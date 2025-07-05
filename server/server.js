import express from "express";

import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRouter from "./routes/adminRoute.js";
import blogRouter from "./routes/blogRoute.js";

const app = express();

// Middlewares

await connectDB();
const allowedOrigins=['http://localhost:5173','https://quick-blog-opal.vercel.app','https://quick-blog-mahesh.vercel.app']
app.use(express.json());

app.use(cors({
  origin: allowedOrigins, // frontend URL
  credentials: true
}));

// Routes
app.get("/", (req, res) => res.send("API is working"));
app.use('/api/admin',adminRouter);
app.use('/api/blog',blogRouter);





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on PORT " + PORT);
});
export default app;
