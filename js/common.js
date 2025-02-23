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
function getClients() {
    return JSON.parse(localStorage.getItem("clients")) || [];
}

function saveClients(clients) {
    localStorage.setItem("clients", JSON.stringify(clients));
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