****📝 AI Meeting Summarizer****

📌 Overview

AI Meeting Summarizer is a full-stack web application that takes meeting transcripts as input and generates structured summaries using OpenAI’s GPT models.
The goal is to save time, improve productivity, and ensure no key points are missed during business discussions.

**🚀 Features**

Upload or paste meeting transcript

AI-powered structured summaries (Agenda, Key Points, Action Items)

Clean React frontend for user interaction

Node.js backend with OpenAI API integration

Optional email integration to share meeting summaries

Fully deployed (frontend + backend)

**🛠️ Tech Stack**

Frontend:

React (Vite/CRA)

Axios (API calls)

Tailwind CSS (UI styling)

Backend:

Node.js + Express

OpenAI API (for summarization)

dotenv (environment variable management)

Nodemailer (for email support, optional)



**📂 Project Structure**

ai-meeting-summarizer/
│── client/             # React frontend  
│   ├── src/  
│   ├── App.js  
│   ├── App.css  
│   └── ...  
│  
│── server/             # Node.js backend  
│   ├── index.js  
│   ├── .env  
│   ├── package.json  
│   └── ...  
│  
│── README.md           # Project Documentation  

**⚙️ Setup Instructions**
1️⃣ Clone the Repository
git clone https://github.com/your-username/ai-meeting-summarizer.git
cd ai-meeting-summarizer

2️⃣ Backend Setup
cd server
npm install


Create a .env file inside server/ with:

PORT=5000
OPENAI_API_KEY=your_openai_api_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password


Run backend:

npm start

3️⃣ Frontend Setup
cd ../client
npm install
npm run dev   # for Vite
# OR
npm start     # for CRA


⚠️ In frontend code, replace API URL:

// Instead of localhost
axios.post("https://your-backend.onrender.com/summarize", { transcript })

**📊 Approach & Process**

Input Handling: Transcript provided by user (copy-paste or file upload).

Backend Processing: Text sent to Node.js server.

AI Summarization: Server calls OpenAI GPT model with structured prompt.

Response Formatting: Output categorized into Key Points, Action Items, Decisions.

Frontend Display: Clean, card-based UI for summary.

Optional Email Delivery: Send summary to participants.

✅ Deliverables for Company

Documentation (this README) → Approach, Process, Tech Stack.

**📧 Contact**

Developed by Ritwik Duggi
📩 Email: ritwikduggi@gmail.com
