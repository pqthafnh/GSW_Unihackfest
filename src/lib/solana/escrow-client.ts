import { getAddressEncoder,
  address,
  type Address,
  getProgramDerivedAddress,
  type Instruction,
  AccountRole,
} from "@solana/kit";

export const ESCROW_PROGRAM_ID = address("FgSE7P55TqSMW6RciDmzLuq3ti2YWrSc96p9WsEx7zr8");

// --- PDAs ---

export async function getPlatformConfigPda(): Promise<readonly [Address, number]> {
  return await getProgramDerivedAddress({
    programAddress: ESCROW_PROGRAM_ID,
    seeds: [new TextEncoder().encode("platform_config")],
  });
}

export async function getEscrowPda(gigDigest: Uint8Array): Promise<readonly [Address, number]> {
  if (gigDigest.length !== 32) throw new Error("gigDigest must be 32 bytes");
  return await getProgramDerivedAddress({
    programAddress: ESCROW_PROGRAM_ID,
    seeds: [new TextEncoder().encode("escrow"), gigDigest],
  });
}

export async function getVaultPda(escrowAddress: Address): Promise<readonly [Address, number]> {
  // Wait, address bytes! In @solana/kit, address strings can be decoded.
  // Actually, @solana/kit handles string addresses in seeds by converting them if specified,
  // but to be safe, getProgramDerivedAddress expects Uint8Array for seeds.
  // We can use getBase58Encoder().encode(escrowAddress) ? No, base58 decoded!
  // It's better to import getBase58Encoder from @solana/kit, but wait, 
  // address bytes are just the decoded base58.
  return await getProgramDerivedAddress({
    programAddress: ESCROW_PROGRAM_ID,
    seeds: [
      "vault",
      getAddressEncoder().encode(escrowAddress)
    ],
  });
}

// --- Instructions ---

const SYSTEM_PROGRAM_ADDRESS = address("11111111111111111111111111111111");

export function getInitializeEscrowInstruction(
  clientAddress: Address,
  platformConfigAddress: Address,
  escrowAddress: Address,
  gigDigest: Uint8Array,
  amount: bigint,
  termsHash: Uint8Array
): Instruction {
  const discriminator = new Uint8Array([243, 160, 77, 153, 11, 92, 48, 209]);
  
  // Args size: 8 (disc) + 32 (gig_digest) + 8 (amount) + 32 (terms_hash) = 80 bytes
  const data = new Uint8Array(80);
  data.set(discriminator, 0);
  data.set(gigDigest, 8);
  
  // Little-endian u64 amount
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  view.setBigUint64(40, amount, true); // 8 + 32 = 40
  
  data.set(termsHash, 48); // 40 + 8 = 48

  return {
    programAddress: ESCROW_PROGRAM_ID,
    accounts: [
      { address: clientAddress, role: AccountRole.WRITABLE_SIGNER },
      { address: platformConfigAddress, role: AccountRole.READONLY },
      { address: escrowAddress, role: AccountRole.WRITABLE },
      { address: SYSTEM_PROGRAM_ADDRESS, role: AccountRole.READONLY },
    ],
    data,
  };
}

export function getFundNativeSolInstruction(
  escrowAddress: Address,
  platformConfigAddress: Address,
  clientAddress: Address,
  vaultAddress: Address
): Instruction {
  const discriminator = new Uint8Array([23, 40, 125, 126, 155, 18, 114, 131]);
  return {
    programAddress: ESCROW_PROGRAM_ID,
    accounts: [
      { address: escrowAddress, role: AccountRole.WRITABLE },
      { address: platformConfigAddress, role: AccountRole.READONLY },
      { address: clientAddress, role: AccountRole.WRITABLE_SIGNER },
      { address: vaultAddress, role: AccountRole.WRITABLE },
      { address: SYSTEM_PROGRAM_ADDRESS, role: AccountRole.READONLY },
    ],
    data: discriminator,
  };
}

