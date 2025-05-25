import cors from "cors";
const allowedOrigins: string[] = ["http://localhost:5173"];

export const corsOptions: cors.CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!!origin && allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy error: Not allowed by CORS"), false);
    }
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  credentials: true,
  optionsSuccessStatus: 200,
};
