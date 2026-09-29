FROM rust:1.85.0-bookworm

ARG SOLANA_CLI_VERSION=3.1.14
ARG ANCHOR_VERSION=0.31.1
ARG NODE_VERSION=22.14.0

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl git build-essential pkg-config libssl-dev python3 \
    && rm -rf /var/lib/apt/lists/*
RUN rustup component add rustfmt
RUN curl --proto '=https' --tlsv1.2 -sSfL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" \
    | tar -xJ --strip-components=1 -C /usr/local \
    && npm install --global yarn@1.22.22 \
    && cargo install --locked --version ${ANCHOR_VERSION} anchor-cli \
    && curl --proto '=https' --tlsv1.2 -sSfL "https://release.anza.xyz/v${SOLANA_CLI_VERSION}/install" | sh
ENV PATH="/root/.local/share/solana/install/active_release/bin:/usr/local/cargo/bin:${PATH}"
WORKDIR /workspace
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "escrow:check"]
