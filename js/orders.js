document.addEventListener("DOMContentLoaded", () => {
    let clients = getClients();
    let currentTablePage = 1;
    const ordersPerPage = 50;

    const tableBody = document.getElementById("orders-table");
    const exportBtn = document.getElementById("export-btn");
    const searchInput = document.getElementById("search-input");
    const sortDropdown = document.getElementById("sort-dropdown");
    const pagination = document.getElementById("pagination");
    const addOrderBtn = document.getElementById("add-order-btn");
    const orderModal = document.getElementById("order-modal");
    const orderModalTitle = document.getElementById("order-modal-title");
    const orderForm = document.getElementById("order-form");
    const closeOrderModal = document.getElementById("close-order-modal");
    const orderClientSelect = document.getElementById("order-client");
    const orderNameInput = document.getElementById("order-name");
    const orderDateInput = document.getElementById("order-date");
    const orderFinishDateInput = document.getElementById("order-finish-date");
    const orderDescriptionInput = document.getElementById("order-description");
    const orderImagesInput = document.getElementById("order-images");
    const orderCostInput = document.getElementById("order-cost");

    // Populăm select-ul cu clienți
    function populateClientSelect() {
        orderClientSelect.innerHTML = '<option value="">Selectează un client</option>';
        clients.forEach((client, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = client.name;
            orderClientSelect.appendChild(option);
        });
    }
    populateClientSelect();

    // Construim lista cu toate comenzile
    function getAllOrders() {
        const allOrders = [];
        clients.forEach((client, clientIndex) => {
            (client.orders || []).forEach(order => {
                allOrders.push({
                    clientName: client.name,
                    clientIndex: clientIndex,
                    ...order
                });
            });
        });
        return allOrders;
    }

    function sortOrders(orders, sortType) {
        const [field, direction] = sortType.split("-");
        return orders.sort((a, b) => {
            let valA, valB;
            if (field === "cost") {
                valA = a.cost || 0;
                valB = b.cost || 0;
            } else {
                valA = a[field];
                valB = b[field];
            }
            if (direction === "asc") {
                return valA > valB ? 1 : -1;
            } else {
                return valA < valB ? 1 : -1;
            }
        });
    }

    function renderOrders(search = "", sortType = "orderDate-asc") {
        tableBody.innerHTML = "";
        const allOrders = getAllOrders();
        let filteredOrders = allOrders.filter(order => 
            order.orderName.toLowerCase().includes(search.toLowerCase()) || 
            order.clientName.toLowerCase().includes(search.toLowerCase())
        );
        sortOrders(filteredOrders, sortType);
        const start = (currentTablePage - 1) * ordersPerPage;
        const end = start + ordersPerPage;
        const paginatedOrders = filteredOrders.slice(start, end);

        paginatedOrders.forEach(order => {
            const rowHTML = `
                <tr class="table-row" data-client-id="${order.clientIndex}">
                    <td class="p-4"><a href="client-details.html?id=${order.clientIndex}" class="text-blue-400 hover:text-blue-300">${order.orderName}</a></td>
                    <td class="p-4">${order.clientName}</td>
                    <td class="p-4">${order.orderDate}</td>
                    <td class="p-4">${order.finishDate}</td>
                    <td class="p-4">${order.cost || 0} lei</td>
                </tr>
            `;
            tableBody.insertAdjacentHTML("beforeend", rowHTML);
        });

        const rows = tableBody.querySelectorAll(".table-row");
        rows.forEach(row => {
            row.addEventListener("click", (e) => {
                if (e.target.tagName !== "A") {
                    const link = row.querySelector("a");
                    if (link) link.click();
                }
            });
        });

        const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        pagination.innerHTML = "";
        if (totalPages <= 1) return;

        const prevBtn = document.createElement("button");
        prevBtn.textContent = "Înapoi";
        prevBtn.className = "page-btn text-white";
        prevBtn.disabled = currentTablePage === 1;
        prevBtn.addEventListener("click", () => {
            if (currentTablePage > 1) {
                currentTablePage--;
                renderOrders(searchInput.value, sortDropdown.value);
            }
        });
        pagination.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.textContent = i;
            pageBtn.className = `page-btn text-white ${i === currentTablePage ? 'active' : ''}`;
            pageBtn.addEventListener("click", () => {
                currentTablePage = i;
                renderOrders(searchInput.value, sortDropdown.value);
            });
            pagination.appendChild(pageBtn);
        }

        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Înainte";
        nextBtn.className = "page-btn text-white";
        nextBtn.disabled = currentTablePage === totalPages;
        nextBtn.addEventListener("click", () => {
            if (currentTablePage < totalPages) {
                currentTablePage++;
                renderOrders(searchInput.value, sortDropdown.value);
            }
        });
        pagination.appendChild(nextBtn);
    }

    // Event listeners
    searchInput.addEventListener("input", () => {
        currentTablePage = 1;
        renderOrders(searchInput.value, sortDropdown.value);
    });

    sortDropdown.addEventListener("change", () => {
        currentTablePage = 1;
        renderOrders(searchInput.value, sortDropdown.value);
    });

    exportBtn.addEventListener("click", () => {
        const allOrders = getAllOrders();
        sortOrders(allOrders, sortDropdown.value); // Exportăm sortat
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allOrders));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "orders.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    // Gestionare modal
    addOrderBtn.addEventListener("click", () => {
        orderModalTitle.textContent = "Adaugă Comandă";
        orderForm.reset();
        orderModal.classList.remove("hidden");
    });

    closeOrderModal.addEventListener("click", () => {
        orderModal.classList.add("hidden");
    });

    orderForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const clientIndex = parseInt(orderClientSelect.value);
        if (isNaN(clientIndex)) {
            alert("Te rog selectează un client!");
            return;
        }

        const files = orderImagesInput.files;
        const readerPromises = [];
        for (let file of files) {
            const reader = new FileReader();
            readerPromises.push(new Promise((resolve) => {
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(file);
            }));
        }

        Promise.all(readerPromises).then((imageData) => {
            const newOrder = {
                orderName: orderNameInput.value,
                orderDate: orderDateInput.value,
                finishDate: orderFinishDateInput.value,
                description: orderDescriptionInput.value,
                images: imageData,
                cost: parseFloat(orderCostInput.value) || 0
            };

            clients[clientIndex].orders = clients[clientIndex].orders || [];
            clients[clientIndex].orders.push(newOrder);
            saveClients(clients);
            renderOrders(searchInput.value, sortDropdown.value);
            orderModal.classList.add("hidden");
        });
    });

    renderOrders(); // Inițializăm tabelul cu sortare implicită orderDate-asc
});