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
        url: "/main-iventory-groupwise"
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
function renderTable(data) {
    if (!data || data.length === 0) {
        return "<tr><td>No Data Found</td></tr>";
    }

    let headers = Object.keys(data[0]);
    let html = "<tr>";

    headers.forEach(h => html += `<th>${h}</th>`);
    html += "</tr>";

    data.forEach(row => {
        html += "<tr>";
        headers.forEach(h => html += `<td>${row[h]}</td>`);
        html += "</tr>";
    });

    return html;
}

async function loadSection(sectionKey) {
    const section = API_MAP[sectionKey];
    const container = document.getElementById("main-section");

    container.innerHTML = `<h3>${section.title}</h3><p>Loading...</p>`;

    try {
        let res = await fetch("http://localhost:3000" + section.url);
        let json = await res.json();

        // Accept both formats:
        // 1) {data: [...]}
        // 2) [...]
        let data = Array.isArray(json) ? json : json.data;

        container.innerHTML = `
            <h3>${section.title}</h3>
            <table>${renderTable(data)}</table>
        `;
    } catch (error) {
        console.log(error);
        container.innerHTML = `<h3>${section.title}</h3><p style="color:red;">Error loading data.</p>`;
    }
}
