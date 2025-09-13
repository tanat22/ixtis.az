
import json

input_path = 'elmir/2025_bakalavr_az.json'
output_path = 'elmir/2025_bakalavr_az.json' # Overwriting the same file

try:
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for item in data:
        qeyd = item.get("qeyd", "").strip()
        if qeyd:
            # Clean up qeyd value (remove extra spaces around commas)
            qeyd_cleaned = ', '.join([part.strip() for part in qeyd.split(',') if part.strip()])
            if qeyd_cleaned:
                 item["Fakulte adi"] = f"{item['Fakulte adi']} ({qeyd_cleaned})"
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"File '{output_path}' has been updated successfully.")

except FileNotFoundError:
    print(f"Error: The file '{input_path}' was not found.")
except json.JSONDecodeError:
    print(f"Error: Could not decode JSON from the file '{input_path}'.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
