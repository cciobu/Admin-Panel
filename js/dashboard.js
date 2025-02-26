document.addEventListener("DOMContentLoaded", () => {
    const settings = getSettings();
    applyTheme(settings.darkMode);

    console.log("Pagina Dashboard încărcată.");

    const clients = getClients();
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === "Activ").length;
    const inactiveClients = clients.filter(c => c.status === "Inactiv").length;

    document.getElementById("total-clients").textContent = totalClients;
    document.getElementById("active-clients").textContent = activeClients;
    document.getElementById("inactive-clients").textContent = inactiveClients;

    const ctx = document.getElementById("clientsDistributionChart").getContext("2d");
    const isDarkMode = settings.darkMode;
    const clientsChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Clienți Activi", "Clienți Inactivi"],
            datasets: [{
                data: [activeClients, inactiveClients],
                backgroundColor: ["#10b981", "#ef4444"],
                borderColor: isDarkMode ? ["#1e293b", "#1e293b"] : ["#d1d5db", "#d1d5db"],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: isDarkMode ? "#a0aeca" : "#111827",
                        font: { size: 10 }
                    }
                },
                title: {
                    display: false
                }
            }
        }
    });
});