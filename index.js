import express from "express";
import mysql from "mysql2";
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://127.0.0.1:3001",
  credentials: true
}))
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Box_Me_5@12!",
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

app.get("/main-inventory-groupwise", (req, res) => {
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

app.get("/expiring-units", (req, res) => {
  db.query("SELECT * FROM expired_units", (err, result) => {
    if (err) throw err;
    res.json(result);
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

app.post("/addDonor", (req, res) => {
  const { donor_name, age, gender, blood_group, contact_no } = req.body;

  const sql = `
        INSERT INTO donor(donor_name, age, gender, blood_group, contact_no)
        VALUES (?, ?, ?, ?, ?)
    `;

  db.query(sql, [donor_name, age, gender, blood_group, contact_no], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    res.json({ message: "Donor added successfully" });
  });
});

app.post("/addDonation", (req, res) => {
  const { donor_id, branch_id, donation_date } = req.body;

  const sql = `
        INSERT INTO donation(donor_id, branch_id, donation_date)
        VALUES (?, ?, ?)
    `;

  db.query(sql, [donor_id, branch_id, donation_date], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    res.json({ message: "Donation added successfully" });
  });
});

app.listen(3000, () => {
  console.log(" Server running on port 3000");
});