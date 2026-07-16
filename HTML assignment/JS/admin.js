/**
 * Admin Workspace - Interactive Controls
 * Antigravity Coding Assistant
 */

// --- Doctors Database Functions ---

// 1. Initialize Doctors Database
function initDoctorsDatabase() {
    let doctors = JSON.parse(localStorage.getItem("system_doctors"));
    if (!doctors || doctors.length === 0 || !doctors[0].email) {
        doctors = [
            { id: "niyonzima", name: "Dr. NIYONZIMA Augustin", specialty: "General Surgery", days: "Mon, Wed, Fri", hospitalCode: "kfh", hospitalName: "King Faisal Hospital (KFH)", phone: "+250 788 123 456", email: "augustin.niyonzima@kfh.rw" },
            { id: "nyiransabimana", name: "Dr. Nyiransabimana Floride", specialty: "Pediatrics", days: "Tue, Thu", hospitalCode: "butaro", hospitalName: "Butaro Hospital", phone: "+250 788 234 567", email: "floride.nyiransabimana@butaro.rw" },
            { id: "niyonsenga", name: "Dr. NIYONSENGA Grace", specialty: "Gynaecology", days: "Mon, Thu", hospitalCode: "chuk", hospitalName: "University Teaching Hospital of Kigali (CHUK)", phone: "+250 788 345 678", email: "grace.niyonsenga@chuk.rw" },
            { id: "iradukunda", name: "Dr. IRADUKUNDA Olivier", specialty: "Cardiology", days: "Wednesday", hospitalCode: "chuk", hospitalName: "University Teaching Hospital of Kigali (CHUK)", phone: "+250 788 456 789", email: "olivier.iradukunda@chuk.rw" },
            { id: "niyomufasha", name: "Dr. NIYOMUFASHA Steven", specialty: "Internal Medicine", days: "Saturday", hospitalCode: "kfh", hospitalName: "King Faisal Hospital (KFH)", phone: "+250 788 567 890", email: "steven.niyomufasha@kfh.rw" }
        ];
        localStorage.setItem("system_doctors", JSON.stringify(doctors));
    }
    return doctors;
}

// 2. Render Doctors in schedules table
function renderDoctorsTable() {
    const tableBody = document.querySelector("#doctorsTable tbody");
    if (!tableBody) return;
    
    const doctors = initDoctorsDatabase();
    tableBody.innerHTML = "";

    doctors.forEach(doc => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><b>${doc.name}</b></td>
            <td>${doc.specialty}</td>
            <td>${doc.hospitalName}</td>
            <td><a href="mailto:${doc.email || ''}">${doc.email || 'N/A'}</a></td>
            <td><a href="tel:${doc.phone || ''}">${doc.phone || 'N/A'}</a></td>
            <td>${doc.days}</td>
            <td>
                <button class="btn-action btn-cancel" onclick="removeDoctor('${doc.id}')" style="margin: 0;">Remove</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    // Also update dynamic "available doctors" counts on dashboard!
    const activeDocCountEl = document.querySelector("#dashboard .stat-card:nth-child(4) p");
    if (activeDocCountEl) {
        activeDocCountEl.textContent = doctors.length;
    }
}

// 3. Remove doctor function (exposed globally)
window.removeDoctor = function(id) {
    let doctors = JSON.parse(localStorage.getItem("system_doctors")) || [];
    const removedDoc = doctors.find(d => d.id === id);
    if (!removedDoc) return;

    if (confirm(`Are you sure you want to remove ${removedDoc.name}?`)) {
        doctors = doctors.filter(d => d.id !== id);
        localStorage.setItem("system_doctors", JSON.stringify(doctors));
        renderDoctorsTable();
        alert("Doctor removed successfully.");
    }
};

// 4. Add new doctor handler
function handleAddDoctor(e) {
    e.preventDefault();
    const name = document.getElementById("docName").value.trim();
    const specialty = document.getElementById("docSpecialty").value.trim();
    const days = document.getElementById("docDays").value.trim();
    const hospitalSelect = document.getElementById("docHospital");
    const hospitalCode = hospitalSelect.value;
    const hospitalName = hospitalSelect.options[hospitalSelect.selectedIndex].text;
    const phone = document.getElementById("docPhone").value.trim();
    const email = document.getElementById("docEmail").value.trim();

    const id = "doc_" + Date.now(); // Unique ID

    const newDoc = {
        id: id,
        name: name,
        specialty: specialty,
        days: days,
        hospitalCode: hospitalCode,
        hospitalName: hospitalName,
        phone: phone,
        email: email
    };

    let doctors = JSON.parse(localStorage.getItem("system_doctors")) || [];
    doctors.push(newDoc);
    localStorage.setItem("system_doctors", JSON.stringify(doctors));

    // Reset Form
    e.target.reset();

    // Re-render
    renderDoctorsTable();
    alert(`Doctor ${name} added successfully!`);
}


// --- Session & Authentication ---

// 1. Authenticate Admin via prompt on workspace load
function authenticateAdmin() {
    let username = prompt("Please enter Admin Username to access workspace:");
    while (username !== "fido") {
        if (username === null) {
            // Admin cancelled, redirect back to login page
            window.location.href = "admin_login.html";
            return false;
        }
        alert("Incorrect Username! Please try again.");
        username = prompt("Please enter Admin Username to access workspace:");
    }

    let password = prompt("Please enter Admin Password:");
    while (password !== "fido") {
        if (password === null) {
            // Admin cancelled, redirect back to login page
            window.location.href = "admin_login.html";
            return false;
        }
        alert("Incorrect Password! Please try again.");
        password = prompt("Please enter Admin Password:");
    }

    // Save login status in sessionStorage so they are not prompted again during this session
    sessionStorage.setItem("admin_logged_in", "true");
    showWelcomeMessage();
    return true;
}

// 2. Greeting depending on the current time of day
function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
        return "Good morning";
    } else if (hour >= 12 && hour < 18) {
        return "Good afternoon";
    } else if (hour >= 18 && hour < 22) {
        return "Good evening";
    } else {
        return "Good night";
    }
}

