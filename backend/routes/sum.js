import express from "express";
import MyDB from "../db/MyMongoDB.js";

const router = express.Router();

router.get("/sum", async (req, res) => {
  console.log("Received request for /api/sum");
  try {
    const sum = await MyDB.sumPledges();
    const total = await MyDB.totalPledges();
    res.json({
      pledgeSum: sum,
      pledgeCount: total,
    });
  } catch (error) {
    console.error("Error fetching sum", error);
  }
});

export default router;
