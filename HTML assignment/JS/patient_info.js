/**
 * Patient Info Booking Form - Interactivity
 * Antigravity Coding Assistant
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Auto-fill name if logged in
    const nameInput = document.getElementById("name");
    const storedName = sessionStorage.getItem("patient_name");
    if (nameInput && storedName) {
        nameInput.value = storedName;
    }

    // 2. Prevent past dates in date picker
    const dateInput = document.getElementById("date");
    if (dateInput) {
        const today = new Date().toISOString().split("T")[0];
        dateInput.min = today;
    }

    // 3. Dynamic Doctor Filtering based on localStorage
    const hospitalSelect = document.getElementById("hospital");
    const doctorSelect = document.getElementById("doctor");

    function getSystemDoctors() {
        let doctors = JSON.parse(localStorage.getItem("system_doctors"));
        if (!doctors) {
            doctors = [
                { id: "niyonzima", name: "Dr. NIYONZIMA Augustin", specialty: "General Surgery", days: "Mon, Wed, Fri", hospitalCode: "kfh", hospitalName: "King Faisal Hospital (KFH)" },
                { id: "nyiransabimana", name: "Dr. Nyiransabimana Floride", specialty: "Pediatrics", days: "Tue, Thu", hospitalCode: "butaro", hospitalName: "Butaro Hospital" },
                { id: "niyonsenga", name: "Dr. NIYONSENGA Grace", specialty: "Gynaecology", days: "Mon, Thu", hospitalCode: "chuk", hospitalName: "University Teaching Hospital of Kigali (CHUK)" },
                { id: "iradukunda", name: "Dr. IRADUKUNDA Olivier", specialty: "Cardiology", days: "Wednesday", hospitalCode: "chuk", hospitalName: "University Teaching Hospital of Kigali (CHUK)" },
                { id: "niyomufasha", name: "Dr. NIYOMUFASHA Steven", specialty: "Internal Medicine", days: "Saturday", hospitalCode: "kfh", hospitalName: "King Faisal Hospital (KFH)" }
            ];
            localStorage.setItem("system_doctors", JSON.stringify(doctors));
        }
        return doctors;
    }

    function filterDoctors() {
        const selectedHospital = hospitalSelect.value;
        const doctors = getSystemDoctors();

        // Clear select options
        doctorSelect.innerHTML = "";

        // Add matching doctors for the selected hospital
        const filteredDocs = doctors.filter(doc => doc.hospitalCode === selectedHospital);
        
        filteredDocs.forEach(doc => {
            const option = new Option(`${doc.name} (${doc.specialty} - ${doc.days})`, doc.id);
            doctorSelect.add(option);
        });

        // Add a default option if no doctor fits
        if (doctorSelect.options.length === 0) {
            const noDocOption = new Option("No doctors available here", "");
            doctorSelect.add(noDocOption);
        }
    }

    if (hospitalSelect && doctorSelect) {
        // Run initial filter on load
        filterDoctors();
        // Run when hospital changes
        hospitalSelect.addEventListener("change", filterDoctors);
    }

    // 4. Interactive Booking Form Submission Summary
    const bookingForm = document.querySelector("form");
    if (bookingForm) {
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Intercept and show custom alert

            const name = document.getElementById("name").value;
            const hospitalText = hospitalSelect.options[hospitalSelect.selectedIndex]?.text;
            const doctorText = doctorSelect.options[doctorSelect.selectedIndex]?.text;
            const date = dateInput.value;
            const time = document.getElementById("time").value;
            const disease = document.getElementById("disease").value;

            const summary = `
🎉 BOOKING CONFIRMED SUCCESSFULLY!

Thank you, ${name}. Here is your appointment receipt:
----------------------------------------
🏥 Hospital: ${hospitalText}
👨‍⚕️ Doctor: ${doctorText}
📅 Date: ${date}
⏰ Time: ${time}
🩺 Case: ${disease || "General Checkup"}
----------------------------------------
We have sent a confirmation message to your contact details. Please arrive 15 minutes before your scheduled slot.
            `;

            alert(summary);
            // Navigate back to home
            window.location.href = "index.html";
        });
    }
});