// 3. Welcome message to Admin Workspace
function showWelcomeMessage() {
    const greeting = getGreeting();
    alert(`${greeting}, Fido! Welcome to the secure Admin Workspace.`);
    
    // Update welcome heading in the dashboard
    const headerTitle = document.querySelector("#dashboard header div");
    if (headerTitle) {
        headerTitle.innerHTML = `${greeting}, <b>Fido (Admin)</b>`;
    }
}

// 4. Validate access before opening Reports
function validateReportsAccess(event) {
    const pin = prompt("Access Control: Enter security PIN to unlock Reports & Analytics (hint: 1234):");
    if (pin !== "1234") {
        alert("Access Denied! Incorrect security PIN.");
        event.preventDefault(); // Stop navigation to the #reports section
        return false;
    }
    
    alert("Access Granted! Launching Report Generator...");
    generateReport();
    return true;
}

// 5. Generate interactive report using switch & display total doctors
function generateReport() {
    const choice = prompt(
        "Select a Report to Generate:\n" +
        "1 - Doctor Staffing & Specialty Report\n" +
        "2 - Monthly Revenue & Trends\n" +
        "3 - Appointment Success Analytics"
    );
    
    switch (choice) {
        case "1":
            const docList = JSON.parse(localStorage.getItem("system_doctors")) || [];
            let docDetails = docList.map(d => `  - ${d.name} (${d.specialty} at ${d.hospitalName})`).join("\n");
            alert(
                `--- REPORT: DOCTOR STAFFING ---\n\n` +
                `Total Registered Doctors: ${docList.length}\n\n` +
                `Details:\n${docDetails || "  No doctors registered."}\n\n` +
                `Status: All departments active.`
            );
            break;
        case "2":
            alert(
                "--- REPORT: REVENUE & TRENDS ---\n\n" +
                "Total Monthly Revenue: RWF 2,400,000\n" +
                "Billing Accuracy: 100%\n" +
                "Growth Rate: +12% MoM"
            );
            break;
        case "3":
            alert(
                "--- REPORT: APPOINTMENT METRICS ---\n\n" +
                "Today's Appointments Scheduled: 12\n" +
                "Success Rate: 94%\n" +
                "Pending Booking Queue: 5 requests"
            );
            break;
        case null:
            // Cancelled prompt
            break;
        default:
            alert("Invalid selection! Please enter 1, 2, or 3.");
            break;
    }
}

