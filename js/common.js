// Particule
particlesJS("particles-js", {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#3b82f6" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#9333ea", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out" }
    },
    interactivity: { detect_on: "canvas", events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" } } },
    retina_detect: true
});

// Funcții comune
// Adăugăm această verificare la începutul scriptului sau în funcția getClients din common.js
function getClients() {
    let storedClients = JSON.parse(localStorage.getItem("clients")) || [];
    // Verificăm și corectăm clienții lipsiți de telefon
    storedClients = storedClients.map(client => ({
        name: client.name || "",
        email: client.email || "",
        phone: client.phone || "", // Asigurăm că există un telefon
        status: client.status || "Activ", // Valoare implicită
        orders: client.orders || []
    }));
    localStorage.setItem("clients", JSON.stringify(storedClients));
    return storedClients;
}

// Navigare sidebar și evidențiere tab activ
document.addEventListener("DOMContentLoaded", () => {
    const sidebarItems = document.querySelectorAll(".sidebar-item");

    // Navigare pe tot tab-ul
    sidebarItems.forEach(item => {
        item.addEventListener("click", (e) => {
            if (e.target.tagName !== "A") {
                const link = item.querySelector("a");
                if (link) {
                    link.click();
                }
            }
        });
    });

    // Evidențiere tab activ bazat pe URL
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    sidebarItems.forEach(item => {
        const link = item.querySelector("a");
        if (link && link.getAttribute("href") === currentPage) {
            item.classList.add("bg-blue-700", "font-semibold");
        } else {
            item.classList.remove("bg-blue-700", "font-semibold");
        }
    });
});