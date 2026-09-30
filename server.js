const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());
app.use(express.static(__dirname));

// ===============================
// DATA FILE
// ===============================

const dataFolder = path.join(__dirname, "data");
const dataFile = path.join(dataFolder, "results.json");

// Create data folder if it does not exist
if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
}

// Create results.json if it does not exist
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, "[]");
}

// ===============================
// READ RESULTS
// ===============================

function readResults() {
    try {
        const data = fs.readFileSync(dataFile, "utf8");

        if (!data.trim()) {
            return [];
        }

        return JSON.parse(data);
    } catch (error) {
        console.log("Error reading results:", error);
        return [];
    }
}

// ===============================
// SAVE RESULTS
// ===============================

function saveResults(results) {
    fs.writeFileSync(
        dataFile,
        JSON.stringify(results, null, 2)
    );
}

// ===============================
// HOME PAGE
// ===============================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ===============================
// SERVER STATUS
// ===============================

app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        message: "Anniversary website backend is running ❤️",
        server: "Node.js + Express",
        port: PORT
    });
});

// ===============================
// SAVE ANNIVERSARY DATE
// ===============================

app.post("/api/anniversary", (req, res) => {

    const anniversaryDate = req.body.anniversaryDate;

    if (!anniversaryDate) {
        return res.status(400).json({
            success: false,
            message: "Anniversary date is required"
        });
    }

    const results = readResults();

    const newResult = {
        id: Date.now(),
        anniversaryDate: anniversaryDate,
        quizScore: null,
        surpriseUnlocked: false,
        createdAt: new Date().toISOString()
    };

    results.push(newResult);

    saveResults(results);

    res.json({
        success: true,
        message: "Anniversary date saved ❤️",
        data: newResult
    });
});

// ===============================
// SAVE QUIZ SCORE
// ===============================

app.post("/api/quiz", (req, res) => {

    const score = Number(req.body.score);

    if (isNaN(score)) {
        return res.status(400).json({
            success: false,
            message: "Invalid quiz score"
        });
    }

    const unlocked = score >= 3;

    const results = readResults();

    const newResult = {
        id: Date.now(),
        anniversaryDate: null,
        quizScore: score,
        surpriseUnlocked: unlocked,
        createdAt: new Date().toISOString()
    };

    results.push(newResult);

    saveResults(results);

    res.json({
        success: true,
        message: unlocked
            ? "Quiz passed! Surprise unlocked ❤️"
            : "Quiz not passed",
        score: score,
        surpriseUnlocked: unlocked
    });
});

// ===============================
// SAVE COMPLETE RESULT
// ===============================

app.post("/api/result", (req, res) => {

    const anniversaryDate = req.body.anniversaryDate;
    const score = Number(req.body.score);

    if (!anniversaryDate || isNaN(score)) {
        return res.status(400).json({
            success: false,
            message: "Date and score are required"
        });
    }

    const results = readResults();

    const newResult = {
        id: Date.now(),
        anniversaryDate: anniversaryDate,
        quizScore: score,
        surpriseUnlocked: score >= 3,
        createdAt: new Date().toISOString()
    };

    results.push(newResult);

    saveResults(results);

    res.json({
        success: true,
        message: "Complete result saved ❤️",
        data: newResult
    });
});

// ===============================
// VIEW ALL RESULTS
// ===============================

app.get("/api/results", (req, res) => {

    const results = readResults();

    res.json({
        success: true,
        total: results.length,
        results: results
    });
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
    console.log("");
    console.log("====================================");
    console.log(" ❤️ ANNIVERSARY SURPRISE WEBSITE ❤️");
    console.log("====================================");
    console.log("");
    console.log(`Server running on port ${PORT}`);
    console.log("");
    console.log("API Status:");
    console.log(`http://localhost:${PORT}/api/status`);
    console.log("");
    console.log("Results:");
    console.log(`http://localhost:${PORT}/api/results`);
    console.log("");
    console.log("====================================");
});