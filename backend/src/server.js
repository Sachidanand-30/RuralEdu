import 'dotenv/config';

import app from "./app.js";
import { connectDB } from "./config/db.js";

/* ---------------------- START SERVER ---------------------- */

const startServer = async () => {
  try {
    await connectDB();

    app.listen(process.env.port, () => {
      console.log(`✅ Server running on port ${process.env.port}`);
      
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
