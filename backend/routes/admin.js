import express from "express";
//import MyDB from "../db/MyMongoDB.js";

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.post("/edit", async (req, res) => {
  if (req.body.password == 123) { //major securit risk , instead of hardcoing move this to .env file
    console.log("Successful password!");
    res.redirect("/admin.html");
  } else {
    console.log("Incorrect password");
  } //no response sent for incorrect password, request will hang indefinitely
});
export default router;
