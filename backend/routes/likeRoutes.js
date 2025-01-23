import express from "express";
import mongoose from "mongoose";
import Novel from "../schemas/schemas.js";
import { checkAuth } from "../middleware/checkAuth.js";

const liker = express.Router();

// Like a novel
liker.post("/novels/:novelId/like", checkAuth, async (req, res) => {
  const { novelId } = req.params; // Fixed parameter name
  const userId = req.user._id;

  try {
    const novel = await Novel.findById(novelId);
    if (!novel) return res.status(404).json({ message: "Novel not found" });

    if (novel.likes.includes(userId)) {
      return res.status(400).json({ message: "You already liked this novel" });
    }

    novel.likes.push(userId);
    await novel.save(); // Fixed variable name

    res.status(200).json({
      message: "Novel liked successfully",
      likesCount: novel.likes.length,
    });
  } catch (error) {
    console.error("Error liking novel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Unlike a novel
liker.delete("/novels/:novelId/like", checkAuth, async (req, res) => {
  const { novelId } = req.params;
  const userId = req.user._id;

  try {
    const novel = await Novel.findById(novelId);
    if (!novel) return res.status(404).json({ message: "Novel not found" });

    const initialLength = novel.likes.length;
    novel.likes = novel.likes.filter(
      (id) => id.toString() !== userId.toString()
    );

    if (novel.likes.length === initialLength) {
      return res.status(400).json({ message: "Like not found" });
    }

    await novel.save();
    res.status(200).json({
      message: "Like removed successfully",
      likesCount: novel.likes.length,
    });
  } catch (error) {
    console.error("Error removing like:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get likes count for a novel
liker.get("/novels/:novelId/likes", async (req, res) => {
  const { novelId } = req.params;

  try {
    const novel = await Novel.findById(novelId);
    if (!novel) return res.status(404).json({ message: "Novel not found" });

    res.status(200).json({
      novelId: novel._id,
      likesCount: novel.likes.length,
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all novels liked by a user
liker.get("/users/likes", checkAuth, async (req, res) => {
  try {
    const likedNovels = await Novel.find({
      likes: req.user._id,
    }).select("title author createdAt");

    res.status(200).json({
      count: likedNovels.length,
      novels: likedNovels,
    });
  } catch (error) {
    console.error("Error fetching liked novels:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default liker;
