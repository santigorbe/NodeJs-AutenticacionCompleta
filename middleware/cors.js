import cors from "cors";

export const corsMiddleware = (req, res, next) =>
  cors({
    origin: "*",
    methods: "GET, PUT, PATCH, POST, DELETE",
    allowedHeaders: ['Authorization', 'Content-Type']
  });
