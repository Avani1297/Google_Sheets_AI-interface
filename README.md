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

4. **Reload the Sheet**

You’ll now see a new menu: `🧠 AI Interface`  
From there, you can:

- ▶️ Run Batch  
- ⛔ Stop Batch  
- ⏹️ Reset Progress  
- 🧹 Clear Results  

---

## 💡 Example Use Cases

- Process 10,000+ rows with the same prompt — rewrite copy, tag responses, or extract summaries
- Summarize scraped content like URLs, PDFs, or call transcripts, row by row
- Classify form submissions, support logs, or feedback by category, urgency, or owner
- Generate next-step recommendations from campaign or customer notes (e.g. “wait for more data”, “escalate”)
- Help ops, CX, and marketing teams automate reviews and surface clear, copy-ready insights in Sheets

---

## 🎥 Demo

👉 [Watch the short walkthrough video](#)  
*([Add your Loom or YouTube link here](https://www.loom.com/share/7c1d3ca88d524152970c549759b222f3))*

## 🧭 UX Ideas to Make It More Stakeholder-Friendly

Ways to make it  more helpful for non-technical users and cross-functional teams with a few simple UX enhancements:

- ✅ **Follow-Up Column** – Add a column (e.g. "E") for action status (e.g. “Reviewed”, “Escalated”) to help track outcomes  
- 🧑‍🤝‍🧑 **Owner Tagging** – Let users assign each row to a team member or function (CX, Ops, Product)  
- 📅 **Reminder Flags** – Auto-flag rows for recheck (e.g. “Trend unclear — review in 2 weeks”)  
- 🧾 **Insight Formatting** – Format AI output in a slide- or Slack-ready structure for easy sharing  
- 🖱️ **Click-to-Act** – Turn results into actionable links (e.g. to a ticket, doc, or dashboard)  
- 💬 **Stakeholder Notes** – Include a “Comments” column for teams to validate, edit, or discuss insights inline

---

## 🙋‍♀️ Created By

**Avani Sharma** 
