//dead code inside, remove before merging.
import express from "express";
import MyDB from "../db/MyMongoDB.js";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.post("/pledges", (req, res) => {
  console.log("Received post request for /api/pledges");

  // Check if existing email, if so, update
  // Send to Data Base
  MyDB.addPledge(
    req.body.name,
    req.body.email,
    req.body.pledge,
    req.body.comment,
  );
  console.log("Added new pledge");
  res.redirect("/");
});
export default router;
