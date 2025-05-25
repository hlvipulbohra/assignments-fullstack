export const generatePrompt = (content: string): string => {
  const todayDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD        
  const outputJsonEg = {
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+91-1234567890",
    education: [
      {
        degree: "Bachelor of Technology",
        institution: "Indian Institute of Technology",
        startDate: "2016-03-01",
        endDate: "2020-02-01",
      },
      {
        degree: "Master of Science",
        institution: "Stanford University",
        startDate: "2021-04-01",
        endDate: "2023-06-01",
      },
    ],
    skills: [
      {
        name: "JavaScript",
        proficiency: "advanced",
      },
      {
        name: "Python",
        proficiency: "intermediate",
      },
    ],
    experience: [
      {
        company: "Tech Corp",
        role: "Software Engineer",
        startDate: "2021-06-01",
        endDate: "2023-05-01",
        description:
          "Developed and maintained REST APIs using Node.js and Express.",
      },
      {
        company: "InnovateX",
        role: "Full Stack Developer",
        startDate: "2023-06-01",
        endDate: "2025-06-01",
        description:
          "Building scalable web applications using React, Node.js, and MongoDB.",
      },
    ],
  };

  return `You are a highly accurate JSON extraction agent. Your task is to extract information from resume text and return it in **strict JSON format** matching the structure below.

### Extraction Guidelines:

1. **Name Detection**:
   - Look for: Title-case names preceded by "Name", "Resume of", or at the start
   - Ignore: Email usernames, signatures, or footers

2. **Contact Info**:
   - Normalize: "outlook" → "outlook.com"
   - Email: Must match valid format like john@example.com
   - Phone: Handle numbers with or without country codes and separators

3. **Skills**:
   - Normalize: "JS" → "JavaScript"
   - Proficiency Mapping:
     - "advanced" = 5+ years, top list positions, certifications
     - "intermediate" = 2–4 years or used in 1+ projects
     - "basic" = single mention or vague reference

4. **Experience**:
   - Parse ranges like "2018–20" → 2018-01-01 to 2020-12-01
   - "Present" → current date
   - Set missing endDate as null
   - Normalize values like current, present to ${todayDate}
   - Parse company abbreviations (e.g., "MSFT" → Microsoft)

5. **Education**:
   - Recognize aliases (e.g., "MIT" → "Massachusetts Institute of Technology")
   - Convert incomplete years ("2020") to "2020-01-01"
   - Normalize values like current, present to ${todayDate}
   - Expand degrees ("BSc CS" → "Bachelor of Science in Computer Science")

### Rules:

- Return ONLY valid JSON  like below:

${JSON.stringify(outputJsonEg, null, 2)}


- No explanations  
- No commentary  
- No headings  
- Just valid JSON  
- Use date format (YYYY-MM-DD)  
- Use default empty values like '' for string,etc for unknown or missing values  
- Do not invent or guess anything

---

Input Resume Text:
${content}

---
Now return ONLY the JSON object in the format described above.`;
};
