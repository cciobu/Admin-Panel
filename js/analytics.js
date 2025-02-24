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

    // Configurăm graficul Total Comenzi pe Lună/An (nou)
    const ctxOrders = document.getElementById("ordersByMonthYearChart").getContext("2d");
    const ordersByMonthYearChart = new Chart(ctxOrders, {
        type: "bar", // Tipul graficului bară
        data: {
            labels: [], // Vom calcula etichetele (luni/ani) din date
            datasets: [{
                label: "Număr de comenzi",
                data: [], // Vom calcula datele (numărul de comenzi pe lună/an)
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
                    text: "Total Comenzi pe Lună/An",
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

    // Funcție pentru a calcula comenzile pe lună/an
    function calculateOrdersByMonthYear() {
        const orders = [];
        clients.forEach(client => {
            (client.orders || []).forEach(order => {
                if (order.orderDate) {
                    const date = new Date(order.orderDate);
                    const year = date.getFullYear();
                    const month = date.toLocaleString('default', { month: 'long' }); // Numele lunii (ex. "Februarie")
                    orders.push({ year, month });
                }
            });
        });

        // Grupăm comenzile pe lună și an
        const ordersByMonthYear = {};
        orders.forEach(order => {
            const key = `${order.month} ${order.year}`;
            ordersByMonthYear[key] = (ordersByMonthYear[key] || 0) + 1;
        });

        // Sortăm lunile/anii cronologic
        const sortedKeys = Object.keys(ordersByMonthYear).sort((a, b) => {
            const [monthA, yearA] = a.split(" ");
            const [monthB, yearB] = b.split(" ");
            const dateA = new Date(yearA, new Date(Date.parse(monthA + " 1, " + yearA)).getMonth());
            const dateB = new Date(yearB, new Date(Date.parse(monthB + " 1, " + yearB)).getMonth());
            return dateA - dateB;
        });

        // Actualizăm datele și etichetele graficului
        ordersByMonthYearChart.data.labels = sortedKeys;
        ordersByMonthYearChart.data.datasets[0].data = sortedKeys.map(key => ordersByMonthYear[key]);
        ordersByMonthYearChart.update();
    }

    // Apelăm funcția după ce graficul este creat
    calculateOrdersByMonthYear();
});