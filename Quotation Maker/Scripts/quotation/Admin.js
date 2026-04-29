$(document).ready(function () {
    //<button class="btn btn-warning btn-sm deleteBtn"><i class="bi bi-pencil-square"></i></button>

    $.get("/Admin/GetRequestorList", function (data) {
        let tbody = $("#reqTable tbody");
        tbody.empty();

        data.forEach(req => {
            tbody.append(`
            <tr>
                <td>${req.requestor}</td>
                <td>${req.dept}</td>
                <td>${req.localnum}</td>
                <td>
                    <button class="btn btn-danger btn-sm deletereqBtn"><i class="bi bi-trash3-fill"></i></button>
                </td>
            </tr>
        `);
        });
        if ($.fn.DataTable.isDataTable('#reqTable')) {
            $('#reqTable').DataTable().destroy();
        }
        // Initialize DataTable AFTER data inserted
        $('#reqTable').DataTable({
            pageLength: 10,
            lengthChange: false,
            paging: true,
            searching: true,
            responsive: true,
            scrollX: true,
            scrollY: '400px',
            ordering: true,
            info: true,
            columnDefs: [
                { targets: '_all', className: 'text-left' },
                { targets: -1, className: 'text-center' }
            ]
        });
    });


    $.get("/Admin/GetItemList", function (data) {
        let tbody = $("#itemTable tbody");
        tbody.empty();

        data.forEach(req => {
            tbody.append(`
            <tr>
                <td>${req.item}</td>
                <td>${req.rate}</td>
                <td>                
                    <button class="btn btn-danger btn-sm deleteitemBtn"><i class="bi bi-trash3-fill"></i></button>
                </td>
            </tr>
        `);
        });
        if ($.fn.DataTable.isDataTable('#itemTable')) {
            $('#itemTable').DataTable().destroy();
        }
        // Initialize DataTable AFTER data inserted
        $('#itemTable').DataTable({
            pageLength: 10,
            lengthChange: false,
            paging: true,
            searching: true,
            ordering: true,
            responsive: true,
            scrollX: true,
            scrollY: '400px',
            info: true,
            columnDefs: [
                { targets: '_all', className: 'text-left' },
                { targets: -1, className: 'text-center' },
                {
                    targets: 1, // change to the correct column index of rate
                    className: 'text-end', // right align money
                    render: function (data) {
                        if (data === null || data === "" || typeof data === "undefined") {
                            return ""; // show blank if no rate
                        }
                        let num = parseFloat(data);
                        return isNaN(num)
                            ? data // fallback: just show raw value
                            : "₱" + num.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    }
                }
            ]
        });
    });

    $.get("/Admin/GetLaborList", function (data) {
        let tbody = $("#laborTable tbody");
        tbody.empty();

        data.forEach(req => {
            tbody.append(`
            <tr>
                <td>${req.labor}</td>
                <td>${req.rate}</td>
                <td>
                    <button class="btn btn-danger btn-sm deletelaborBtn"><i class="bi bi-trash3-fill"></i></button>
                </td>
            </tr>
        `);
        });
        if ($.fn.DataTable.isDataTable('#laborTable')) {
            $('#laborTable').DataTable().destroy();
        }
        // Initialize DataTable AFTER data inserted
        $('#laborTable').DataTable({
            pageLength: 10,
            lengthChange: false,
            paging: true,
            searching: true,
            ordering: true,
            responsive: true,
            scrollX: true,
            scrollY: '400px',
            info: true,
            columnDefs: [
                { targets: '_all', className: 'text-left' },
                { targets: -1, className: 'text-center' },
                {
                    targets: 1, // change to the correct column index of rate
                    className: 'text-end', // right align money
                    render: function (data) {
                        if (data === null || data === "" || typeof data === "undefined") {
                            return ""; // show blank if no rate
                        }
                        let num = parseFloat(data);
                        return isNaN(num)
                            ? data // fallback: just show raw value
                            : "₱" + num.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    }
                }
            ]
        });

    });


    $("#addReqModal").off("click").on("click", function () {
        let requestor = $("#req").val().trim();
        let department = $("#dept").val().trim();
        let localNo = $("#rate").val().trim();

        if (!requestor || !department || !localNo) {
            iziToast.warning({
                title: 'Warning',
                message: 'Please input all fields.',
            });
            return;
        }

        // Get DataTable instance
        let table = $("#reqTable").DataTable();

        // 🔴 CHECK FOR DUPLICATE DATA
        let isDuplicate = false;

        table.rows().every(function () {
            let rowData = this.data();

            if (
                rowData[0] === requestor &&
                rowData[1] === department &&
                rowData[2] === localNo
            ) {
                isDuplicate = true;
                return false; // stop loop
            }
        });

        if (isDuplicate) {
            iziToast.error({
                title: 'Duplicate',
                message: 'This data is already added.',
            });
            return;
        }

        // ✅ IF NOT DUPLICATE → SAVE TO DATABASE
        $.post("/Admin/AddRequestor", { requestor, department, localNo }, function (res) {
            if (res.success) {

                table.row.add([
                    requestor,
                    department,
                    localNo,
                    `
                 <button class="btn btn-danger btn-sm deletereqBtn">
                    <i class="bi bi-trash3-fill"></i>
                 </button>`
                ]).draw(false);

                iziToast.success({
                    title: 'Success',
                    message: 'Added successfully.',
                });

                // Clear inputs
                $("#req, #dept, #rate").val("");

            } else {
                iziToast.error({
                    title: 'Error',
                    message: 'Failed to add data.',
                });
            }
        });
    });

    $("#addItemModal").off("click").on("click", function () {
        let item = $("#item").val().trim();
        let rateText = $("#itemrate").val().trim();      // 20,000.00
        let rate = rateText.replace(/,/g, "");           // 20000.00

        if (!item || !rate) {
            iziToast.warning({
                title: 'Warning',
                message: 'Please input all fields.',
            });
            return;
        }

        let table = $("#itemTable").DataTable();
        let isDuplicate = false;

        table.rows().every(function () {
            let rowData = this.data();

            if (
                rowData[0] === item &&
                rowData[1].replace(/,/g, "") === rate
            ) {
                isDuplicate = true;
                return false;
            }
        });

        if (isDuplicate) {
            iziToast.error({
                title: 'Duplicate',
                message: 'This data is already added.',
            });
            return;
        }

        // SAVE CLEAN NUMBER TO DATABASE
        $.post("/Admin/AddItem", { item, rate }, function (res) {
            if (res.success) {

                // FORMAT FOR DISPLAY ONLY
                let formattedRate = parseFloat(rate).toLocaleString('en-PH', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

                table.row.add([
                    item,
                    formattedRate,
                    `
                <button class="btn btn-danger btn-sm deleteitemBtn">
                    <i class="bi bi-trash3-fill"></i>
                </button>
                `
                ]).draw(false);

                iziToast.success({
                    title: 'Success',
                    message: 'Added successfully.',
                });

            } else {
                iziToast.error({
                    title: 'Error',
                    message: 'Failed to add data.',
                });
            }
        });
    });


    $("#addLaborModal").off("click").on("click", function () {
        let labor = $("#labor").val().trim();
        let rate = $("#laborRate").val().trim();

        if (!labor || !rate) {
            iziToast.warning({
                title: 'Warning',
                message: 'Please input all fields.',
            });
            return;
        }

        // Get DataTable instance
        let table = $("#laborTable").DataTable();

        // 🔴 CHECK FOR DUPLICATE DATA
        let isDuplicate = false;

        table.rows().every(function () {
            let rowData = this.data();

            if (
                rowData[0] === labor &&
                rowData[1] === rate
            ) {
                isDuplicate = true;
                return false; // stop loop
            }
        });

        if (isDuplicate) {
            iziToast.error({
                title: 'Duplicate',
                message: 'This data is already added.',
            });
            return;
        }

        // ✅ IF NOT DUPLICATE → SAVE TO DATABASE
        $.post("/Admin/AddLabor", { labor, rate }, function (res) {
            if (res.success) {

                table.row.add([
                    labor,
                    rate,
                    `
                 <button class="btn btn-danger btn-sm deletelaborBtn">
                    <i class="bi bi-trash3-fill"></i>
                 </button>`
                ]).draw(false);

                iziToast.success({
                    title: 'Success',
                    message: 'Added successfully.',
                });

            } else {
                iziToast.error({
                    title: 'Error',
                    message: 'Failed to add data.',
                });
            }
        });
    });

    $("#reqTable").on("click", ".deletereqBtn", function () {

        // Get the Datatable instance
        let table = $("#reqTable").DataTable();

        // Get the row data object
        let rowData = table.row($(this).closest("tr")).data();

        console.log(rowData);  // shows the full row object

        // Extract the columns you need
        let requestor = rowData[0]
        let department = rowData[1]
        let localNo = rowData[2]

        console.log(requestor, department, localNo);


        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this data?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Continue',
            cancelButtonText: 'No, Cancel',
            confirmButtonColor: '#2AA63E',
            cancelButtonColor: '#E7180B',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "/Admin/DeleteRequestor",
                    type: "POST",
                    data: {
                        requestor: requestor,
                        department: department,
                        localNo: localNo
                    },
                    success: function (res) {
                        if (res.success) {
                            iziToast.success({
                                title: 'Success',
                                message: 'Removed successfully.',
                            });
                            table.row($(this).closest("tr")).remove().draw(false);
                        }
                    }.bind(this)
                });
            }
        });
    });

    $("#itemTable").on("click", ".deleteitemBtn", function () {

        // Get the Datatable instance
        let table = $("#itemTable").DataTable();

        // Get the row data object
        let rowData = table.row($(this).closest("tr")).data();

        console.log(rowData);  // shows the full row object

        // Extract the columns you need
        let item = rowData[0]
        let rate = rowData[1]


        console.log(item, rate);


        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this data?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Continue',
            cancelButtonText: 'No, Cancel',
            confirmButtonColor: '#2AA63E',
            cancelButtonColor: '#E7180B',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "/Admin/DeleteItem",
                    type: "POST",
                    data: {
                        item: item,
                        rate: rate
                    },
                    success: function (res) {
                        if (res.success) {
                            iziToast.success({
                                title: 'Success',
                                message: 'Removed successfully.',
                            });
                            table.row($(this).closest("tr")).remove().draw();
                        }
                    }.bind(this)
                });
            }
        });
    });

    $("#laborTable").on("click", ".deletelaborBtn", function () {

        // Get the Datatable instance
        let table = $("#laborTable").DataTable();

        // Get the row data object
        let rowData = table.row($(this).closest("tr")).data();

        console.log(rowData);  // shows the full row object

        // Extract the columns you need
        let labor = rowData[0]
        let rate = rowData[1]


        console.log(labor, rate);


        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this data?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Continue',
            cancelButtonText: 'No, Cancel',
            confirmButtonColor: '#2AA63E',
            cancelButtonColor: '#E7180B',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "/Admin/DeleteLabor",
                    type: "POST",
                    data: {
                        labor: labor,
                        rate: rate
                    },
                    success: function (res) {
                        if (res.success) {
                            iziToast.success({
                                title: 'Success',
                                message: 'Removed successfully.',
                            });
                            table.row($(this).closest("tr")).remove().draw(false);
                        }
                    }.bind(this)
                });
            }
        });
    });

    $("#itemrate, #laborRate").on("input", function () {
        $(this).val(
            $(this).val()
                .replace(/,/g, "")
                .replace(/\.00$/, "")
                .replace(/[^0-9]/g, "")
        );
    })
        .on("blur", function () {
            if (!this.value) return;

            let number = parseFloat(this.value);

            $(this).val(
                number.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })
            );
        });
});