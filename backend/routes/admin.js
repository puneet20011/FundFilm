import express from "express";
//import MyDB from "../db/MyMongoDB.js";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.post("/edit", async (req, res) => {
  if (req.body.password == 123) {
    console.log("Successful password!");
    res.redirect("/admin.html");
  } else {
    console.log("Incorrect password");
  }
});
export default router;
