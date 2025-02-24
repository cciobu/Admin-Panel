document.addEventListener("DOMContentLoaded", () => {
    console.log("Pagina Analize încărcată.");

    // Obținem clienții din localStorage
    const clients = getClients();
    const activeClients = clients.filter(c => c.status === "Activ").length;
    const inactiveClients = clients.filter(c => c.status === "Inactiv").length;

    // Configurăm graficul Distribuția Clienților (existente)
    const ctxClients = document.getElementById("clientsChart").getContext("2d");
    const clientsChart = new Chart(ctxClients, {
        type: "pie", // Tipul graficului
        data: {
            labels: ["Clienți Activi", "Clienți Inactivi"],
            datasets: [{
                data: [activeClients, inactiveClients],
                backgroundColor: ["#10b981", "#ef4444"], // Culori din design-ul tău: verde pentru activ, roșu pentru inactiv
                borderColor: ["#1e293b", "#1e293b"], // Bordură gri închis
                borderWidth: 2
            }]
        },
        options: {
            responsive: false, // Dezactivăm complet responsivitatea
            maintainAspectRatio: false, // Dezactivăm raportul de aspect automat
            aspectRatio: 1, // Menținem un raport 1:1 (patrat)
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: "#a0aeca", // Text gri deschis, conform site-ului
                        font: {
                            size: 12 // Font mai mic
                        }
                    }
                },
                title: {
                    display: true,
                    text: "Distribuția Clienților",
                    color: "#e2e8f0",
                    font: {
                        size: 16
                    }
                }
            },
            layout: {
                padding: 0 // Eliminăm orice padding suplimentar
            }
        }
    });

    // Configurăm graficul Total Comenzi pe Clienți (nou)
    const ctxOrders = document.getElementById("ordersByClientsChart").getContext("2d");
    const ordersByClientsChart = new Chart(ctxOrders, {
        type: "bar", // Tipul graficului bară
        data: {
            labels: clients.map(client => client.name), // Numele clienților pe axa X
            datasets: [{
                label: "Număr de comenzi",
                data: clients.map(client => (client.orders || []).length), // Numărul de comenzi per client
                backgroundColor: "#3b82f6", // Culoare albastră, conform design-ului
                borderColor: "#1e293b", // Bordură gri închis
                borderWidth: 1
            }]
        },
        options: {
            responsive: true, // Activăm responsivitatea
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Ascundem legenda, deoarece avem un singur dataset
                },
                title: {
                    display: true,
                    text: "Total Comenzi pe Clienți",
                    color: "#e2e8f0",
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "#a0aeca" // Text gri deschis pentru axa Y
                    }
                },
                x: {
                    ticks: {
                        color: "#a0aeca" // Text gri deschis pentru axa X
                    }
                }
            }
        }
    });
});