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
    const orderDetailsModal = document.getElementById("order-details-modal");
    const closeOrderDetailsModal = document.getElementById("close-order-details-modal");
    const editOrderBtn = document.getElementById("edit-order-btn");
    const cancelEditBtn = document.getElementById("cancel-edit-btn");
    const saveEditBtn = document.getElementById("save-edit-btn");
    const viewOrderDetails = document.getElementById("view-order-details");
    const editOrderForm = document.getElementById("edit-order-form");

    let currentOrder = null;

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

        paginatedOrders.forEach((order, index) => {
            const globalIndex = allOrders.indexOf(order);
            const rowHTML = `
                <tr class="table-row cursor-pointer" data-order-index="${globalIndex}">
                    <td class="p-4">${order.orderName}</td>
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
            row.addEventListener("click", () => {
                showOrderDetails(allOrders[row.dataset.orderIndex]);
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

    // Event listeners pentru sortare și căutare
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

    // Gestionare modal Adăugare/Editare Comandă
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

    // Gestionare modal Detalii/Editare Comandă
    function showOrderDetails(order) {
        currentOrder = order;
        document.getElementById("order-name-detail").textContent = order.orderName;
        document.getElementById("order-client-detail").innerHTML = `<a href="client-details.html?id=${order.clientIndex}" id="client-link" class="text-blue-400 hover:text-blue-300">${order.clientName}</a>`;
        document.getElementById("order-date-detail").textContent = order.orderDate;
        document.getElementById("order-finish-date-detail").textContent = order.finishDate;
        document.getElementById("order-description-detail").textContent = order.description || "N/A";
        document.getElementById("order-cost-detail").textContent = order.cost || 0;

        const orderImagesDetail = document.getElementById("order-images-detail");
        orderImagesDetail.innerHTML = "";
        (order.images || []).forEach(img => {
            const imgElement = document.createElement("img");
            imgElement.src = img;
            imgElement.className = "w-20 h-20 object-cover rounded cursor-pointer";
            imgElement.addEventListener("click", () => {
                const lightbox = document.getElementById("lightbox");
                const lightboxImage = document.getElementById("lightbox-image");
                lightboxImage.src = img;
                lightbox.classList.remove("hidden");
            });
            orderImagesDetail.appendChild(imgElement);
        });

        // Afișăm secțiunea de vizualizare și ascundem formularul de editare
        viewOrderDetails.classList.remove("hidden");
        editOrderForm.classList.add("hidden");
        orderDetailsModal.classList.remove("hidden");
    }

    function showEditForm() {
        // Completăm formularul cu datele curente
        document.getElementById("edit-order-name").value = currentOrder.orderName;
        document.getElementById("edit-order-date").value = currentOrder.orderDate;
        document.getElementById("edit-order-finish-date").value = currentOrder.finishDate;
        document.getElementById("edit-order-description").value = currentOrder.description || "";
        document.getElementById("edit-order-cost").value = currentOrder.cost || 0;

        // Ascundem secțiunea de vizualizare și afișăm formularul de editare
        viewOrderDetails.classList.add("hidden");
        editOrderForm.classList.remove("hidden");
    }

    function saveEditedOrder() {
        const clientIndex = currentOrder.clientIndex;
        const orderIndex = clients[clientIndex].orders.findIndex(order => 
            order.orderName === currentOrder.orderName && 
            order.orderDate === currentOrder.orderDate
        );

        const files = document.getElementById("edit-order-images").files;
        const readerPromises = [];
        for (let file of files) {
            const reader = new FileReader();
            readerPromises.push(new Promise((resolve) => {
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(file);
            }));
        }

        Promise.all(readerPromises).then((imageData) => {
            const updatedOrder = {
                orderName: document.getElementById("edit-order-name").value,
                orderDate: document.getElementById("edit-order-date").value,
                finishDate: document.getElementById("edit-order-finish-date").value,
                description: document.getElementById("edit-order-description").value,
                images: imageData.length > 0 ? imageData : currentOrder.images,
                cost: parseFloat(document.getElementById("edit-order-cost").value) || 0
            };

            clients[clientIndex].orders[orderIndex] = updatedOrder;
            saveClients(clients);
            currentOrder = updatedOrder;
            showOrderDetails(currentOrder); // Reafișăm detaliile actualizate
        });
    }

    // Event listeners pentru modalul detaliilor
    closeOrderDetailsModal.addEventListener("click", () => {
        orderDetailsModal.classList.add("hidden");
    });

    editOrderBtn.addEventListener("click", () => {
        showEditForm();
    });

    cancelEditBtn.addEventListener("click", () => {
        showOrderDetails(currentOrder); // Revenim la vizualizarea detaliilor
    });

    saveEditBtn.addEventListener("click", () => {
        saveEditedOrder();
    });

    // Gestionare lightbox (dacă e deja definit în common.js sau altundeva)
    const lightbox = document.getElementById("lightbox");
    if (lightbox) {
        const closeLightbox = document.getElementById("close-lightbox");
        closeLightbox.addEventListener("click", () => {
            lightbox.classList.add("hidden");
        });
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                lightbox.classList.add("hidden");
            }
        });
    }

    renderOrders(); // Inițializăm tabelul cu sortare implicită orderDate-asc
});