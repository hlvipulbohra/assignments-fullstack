import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ActionButtons from "./ActionButtons";

interface Education {
  degree?: string;
  institution?: string;
  startDate?: string;
  endDate?: string;
}
interface Skill {
  name?: string;
  proficiency?: "beginner" | "intermediate" | "advanced";
}
interface Experience {
  company?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}
interface ParsedData {
  name?: string;
  email?: string;
  phone?: string;
  education?: Education[];
  skills?: Skill[];
  experience?: Experience[];
  rawContent?: string;
  warningsOrErrors?: string[];
  status?: string;
  error?: string;
  createdAt?: string;
}

export default function ParsedResume() {
  const { id } = useParams();
  const [data, setData] = useState<ParsedData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchStatus = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3000/api/resume/status/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch status");

        const { status } = await res.json();

        if (status !== "completed") {
          setData({ status });
          setLoading(false);
          return;
        }

        // Fetch parsed resume
        const parsedRes = await fetch(`http://localhost:3000/api/resume/${id}`);
        if (!parsedRes.ok) throw new Error("Failed to fetch parsed resume");

        const { resume: parsedJson } = await parsedRes.json();
        setData(parsedJson);
      } catch (e) {
        setData({ error: (e as Error).message });
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    // Poll every 5 seconds if not completed
    const interval = setInterval(() => {
      if (data?.status && !["completed", "failed"].includes(data.status))
        fetchStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [id, data?.status]);

  const formattedDate = (dateStr: string) => {
    if (!dateStr) return "";
    
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  if (loading) return <p>Loading...</p>;

  if (data?.error)
    return (
      <div>
        <h2>Error</h2>
        <p>{data.error}</p>
      <ActionButtons showHomeButton={true} showAddButton={false} showHistoryButton={false} />
      </div>
    );

  if (data?.status && data.status !== "completed")
    return (
      <div>
        <h2>The current status of the Resume is {data.status}</h2>
        <p>Please check back later.</p>
        <ActionButtons />
      </div>
    );
  
  const textStyle :{textCapitalize: React.CSSProperties} = {
    textCapitalize: {
      textTransform: "capitalize"
   }
  }
  const styles = {
    h1: {
      color: "#007bff",
    },

    card: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "1rem",
      marginBottom: "1.5rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      backgroundColor: "#51e8c2",
    },
    cardTitle: {
      marginBottom: "1rem",
      color: "#333",
      borderBottom: "1px solid #eee",
      paddingBottom: "0.5rem",
    },
    itemBlock: {
      padding: "0.5rem 0",
      borderBottom: "1px dashed #ccc",
    },
    skillBadge: {
      background: "#e0f3ff",
      padding: "6px 12px",
      borderRadius: "16px",
      marginRight: "10px",
      marginBottom: "10px",
      fontSize: "0.9rem",
    },
    mainDiv:{
      width: "100%",
      margin: "auto",
      padding: "2rem",
      color: "#00332b",
    }
  };

  return (
    <div
      style={styles.mainDiv}
    >
      <h1 style={styles.h1}>Parsed Resume</h1>

      <div style={styles.card }>
        <p style={ textStyle.textCapitalize}>
          <strong>Name:</strong> {data?.name || ""}
        </p>
        <p>
          <strong>Email:</strong> {data?.email || ""}
        </p>
        <p>
          <strong>Phone:</strong> {data?.phone || ""}
        </p>
      </div>

      {/* Education Section */}
      {
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Education</h3>
          {data?.education?.map((edu: Education, idx: number) => (
            <div key={idx} style={styles.itemBlock}>
              <p style={ textStyle.textCapitalize} >
                <strong>Degree:</strong> {edu.degree}
              </p>
              <p style={ textStyle.textCapitalize}>
                <strong>Institution:</strong> {edu.institution}
              </p>
              <p>
                <strong>Start :</strong> {formattedDate(edu?.startDate || "")}
              </p>
              <p>
                <strong>End :</strong> {formattedDate(edu?.endDate || "")}
              </p>
            </div>
          ))}
        </div>
      }

      {/* Skills Section */}
      {
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Skills</h3>

          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              listStyle: "none",
              padding: 0,
            }}
          >
            {data?.skills?.map((skill: Skill, idx: number) => (
              <li key={idx} style={{...styles.skillBadge, ...textStyle.textCapitalize}}>
                <strong>{skill.name}</strong> — {skill.proficiency}
              </li>
            ))}
          </ul>
        </div>
      }

      {/* Experience Section */}
      {
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Experience</h3>
          {data?.experience?.map((exp: Experience, idx: number) => (
            <div key={idx} style={styles.itemBlock}>
               <p style={ textStyle.textCapitalize}>
                <strong>Role:</strong> {exp.role}
              </p>
               <p style={ textStyle.textCapitalize}>
                <strong>Company:</strong> {exp.company}
              </p>
              <p>
                <strong>Start:</strong> {formattedDate(exp?.startDate || "")}
              </p>
              <p>
                <strong>End:</strong> {formattedDate(exp?.endDate || "")}
              </p>
              <p>
                <strong>Description:</strong> {exp.description}
              </p>
            </div>
          ))}
        </div>
      }
      {/* Show resume */}
      {data?.rawContent && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Raw Content</h3>
          <pre>{data.rawContent}</pre>
        </div>
      )}
      {/* Show errors and warnings */}
      {
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Warnings / Errors</h3>
          {data?.warningsOrErrors && data.warningsOrErrors.length > 0 ? (
            <ul>
              {data.warningsOrErrors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          ) : (
            <p>No warnings or errors found.</p>
          )}
        </div>
      }
      <ActionButtons />
    </div>
  );
}
