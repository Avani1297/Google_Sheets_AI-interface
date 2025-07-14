# 🧠 GSheets AI Tool

A lightweight AI-powered interface inside Google Sheets — run the same prompt across 10s, 100s, or 10,000+ rows with one click.

This tool lets you process bulk inputs using a single prompt, directly from Sheets. Useful for marketing analysis, content rewriting, tagging support tickets, and much more.

---

## ✨ What It Does

- ✅ Write a prompt in cell A1
- 📋 Paste inputs in column A (starting at A3)
- ⚙️ Click “Run Batch” from the menu
- 💬 AI responses appear in column B (one per row)
- 🧠 Tracks progress, handles errors, and estimates API cost

---

## 🔧 How to Set It Up

1. **Copy the Sheet**  
   [👉 Click here to access the template][(https://docs.google.com/spreadsheets/d/1EPUwIw_g9idKpT1JIdx-iSx33bodcNyBuOullwy1TPk/edit?usp=sharing)

    File → Make a copy

3. **Add your OpenRouter API key**  
   In the Apps Script editor (`Extensions → Apps Script`), update this line:  
   ```js
   const API_KEY = "your_key_here";
