import csv
import json
import re
import os
import textwrap # <-- NEW: Built-in library for smart text formatting

def generate_diverse_amazon_json(folder_path, output_file, rows_per_file=50):
    category_map = {}
    category_counter = 1
    
    final_categories = []
    final_products = []
    total_products_count = 0

    # 1. Get all CSV files in the folder
    files = [f for f in os.listdir(folder_path) if f.endswith(".csv")]
    
    for filename in files:
        file_path = os.path.join(folder_path, filename)
        
        try:
            with open(file_path, mode='r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                
                # 2. Process only the first 50 rows of EACH file
                for i, row in enumerate(reader):
                    if i >= rows_per_file:
                        break

                    # Use internal category field
                    raw_cat_name = row.get('category') or row.get('main_category') or "General"

                    # Dictionary Logic for unique Categories
                    if raw_cat_name not in category_map:
                        category_map[raw_cat_name] = category_counter
                        final_categories.append({
                            "id": category_counter,
                            "category_name": raw_cat_name
                        })
                        category_counter += 1
                    
                    # Numeric Cleaning Helper
                    def clean_numeric(val):
                        if not val: return 0.0
                        cleaned = re.sub(r'[^\d.]', '', str(val))
                        try:
                            return float(cleaned)
                        except ValueError:
                            return 0.0

                    # --- NEW TITLE & DESCRIPTION LOGIC ---
                    
                    full_title = row.get('name', 'Unknown Product').strip()
                    
                    # 1. Split by commas, hyphens, OR brackets to remove keyword stuffing
                    name_parts = re.split(r'[,|\-\(|\[]', full_title)
                    base_name = name_parts[0].strip()
                    
                    # 2. Smart Truncation: Max 65 chars, NEVER breaks a word in half!
                    clean_product_name = textwrap.shorten(base_name, width=80, placeholder="")

                    # 3. Grab the ACTUAL long description from the dataset
                    real_description = row.get('about_product') or row.get('description') or full_title

                    # ---------------------------------------

                    # 3. Map to your schema
                    product_entry = {
                        "product_name": clean_product_name,
                        "description": real_description, # Inserted the real description here
                        "category_name": raw_cat_name,
                        "category_id": category_map[raw_cat_name],
                        "rating": clean_numeric(row.get('ratings')),
                        "image": row.get('image', ''),
                        "discounted_price": clean_numeric(row.get('discount_price')),
                        "actual_price": clean_numeric(row.get('actual_price'))
                    }
                    
                    final_products.append(product_entry)
                    total_products_count += 1
                    
        except Exception as e:
            print(f"Skipping {filename} due to error: {e}")

    # 4. Save the Result
    with open(output_file, 'w', encoding='utf-8') as out_f:
        json.dump({"categories": final_categories, "products": final_products}, out_f, indent=4)
    
    print(f"Success: Processed {total_products_count} total products.")
    print(f"Discovered {len(final_categories)} unique categories across your files.")

# Execute
generate_diverse_amazon_json('./archive', 'final_seed.json', rows_per_file=50)