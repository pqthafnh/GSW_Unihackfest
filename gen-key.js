const { Keypair } = require('@solana/web3.js');
const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key');
const bs58 = require('bs58');

// THAY 12 TỪ KHÔI PHỤC CỦA BẠN VÀO GIỮA 2 DẤU NGOẶC KÉP NÀY
// Lưu ý: mỗi từ cách nhau 1 khoảng trắng, viết thường
const mnemonic = "tu1 tu2 tu3 tu4 tu5 tu6 tu7 tu8 tu9 tu10 tu11 tu12"; 

function generateKeyFromMnemonic() {
    try {
        const seed = bip39.mnemonicToSeedSync(mnemonic, ""); 
        // Đường dẫn derivation path mặc định của Solana (Account 1)
        const derivationPath = "m/44'/501'/0'/0'"; 
        
        const derivedSeed = derivePath(derivationPath, seed.toString('hex')).key;
        const keypair = Keypair.fromSeed(derivedSeed);
        
        console.log("==========================================");
        console.log("Địa chỉ ví (Public Key):", keypair.publicKey.toBase58());
        console.log("==========================================");
        console.log("Private Key (COPY DÒNG NÀY VÀO VERCEL):");
        console.log(bs58.encode(keypair.secretKey));
        console.log("==========================================");
    } catch (error) {
        console.error("Lỗi:", error.message);
    }
}

generateKeyFromMnemonic();