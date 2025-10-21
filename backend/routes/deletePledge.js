import express from "express";
import myDB from "../db/MyMongoDB.js";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));

router.post("/delete", (req, res) => {
  myDB.deletePledge(req.body.email);
  console.log("Deleted pledge from: ", req.body.email);
  res.redirect("/");
});

export default router;
