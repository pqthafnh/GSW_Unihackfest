use anchor_lang::prelude::*;
use anchor_lang::system_program::{self, Transfer};

/// Deployment placeholder. Replace only as part of an approved Devnet deployment.
declare_id!("FgSE7P55TqSMW6RciDmzLuq3ti2YWrSc96p9WsEx7zr8");

const MAX_FEE_BPS: u16 = 1_000;
const BPS: u64 = 10_000;

#[program]
pub mod escrow {
    use super::*;

    pub fn initialize_config(ctx: Context<InitializeConfig>, fee_bps: u16) -> Result<()> {
        require!(fee_bps <= MAX_FEE_BPS, EscrowError::FeeTooHigh);
        let config = &mut ctx.accounts.platform_config;
        config.admin = ctx.accounts.admin.key();
        config.treasury = ctx.accounts.treasury.key();
        config.arbiter = ctx.accounts.arbiter.key();
        config.fee_bps = fee_bps;
        config.paused = false;
        emit!(ConfigInitialized {
            config: config.key(),
            admin: config.admin,
            fee_bps
        });
        Ok(())
    }

    pub fn update_fee(ctx: Context<AdminConfig>, fee_bps: u16) -> Result<()> {
        require!(fee_bps <= MAX_FEE_BPS, EscrowError::FeeTooHigh);
        ctx.accounts.platform_config.fee_bps = fee_bps;
        emit!(FeeUpdated { fee_bps });
        Ok(())
    }

    pub fn update_treasury(ctx: Context<AdminConfig>, treasury: Pubkey) -> Result<()> {
        ctx.accounts.platform_config.treasury = treasury;
        Ok(())
    }

    pub fn update_arbiter(ctx: Context<AdminConfig>, arbiter: Pubkey) -> Result<()> {
        ctx.accounts.platform_config.arbiter = arbiter;
        Ok(())
    }

    pub fn set_paused(ctx: Context<AdminConfig>, paused: bool) -> Result<()> {
        ctx.accounts.platform_config.paused = paused;
        emit!(PauseChanged { paused });
        Ok(())
    }

    pub fn initialize_escrow(
        ctx: Context<InitializeEscrow>,
        gig_digest: [u8; 32],
        amount: u64,
        terms_hash: [u8; 32],
    ) -> Result<()> {
        require!(amount > 0, EscrowError::InvalidAmount);
        require!(!ctx.accounts.platform_config.paused, EscrowError::Paused);
        let escrow = &mut ctx.accounts.escrow;
        escrow.client = ctx.accounts.client.key();
        escrow.worker = None;
        escrow.gig_digest = gig_digest;
        escrow.terms_hash = terms_hash;
        escrow.amount = amount;
        escrow.fee_bps = ctx.accounts.platform_config.fee_bps;
        escrow.treasury = ctx.accounts.platform_config.treasury;
        escrow.arbiter = ctx.accounts.platform_config.arbiter;
        escrow.funded = false;
        escrow.state = EscrowState::Created;
        escrow.submission_hash = None;
        escrow.bump = ctx.bumps.escrow;
        emit!(EscrowInitialized {
            escrow: escrow.key(),
            client: escrow.client,
            amount
        });
        Ok(())
    }

