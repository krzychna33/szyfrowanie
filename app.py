import json
import time

from Crypto.Cipher import DES3
from Crypto.Random import get_random_bytes


def encrypt_json(input_file, output_file):
    # Generate a 3DES key with proper parity
    key = DES3.adjust_key_parity(get_random_bytes(24))
    cipher = DES3.new(key, DES3.MODE_OFB)

    # Read JSON file
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Convert JSON data to a string and then to bytes
    plaintext = json.dumps(data).encode('utf-8')

    start_time = time.time()

    # Encrypt data
    print("Encryption started...")

    encrypted_msg = cipher.iv + cipher.encrypt(plaintext)

    end_time = time.time()
    total_time = end_time - start_time

    print(f"Encryption of {input_file} took {total_time:.4f} seconds.")

    # Write encrypted data to a file
    with open(output_file, 'wb') as f:
        f.write(encrypted_msg)
        f.close()

    print(f"Encryption complete. Encrypted data saved to {output_file}")
    return key  # Return the key for decryption


def decrypt_json(input_file, output_file, key):
    # Read encrypted data
    with open(input_file, 'rb') as f:
        encrypted_data = f.read()
        f.close()

    # Extract IV and encrypted content
    iv = encrypted_data[:8]
    encrypted_msg = encrypted_data[8:]

    # Decrypt data
    cipher = DES3.new(key, DES3.MODE_OFB, iv)

    start_time = time.time()
    print("Decryption started...")
    decrypted_msg = cipher.decrypt(encrypted_msg)

    end_time = time.time()
    total_time = end_time - start_time

    print(f"Decryption of {input_file} took {total_time:.4f} seconds.")

    # Convert bytes back to JSON
    data = json.loads(decrypted_msg.decode('utf-8'))

    # Write decrypted data to JSON file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f)
        f.close()

    print(f"Decryption complete. Decrypted data saved to {output_file}")

# Example usage
used_key = encrypt_json('large_data.json', 'encrypted_data.bin')
decrypt_json('encrypted_data.bin', 'decrypted_data.json', used_key)

print(used_key)