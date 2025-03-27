import time

from Crypto.Cipher import DES3
from Crypto.Random import get_random_bytes


def encrypt_file(input_file, output_file):
    key = DES3.adjust_key_parity(get_random_bytes(24))
    cipher = DES3.new(key, DES3.MODE_OFB)

    with open(input_file, 'r', encoding='utf-8') as f:
        data = f.read()

    plaintext = data.encode('utf-8')

    start_time = time.time()
    print("Encryption started...")

    encrypted_msg = cipher.iv + cipher.encrypt(plaintext)

    end_time = time.time()
    total_time = end_time - start_time

    print(f"Encryption of {input_file} took {total_time:.4f} seconds.")

    with open(output_file, 'wb') as f:
        f.write(encrypted_msg)
        f.close()

    print(f"Encryption complete. Encrypted data saved to {output_file}")
    return key


def decrypt_file(input_file, output_file, key):
    with open(input_file, 'rb') as f:
        encrypted_data = f.read()
        f.close()

    iv = encrypted_data[:8]
    encrypted_msg = encrypted_data[8:]

    cipher = DES3.new(key, DES3.MODE_OFB, iv)

    start_time = time.time()
    print("Decryption started...")

    decrypted_msg = cipher.decrypt(encrypted_msg)

    end_time = time.time()
    total_time = end_time - start_time

    print(f"Decryption of {input_file} took {total_time:.4f} seconds.")

    data = decrypted_msg.decode('utf-8')

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(data)
        f.close()

    print(f"Decryption complete. Decrypted data saved to {output_file}")

# Example usage
used_key = encrypt_file('large_data.json', 'encrypted_data.bin')
decrypt_file('encrypted_data.bin', 'decrypted_data.json', used_key)

print(used_key)