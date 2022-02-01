# Password Manager

This is a zero knowledge password manager. The user can create a vault which is just a list of usernames, passwords, and the associated account/website. The user will sign up with a master password which is used to encrypt/decrypt their entire vault. The important parts are that the master password never leaves the clients computer and all encryption/decryption of the vault is done on the client's machine. The server never sees the plain text password and never sees the unencrypted vault. 

## Encryption steps
The master password is hashed to create an authentication code which allows the server to verify a user and send the corresponding vault. The vault is stored on the server fully encrypted and is sent to the client still encrypted.

The master password is used again along with the authentication code to create the encryption key. The client then uses this key to decrypt and view the entire vault. The vault is encrypted again using the key before it is sent back for storage on the server.

The server only ever sees the authentication key which can only be used to retrieve an encrypted vault. If this gets leaked, a malicious user can retrieve the vault, but without the master password (which never leaves the client machine), the malicious user cannot derive the key needed to decrypt the vault and view all of the users passwords.