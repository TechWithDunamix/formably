import random

def generate_code():
    chars = '1234567890abcdefghijklmnopqrstuvwxyz'
    return ''.join(random.choice(chars) for _ in range(7))

