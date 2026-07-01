/**
 * Homepage Interactive Features - Search & Hover Enhancements
 * Antigravity Coding Assistant
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Live Interactive Search Bar
    const searchInput = document.getElementById("homeSearch");
    const searchResults = document.getElementById("searchResults");

    const searchData = [
        { name: "King Faisal Hospital (KFH)", type: "Hospital", url: "login.html" },
        { name: "CHUK (University Teaching Hospital)", type: "Hospital", url: "login.html" },
        { name: "Butaro Cancer Center", type: "Hospital", url: "login.html" },
        { name: "RMH Kanombe (Rwanda Military Hospital)", type: "Hospital", url: "login.html" },
        { name: "Legacy Clinics", type: "Hospital", url: "login.html" },
        { name: "General Surgery (Dr. Augustin)", type: "Specialty", url: "login.html" },
        { name: "Pediatrics (Dr. Floride)", type: "Specialty", url: "login.html" },
        { name: "Gynaecology (Dr. Grace)", type: "Specialty", url: "login.html" },
        { name: "Cardiology (Dr. Olivier)", type: "Specialty", url: "login.html" },
        { name: "Internal Medicine (Dr. Steven)", type: "Specialty", url: "login.html" },
        { name: "Instant Scheduling Consultation", type: "Service", url: "login.html" },
        { name: "Emergency Medical Routing", type: "Service", url: "login.html" }
    ];

    if (searchInput && searchResults) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase().trim();
            searchResults.innerHTML = "";

            if (query.length === 0) {
                searchResults.style.display = "none";
                return;
            }

            const matches = searchData.filter(item => 
                item.name.toLowerCase().includes(query) || 
                item.type.toLowerCase().includes(query)
            );

            if (matches.length > 0) {
                matches.forEach(match => {
                    const div = document.createElement("div");
                    div.style.padding = "10px 15px";
                    div.style.cursor = "pointer";
                    div.style.borderBottom = "1px solid #f0f0f0";
                    div.style.display = "flex";
                    div.style.justify = "space-between";
                    div.innerHTML = `
                        <span style="font-weight: 600;">${match.name}</span>
                        <span style="font-size: 0.8rem; background: #e0f2f1; padding: 2px 8px; border-radius: 12px; color: #00796b;">${match.type}</span>
                    `;
                    div.addEventListener("click", () => {
                        window.location.href = match.url;
                    });
                    
                    // Hover effect
                    div.addEventListener("mouseover", () => {
                        div.style.background = "#f4fcf8";
                    });
                    div.addEventListener("mouseout", () => {
                        div.style.background = "white";
                    });

                    searchResults.appendChild(div);
                });
                searchResults.style.display = "block";
            } else {
                const div = document.createElement("div");
                div.style.padding = "15px";
                div.style.color = "#999";
                div.textContent = "No matches found. Try searching 'Faisal' or 'Surgery'.";
                searchResults.appendChild(div);
                searchResults.style.display = "block";
            }
        });

        // Hide search suggestions when clicking outside
        document.addEventListener("click", (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = "none";
            }
        });
    }

    // 2. Interactive Card Animations / Counter Tracker Simulation
    const solutionCards = document.querySelectorAll(".solution-card");
    solutionCards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            card.style.transform = "translateY(-5px) scale(1.02)";
            card.style.boxShadow = "0 12px 35px rgba(46,139,87,0.15)";
            card.style.transition = "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)";
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "translateY(0) scale(1)";
            card.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)";
        });
    });
});
