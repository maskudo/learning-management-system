import hashlib


def hash_password(password: str) -> str:
    if not password:
        return ""
    hash = hashlib.sha256()
    hash.update(password.encode("UTF-8"))
    password_digest = hash.hexdigest()
    return password_digest
