import os
import google.generativeai as genai
from dotenv import load_dotenv

base_dir = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(base_dir, "..", ".env")
load_dotenv(dotenv_path)
api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)
    print("FLASH MODELS:")
    for m in genai.list_models():
        if 'flash' in m.name.lower():
            print(f" - {m.name}")
