require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Profile = require("./models/userprofiles");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// ── Health check ──
app.get("/", (_req, res) => {
    res.json({ message: "API is running" });
});

// ── GET all profiles ──
app.get('/register', async (req, res) => {
    try {
        const profiles = await Profile.find();
        res.json(profiles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ── POST create a new profile ──
app.post('/register', async (req, res) => {
    try {
        const user = await Profile.create(req.body);
        res.status(201).json({
            message: "Profile stored successfully",
            profile: user,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ── PUT update a profile by ID ──
app.put('/register/:id', async (req, res) => {
    try {
        const updated = await Profile.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: "Profile not found" });
        res.json({ message: "Profile updated successfully", profile: updated });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ── DELETE a profile by ID ──
app.delete('/register/:id', async (req, res) => {
    try {
        const deleted = await Profile.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Profile not found" });
        res.json({ message: "Profile deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

async function startServer() {
    if (!process.env.mongodb_url) {
        throw new Error("mongodb_url is missing from the environment");
    }

    await mongoose.connect(process.env.mongodb_url, {
        serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer().catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
});
