interface Education {
  degree?: string;
  institution?: string;
  startDate?: Date;
  endDate?: Date;
}
interface Skill {
  name?: string;
  proficiency?: "basic" | "intermediate" | "advanced";
}
interface Experience {
  company?: string;
  role?: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
}

const PROFICIENCY_LEVELS = ["basic", "intermediate", "advanced"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?\d{10,15}$/;

const warningsOrErrors: string[] = [];

const lowerCaseAndTrim = (str: string ): string=> {
  return str ? str.toLowerCase().trim() : '';
}

export const validateResume = (resume: any) => {
  let { name, email, phone, skills, experience, education } = resume;

  if (!name || name.trim().length < 2) warningsOrErrors.push("Invalid name");
  name=lowerCaseAndTrim(name);
  if (!EMAIL_REGEX.test(email)) warningsOrErrors.push("Invalid email format");
  email=lowerCaseAndTrim(email);
  if (!PHONE_REGEX.test(phone)) warningsOrErrors.push("Invalid phone number");

  education.forEach((entry: Education, index: number) => {
    if (entry.startDate) entry.startDate = new Date(entry.startDate);
    if (entry.endDate) entry.endDate = new Date(entry.endDate);

    if (
      !entry.degree ||
      !entry.institution ||
      !entry.startDate ||
      !entry.endDate
    ) {
      warningsOrErrors.push(`Education entry #${index + 1} is incomplete`);
    } else if (
      entry.startDate?.getFullYear() < 1950 ||
      entry.endDate?.getFullYear() > new Date().getFullYear() ||
      entry.startDate > entry.endDate
    ) {
      warningsOrErrors.push(`Education year in entry #${index}+ 1} is invalid`);
    }
    entry.degree = lowerCaseAndTrim(entry.degree || '');
    entry.institution = lowerCaseAndTrim(entry.institution || '');
  });

  experience.forEach((entry: Experience, index: number) => {
    if (entry.startDate) entry.startDate = new Date(entry.startDate);
    if (entry.endDate) entry.endDate = new Date(entry.endDate);

    if (!entry.company || !entry.role || !entry.startDate || !entry.endDate) {
      warningsOrErrors.push(`Experience entry #${index + 1} is incomplete`);
    } else if (entry.startDate > entry.endDate) {
      warningsOrErrors.push(`Start year > end year in entry #${index + 1}`);
    } else if (
      entry.startDate?.getFullYear() < 1950 ||
      entry.endDate?.getFullYear() > new Date().getFullYear() ||
      entry.startDate > entry.endDate
    ) {
      warningsOrErrors.push(
        `Invalid year range in experience entry #${index + 1}`
      );
    }
    entry.company = lowerCaseAndTrim(entry.company || '');
    entry.role = lowerCaseAndTrim(entry.role || '');
  });

  skills.forEach((skill: Skill, index: number) => {
    if (!skill.name) {
      warningsOrErrors.push(`Skill name missing at entry #${index + 1}`);
    }
    skill.name = lowerCaseAndTrim(skill.name || '');

    if (
      !skill.proficiency ||
      !PROFICIENCY_LEVELS.includes(skill?.proficiency?.toLowerCase())
    ) {
      warningsOrErrors.push(
        `Invalid proficiency '${skill.proficiency}' at entry #${index + 1}`
      );
    }
  });

  return resume;
};
