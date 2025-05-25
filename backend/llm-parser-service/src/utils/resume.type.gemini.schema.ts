import { Type } from "@google/genai";

export default {
  type: Type.OBJECT,
  properties: {
    _id: {
      type: Type.STRING,
    },
    name: {
      type: Type.STRING,
    },
    email: {
      type: Type.STRING,
    },
    phone: {
      type: Type.STRING,
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING },
          institution: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
        },
        propertyOrdering: ["degree", "institution", "startDate", "endDate"],
      },
    },
    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          proficiency: {
            type: Type.STRING,
            enum: ["basic", "intermediate", "advanced"],
          },
        },
        propertyOrdering: ["name", "proficiency"],
      },
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          company: { type: Type.STRING },
          role: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        propertyOrdering: [
          "company",
          "role",
          "startDate",
          "endDate",
          "description",
        ],
      },
    },
  },
  propertyOrdering: [
    "_id",
    "name",
    "email",
    "phone",
    "education",
    "skills",
    "experience",
  ],
};
