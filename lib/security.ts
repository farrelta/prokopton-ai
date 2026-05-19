/**
 * Security utilities for journal encryption.
 * USAGE: Primarily client-side encryption for private reflections.
 */

const ENCRYPTION_KEY_NAME = 'prokopton_e_key';

async function getOrCreateKey(): Promise<CryptoKey> {
  if (typeof window === 'undefined') throw new Error('Web Crypto only available in browser');

  let keyData = localStorage.getItem(ENCRYPTION_KEY_NAME);
  if (!keyData) {
    // Generate a new key and store it
    const key = await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    const exported = await window.crypto.subtle.exportKey('jwk', key);
    localStorage.setItem(ENCRYPTION_KEY_NAME, JSON.stringify(exported));
    return key;
  }

  return await window.crypto.subtle.importKey(
    'jwk',
    JSON.parse(keyData),
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(data: string): Promise<string> {
  try {
    const key = await getOrCreateKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(data);
    
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    const ivBase64 = btoa(String.fromCharCode(...iv));
    const contentBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    
    return `${ivBase64}:${contentBase64}`;
  } catch (error) {
    console.error('Encryption failed:', error);
    return data; // Fallback to plain text if failed (not ideal but better than crash)
  }
}

export async function decryptData(encryptedString: string): Promise<string> {
  if (!encryptedString.includes(':')) return encryptedString; // Likely plain text

  try {
    const key = await getOrCreateKey();
    const [ivBase64, contentBase64] = encryptedString.split(':');
    
    const iv = new Uint8Array(atob(ivBase64).split('').map(c => c.charCodeAt(0)));
    const encrypted = new Uint8Array(atob(contentBase64).split('').map(c => c.charCodeAt(0)));

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    return encryptedString; // Return as is if failed
  }
}