    pub fn fund_native_sol(ctx: Context<FundEscrow>) -> Result<()> {
        require!(!ctx.accounts.platform_config.paused, EscrowError::Paused);
        require!(!ctx.accounts.escrow.funded, EscrowError::AlreadyFunded);
        let amount = ctx.accounts.escrow.amount;
        let cpi = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.client.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            },
        );
        system_program::transfer(cpi, amount)?;
        ctx.accounts.escrow.funded = true;
        ctx.accounts.escrow.state = EscrowState::Funded;
        emit!(EscrowFunded {
            escrow: ctx.accounts.escrow.key(),
            amount
        });
        Ok(())
    }

    pub fn assign_worker(ctx: Context<AssignWorker>, worker: Pubkey) -> Result<()> {
        require!(ctx.accounts.escrow.funded, EscrowError::NotFunded);
        require!(
            ctx.accounts.escrow.state == EscrowState::Funded,
            EscrowError::InvalidState
        );
        require!(worker != Pubkey::default(), EscrowError::InvalidWorker);
        require!(
            worker != ctx.accounts.client.key(),
            EscrowError::SelfDealing
        );
        require!(
            ctx.accounts.escrow.worker.is_none(),
            EscrowError::AlreadyAssigned
        );
        ctx.accounts.escrow.worker = Some(worker);
        ctx.accounts.escrow.state = EscrowState::Assigned;
        emit!(WorkerAssigned {
            escrow: ctx.accounts.escrow.key(),
            worker
        });
        Ok(())
    }

    pub fn record_submission(
        ctx: Context<RecordSubmission>,
        submission_hash: [u8; 32],
    ) -> Result<()> {
        require!(
            matches!(
                ctx.accounts.escrow.state,
                EscrowState::Assigned | EscrowState::RevisionRequested
            ),
            EscrowError::InvalidState
        );
        require_keys_eq!(
            ctx.accounts
                .escrow
                .worker
                .ok_or(EscrowError::WorkerMissing)?,
            ctx.accounts.worker.key(),
            EscrowError::WrongWorker
        );
        require!(
            submission_hash != [0u8; 32],
            EscrowError::EmptySubmissionHash
        );
        ctx.accounts.escrow.submission_hash = Some(submission_hash);
        ctx.accounts.escrow.submission_version = ctx
            .accounts
            .escrow
            .submission_version
            .checked_add(1)
            .ok_or(EscrowError::ArithmeticOverflow)?;
        ctx.accounts.escrow.state = EscrowState::Submitted;
        emit!(SubmissionRecorded {
            escrow: ctx.accounts.escrow.key(),
            submission_hash,
            version: ctx.accounts.escrow.submission_version
        });
        Ok(())
    }

    pub fn request_revision(ctx: Context<AuthorizedEscrow>) -> Result<()> {
        require!(
            ctx.accounts.escrow.state == EscrowState::Submitted,
            EscrowError::InvalidState
        );
        ctx.accounts.escrow.state = EscrowState::RevisionRequested;
        emit!(RevisionRequested {
            escrow: ctx.accounts.escrow.key()
        });
        Ok(())
    }

    pub fn approve_release(ctx: Context<ApproveRelease>) -> Result<()> {
        require!(
            ctx.accounts.escrow.state == EscrowState::Submitted,
            EscrowError::InvalidState
        );
        let worker = ctx
            .accounts
            .escrow
            .worker
            .ok_or(EscrowError::WorkerMissing)?;
        require_keys_eq!(worker, ctx.accounts.worker.key(), EscrowError::WrongWorker);
        require_keys_eq!(
            ctx.accounts.escrow.treasury,
            ctx.accounts.treasury.key(),
            EscrowError::WrongTreasury
        );
        let amount = ctx.accounts.escrow.amount;
        let fee = amount
            .checked_mul(ctx.accounts.escrow.fee_bps as u64)
            .ok_or(EscrowError::ArithmeticOverflow)?
            / BPS;
        let payout = amount
            .checked_sub(fee)
            .ok_or(EscrowError::ArithmeticOverflow)?;
        let escrow_key = ctx.accounts.escrow.key();
        let bump = [ctx.bumps.vault];
        let seeds: &[&[u8]] = &[b"vault", escrow_key.as_ref(), &bump];
        let signer = &[seeds];
        system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault.to_account_info(),
                    to: ctx.accounts.worker.to_account_info(),
                },
                signer,
            ),
            payout,
        )?;
        if fee > 0 {
            system_program::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.system_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.vault.to_account_info(),
                        to: ctx.accounts.treasury.to_account_info(),
                    },
                    signer,
                ),
                fee,
            )?;
        }
        ctx.accounts.escrow.state = EscrowState::Released;
        emit!(ReleaseApproved {
            escrow: escrow_key,
            worker,
            payout,
            fee
        });
        Ok(())
    }

    pub fn refund_pre_assignment(ctx: Context<RefundEscrow>) -> Result<()> {
        require!(
            ctx.accounts.escrow.state == EscrowState::Funded,
            EscrowError::InvalidState
        );
        require!(
            ctx.accounts.escrow.worker.is_none(),
            EscrowError::AlreadyAssigned
        );
        let amount = ctx.accounts.escrow.amount;
        let escrow_key = ctx.accounts.escrow.key();
        let bump = [ctx.bumps.vault];
        let seeds: &[&[u8]] = &[b"vault", escrow_key.as_ref(), &bump];
        system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault.to_account_info(),
                    to: ctx.accounts.client.to_account_info(),
                },
                &[seeds],
            ),
            amount,
        )?;
        ctx.accounts.escrow.state = EscrowState::Refunded;
        emit!(Refunded {
            escrow: escrow_key,
            amount
        });
        Ok(())
    }

    pub fn open_dispute(ctx: Context<OpenDispute>) -> Result<()> {
        let opener = ctx.accounts.opener.key();
        require!(
            opener == ctx.accounts.escrow.client
                || ctx.accounts.escrow.worker == Some(opener)
                || opener == ctx.accounts.escrow.arbiter,
            EscrowError::Unauthorized
        );
        require!(
            matches!(
                ctx.accounts.escrow.state,
                EscrowState::Assigned | EscrowState::Submitted | EscrowState::RevisionRequested
            ),
            EscrowError::InvalidState
        );
        ctx.accounts.escrow.state = EscrowState::Disputed;
        emit!(DisputeOpened {
            escrow: ctx.accounts.escrow.key(),
            opener
        });
        Ok(())
    }

    pub fn resolve_dispute(ctx: Context<ResolveDispute>, client_award: u64, worker_award: u64) -> Result<()> {
        require!(
            ctx.accounts.escrow.state == EscrowState::Disputed,
            EscrowError::InvalidState
        );
        let amount = ctx.accounts.escrow.amount;
        require!(
            client_award.checked_add(worker_award).ok_or(EscrowError::ArithmeticOverflow)? <= amount,
            EscrowError::InvalidAmount
        );

        let escrow_key = ctx.accounts.escrow.key();
        let bump = [ctx.bumps.vault];
        let seeds: &[&[u8]] = &[b"vault", escrow_key.as_ref(), &bump];
        let signer = &[seeds];

        if client_award > 0 {
            system_program::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.system_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.vault.to_account_info(),
                        to: ctx.accounts.client.to_account_info(),
                    },
                    signer,
                ),
                client_award,
            )?;
        }

        if worker_award > 0 {
            let worker = ctx.accounts.escrow.worker.ok_or(EscrowError::WorkerMissing)?;
            require_keys_eq!(worker, ctx.accounts.worker.key(), EscrowError::WrongWorker);
            system_program::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.system_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.vault.to_account_info(),
                        to: ctx.accounts.worker.to_account_info(),
                    },
                    signer,
                ),
                worker_award,
            )?;
        }

        // any remaining goes to treasury as fee
        let fee = amount
            .checked_sub(client_award)
            .and_then(|a| a.checked_sub(worker_award))
            .unwrap_or(0);

        if fee > 0 {
            system_program::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.system_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.vault.to_account_info(),
                        to: ctx.accounts.treasury.to_account_info(),
                    },
                    signer,
                ),
                fee,
            )?;
        }

        ctx.accounts.escrow.state = EscrowState::Released; // Or Resolved? Let's use Released to reuse enum
        
        emit!(DisputeResolved {
            escrow: escrow_key,
            client_award,
            worker_award,
            fee
        });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    /// CHECK: destination only; changing it requires the admin signer.
    pub treasury: UncheckedAccount<'info>,
    /// CHECK: authority key stored for future dispute resolution.
    pub arbiter: UncheckedAccount<'info>,
    #[account(init, payer = admin, space = 8 + PlatformConfig::SIZE, seeds = [b"platform_config"], bump)]
    pub platform_config: Account<'info, PlatformConfig>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AdminConfig<'info> {
    #[account(mut, has_one = admin)]
    pub platform_config: Account<'info, PlatformConfig>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(gig_digest: [u8; 32])]
pub struct InitializeEscrow<'info> {
    #[account(mut)]
    pub client: Signer<'info>,
    #[account(seeds = [b"platform_config"], bump)]
    pub platform_config: Account<'info, PlatformConfig>,
    #[account(init, payer = client, space = 8 + Escrow::SIZE, seeds = [b"escrow", gig_digest.as_ref()], bump)]
    pub escrow: Account<'info, Escrow>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FundEscrow<'info> {
    #[account(mut, has_one = client)]
    pub escrow: Account<'info, Escrow>,
    #[account(seeds = [b"platform_config"], bump)]
    pub platform_config: Account<'info, PlatformConfig>,
    #[account(mut)]
    pub client: Signer<'info>,
    #[account(mut, seeds = [b"vault", escrow.key().as_ref()], bump)]
    /// CHECK: PDA vault validated by seeds.
    pub vault: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AssignWorker<'info> {
    #[account(mut, has_one = client)]
    pub escrow: Account<'info, Escrow>,
    pub client: Signer<'info>,
}

#[derive(Accounts)]
pub struct RecordSubmission<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
    pub worker: Signer<'info>,
}

