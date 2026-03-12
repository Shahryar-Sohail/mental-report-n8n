# 🧠 Mental Wellness AI Reporter

An automated end-to-end pipeline that captures mental health survey data, processes it using **Groq AI**, and delivers a professionally formatted, colorful HTML wellness report directly to the user's inbox.

## 🚀 Live Demo
* **Frontend:** Vercel 
* **Automation Backend:** Used n8n Hosted on n8n Cloud

## 🛠️ The Tech Stack
* **Frontend:** React / Vite (Deployed on **Vercel**)
* **Workflow Engine:** **n8n**
* **AI Logic:** **Groq Cloud API** (llama-3.1-8b-instant)
* **Communication:** Gmail API via n8n
* **Data Handling:** Secure Webhooks & Regex-based HTML Parsing

## ⚙️ How it Works
1. **Data Capture:** A custom-built form on the Vercel-deployed website collects user sentiment data (Sleep, Anxiety, Connection, etc.).
2. **Secure Trigger:** Data is sent via a `POST` request to an **n8n Webhook**. 
3. **AI Analysis:** The **Groq AI Agent** processes the raw JSON. It calculates a "Wellness Score" and generates an empathetic analysis based on specific mental health factors.
4. **Parsing & Formatting:** The workflow uses **JavaScript Regex** to extract scores and categories from the AI's markdown output (handling bold asterisks and line breaks) to ensure clean visual delivery.
5. **Delivery:** A beautifully designed **HTML/CSS email template** is populated with the AI's insights and sent to the user via the **Gmail Node**.

## 🧩 Key Features
* **Dynamic HTML Reporting:** No plain text emails. Users receive a structured "Clinical Form" style report.
* **Real-time Processing:** Sub-2-second response time thanks to Groq's LPU inference engine.
* **Smart Parsing:** Custom logic to handle Markdown-to-HTML conversion for seamless data display.
* **Environment Safety:** Fully configured with Vercel environment variables (`VITE_` prefix) for secure API communication.

## 🛠️ Technical Challenges Overcome
* **Environment Variable Injection:** Solved the "undefined" URL issue in Vite by properly prefixing variables and managing Vercel build caches.
* **Regex Data Extraction:** Developed robust regex patterns to extract specific data points from LLM-generated strings, even when wrapped in Markdown formatting (e.g., `**Wellness Score:**`).

## 👨‍💻 Author
**Shahryar Sohail** *BS Software Engineering Student @ UMT Lahore* [LinkedIn](https://www.linkedin.com/in/shahryar-sohail/)

---
*Developed as part of an exploration into AI Automation and Full-stack Integration.*