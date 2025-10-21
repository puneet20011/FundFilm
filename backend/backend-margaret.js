//The Start script in package.json runs backend.js but the actual file is backend-margaret.js. Fixed package.json
import express from "express";
import {connectDB} from "./db/db.js"; // Addding from utkarsh's

import pledgesRouter from "./routes/pledges.js";
import submitRouter from "./routes/submitPledges.js";
import sumRouter from "./routes/sum.js";
import adminRouter from "./routes/admin.js";
import deleteRouter from "./routes/deletePledge.js";
import updateRouter from "./routes/updatePledge.js";
import updatesRouter from "./routes/updates.js";

console.log("Initializing the backend...");
// Initialize express
const app = express();
const PORT = process.env.PORT || 4000;

await connectDB();

app.use(express.static("frontend"));
app.use("/api/", pledgesRouter);

app.use("/api/", submitRouter);
app.use("/api/", sumRouter);
app.use("/api/", adminRouter);
app.use("/api/", deleteRouter);
app.use("/api/", updateRouter);

app.use("/api/", updatesRouter);
app.use("/uploads", express.static("uploads"));

// CALL GET TO >>>

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