// Initialize Interactive Handlers
function initWorkspace() {
    // 1. Approve Appointment (Updates UI status badge dynamically)
    document.querySelectorAll(".btn-approve").forEach(button => {
        button.addEventListener("click", (e) => {
            const row = e.target.closest("tr");
            const patientName = row.querySelector("td:nth-child(2)").textContent;
            const statusBadge = row.querySelector(".badge");
            
            if (statusBadge) {
                statusBadge.textContent = "Confirmed";
                statusBadge.className = "badge badge-confirmed";
                
                // If approval button is inside action group, we can disable or change it
                e.target.style.display = "none"; 
                alert(`Success: Appointment for ${patientName} is now APPROVED & CONFIRMED.`);
            }
        });
    });

    // 2. Cancel Appointment (Confirm before cancelling, updates UI badge)
    document.querySelectorAll(".btn-cancel").forEach(button => {
        button.addEventListener("click", (e) => {
            const row = e.target.closest("tr");
            // If the row doesn't have an action button td, it might be the doctor schedule row.
            // Let's filter to only trigger for rows with a status badge.
            const statusBadge = row.querySelector(".badge");
            if (!statusBadge) return; // Ignore doctor remove button cancels

            const patientName = row.querySelector("td:nth-child(2)").textContent;
            
            if (confirm(`Are you sure you want to CANCEL the appointment for ${patientName}?`)) {
                statusBadge.textContent = "Cancelled";
                statusBadge.className = "badge";
                statusBadge.style.backgroundColor = "#dc3545";
                statusBadge.style.color = "#ffffff";
                
                e.target.style.display = "none";
                alert(`Cancelled: Appointment request for ${patientName} has been cancelled.`);
            }
        });
    });

    // 3. View Patient File (Simulates opening a records vault alert)
    document.querySelectorAll(".btn-view").forEach(button => {
        button.addEventListener("click", (e) => {
            const row = e.target.closest("tr");
            const name = row.querySelector("td:nth-child(1)").textContent;
            let details = `--- MEDICAL RECORD VAULT: ${name.toUpperCase()} ---\n\n`;
            
            if (name.includes("Jean")) {
                details += "Age: 28\n" +
                           "Gender: Male\n" +
                           "Primary Email: jean.k@mail.com\n" +
                           "Primary Phone: +250 788 000 123\n" +
                           "Province: Kigali City\n" +
                           "Medical Diagnosis: Malaria (Treated & Cleared)\n" +
                           "Allergies: Penicillin\n" +
                           "Doctor assigned: Dr. NIYONZIMA Augustin\n" +
                           "Last checkup: 2 weeks ago";
            } else if (name.includes("Alice")) {
                details += "Age: 24\n" +
                           "Gender: Female\n" +
                           "Primary Email: mutesi.a@mail.com\n" +
                           "Primary Phone: +250 788 111 456\n" +
                           "Province: Northern Province\n" +
                           "Medical Diagnosis: Routine Pediatric follow-up\n" +
                           "Allergies: None\n" +
                           "Doctor assigned: Dr. NIYONSENGA Grace\n" +
                           "Last checkup: 1 month ago";
            } else {
                details += "Patient ID: #N/A\nRecord Location: Offline Archives\nNo current digital diagnosis on file.";
            }
            alert(details);
        });
    });

    // 4. Hook Reports validation into navigation
    const reportsLink = document.querySelector('a[href="#reports"]');
    if (reportsLink) {
        reportsLink.addEventListener("click", (e) => {
            validateReportsAccess(e);
        });
    }

    // 5. Logout Confirmation
    const logoutLink = document.querySelector('a[href="admin_login.html"]');
    if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
            if (!confirm("Are you sure you want to exit the secure session?")) {
                e.preventDefault();
            } else {
                sessionStorage.removeItem("admin_logged_in");
            }
        });
    }

    // 6. Mobile Sidebar Hamburger Menu Toggle
    const headers = document.querySelectorAll(".main-content header");
    const sidebar = document.querySelector(".sidebar");
    
    if (headers.length > 0 && sidebar) {
        // Create overlay
        const overlay = document.createElement("div");
        overlay.className = "sidebar-overlay";
        document.body.appendChild(overlay);

        headers.forEach(header => {
            const toggleBtn = document.createElement("button");
            toggleBtn.className = "menu-toggle";
            toggleBtn.innerHTML = "&#9776;"; // Hamburger symbol
            
            // Adjust header style to align button and content nicely
            header.style.display = "flex";
            header.style.alignItems = "center";
            
            // Wrap text elements in a container if they aren't
            const wrapper = document.createElement("div");
            while (header.firstChild) {
                wrapper.appendChild(header.firstChild);
            }
            header.appendChild(toggleBtn);
            header.appendChild(wrapper);

            toggleBtn.addEventListener("click", () => {
                sidebar.classList.toggle("active");
                overlay.classList.toggle("active");
            });
        });

        // Close sidebar when clicking overlay
        overlay.addEventListener("click", () => {
            sidebar.classList.remove("active");
            overlay.classList.remove("active");
        });

        // Close sidebar when clicking any link inside it on mobile
        sidebar.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                sidebar.classList.remove("active");
                overlay.classList.remove("active");
            });
        });
    }
}

// Kick off auth and execution
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Doctors
    initDoctorsDatabase();
    renderDoctorsTable();

    // Hook up doctor add form
    const addDocForm = document.getElementById("addDoctorForm");
    if (addDocForm) {
        addDocForm.addEventListener("submit", handleAddDoctor);
    }

    // If targeted hash is reports directly, reset to dashboard on initial load for security
    if (window.location.hash === "#reports") {
        window.location.hash = "#dashboard";
    }

    if (sessionStorage.getItem("admin_logged_in") !== "true") {
        authenticateAdmin();
    } else {
        // Welcome heading greeting update (quiet welcome, no alert popup on reload)
        const greeting = getGreeting();
        const headerTitle = document.querySelector("#dashboard header div");
        if (headerTitle) {
            headerTitle.innerHTML = `${greeting}, <b>Fido (Admin)</b>`;
        }
    }
    
    initWorkspace();
});
