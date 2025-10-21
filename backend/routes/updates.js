import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getDB } from "../db/db.js";
import { ObjectId } from "mongodb";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get("/updates", async (req, res) => {
  try {
    const db = getDB();
    const updates = await db.collection("updateData").find().toArray();
    res.json({ updates });
  } catch (err) {
    console.error("Error in /api/updates:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/updates/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDB();
    const update = await db
      .collection("updateData")
      .findOne({ _id: new ObjectId(id) });

    if (!update) {
      return res.status(404).json({ error: "Update not found" });
    }

    res.json({ update });
  } catch (err) {
    console.error("Error fetching update:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(
  "/updates",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "modal_image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const db = getDB();

      const updateData = {
        title: req.body.title,
        gist: req.body.gist,
        summary: req.body.summary,
        image: req.files?.image?.[0]?.filename
          ? `/uploads/${req.files.image[0].filename}`
          : "",
        modal_image: req.files?.modal_image?.[0]?.filename
          ? `/uploads/${req.files.modal_image[0].filename}`
          : "",
        createdAt: new Date(),
      };

      const result = await db.collection("updateData").insertOne(updateData);

      res
        .status(201)
        .json({ message: "Update added successfully", id: result.insertedId });
    } catch (err) {
      console.error("Error adding update:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

router.put(
  "/updates/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "modal_image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const adminKey = req.query.admin;
      if (adminKey !== "theSuperSecretAdminKey") { //major securit risk , instead of hardcoing move the keys to .env file
        return res.status(403).json({ error: "Forbidden" });
      }

      const { id } = req.params;
      const db = getDB();

      const existingUpdate = await db
        .collection("updateData")
        .findOne({ _id: new ObjectId(id) });

      if (!existingUpdate) {
        return res.status(404).json({ error: "Update not found" });
      }

      const updateData = {
        title: req.body.title || existingUpdate.title,
        gist: req.body.gist || existingUpdate.gist,
        summary: req.body.summary || existingUpdate.summary,
        image: req.files?.image?.[0]?.filename
          ? `/uploads/${req.files.image[0].filename}`
          : existingUpdate.image,
        modal_image: req.files?.modal_image?.[0]?.filename
          ? `/uploads/${req.files.modal_image[0].filename}`
          : existingUpdate.modal_image,
        updatedAt: new Date(),
      };

      if (req.files?.image?.[0] && existingUpdate.image) {
        const oldImagePath = path.join(
          "uploads",
          path.basename(existingUpdate.image),
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Error deleting old image:", err);
        });
      }

      if (req.files?.modal_image?.[0] && existingUpdate.modal_image) {
        const oldModalImagePath = path.join(
          "uploads",
          path.basename(existingUpdate.modal_image),
        );
        fs.unlink(oldModalImagePath, (err) => {
          if (err) console.error("Error deleting old modal image:", err);
        });
      }

      const result = await db
        .collection("updateData")
        .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

      res.json({
        message: "Update modified successfully",
        modifiedCount: result.modifiedCount,
      });
    } catch (err) {
      console.error("Error updating update:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

router.delete("/updates/:id", async (req, res) => {
  try {
    const adminKey = req.query.admin;
    if (adminKey !== "theSuperSecretAdminKey") { //major securit risk , instead of hardcoing move the keys to .env file
      return res.status(403).json({ error: "Forbidden" });
    }

    const { id } = req.params;
    const db = getDB();

    const update = await db
      .collection("updateData")
      .findOne({ _id: new ObjectId(id) });
    if (!update) {
      return res.status(404).json({ error: "Update not found" });
    }

    await db.collection("updateData").deleteOne({ _id: new ObjectId(id) });

    if (update.image) {
      fs.unlink(path.join("uploads", path.basename(update.image)), (err) => {
        if (err) console.error("Error deleting image file:", err);
      });
    }
    if (update.modal_image) {
      fs.unlink(
        path.join("uploads", path.basename(update.modal_image)),
        (err) => {
          if (err) console.error("Error deleting modal image file:", err);
        },
      );
    }

    res.json({ message: "Update deleted successfully" });
  } catch (err) {
    console.error("Error deleting update:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
