import express from "express";
import jwt from "jsonwebtoken";
import pool2 from "./utils/db2.js";

const router = express.Router();

// Middleware: verify JWT from Authorization header
function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const token = header.split(" ")[1];
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
}

// GET /api/evaluation
// Returns ALL HR interview evaluations for the logged-in student,
// each with hr_name and company_name.
// If the student has no evaluations, returns { evaluated: false }.
router.get("/evaluation", requireAuth, async (req, res) => {
    const email = req.user.email;

    if (!email) {
        return res.status(400).json({ error: "No email in token" });
    }

    try {
        const result = await pool2.query(
            `SELECT
         e.id,
         e.appearance_attitude,
         e.managerial_aptitude,
         e.general_awareness,
         e.technical_knowledge,
         e.communication_skills,
         e.ambition,
         e.self_confidence,
         e.overall_score,
         e.strengths,
         e.improvements,
         e.comments,
         e.evaluation_date,
         hp.name        AS hr_name,
         hp.company_name
       FROM public."Student" st
       JOIN public.evaluations e
         ON e."studentId" = st.id
       LEFT JOIN public.hr_profiles hp
         ON hp.id = e."hrId"
       WHERE st."registerNumber" = (
         SELECT "regNo" FROM public.student_scores
         WHERE LOWER(email) = LOWER($1)
         LIMIT 1
       )
         AND e.overall_score IS NOT NULL
       ORDER BY e.evaluation_date DESC, e.id DESC`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.json({ evaluated: false });
        }

        const evaluations = result.rows.map((row) => ({
            id: row.id,
            hr_name: row.hr_name || "Unknown HR",
            company_name: row.company_name || null,
            appearance_attitude: row.appearance_attitude ?? 0,
            managerial_aptitude: row.managerial_aptitude ?? 0,
            general_awareness: row.general_awareness ?? 0,
            technical_knowledge: row.technical_knowledge ?? 0,
            communication_skills: row.communication_skills ?? 0,
            ambition: row.ambition ?? 0,
            self_confidence: row.self_confidence ?? 0,
            overall_score: row.overall_score ?? 0,
            strengths: row.strengths || null,
            improvements: row.improvements || null,
            comments: row.comments || null,
            evaluation_date: row.evaluation_date || null,
        }));

        return res.json({ evaluated: true, evaluations });
    } catch (err) {
        console.error("Evaluation query error:", err.message);
        return res.status(500).json({ error: "Failed to fetch evaluation" });
    }
});

export default router;
