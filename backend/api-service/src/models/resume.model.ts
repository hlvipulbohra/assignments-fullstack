import ResumeModel from "../schemas/resume.schema";

interface SaveResumeInput {
  content: string;
}

export const saveResumeToDb = async (
  content: SaveResumeInput,
  userEmail: string
) => {
  const newResume = new ResumeModel({
    name: "",
    email: "",
    phone: "",
    education: [],
    experience: [],
    skills: [],
    warningsOrErrors: [],
    rawContent: content,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    userEmail: userEmail.toLowerCase(),
  });

  const savedResume = await newResume.save();
  return savedResume;
};

export const updateResumeStatus = async (id: string, resume: any) => {
  resume.updatedAt = new Date();
  const savedResume = await ResumeModel.findByIdAndUpdate(id, resume, {
    new: true,
    runValidators: true,
  });
  return savedResume;
};
export const findStatus = async (id: string): Promise<string | null> => {
  const resume = await ResumeModel.findById(id, { status: 1 });
  if (!resume) return null;
  return resume.status;
};

export const getResume = async (id: string) => {
  const resume = await ResumeModel.findById(id);
  if (!resume) return null;
  return resume;
};

export const getAllResumes = async (userEmail: string) => {
  const resumes = await ResumeModel.find({ userEmail: userEmail.toLowerCase() }).sort({ _id: -1 });
  return resumes;
};
