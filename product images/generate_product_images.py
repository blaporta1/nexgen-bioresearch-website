#!/usr/bin/env python3
"""Generate NexGen BioResearch product images with Nano Banana 2 (Gemini 3.1 Flash Image).

Usage:  GEMINI_API_KEY=... python3 generate_product_images.py [--only "Glow"] [--model MODEL]
Uses an existing site image as a style reference so new shots match the current ones.
"""
import argparse, base64, json, os, sys, time, urllib.request, urllib.error

HERE = os.path.dirname(os.path.abspath(__file__))
REF = os.path.join(HERE, "BPC-157 5mg Product Image.png")
DEFAULT_MODEL = "gemini-3.1-flash-image-preview"  # Nano Banana 2

# (output name, label title, strength line, classification, CAS)
PRODUCTS = [
    ("Retatrutide 10mg", "Retatrutide", "10mg", "GLP-1 / GIP / GCG Agonist", "2381089-83-2"),
    ("Retatrutide 20mg", "Retatrutide", "20mg", "GLP-1 / GIP / GCG Agonist", "2381089-83-2"),
    ("Retatrutide 30mg", "Retatrutide", "30mg", "GLP-1 / GIP / GCG Agonist", "2381089-83-2"),
    ("BPC-157 10mg", "BPC-157", "10mg", "Cytoprotective Peptide", "137525-51-0"),
    ("TB-500 10mg", "TB-500", "10mg", "Thymosin Beta-4 Acetate", "77591-33-4"),
    ("Glow", "Glow", "70mg blend", "Peptide Blend (TB-500 10mg + BPC-157 10mg + GHK-Cu 50mg)", None),
    ("Klow", "Klow", "80mg blend", "Peptide Blend (TB-500 10mg + BPC-157 10mg + GHK-Cu 50mg + KPV 10mg)", None),
    ("MOTS-c 10mg", "MOTS-c", "10mg", "Mitochondrial Peptide", "1627580-64-6"),
    ("Tesamorelin 10mg", "Tesamorelin", "10mg", "GHRH Analogue", "218949-48-5"),
    ("CJC-1295 + Ipamorelin 10mg", "CJC-1295 / Ipamorelin", "10mg blend", "Peptide Blend (CJC-1295 no DAC 5mg + Ipamorelin 5mg)", None),
    ("NAD+ 500mg", "NAD+", "500mg", "Coenzyme", "53-84-9"),
]

def prompt_for(title, strength, cls, cas):
    cas_line = f"CAS: {cas}" if cas else "Multi-component blend"
    return (
        "Create a product image that is an exact style match to the attached reference photo: "
        "same ultra-wide cinematic banner composition, same pale blue-grey laboratory background with softly blurred "
        "glassware (beakers, flasks) on both sides, same glossy white lab surface with faint prismatic light streaks, "
        "same single clear glass vial with silver metal crimp cap and white lyophilized powder at the bottom, "
        "standing centered on the same square grey marble slab, same glass pipette with one droplet at upper right, "
        "same lighting, color grading and depth of field. Do NOT include any sparkle/watermark icon.\n"
        "Only change the vial label. The label is the same dark navy wrap-around label with the NexGen BioResearch "
        "logo (X-shaped dotted mark + 'NexGen' bold / 'BioResearch' light) at the top, then a thin blue divider, and this text, "
        "rendered crisp, sharp and spelled exactly:\n"
        f"  Title (bold, large white): {title}\n"
        f"  Strength (regular white, below title): {strength}\n"
        f"  Small text lines: 'Classification: {cls}' / 'Purity: 99% HPLC Verified' / '{cas_line}'\n"
        "  Tiny footer line: 'For Research Use Only'\n"
        "All label text must be legible with no garbled characters."
    )

def generate(api_key, model, text, ref_b64, aspect):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    body = {
        "contents": [{"parts": [
            {"text": text},
            {"inline_data": {"mime_type": "image/png", "data": ref_b64}},
        ]}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {"aspectRatio": aspect, "imageSize": "2K"},
        },
    }
    req = urllib.request.Request(url, json.dumps(body).encode(),
                                 {"Content-Type": "application/json", "x-goog-api-key": api_key})
    with urllib.request.urlopen(req, timeout=300) as r:
        data = json.load(r)
    for cand in data.get("candidates", []):
        for p in cand.get("content", {}).get("parts", []):
            inline = p.get("inlineData") or p.get("inline_data")
            if inline:
                return base64.b64decode(inline["data"])
    raise RuntimeError("no image in response: " + json.dumps(data)[:500])

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only")
    ap.add_argument("--model", default=DEFAULT_MODEL)
    ap.add_argument("--aspect", default="4:1")
    args = ap.parse_args()
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not key:
        sys.exit("Set GEMINI_API_KEY first.")
    ref_b64 = base64.b64encode(open(REF, "rb").read()).decode()
    for name, title, strength, cls, cas in PRODUCTS:
        if args.only and args.only.lower() not in name.lower():
            continue
        out = os.path.join(HERE, f"{name} Product Image.png")
        if os.path.exists(out):
            print("skip (exists):", out); continue
        for aspect in (args.aspect, "21:9"):
            try:
                img = generate(key, args.model, prompt_for(title, strength, cls, cas), ref_b64, aspect)
                open(out, "wb").write(img)
                print("saved:", out); break
            except urllib.error.HTTPError as e:
                print(f"{name} [{aspect}] HTTP {e.code}: {e.read().decode()[:300]}")
            except Exception as e:
                print(f"{name} [{aspect}] {e}")
            time.sleep(2)

if __name__ == "__main__":
    main()
