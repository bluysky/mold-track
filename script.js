const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = process.env.PORT || 3002;  // 로컬에서는 3002 포트를 사용

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("mold_tracking.db", (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
        db.run(`CREATE TABLE IF NOT EXISTS molds (
            mold_id TEXT PRIMARY KEY,
            machine_number TEXT,
            status TEXT,
            maintenance TEXT,
            maintenance_date TEXT
        )`);
    }
});

// 데이터 추가 (Create)
app.post("/add-mold", (req, res) => {
    const { mold_id, machine_number, status, maintenance, maintenance_date } = req.body;
    const query = `INSERT INTO molds (mold_id, machine_number, status, maintenance, maintenance_date) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(query, [mold_id, machine_number, status, maintenance, maintenance_date], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Mold added successfully" });
    });
});

// 모든 데이터 조회 (Read)
app.get("/get-molds", (req, res) => {
    db.all("SELECT * FROM molds", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// 데이터 수정 (Update)
app.put("/update-mold/:id", (req, res) => {
    const { machine_number, status, maintenance, maintenance_date } = req.body;
    const mold_id = req.params.id;
    const query = `UPDATE molds SET machine_number = ?, status = ?, maintenance = ?, maintenance_date = ? WHERE mold_id = ?`;
    
    db.run(query, [machine_number, status, maintenance, maintenance_date, mold_id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Mold updated successfully" });
    });
});

// 데이터 삭제 (Delete)
app.delete("/delete-mold/:id", (req, res) => {
    const mold_id = req.params.id;
    const query = `DELETE FROM molds WHERE mold_id = ?`;
    
    db.run(query, mold_id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Mold deleted successfully" });
    });
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
