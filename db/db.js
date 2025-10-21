//this file has dead code inside, remove the commented code before merging. 
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

const client = new MongoClient(MONGODB_URI);

let db;

export async function connectDB() {
  try {
    console.log("Attempting to connect to MongoDB...");
    await client.connect();
    db = client.db();
    console.log("MongoDB connected!");
    console.log("Connected to database:", db.databaseName);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    console.error("Error details:", err.message);
  }
}

export function getDB() {
  if (!db) throw new Error("Database not connected");
  return db;
}
