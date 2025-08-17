import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Validate env vars
const requiredEnv = ["OPENAI_API_KEY", "EMAIL_USER", "EMAIL_PASS"];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ Missing environment variable: ${key}`);
  }
});

// ✅ Helper response function
const sendResponse = (res, success, data = null, error = null, status = 200) => {
  res.status(status).json({ success, data, error });
};

// ✅ Root route
app.get("/", (req, res) => {
  sendResponse(res, true, "🚀 AI Meeting Summarizer Backend is running");
});

// ✅ Summarization route
app.post("/summarize", async (req, res) => {
  try {
    const { transcript, prompt } = req.body;

    if (!transcript) {
      return sendResponse(res, false, null, "Transcript is required", 400);
    }

    console.log("📩 Incoming transcript preview:", transcript.slice(0, 100));

    // 🔗 OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an AI that summarizes meeting transcripts clearly and concisely.",
          },
          {
            role: "user",
            content: `${prompt ? "Instruction: " + prompt + "\n\n" : ""}Transcript:\n${transcript.substring(
              0,
              4000
            )}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ OpenAI API error:", data);
      return sendResponse(res, false, null, data.error?.message || "Failed to fetch summary", response.status);
    }

    const summary =
      data.choices?.[0]?.message?.content?.trim() || "⚠️ No summary generated (empty response)";

    console.log("✅ Summary generated");
    return sendResponse(res, true, { summary });
  } catch (err) {
    console.error("❌ Error in /summarize:", err);
    return sendResponse(res, false, null, "Internal server error while summarizing", 500);
  }
});

// ✅ Email route
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
      return sendResponse(res, false, null, "Missing email fields (to, subject, text required)", 400);
    }

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"AI Meeting Summarizer" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log(`✅ Email sent successfully to ${to}`);
    return sendResponse(res, true, "Email sent successfully ✅");
  } catch (err) {
    console.error("❌ Error in /send-email:", err);
    return sendResponse(res, false, null, "Internal server error while sending email", 500);
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
