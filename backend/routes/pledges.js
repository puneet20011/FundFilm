import express from "express";
import MyDB from "../db/MyMongoDB.js";

/*
const pledges = [
    {
        name: "Margaret Bertoni",
        email: "bertoni.m@northeastern.edu",
        pledge: 500,
        comment: "Let's get it done",
    },
];
*/

const router = express.Router();

/*
router.get("/pledges", (req,res) => {
    console.log("Received requests for api/listings");
    res.json({
        pledges,
    });
});
*/

router.get("/pledges", async (req, res) => {
  console.log("Received request for /api/pledges");
  try {
    const pledges = await MyDB.getPledges();
    res.json({
      pledges,
    });
  } catch (error) {
    console.error("Error fetching pledges:", error);
    res.status(500).json({ error: "Internal Server Error", pledges: [] });
  }
});

export default router;
