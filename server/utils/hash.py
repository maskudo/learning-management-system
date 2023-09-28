import hashlib
def hash_password(password: str) -> bytes: 
    if(not password):
        return b''
    hash = hashlib.sha256()
    hash.update(password.encode('UTF-8'))
    password_digest = hash.digest()
    return password_digest


