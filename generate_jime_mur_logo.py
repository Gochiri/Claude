#!/usr/bin/env python3
"""
Genera el logo de Jime Mur usando GPT Image 2 via Fal AI.
Corre desde tu terminal: python3 generate_jime_mur_logo.py
"""
import os, time, requests, pathlib

FAL_KEY = os.environ.get("FAL_KEY", "f6213d20-7092-4793-9bc4-95dc4f52c1d1:c31deaaf6dea04aa183f0d7228846ee0")
OUT_DIR = pathlib.Path("logos_jime_mur")
OUT_DIR.mkdir(exist_ok=True)

PROMPT = """
Minimalist logo design for the brand name "Jime Mur", handmade accessories and embroidery brand for women.
The logotype uses elegant thin serif typography spelling out "Jime Mur" in deep black on a pure white background.
Color palette: off-white cream, deep black (#1A1A1A), warm terracotta orange (#D4622A).
Flat design, no gradients, no shadows.
A single delicate accent element: a fine embroidery thread or tiny needle with a thread loop drawn in terracotta orange (#D4622A),
placed as a subtle diacritic above the letter J or as an underline flourish beneath the full name.
Argentine artisan aesthetic. High-end, timeless, feminine.
Clean white background. Centered composition. Logo only, no extra decorations or frames.
"""

payload = {
    "prompt": PROMPT.strip(),
    "image_size": "square_hd",
    "quality": "high",
    "num_images": 2,
    "output_format": "png"
}

print("Generando logo de Jime Mur...")
res = requests.post(
    "https://fal.run/openai/gpt-image-2",
    headers={"Authorization": f"Key {FAL_KEY}", "Content-Type": "application/json"},
    json=payload,
    timeout=120
)
data = res.json()

if not data.get("images"):
    print("Error:", data)
    exit(1)

ts = int(time.time())
for i, img in enumerate(data["images"]):
    fp = OUT_DIR / f"jime_mur_{ts}_{i+1}.png"
    fp.write_bytes(requests.get(img["url"]).content)
    print(f"Guardado: {fp}")

print(f"\nListo. {len(data['images'])} logo(s) en la carpeta '{OUT_DIR}/'")
