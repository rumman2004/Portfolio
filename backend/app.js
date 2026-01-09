import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();

// Connect DB (Vercel handles connection pooling)
connectDB();

app.use(
    cors({
        origin: [
            process.env.CLIENT_URL,
            "http://localhost:5173", // Local dev
            "https://portfolio-frontend-snowy-beta.vercel.app/" // Production
        ],
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.get("/", (req, res) => {
    res.json({
        message: "Portfolio API is running",
        version: "1.0.0",
        environment: process.env.NODE_ENV,
        cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? "✓ Configured" : "✗ Not Configured",
        database: "Connected",
        endpoints: {
            auth: "/api/auth",
            about: "/api/about",
            projects: "/api/projects",
            experiences: "/api/experiences",
            certificates: "/api/certificates",
            skills: "/api/skills",
            socials: "/api/socials",
            contacts: "/api/contacts",
        },
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/socials", socialRoutes);
app.use("/api/contacts", contactRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;