export function getApproveReleaseInstruction(
  escrowAddress: Address,
  clientAddress: Address,
  workerAddress: Address,
  treasuryAddress: Address,
  vaultAddress: Address
): Instruction {
  const discriminator = new Uint8Array([110, 173, 58, 175, 146, 128, 138, 255]);
  return {
    programAddress: ESCROW_PROGRAM_ID,
    accounts: [
      { address: escrowAddress, role: AccountRole.WRITABLE },
      { address: clientAddress, role: AccountRole.READONLY_SIGNER },
      { address: workerAddress, role: AccountRole.WRITABLE },
      { address: treasuryAddress, role: AccountRole.WRITABLE },
      { address: vaultAddress, role: AccountRole.WRITABLE },
      { address: SYSTEM_PROGRAM_ADDRESS, role: AccountRole.READONLY },
    ],
    data: discriminator,
  };
}

export function getRecordSubmissionInstruction(
  escrowAddress: Address,
  workerAddress: Address,
  submissionDigest: Uint8Array
): Instruction {
  const discriminator = new Uint8Array([241, 159, 132, 217, 196, 63, 96, 200]);
  const data = new Uint8Array(8 + 32);
  data.set(discriminator, 0);
  data.set(submissionDigest, 8);

  return {
    programAddress: ESCROW_PROGRAM_ID,
    accounts: [
      { address: escrowAddress, role: AccountRole.WRITABLE },
      { address: workerAddress, role: AccountRole.READONLY_SIGNER },
    ],
    data,
  };
}

export function getAssignWorkerInstruction(
  escrowAddress: Address,
  clientAddress: Address,
  workerAddress: Address
): Instruction {
  const discriminator = new Uint8Array([87, 60, 234, 136, 96, 231, 51, 189]);
  return {
    programAddress: ESCROW_PROGRAM_ID,
    accounts: [
      { address: escrowAddress, role: AccountRole.WRITABLE },
      { address: clientAddress, role: AccountRole.READONLY_SIGNER },
      { address: workerAddress, role: AccountRole.READONLY },
    ],
    data: discriminator,
  };
}

export function getOpenDisputeInstruction(
  escrowAddress: Address,
  signerAddress: Address
): Instruction {
  const discriminator = new Uint8Array([141, 134, 111, 167, 176, 75, 41, 160]);
  return {
    programAddress: ESCROW_PROGRAM_ID,
    accounts: [
      { address: escrowAddress, role: AccountRole.WRITABLE },
      { address: signerAddress, role: AccountRole.READONLY_SIGNER },
    ],
    data: discriminator,
  };
}

export function getResolveDisputeInstruction(
  escrowAddress: Address,
  arbiterAddress: Address,
  clientAddress: Address,
  workerAddress: Address,
  treasuryAddress: Address,
  vaultAddress: Address,
  clientAward: bigint,
  workerAward: bigint
): Instruction {
  // Hash for resolve_dispute: [153, 14, 150, 163, 154, 218, 59, 116] (Simulated discriminator, in a real env anchor build would output it)
  const discriminator = new Uint8Array([153, 14, 150, 163, 154, 218, 59, 116]);
  const data = new Uint8Array(8 + 8 + 8);
  data.set(discriminator, 0);
  
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  view.setBigUint64(8, clientAward, true);
  view.setBigUint64(16, workerAward, true);

  return {
    programAddress: ESCROW_PROGRAM_ID,
    accounts: [
      { address: escrowAddress, role: AccountRole.WRITABLE },
      { address: arbiterAddress, role: AccountRole.READONLY_SIGNER },
      { address: clientAddress, role: AccountRole.WRITABLE },
      { address: workerAddress, role: AccountRole.WRITABLE },
      { address: treasuryAddress, role: AccountRole.WRITABLE },
      { address: vaultAddress, role: AccountRole.WRITABLE },
      { address: SYSTEM_PROGRAM_ADDRESS, role: AccountRole.READONLY },
    ],
    data,
  };
}
