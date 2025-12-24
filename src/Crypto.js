import CryptoJS from "crypto-js";

const SECRET_KEY = "123dgfyasgygd893"; 

export function encryptText(text) {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

export function decryptText(cipherText) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    // Jika hasil decrypt kosong (kunci salah/corrupt), kembalikan cipherText agar tidak error blank
    return originalText || cipherText; 
  } catch (error) {
    console.error("Gagal decrypt text:", error);
    return cipherText; 
  }
}

export function encryptFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      try {
        const base64Data = reader.result; // Ini formatnya: "data:image/png;base64,....."
        const encrypted = CryptoJS.AES.encrypt(base64Data, SECRET_KEY).toString();
        const encryptedBlob = new Blob([encrypted], { type: "text/plain" });
        resolve(encryptedBlob);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

// --- PERBAIKAN UTAMA ADA DI SINI ---
export async function decryptFile(encryptedBlob) {
  try {
    const encryptedText = await encryptedBlob.text();
    
    // 1. Dekripsi menjadi string Base64 asli
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    const originalBase64 = bytes.toString(CryptoJS.enc.Utf8);

    if (!originalBase64) throw new Error("Gagal dekripsi: Kunci salah atau file rusak");

    // 2. KONVERSI BASE64 KE BLOB DENGAN MIME TYPE YANG BENAR
    // Format originalBase64: "data:[MimeType];base64,[IsiData]"
    const arr = originalBase64.split(',');
    
    // Ambil MimeType (contoh: 'application/pdf' atau 'image/jpeg')
    const mime = arr[0].match(/:(.*?);/)[1]; 
    
    // Decode Base64 menjadi data biner
    const bstr = atob(arr[1]); 
    let n = bstr.length; 
    const u8arr = new Uint8Array(n);
    
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    // 3. Buat Blob dengan tipe yang spesifik!
    return new Blob([u8arr], {type: mime});

  } catch (error) {
    console.error("Gagal decrypt file:", error);
    throw error;
  }
}