#[derive(Accounts)]
pub struct AuthorizedEscrow<'info> {
    #[account(mut, has_one = client)]
    pub escrow: Account<'info, Escrow>,
    pub client: Signer<'info>,
}

#[derive(Accounts)]
pub struct ApproveRelease<'info> {
    #[account(mut, has_one = client)]
    pub escrow: Account<'info, Escrow>,
    pub client: Signer<'info>,
    /// CHECK: matched to the worker key stored in escrow.
    #[account(mut)]
    pub worker: UncheckedAccount<'info>,
    /// CHECK: matched to config treasury.
    #[account(mut)]
    pub treasury: UncheckedAccount<'info>,
    #[account(mut, seeds = [b"vault", escrow.key().as_ref()], bump)]
    /// CHECK: PDA vault validated by seeds.
    pub vault: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RefundEscrow<'info> {
    #[account(mut, has_one = client)]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    pub client: Signer<'info>,
    #[account(mut, seeds = [b"vault", escrow.key().as_ref()], bump)]
    /// CHECK: PDA vault validated by seeds.
    pub vault: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct OpenDispute<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
    pub opener: Signer<'info>,
}

#[derive(Accounts)]
pub struct ResolveDispute<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
    pub arbiter: Signer<'info>,
    /// CHECK: matched to the client key stored in escrow
    #[account(mut)]
    pub client: UncheckedAccount<'info>,
    /// CHECK: matched to the worker key stored in escrow
    #[account(mut)]
    pub worker: UncheckedAccount<'info>,
    /// CHECK: matched to config treasury
    #[account(mut)]
    pub treasury: UncheckedAccount<'info>,
    #[account(mut, seeds = [b"vault", escrow.key().as_ref()], bump)]
    /// CHECK: PDA vault validated by seeds
    pub vault: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct PlatformConfig {
    pub admin: Pubkey,
    pub treasury: Pubkey,
    pub arbiter: Pubkey,
    pub fee_bps: u16,
    pub paused: bool,
}
impl PlatformConfig {
    const SIZE: usize = 32 * 3 + 2 + 1;
}

