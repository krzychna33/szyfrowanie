import json
import random
import string


def random_string(length=10):
    """Generate a random string of given length."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


def generate_large_json(filename, num_objects=12_000_000):
    """Generate a large JSON file over 2GB in size."""
    with open(filename, 'w', encoding='utf-8') as f:
        f.write('[')  # Start JSON array

        for i in range(num_objects):
            obj = {
                "id": i,
                "name": random_string(15),
                "email": random_string(10) + "@example.com",
                "age": random.randint(18, 80),
                "address": random_string(50),
                "balance": round(random.uniform(1000, 100000), 2),
                "active": random.choice([True, False])
            }

            json.dump(obj, f)

            if i < num_objects - 1:
                f.write(',')  # Add a comma except for the last item

        f.write(']')  # Close JSON array

    print(f"File {filename} generated successfully!")


# Call function to generate the JSON file (adjust filename and number of objects if needed)
generate_large_json("large_data.json")