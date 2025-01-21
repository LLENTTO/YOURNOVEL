import express from "express";
import NovelSchema from "../schemas/schemas.js"
import mongoose from "mongoose";

const router = express.Router()

router.post("/", async (req, res) => {
    const { name, description, text } = req.body
    try
    { if (!name || !description || !text) return res.status(400).json({ error: "Input all fields" })
        
        const newNovel = new NovelSchema({
            name, description, text
        })

        const createdNovel = await newNovel.save();
        res.status(201).json(createdNovel)}
    catch (err) {
        res.status(400).json({error: err.message})
    }
})

router.get("/", async (req, res) => {
    try {
        const novels = await NovelSchema.find().sort({ createdAt: -1 })
        res.json(novels)
    }catch(err) {res.status(500).json({error: err.message})}
})

// get a single
router.get("/:id", async (req, res) => {
    try {
        const {id} = req.params
        const novel = await NovelSchema.findById(id)

        res.status(200).json(novel)
    } catch (error) {
        
    }
})

router.put("/:id", async (req, res) => {
    
try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: "Invalid Novel ID" });
        }

        const { name, description, text } = req.body;

        if (!name && !description && !text) {
            return res.status(400).json({ error: "Please provide at least one field to update." });
        }

        const updateFields = {};
        if (name) updateFields.name = name;
        if (description) updateFields.description = description;
        if (text) updateFields.text = text;

        const updatedNovel = await NovelSchema.findByIdAndUpdate(
            id,
            { $set: updateFields }, // Update only the provided fields
            { new: true, runValidators: true } // Return updated document & run validations
        );

        // If novel not found
        if (!updatedNovel) {
            return res.status(404).json({ error: "Novel not found" });
        }

        res.status(200).json({ message: "Novel updated successfully", updatedNovel });
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const {id} = req.params
        const deletedNovel = await NovelSchema.findOneAndDelete(id);

         if(!deletedNovel) return res.status(404).json({error: "Novel not foun"})
    
        res.json({ message: "Novel deleted successfully" })
    }
    
    catch (err) {
        res.status(500).json({error: err.message})
    }
})

export default router;