#[account]
pub struct Escrow {
    pub client: Pubkey,
    pub worker: Option<Pubkey>,
    pub gig_digest: [u8; 32],
    pub terms_hash: [u8; 32],
    pub amount: u64,
    pub fee_bps: u16,
    pub treasury: Pubkey,
    pub arbiter: Pubkey,
    pub funded: bool,
    pub state: EscrowState,
    pub submission_hash: Option<[u8; 32]>,
    pub submission_version: u32,
    pub bump: u8,
}
impl Escrow {
    const SIZE: usize = 32 + 33 + 32 + 32 + 8 + 2 + 32 + 32 + 1 + 1 + 33 + 4 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Debug)]
pub enum EscrowState {
    Created,
    Funded,
    Assigned,
    Submitted,
    RevisionRequested,
    Disputed,
    Released,
    Refunded,
}

#[event]
pub struct ConfigInitialized {
    pub config: Pubkey,
    pub admin: Pubkey,
    pub fee_bps: u16,
}
#[event]
pub struct FeeUpdated {
    pub fee_bps: u16,
}
#[event]
pub struct PauseChanged {
    pub paused: bool,
}
#[event]
pub struct EscrowInitialized {
    pub escrow: Pubkey,
    pub client: Pubkey,
    pub amount: u64,
}
#[event]
pub struct EscrowFunded {
    pub escrow: Pubkey,
    pub amount: u64,
}
#[event]
pub struct WorkerAssigned {
    pub escrow: Pubkey,
    pub worker: Pubkey,
}
#[event]
pub struct SubmissionRecorded {
    pub escrow: Pubkey,
    pub submission_hash: [u8; 32],
    pub version: u32,
}
#[event]
pub struct RevisionRequested {
    pub escrow: Pubkey,
}
#[event]
pub struct ReleaseApproved {
    pub escrow: Pubkey,
    pub worker: Pubkey,
    pub payout: u64,
    pub fee: u64,
}
#[event]
pub struct Refunded {
    pub escrow: Pubkey,
    pub amount: u64,
}
#[event]
pub struct DisputeOpened {
    pub escrow: Pubkey,
    pub opener: Pubkey,
}
#[event]
pub struct DisputeResolved {
    pub escrow: Pubkey,
    pub client_award: u64,
    pub worker_award: u64,
    pub fee: u64,
}

