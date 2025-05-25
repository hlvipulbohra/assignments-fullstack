import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ActionButtons from "./ActionButtons";

interface ResumeEntry {
  _id: string;
  email: string;
  status: string;
  createdAt: string;
}

export default function ResumeHistory() {
  const [resumes, setResumes] = useState<ResumeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [error, setError] = useState("");

  const validateAndFetch = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);
    setSubmittedEmail(email);
  };

  useEffect(() => {
    if (!submittedEmail) return;

    const fetchResumes = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3000/api/resume/view/all?email=${submittedEmail}`
        );
        if (!res.ok) throw new Error("Failed to fetch resumes");        
        const data = await res.json();
        setResumes(data);
        setEmail("")
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [submittedEmail]);

  const styles = {
    mainDiv: { maxWidth: 800, margin: "auto", padding: 20 },
    emailInput: {
      padding: 10,
      fontSize: 16,
      width: "60%",
      marginRight: 10,
    },
    fetchButton: {
      padding: "10px 20px",
      fontSize: 16,
      cursor: email.trim() ? "pointer" : "not-allowed",
      opacity: email.trim() ? 1 : 0.5,
      backgroundColor: "#007bff",
      marginTop: 10,
    }
  }
  return (
    <div style={styles.mainDiv}>
      <h1>Resume History</h1>

      {/* Email input section */}
      <div style={{ marginBottom: 50 }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.emailInput}
          autoFocus
        />
        <button
          onClick={validateAndFetch}
          disabled={!email.trim() }
          style={styles.fetchButton}
        >
          Fetch History
        </button>
        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
      </div>

      {/* Loading indicator */}
      {loading && <p>Loading resumes...</p>}

      {/* Resume table */}
      {submittedEmail && !loading && resumes.length > 0 && (
        <>
          <h2>Results for: {submittedEmail}</h2>
          <table
            style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={{ padding: 10, textAlign: "left" }}>Submitted At</th>
                <th style={{ padding: 10, textAlign: "left" }}>Status</th>
                <th style={{ padding: 10 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume) => (
                <tr key={resume._id} style={{ borderBottom: "1px solid #ccc" }}>
                  <td style={{ padding: 10 }}>
                    {new Date(resume.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: 10 }}>
                    <strong>{resume.status}</strong>
                  </td>
                  <td style={{ padding: 10, textAlign: "center" }}>
                    <Link to={`/view/${resume._id}`}>
                      <button
                        style={{ padding: "5px 10px", cursor: "pointer" }}
                      >
                        View
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* No resumes found */}
      {submittedEmail && !loading && resumes.length === 0 && (
        <p>No resumes found for {submittedEmail}</p>
      )}

      {/* Home link */}
      <div style={{ marginTop: 20 }}>
        <ActionButtons showHomeButton={true} showAddButton={false} showHistoryButton={false} />
      </div>
    </div>
  );
}
