const { execSync } = require('child_process');
execSync('git add -A', { stdio: 'inherit' });
execSync('git commit -m "feat(web3): integrate real on-chain Solana Devnet SOL transfer and wallet transaction signing for Escrow Funding and Settlement"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
