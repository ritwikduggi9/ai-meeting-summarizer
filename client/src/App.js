import React, { useState } from "react";

const API_BASE = "http://localhost:5000"; // 🔥 Direct backend URL

export default function App() {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Load transcript from file
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setTranscript(reader.result.toString());
    reader.readAsText(file);
  };

  const summarize = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, prompt }),
      });
      const data = await r.json();
      if (data.success) {
        setSummary(data.data.summary || "No summary returned.");
      } else {
        alert(data.error || "Failed to summarize");
      }
    } catch (e) {
      alert("Failed to summarize (network error)");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async () => {
    try {
      const r = await fetch(`${API_BASE}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: "Meeting Summary",
          text: summary,
        }),
      });
      const data = await r.json();
      if (data.success) {
        alert("✅ " + data.data);
      } else {
        alert("❌ " + (data.error || "Failed to send email"));
      }
    } catch (e) {
      alert("Failed to send email (network error)");
      console.error(e);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto", fontFamily: "Inter, Arial" }}>
      <h2>AI Meeting Notes Summarizer</h2>

      <label>Upload transcript (.txt) or paste below:</label>
      <input type="file" accept=".txt" onChange={handleFile} style={{ display: "block", margin: "8px 0" }} />

      <textarea
        rows="8"
        placeholder="Paste transcript here…"
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input
        type="text"
        placeholder="Custom instruction (e.g., summarize for execs)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <button onClick={summarize} disabled={loading || !transcript}>
        {loading ? "Generating…" : "Generate Summary"}
      </button>

      <h3 style={{ marginTop: 20 }}>Summary (Editable)</h3>
      <textarea
        rows="8"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input
        type="email"
        placeholder="Recipient email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />
      <button onClick={sendEmail} disabled={!summary || !email}>
        Send Summary via Email
      </button>
    </div>
  );
}
