#!/usr/bin/env bash
set -e

KEYPAIR_PATH="/root/.config/solana/id.json"

if [ ! -f "$KEYPAIR_PATH" ]; then
  echo "Creating temporary local test keypair..."
  mkdir -p /root/.config/solana
  solana-keygen new --no-bip39-passphrase --silent --force --outfile "$KEYPAIR_PATH"
fi

solana config set --url localhost
solana config set --keypair "$KEYPAIR_PATH"

exec anchor test
