const API_MAP = {
    hospital: {
        title: "Hospital Requests",
        url: "/hospital-requests"
    },
    branchwise: {
        title: "Branch-wise Inventory",
        url: "/branchwise"
    },
    groupwise: {
        title: "Group-wise Inventory",
        url: "/main-inventory-groupwise"
    },
    donations: {
        title: "All Donations",
        url: "/alldonations"
    },
    donorcounts: {
        title: "Donor Donation Count",
        url: "/donation-numbers"
    },
    expiry: {
        title: "Expiring Units",
        url: "/expiry"
    },
    transfused: {
        title: "Transfused Units",
        url: "/transfuse"
    }
};
function formatDate(value) {
    if (!value) return value;
    const d = new Date(value);
    if (isNaN(d)) return value;

    return d.toISOString().split("T")[0];   // returns YYYY-MM-DD
}
// ----------------------- RENDER TABLE -----------------------
function renderTable(data) {
    if (!data || data.length === 0) {
        return "<tr><td>No Data Found</td></tr>";
    }

    let headers = Object.keys(data[0]);
    let html = "<tr>";

    headers.forEach(h => html += `<th>${h}</th>`);
    html += "</tr>";

    // data.forEach(row => {
    //     html += "<tr>";
    //     headers.forEach(h => html += <td>${row[h]}</td>);
    //     html += "</tr>";
    // });
    data.forEach(row => {
        html += "<tr>";
        headers.forEach(h => {
            let value = row[h];

            // Format dates automatically
            if (h.toLowerCase().includes("date") || h.toLowerCase().includes("expiry")) {
                value = formatDate(value);
            }

            html += `<td>${value}</td>`;
        });
        html += "</tr>";
    });

    return html;
}

// ----------------------- SEARCH FILTER -----------------------
function filterTable() {
    const input = document.getElementById("searchBox").value.toLowerCase();
    const rows = document.querySelectorAll("#dataTable tr");

    // Skip header (index 0)
    rows.forEach((row, index) => {
        if (index === 0) return;

        let rowText = row.innerText.toLowerCase();
        row.style.display = rowText.includes(input) ? "" : "none";
    });
}

// ----------------------- LOAD SECTION -----------------------
async function loadSection(sectionKey) {
    const section = API_MAP[sectionKey];
    const container = document.getElementById("main-section");

    if (!section) {
        container.innerHTML = `<p style="color:red;">Invalid Section Key: ${sectionKey}</p>`;
        return;
    }

    container.innerHTML = `<h3>${section.title}</h3><p>Loading...</p>`;

    try {
        let res = await fetch("http://localhost:3000" + section.url);
        let json = await res.json();

        // Accept both formats: {data: [...]} or [...]
        let data = Array.isArray(json) ? json : json.data;

        container.innerHTML = `
            <h3>${section.title}</h3>

            <input type="text" id="searchBox" placeholder="Search..."
                   onkeyup="filterTable()"
                   style="padding:8px; margin-bottom:10px; width:250px">

            <table id="dataTable">${renderTable(data)}</table>
        `;

    } catch (error) {
        console.log("ERROR:", error);
        container.innerHTML = `<h3>${section.title}</h3><p style="color:red;">Error loading data.</p>`;
    }
}
const API_BASE = "http://localhost:3000";

/* ------------------------------
   Load Donor List for Dropdown
--------------------------------*/
async function getDonors() {
    let res = await fetch(API_BASE + "/api/donors");
    return await res.json();
}

/* ------------------------------
   Load Branch List for Dropdown
--------------------------------*/
async function getBranches() {
    let res = await fetch(API_BASE + "/api/branches");
    return await res.json();
}


/* ------------------------------
   1️⃣ Show Add Donor Form
--------------------------------*/
function showAddDonor() {
    document.getElementById("main-section").innerHTML = `
        <h2>Add New Donor</h2>

        <form id="addDonorForm">

            <label>Name:</label>
            <input type="text" name="donor_name" required />

            <label>Age:</label>
            <input type="number" name="age" required />

            <label>Gender:</label>
            <select name="gender" required>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="Other">Other</option>
            </select>

            <label>Blood Group:</label>
            <select name="blood_group" required>
                <option>A+</option><option>A-</option>
                <option>B+</option><option>B-</option>
                <option>O+</option><option>O-</option>
                <option>AB+</option><option>AB-</option>
            </select>

            <label>Contact No:</label>
            <input type="text" name="contact_no" required />

            <button type="submit">Add Donor</button>
        </form>
    `;

    document.getElementById("addDonorForm").addEventListener("submit", submitDonor);
}


/* ------------------------------
   POST: Add Donor API Call
--------------------------------*/
async function submitDonor(event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let donor = Object.fromEntries(formData.entries());

    let res = await fetch(API_BASE + "/addDonor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donor)
    });

    let result = await res.json();
    alert(result.message || "Donor added successfully!");
}



/* ------------------------------
  2️⃣ Show Add Donation Form
--------------------------------*/
async function showAddDonation() {
    document.getElementById("main-section").innerHTML = `<h2>Loading...</h2>`;

    let donors = await getDonors();
    let branches = await getBranches();
    let donorOptions = donors
        .map(d => `<option value="${d.donor_id}">${d.donor_name}</option>`)
        .join("");

    let branchOptions = branches
        .map(b => `<option value="${b.branch_id}">${b.branch_name}</option>`)
        .join("");

    document.getElementById("main-section").innerHTML = `
        <h2>Add Donation (Existing Donor)</h2>

        <form id="addDonationForm">

            <label>Donor:</label>
            <select name="donor_id" required>
                <option value="" disabled selected>Select Donor</option>
                ${donorOptions}
            </select>

            <label>Branch:</label>
            <select name="branch_id" required>
                <option value="" disabled selected>Select Branch</option>
                ${branchOptions}
            </select>

            <label>Donation Date:</label>
            <input type="date" name="donation_date" required />

            <button type="submit">Add Donation</button>
        </form>
    `;

    document.getElementById("addDonationForm").addEventListener("submit", submitDonation);
}


/* ------------------------------
    POST: Add Donation API Call
--------------------------------*/
async function submitDonation(event) {
    event.preventDefault();

    let formData = new FormData(event.target);
    let donation = Object.fromEntries(formData.entries());

    let res = await fetch(API_BASE + "/addDonation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donation)
    });

    let result = await res.json();
    alert(result.message || "Donation recorded successfully!");
}