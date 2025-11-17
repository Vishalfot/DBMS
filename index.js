
import express from "express";
import mysql from "mysql2";
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://127.0.0.1:3000",
    credentials: true
}))
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Vishal@du1",
  database: "blood_management",
});

db.connect((err) => {
  if (err) {
    console.log(" Database connection failed:", err);
  } else {
    console.log(" Database connected successfully");
  }
});


app.get("/branchwise", (req, res) => {
  const sql = "SELECT * FROM availablebloodunits"; 

  db.query(sql, (err, result) => {
    if (err) {
      console.log(" SQL ERROR:", err); 
      return res.status(500).json({
        error: "Failed to fetch inventory from database.",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  });
});


app.get("/alldonations", (req, res) => {
  const sql = "SELECT * FROM alldonation";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(" SQL ERROR:", err);
      return res.status(500).json({
        error: "Failed to fetch donation list.",
      });
    }

    res.status(200).json(result);
  });
});


app.get("/hospital-requests", (req, res) => {
  const sql = "SELECT * FROM allhospitalrequest";

  db.query(sql, (err, result) => {
    if (err) {
      console.log("SQL ERROR:", err);
      return res.status(500).json({
        error: "Failed to fetch hospital requests.",
      });
    }

    res.status(200).json(result);
  });
});

app.get("/main-iventory-groupwise", (req, res) => {
  const sql = "SELECT * FROM total_group_wise_count";

  db.query(sql, (err, result) => {
    if (err) {
      console.log("SQL ERROR:", err);
      return res.status(500).json({
        error: "Failed to fetch hospital requests.",
      });
    }

    res.status(200).json(result);
  });
});

app.get("/donation-numbers", (req, res) => {
  const sql = "SELECT * FROM donor_all_donation";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(" SQL ERROR:", err);
      return res.status(500).json({
        error: "Failed to fetch hospital requests.",
      });
    }

    res.status(200).json(result);
  });
});

app.get("/expiry", (req, res) => {
  const sql = "SELECT * FROM expiry";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(" SQL ERROR:", err);
      return res.status(500).json({
        error: "Failed to fetch hospital requests.",
      });
    }

    res.status(200).json(result);
  });
});

app.get("/transfuse", (req, res) => {
  const sql = "SELECT * FROM transfused";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(" SQL ERROR:", err);
      return res.status(500).json({
        error: "Failed to fetch hospital requests.",
      });
    }

    res.status(200).json(result);
  });
});

app.get("/api/donors", (req, res) => {
    db.query("SELECT donor_id, donor_name FROM donor", (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result);
    });
});

app.get("/api/branches", (req, res) => {
    db.query("SELECT branch_id, branch_name FROM branch", (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result);
    });
});


app.listen(3000, () => {
  console.log(" Server running on port 3000");
});
