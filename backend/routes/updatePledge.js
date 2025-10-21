import express from "express";
import myDB from "../db/MyMongoDB.js";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.post("/updatePledge", (req, res) => {
  //myDB.deletePledge(req.body.email);
  myDB.updatePledge(req.body.email, req.body.pledge);
  console.log("Updated pledge from: ", req.body.email);
  res.redirect("/");
});

export default router;
