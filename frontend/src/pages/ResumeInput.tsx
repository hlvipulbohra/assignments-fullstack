import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ActionButtons from "./ActionButtons";

const MIN_RESUME_LENGTH = 100; // Minimum length for resume content


export default function ResumeInput() {
  const [resumeText, setResumeText] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validate = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      return false;
    }

    if (!resumeText.trim()) {
      setError("Resume content cannot be empty");
      return false;
    }
    if (resumeText.trim().length < MIN_RESUME_LENGTH) {
      setError(
        `Resume content should be at least ${MIN_RESUME_LENGTH} characters`
      );
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:3000/api/resume/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: resumeText.trim(),
          email,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to submit resume");
        return;
      }

      const data = await res.json();

      if (data?.savedResume?._id) navigate(`/view/${data.savedResume._id}`);
    } catch (e) {
      setError("Network error, please try again");
    }
  };

const styles = {
  mainDiv: { maxWidth: 600, margin: "auto", padding: 20 },
  emailInput: { width: "100%", padding: 10, marginBottom: 10, fontSize: 16 },
  textAreaInput:{ width: "100%", height: 300, padding: 10, fontSize: 16 },
  submitButton: {
    marginTop: 20,
    marginRight:20,
    padding: "10px 20px",
    fontSize: 18,
    cursor: "pointer",
  },
}

  return (
    <div style={styles.mainDiv}>
      <h1>Paste Resume Content</h1>

      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.emailInput}
      />

      <textarea
        style={styles.textAreaInput}
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        placeholder="Paste resume text here..."
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        onClick={handleSubmit}
        style={styles.submitButton}
      >
        Submit Resume
      </button>
     <ActionButtons showAddButton={false} ></ActionButtons>
    </div>
  );
}