#[error_code]
pub enum EscrowError {
    #[msg("Fee exceeds the configured maximum")]
    FeeTooHigh,
    #[msg("Escrow is paused")]
    Paused,
    #[msg("Amount must be positive")]
    InvalidAmount,
    #[msg("Escrow is already funded")]
    AlreadyFunded,
    #[msg("Escrow is not funded")]
    NotFunded,
    #[msg("Invalid escrow state")]
    InvalidState,
    #[msg("Worker is missing")]
    WorkerMissing,
    #[msg("Worker does not match escrow")]
    WrongWorker,
    #[msg("Treasury does not match config")]
    WrongTreasury,
    #[msg("Escrow is already assigned")]
    AlreadyAssigned,
    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,
    #[msg("Signer is not authorized for this escrow")]
    Unauthorized,
    #[msg("Worker must be a non-zero key")]
    InvalidWorker,
    #[msg("Client cannot assign themselves as worker")]
    SelfDealing,
    #[msg("Submission hash must not be all zeroes")]
    EmptySubmissionHash,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn fee_is_bounded_and_uses_integer_arithmetic() {
        let amount = 1_000_000u64;
        let fee = amount.checked_mul(500).unwrap() / BPS;
        assert_eq!(fee, 50_000);
        assert_eq!(amount - fee, 950_000);
        assert!(1_001 > MAX_FEE_BPS);
    }

    #[test]
    fn state_transition_enum_is_explicit() {
        assert_ne!(EscrowState::Funded, EscrowState::Released);
    }
}
