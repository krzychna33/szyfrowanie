import hashlib
import sys


def calculate_hash(file_path):
    """Calculate SHA-256 hash of a file."""
    hasher = hashlib.sha256()
    try:
        with open(file_path, 'rb') as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hasher.update(chunk)
        return hasher.hexdigest()
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading file '{file_path}': {e}")
        sys.exit(1)


def compare_files(file1, file2):
    """Compare two files using their SHA-256 hash."""
    hash1 = calculate_hash(file1)
    hash2 = calculate_hash(file2)

    if hash1 == hash2:
        print("The files are identical.")
    else:
        print("The files are different.")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python compare_files.py <file1> <file2>")
        sys.exit(1)

    file1, file2 = sys.argv[1], sys.argv[2]
    compare_files(file1, file2)