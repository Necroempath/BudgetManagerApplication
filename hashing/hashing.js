export async function hashPassword(password, salt = null) {
    const enc = new TextEncoder();
    if (!salt) {
        salt = crypto.getRandomValues(new Uint8Array(16));
    }
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
    );

    const hashBuffer = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        256
    );

    return {
        salt: btoa(String.fromCharCode(...salt)),
        hash: btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
    };
}

export async function verifyPassword(password, savedHash, savedSalt) {
    const result = await hashPassword(password, Uint8Array.from(atob(savedSalt), c => c.charCodeAt(0)));
    return result.hash === savedHash;
}