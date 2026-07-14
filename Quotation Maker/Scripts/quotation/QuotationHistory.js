$(function () {

    $('#itemTable').DataTable({
        lengthChange: false,
        paging: true,
        searching: false,
        info: true,
        columnDefs: [
            { targets: '_all', className: 'text-center align-center' } // forces left alignment for all
        ]
    });
    $('#DeliveryitemTable').DataTable({
        lengthChange: false,
        paging: true,
        searching: false,
        info: true,
        columnDefs: [
            { targets: '_all', className: 'text-center align-center' } // forces left alignment for all
        ]
    });

    $('#laborTable').DataTable({
        lengthChange: false,
        paging: true,
        searching: false,
        info: true,
        columnDefs: [
            { targets: '_all', className: 'text-center align-center' } // forces left alignment for all
        ]
    });

    $('#changevalidity').select2({
        placeholder: "Select validity...",
        allowClear: true,
        theme: 'bootstrap4',
        width: 'resolve'
    });

    $('#requestor').select2({
        placeholder: "Select a requestor...",
        allowClear: true,
        theme: 'bootstrap4',
        width: 'resolve'
    });

    $('#itemModal, #laborModal,#DeliveryModal').on('shown.bs.modal', function () {
        $('#desc').select2({
            dropdownParent: $('#laborModal'),
            placeholder: "Select a description...",
            allowClear: true,
            theme: 'bootstrap4',
            width: 'resolve'
        });

        $('#item').select2({
            dropdownParent: $('#itemModal'),
            placeholder: "Select an item...",
            allowClear: true,
            theme: 'bootstrap4',
            width: 'resolve'
        });
        $('#unit').select2({
            dropdownParent: $('#itemModal'),
            placeholder: "Select a unit...",
            allowClear: true,
            theme: 'bootstrap4',
            width: 'resolve'
        });

        $('#Deliveryitem').select2({
            dropdownParent: $('#DeliveryModal'),
            placeholder: "Select an item...",
            allowClear: true,
            theme: 'bootstrap4',
            width: 'resolve'
        });

        $('#Deliveryunit').select2({
            dropdownParent: $('#DeliveryModal'),
            placeholder: "Select a unit...",
            allowClear: true,
            theme: 'bootstrap4',
            width: 'resolve'
        });
    });



    $.get('/Quotation/GetRequestors', function (data) {
        const req = $('#requestor');
        req.empty().append('<option value="" disabled selected>-- Select a requestor... --</option>');

        if (data.error) {
            alert(data.error);
            return;
        }

        data.forEach(item => {
            // store dept and local as data attributes
            req.append(`<option value="${item.requestor}" data-dept="${item.dept}" data-localnum="${item.localnum}">
                        ${item.requestor}
                    </option>`);
        });
    }).fail(function () {
        alert("Failed to load requestors.");
    });

    $('#requestor').on('change', function () {
        var selected = $('#requestor option:selected');
        var dept = selected.data('dept');
        var local = selected.data('localnum');

        if (dept || local) {
            $('#department').val(dept || '');
            $('#localnum').val(local || '');
        } else {
            $('#department').val('');
            $('#localnum').val('');
        }
    });

    $('#tblQuotation').DataTable({
        lengthChange: false,
        paging: true,
        searching: true,
        responsive: true,
        scrollX: true,
        scrollY: '400px',   // must specify height
        info: true,
        pageLength: 10,

        ajax: {
            url: '/EditQuotation/GetQuotationData', // controller action
            type: 'GET',
            dataSrc: 'result' // property name in JSON
        },

        columns: [
            { data: 'QuotationNumber', className: 'text-center' },
            {
                data: 'QuotationDate', className: 'text-center',
                render: function (data) {
                    if (!data) return '';
                    // Strip /Date(...)/
                    var timestamp = parseInt(data.replace(/\/Date\((\d+)\)\//, '$1'), 10);
                    var date = new Date(timestamp);
                    // Format as yyyy-MM-dd (or any format you like)
                    return date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                }
            },
            { data: 'Validity', className: 'text-center' },
            {
                data: 'ValidUntil', className: 'text-center',
                render: function (data) {
                    if (!data) return '';
                    var timestamp = parseInt(data.replace(/\/Date\((\d+)\)\//, '$1'), 10);
                    var date = new Date(timestamp);
                    return date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                }
            },
            { data: 'ReferenceNumber', className: 'text-center' },
            { data: 'QuotationTo', className: 'text-center' },
            { data: 'Requestor', className: 'text-center' },
            { data: 'Attention', className: 'text-center' },
            { data: 'Department', className: 'text-center' },
            { data: 'Thru', className: 'text-center' },
            { data: 'LocalNo', className: 'text-center' },
            { data: 'Subject', className: 'text-center' },
            { data: 'MaterialsSubTotal', className: 'text-center' },
            { data: 'LaborSubTotal', className: 'text-center' },
            { data: 'Vat', className: 'text-center' },
            { data: 'Total', className: 'text-center' },
            {
                data: null,
                render: function (data, type, row) {
                    return `<a href="/Quotation/ViewPdf?QuotationNumber=${row.QuotationNumber}" target="_blank"> <i class="fa fa-file-pdf-o" style="color:red;"></i> View</a>`;
                }, className: 'text-center'
            },
            { data: 'Username', className: 'text-center' },
            {
                data: 'Action', render: function (data, type, row) {
                    return `<button class="btn btn-sm btn-warning" id="btnedit" data-bs-toggle="modal" data-bs-target="#QuotationModal">Edit</button> 
                            <button class="btn btn-sm btn-warning" id="btndelivery" data-bs-toggle="modal" data-bs-target="#deliverymodal">Delivery </button>
                             <button class="btn btn-sm btn-warning" id="btnduplicate">Duplicate </button>`;
                }, className: 'text-center'
            }
        ]
    });


    //DUPLICATE
    $('#tblQuotation').on('click', '#btnduplicate', function () {
        var table = $('#tblQuotation').DataTable();
        var data = table.row($(this).closest('tr')).data();
        var QuotationNumber = data.QuotationNumber;

        $.post('/Quotation/InsertDuplicate', { QuotationNumber: QuotationNumber }, function (result) {
            if (result) {
                Swal.fire({
                    icon: 'success',
                    title: 'Quotation Duplicated!',
                    text: `Quotation ${QuotationNumber}`,
                    showConfirmButton: false,
                    timer: 2000 // closes automatically after 2 seconds
                });
                $('#tblQuotation').DataTable().ajax.reload();
            }
        });


    });

    //======


    $('#tblQuotation').on('click', '#btnedit', function () {

        var table = $('#tblQuotation').DataTable();
        var data = table.row($(this).closest('tr')).data();
        var validUntilDate = parseDotNetDate(data.ValidUntil);
        var QuotationDate = parseDotNetDate(data.QuotationDate);
        var QuotationNumber = data.QuotationNumber;
        if (validUntilDate) {
            // Format as "Oct 17, 2026"
            var formatted = validUntilDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            $('#validity').val(formatted);
        } else {
            $('#validity').val('');
        }


        if (QuotationDate) {
            // Format as "Oct 17, 2026"
            var formatted = QuotationDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            $('#quotationdate').val(formatted);
        } else {
            $('#quotationdate').val('');
        }
        // Example: put ReferenceNumber into modal textbox
        $('#quotationnum').val(data.QuotationNumber);
        $('#changevalidity').val(data.Validity).trigger('change');
        $('#referenceNumber').val(data.ReferenceNumber);
        $('#department').val(data.Department);
        $('#localnum').val(data.LocalNo);
        $('#attention').val(data.Attention);
        $('#requestor').val(data.Requestor).trigger('change');
        $('#quotationTo').val(data.QuotationTo);
        $('#thru').val(data.Thru);
        $('#subject').val(data.Subject);
        $('#materialtotal').val(data.MaterialsSubTotal);
        $('#labortotal').val(data.LaborSubTotal);
        $('#vat').val(data.Vat);
        $('#totalamounts').val(data.Total);

        // Show modal (if not already triggered by data-bs-toggle)
        $('#QuotationModal').modal('show');
        $('#itemTable').DataTable().destroy();
        $('#itemTable').DataTable({
            lengthChange: false,
            paging: false,
            responsive: true,
            scrollX: true,
            scrollY: '400px',
            searching: false,
            info: true,

            ajax: {
                url: '/EditQuotation/GetItemList', // controller action
                type: 'GET',
                data: function (d) {
                    d.QuotationNumber = $('#quotationnum').val();
                },
                dataSrc: 'result' // property name in JSON
            },

            columns: [
                { data: 'ItemDescription', className: 'text-center' },
                { data: 'Qty', className: 'text-center' },
                { data: 'Unit', className: 'text-center' },
                { data: 'Rate', className: 'text-center' },
                { data: 'Amount', className: 'text-center' },
                {
                    data: 'Action', render: function (data, type, row) {
                        return `<button class="btn btn-danger btn-sm deleteBtn"><i class="fa fa-trash"></i> Delete</button>
                            <button class="btn btn-sm btn-warning" id="btnedititem" data-bs-toggle="modal" data-bs-target="#EditItemModal"><i class="fa fa-pencil"></i> Edit</button>`
                    }, className: 'text-center'
                }
            ]
        });
        $('#laborTable').DataTable().destroy();
        $('#laborTable').DataTable({
            lengthChange: false,
            paging: true,
            responsive: true,
            scrollX: true,
            scrollY: '400px',
            searching: false,
            info: true,

            ajax: {
                url: '/EditQuotation/GetLabor', // controller action
                type: 'GET',
                data: function (d) {
                    d.QuotationNumber = $('#quotationnum').val();
                },
                dataSrc: 'result' // property name in JSON
            },

            columns: [
                { data: 'LaborDescription', className: 'text-center' },
                { data: 'Count', className: 'text-center' },
                { data: 'WorkingDay', className: 'text-center' },
                { data: 'Rate', className: 'text-center' },
                { data: 'Amount', className: 'text-center' },
                {
                    data: 'Action', render: function (data, type, row) {
                        return `<button class="btn btn-danger btn-sm deleteLaborBtn"><i class="fa fa-trash"></i> Delete</button>
                            <button class="btn btn-sm btn-warning" id="btneditlabor" data-bs-toggle="modal" data-bs-target="#UpdatelaborModal"> <i class="fa fa-pencil"></i> Edit</button >`
                    }, className: 'text-center'
                }
            ]
        });
        setInterval(function () {
            calculateItemTotal();
        }, 500);
        setInterval(function () {
            calculateLaborTotal();
        }, 500);
    });

    //UPDATE
    $.get('/Quotation/GetItems', function (data) {
        const item = $('#EditItem');
        item.empty().append('<option value="" disabled selected>Select an item...</option>');

        if (data.error) {
            alert(data.error);
            return;
        }

        data.forEach(i => {
            item.append(`<option value="${i.itemname}" data-rate="${i.rate}" data-unit="${i.Unit}">${i.itemname}</option>`);
        });
    }).fail(function () {
        alert("Failed to load items.");
    });

    $('#EditItem').on('change', function () {
        const selectedOption = $(this).find(':selected');
        const unitValue = selectedOption.data('unit'); // assuming your API returns "unit"

        // Set the unit dropdown value
        $('#EditUnit').val(unitValue).trigger('change.select2');
    }
    );

    $('#EditItem').on('change', function () {
        var rate = $('#EditItem option:selected').data('rate');

        if (rate) {
            $('#EditQuantity').prop('disabled', false);
            $('#EditQuantity').val(1); // reset to 1 when new item is selected

            // Format rate with ₱ and commas
            var formattedRate = '₱' + parseFloat(rate).toLocaleString('en-PH', { minimumFractionDigits: 2 });
            $('#EditRate').val(formattedRate);

            updateEditAmount();
        } else {
            $('#EditQuantity').prop('disabled', true);
            $('#EditQuantity').val('1');
            $('#EditRate').val('');
            $('#EditTotalamount').val('');
        }
    });
    $('#itemTable').on('click', '#btnedititem', function () {
        var table = $('#itemTable').DataTable();
        var data = table.row($(this).closest('tr')).data();
        $('#EditItem').val(data.ItemDescription).trigger('change');
    });

    $('#UpdateEditItemModal').on('click', function () {
        var table = $('#itemTable').DataTable();
        var item = $('#EditItem').val();
        var Quantity = $('#EditQuantity').val();
        var Unit = $('#EditUnit').val();
        var Rate = $('#EditRate').val();
        var Amount = $('#EditTotalamount').val();
        var row = table.row(function (idx, data, node) {
            return data.ItemDescription === item;  // match first column
        });

        if (row.any()) {
            // Update the row’s data
            var updated = row.data();
            updated.Qty = Quantity;     
            updated.Unit = Unit;    
            updated.Rate = Rate;    
            updated.Amount = Amount;   
            row.data(updated).draw();
        }

        $('#EditItemModal').modal('hide');
    });
    $('#EditQuantity').on('input change', updateEditAmount);
    //==============
    $.get('/Quotation/GetItems', function (data) {
        const item = $('#item');
        item.empty().append('<option value="" disabled selected>Select an item...</option>');

        if (data.error) {
            alert(data.error);
            return;
        }

        data.forEach(i => {
            item.append(`<option value="${i.itemname}" data-rate="${i.rate}" data-unit="${i.Unit}">${i.itemname}</option>`);
        });
    }).fail(function () {
        alert("Failed to load items.");
    });

    $('#item').on('change', function () {
        const selectedOption = $(this).find(':selected');
        const unitValue = selectedOption.data('unit'); // assuming your API returns "unit"

        // Set the unit dropdown value
        $('#unit').val(unitValue).trigger('change.select2');
    }
    );
    //=====
    $.get('/Quotation/GetItems', function (data) {
        const item = $('#Deliveryitem');
        item.empty().append('<option value="" disabled selected>Select an item...</option>');

        if (data.error) {
            alert(data.error);
            return;
        }

        data.forEach(i => {
            item.append(`<option value="${i.itemname}" data-rate="${i.rate}" data-unit="${i.Unit}">${i.itemname}</option>`);
        });
    }).fail(function () {
        alert("Failed to load items.");
    });

    $('#Deliveryitem').on('change', function () {
        const selectedOption = $(this).find(':selected');
        const unitValue = selectedOption.data('unit'); // assuming your API returns "unit"

        // Set the unit dropdown value
        $('#Deliveryunit').val(unitValue).trigger('change.select2');
    }
    );
    //====
    $.get('/Quotation/GetLabor', function (data) {
        const labor = $('#desc');
        labor.empty().append('<option value="" disabled selected>Select a description...</option>');

        if (data.error) {
            alert(data.error);
            return;
        }

        data.forEach(i => {
            labor.append(`<option value="${i.desc}" data-rate="${i.laborrate}">${i.desc}</option>`);
        });
    }).fail(function () {
        alert("Failed to load items.");
    });
    //updatelabormodal
    $('#laborTable').on('click', '#btneditlabor', function () {
        var table = $('#laborTable').DataTable();
        var data = table.row($(this).closest('tr')).data();
        $('#Editdesc').val(data.LaborDescription).trigger('change');
    });


    $.get('/Quotation/GetLabor', function (data) {
        const labor = $('#Editdesc');
        labor.empty().append('<option value="" disabled selected>Select a description...</option>');

        if (data.error) {
            alert(data.error);
            return;
        }

        data.forEach(i => {
            labor.append(`<option value="${i.desc}" data-rate="${i.laborrate}">${i.desc}</option>`);
        });
    }).fail(function () {
        alert("Failed to load items.");
    });

    $('#item').on('change', function () {
        var rate = $('#item option:selected').data('rate');

        if (rate) {
            $('#quantity').prop('disabled', false);
            $('#quantity').val(1); // reset to 1 when new item is selected

            // Format rate with ₱ and commas
            var formattedRate = '₱' + parseFloat(rate).toLocaleString('en-PH', { minimumFractionDigits: 2 });
            $('#rate').val(formattedRate);

            updateAmount();
        } else {
            $('#quantity').prop('disabled', true);
            $('#quantity').val('1');
            $('#rate').val('');
            $('#totalamount').val('');
        }
    });
    $('#Deliveryitem').on('change', function () {
            $('#Deliveryquantity').prop('disabled', false);
            $('#Deliveryquantity').val(1); // reset to 1 when new item is selected

    });

    $('#quantity').on('input change', updateAmount); // update when qty changes


    function updateAmount() {
        // Remove ₱ and commas before parsing
        var rateText = $('#rate').val().replace(/[₱,]/g, '') || 0;
        var rate = parseFloat(rateText);
        var qty = parseInt($('#quantity').val()) || 0;

        var total = rate * qty;

        // Format with ₱, commas, and 2 decimals
        var formattedTotal = '₱' + total.toLocaleString('en-PH', { minimumFractionDigits: 2 });
        $('#totalamount').val(formattedTotal);
    }
    function updateEditAmount() {
        // Remove ₱ and commas before parsing
        var rateText = $('#EditRate').val().replace(/[₱,]/g, '') || 0;
        var rate = parseFloat(rateText);
        var qty = parseInt($('#EditQuantity').val()) || 0;

        var total = rate * qty;

        // Format with ₱, commas, and 2 decimals
        var formattedTotal = '₱' + total.toLocaleString('en-PH', { minimumFractionDigits: 2 });
        $('#EditTotalamount').val(formattedTotal);
    }

    $('#desc').on('change', function () {
        var rateLabor = $('#desc option:selected').data('rate');

        if (rateLabor) {
            $('#count').prop('disabled', false);
            $('#count').val(1); // reset to 1 when new item is selected

            // Format rate with ₱ and commas
            var formattedRate = '₱' + parseFloat(rateLabor).toLocaleString('en-PH', { minimumFractionDigits: 2 });
            $('#laborrate').val(formattedRate);

            updateLaborAmount();
        } else {
            $('#count').prop('disabled', true);
            $('#count').val('1');
            $('#laborrate').val('');
            $('#totallabor').val('');
        }
    });
    $('#Editdesc').on('change', function () {
        var rateLabor = $('#Editdesc option:selected').data('rate');

        if (rateLabor) {
            $('#Editcount').prop('disabled', false);
            $('#Editcount').val(1); // reset to 1 when new item is selected

            // Format rate with ₱ and commas
            var formattedRate = '₱' + parseFloat(rateLabor).toLocaleString('en-PH', { minimumFractionDigits: 2 });
            $('#Editlaborrate').val(formattedRate);

            updateEditLaborAmount();
        } else {
            $('#Editcount').prop('disabled', true);
            $('#Editcount').val('1');
            $('#Editlaborrate').val('');
            $('#Edittotallabor').val('');
        }
    });

    $('#count').on('input change', updateLaborAmount); // update when qty changes
    $('#work').on('input change', updateLaborAmount);
    $('#Editcount').on('input change', updateEditLaborAmount); // update when qty changes
    $('#Editwork').on('input change', updateEditLaborAmount);

    $('#btnUpdateLaborModal').on('click', function () {
        var table = $('#laborTable').DataTable();
        var description = $('#Editdesc').val();
        var work = $('#Editwork').val();
        var count = $('#Editcount').val();
        var rate = $('#Editlaborrate').val();
        var totallabor = $('#Edittotallabor').val();
        var row = table.row(function (idx, data, node) {
            return data.LaborDescription === description;  // match first column
        });

        if (row.any()) {
            // Update the row’s data
            var updated = row.data();
            updated.Count = count;
            updated.WorkingDay = work;
            updated.Rate = rate;
            updated.Amount = totallabor;
            row.data(updated).draw();
        }

        $('#UpdatelaborModal').modal('hide');
    });


    function updateEditLaborAmount() {
        // Remove ₱ and commas before parsing
        var rateText = $('#Editlaborrate').val().replace(/[₱,]/g, '') || 0;
        var rate = parseFloat(rateText);
        var qty = parseInt($('#Editcount').val()) || 0;
        var worktext = $('#Editwork').val().replace(/[₱,]/g, '') || 0;
        var workday = parseInt($('#Editwork').val()) || 1;;
        var total = rate * qty * workday;

        // Format with ₱, commas, and 2 decimals
        var formattedTotal = '₱' + total.toLocaleString('en-PH', { minimumFractionDigits: 2 });
        $('#Edittotallabor').val(formattedTotal);
    }
    function updateLaborAmount() {
        // Remove ₱ and commas before parsing
        var rateText = $('#laborrate').val().replace(/[₱,]/g, '') || 0;
        var rate = parseFloat(rateText);
        var qty = parseInt($('#count').val()) || 0;
        var worktext = $('#work').val().replace(/[₱,]/g, '') || 0;
        var workday = parseInt($('#work').val()) || 1;;
        var total = rate * qty * workday;

        // Format with ₱, commas, and 2 decimals
        var formattedTotal = '₱' + total.toLocaleString('en-PH', { minimumFractionDigits: 2 });
        $('#totallabor').val(formattedTotal);
    }
    var table = $('#itemTable').DataTable();
    var labortable = $('#laborTable').DataTable();
    calculateItemTotal();
    function calculateItemTotal() {
        var itemTable = $('#itemTable').DataTable();
        let total = 0;
        itemTable.column(4, { search: 'applied' }).data().each(function (value) {
            let val = value.toString().replace(/[₱,]/g, '');
            total += parseFloat(val) || 0;
        });
        $('#totalitemsamount,#materialtotal').val('₱' + total.toLocaleString(undefined, { minimumFractionDigits: 2 }));
    }

    calculateLaborTotal();
    function calculateLaborTotal() {
        let total = 0;
        var laborTable = $('#laborTable').DataTable();
        laborTable.column(4, { search: 'applied' }).data().each(function (value) {
            let val = value.toString().replace(/[₱,]/g, '');
            total += parseFloat(val) || 0;
        })
        $('#totallaboramount,#labortotal').val('₱' + total.toLocaleString(undefined, { minimumFractionDigits: 2 }));
    }


    const material = document.getElementById('materialtotal');
    const labor = document.getElementById('labortotal');
    const vat = document.getElementById('vat');
    const total = document.getElementById('totalamounts');

    function computeVAT() {
        const v1 = parseFloat((material.value || '0').replace(/[₱,]/g, '')) || 0;
        const v2 = parseFloat((labor.value || '0').replace(/[₱,]/g, '')) || 0;
        const totalVat = (v1 + v2) * 0.15;

        vat.value = '₱' + totalVat.toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function computeTOTAL() {
        const a1 = parseFloat((material.value || '0').replace(/[₱,]/g, '')) || 0;
        const a2 = parseFloat((labor.value || '0').replace(/[₱,]/g, '')) || 0;
        const a3 = parseFloat((vat.value || '0').replace(/[₱,]/g, '')) || 0;
        const sum = a1 + a2 + a3;

        total.value = '₱' + sum.toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // run compute every 200ms to catch updates made by your script
    setInterval(computeVAT, 200);
    setInterval(computeTOTAL, 200);

    // also compute on page load
    computeVAT();
    computeTOTAL();

    function parseDotNetDate(dotNetDate) {
        if (!dotNetDate) return null;
        var timestamp = parseInt(dotNetDate.replace(/\/Date\((\d+)\)\//, '$1'), 10);
        return new Date(timestamp);
    }

    function numToWords(n) {
        const a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
            b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        if (n === 0) return '';
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + ' ' + a[n % 10];
        if (n < 1000) return a[Math.floor(n / 100)] + ' hundred ' + numToWords(n % 100);
        if (n < 1e6) return numToWords(Math.floor(n / 1000)) + ' thousand ' + numToWords(n % 1000);
        if (n < 1e9) return numToWords(Math.floor(n / 1e6)) + ' million ' + numToWords(n % 1e6);
        return '';
    }

    function toWords() {
        const input = document.getElementById('totalamounts');
        const label = document.getElementById('inWords');
        if (!input || !label) return;
        let v = input.value.replace(/[₱,]/g, '').trim();
        if (!v) { label.textContent = ''; return; }
        let [p, c] = (v + '').split('.');
        let words = (numToWords(+p) + ' pesos' + (c && +c > 0 ? ' and ' + numToWords(+c) + ' centavos' : '') + ' only').toUpperCase();
        label.textContent = words.replace(/\s+/g, ' ').trim();
    }

    // run immediately + keep checking automatically
    toWords();
    setInterval(toWords, 500);

    $('#DeliveryModal').on('hidden.bs.modal', function () {
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove(); // remove leftover backdrop
        $('#deliverymodal').modal('show');
    });
    $('#itemModal').on('hidden.bs.modal', function () {
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove(); // remove leftover backdrop
        $('#QuotationModal').modal('show');
    });
    $('#EditItemModal').on('hidden.bs.modal', function () {
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove(); // remove leftover backdrop
        $('#QuotationModal').modal('show');
    });
    $('#UpdatelaborModal').on('hidden.bs.modal', function () {
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove(); // remove leftover backdrop
        $('#QuotationModal').modal('show');
    });
    $('#laborModal').on('hidden.bs.modal', function () {
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove(); // remove leftover backdrop
        $('#QuotationModal').modal('show');
    });

    $('#addItemModal').on('click', function () {

        // Get values from input fields
        var item = $('#item option:selected').text();
        var qty = $('#quantity').val();
        var unit = $('#unit').val();
        var rate = $('#rate').val();
        var amount = $('#totalamount').val();

        // Validation check
        if (!item || !unit || !qty || !rate || !amount) {
            //alert('Please complete all fields before adding.');
            iziToast.warning({
                title: 'Warning',
                message: 'Please complete all fields before adding.',
            });
            return;
        }

        // Add data to DataTable
        $('#itemTable').DataTable().row.add({
            ItemDescription: item,
            Qty: qty,
            Unit: unit,
            Rate: rate,
            Amount: amount,
            Action: '<button class="btn btn-danger btn-sm deleteBtn"><i class="fa fa-trash"></i> Delete</button>'
        }).draw(false);


        calculateItemTotal();

        // Reset modal inputs
        $('#item').val('').trigger('change');
        $('#unit').val('').trigger('change');
        $('#quantity').val(1).prop('disabled', true);
        $('#rate').val('');
        $('#totalamount').val('');

        // Close modal
        $('#exampleModal').modal('hide');
    });

    $('#addLaborModal').on('click', function () {

        // Get values from input fields
        var desc = $('#desc option:selected').text();
        var work = $('#work').val();
        var count = $('#count').val();
        var rate = $('#laborrate').val();
        var amount = $('#totallabor').val();

        // Validation check
        if (!desc || !work || !count || !rate || !amount) {
            //alert('Please complete all fields before adding.');
            iziToast.warning({
                title: 'Warning',
                message: 'Please complete all fields before adding.',
            });
            return;
        }

        $('#laborTable').DataTable().row.add({
            LaborDescription: desc,
            WorkingDay: work,
            Count: count,
            Rate: rate,
            Amount: amount,
            Action: '<button class="btn btn-danger btn-sm deleteLaborBtn"><i class="fa fa-trash"></i> Delete</button>'
        }).draw(false);


        calculateLaborTotal();

        // Reset modal inputs
        $('#desc').val('').trigger('change');
        //$('#work').val('');
        $('#count').val(1).prop('disabled', true);
        $('#laborrate').val('');
        $('#totallabor').val('');

        // Close modal
        $('#exampleModal').modal('hide');
    });

    $('#itemTable tbody').on('click', '.deleteBtn', function () {
        $('#itemTable').DataTable().row($(this).parents('tr')).remove().draw(false);
        calculateItemTotal();
    });

    $('#laborTable tbody').on('click', '.deleteLaborBtn', function () {
        $('#laborTable').DataTable().row($(this).parents('tr')).remove().draw(false);
        calculateLaborTotal();
    });


    $('#addDeliveryModal').on('click', function () {

        // Get values from input fields
        var item = $('#Deliveryitem option:selected').text();
        var qty = $('#Deliveryquantity').val();
        var unit = $('#Deliveryunit').val();

        // Validation check
        if (!item || !unit || !qty) {
            //alert('Please complete all fields before adding.');
            iziToast.warning({
                title: 'Warning',
                message: 'Please complete all fields before adding.',
            });
            return;
        }

        // Add data to DataTable
        $('#DeliveryitemTable').DataTable().row.add({
            ItemDescription: item,
            Qty: qty,
            Unit: unit,
            Action: '<button class="btn btn-danger btn-sm deleteBtn"><i class="fa fa-trash"></i> Delete</button>'
        }).draw(false);


        // Reset modal inputs
        $('#Deliveryitem').val('').trigger('change');
        $('#Deliveryunit').val('').trigger('change');
        $('#Deliveryquantity').val(1).prop('disabled', true);

        // Close modal
        $('#exampleModal').modal('hide');
    });




    $('#btnupdatemodal').on("click", function () {
        var QuotationNumber = $('#quotationnum').val();
        var QuotationDate = $('#quotationdate').val();
        var Validity = $('#changevalidity').val();
        var ValidUntil = $('#validity').val();
        var ReferenceNumber = $('#referenceNumber').val();
        var Requestor = $('#requestor').val();
        var Department = $('#department').val();
        var LocalNumber = $('#localnum').val();
        var QuotationTo = $('#quotationTo').val();
        var Attention = $('#attention').val();
        var Thru = $('#thru').val();
        var Subject = $('#subject').val();
        var MaterialSubTotal = $('#materialtotal').val();
        var LaborSubTotal = $('#labortotal').val();
        var Vat = $('#vat').val();
        var Total = $('#totalamounts').val();
        var TotalInWords = $('#inWords').text();

        let isValid = true;

        // ✅ Check textboxes inside .card
        $('#QuotationModal input[type="text"]').each(function () {
            if ($(this).is(':disabled')) return; // skip disabled

            if ($(this).val().trim() === "") {
                iziToast.warning({
                    title: 'Warning',
                    message: 'Please complete all fields before adding.',
                });
                isValid = false;
                return false; // break out of .each loop
            }
        });

        // ✅ Check table rows (excluding header)
        if (isValid) {
            let rowCount = $('#itemTable').DataTable().rows().count();

            if (rowCount === 0) {
                iziToast.warning({
                    title: 'Warning',
                    message: 'Please add data in item',
                });
                isValid = false;
            }
        }
        if (isValid) {
            let rowCount = $('#laborTable').DataTable().rows().count();
            if (rowCount === 0) {
                iziToast.warning({
                    title: 'Warning',
                    message: 'Please add data in labor',
                });
                isValid = false;
            }
        }

        if (!isValid) {
            return;
        }

        // Collect table data into array of objects
        var items = [];

        $("#itemTable tr").each(function () {
            var row = $(this);

            var item = {
                ItemDescription: row.find("td:eq(0)").text().trim(),
                Qty: parseInt(row.find("td:eq(1)").text().trim()),
                Unit: row.find("td:eq(2)").text().trim(),
                Rate: row.find("td:eq(3)").text().trim(),
                Amount: row.find("td:eq(4)").text().trim()
            };

            // Only push if row has data
            if (item.ItemDescription) {
                items.push(item);
            }
        });

        // Collect table data into array of objects
        var itemslabor = [];

        $("#laborTable tr").each(function () {
            var row = $(this);
            var item = {
                LaborDescription: row.find("td:eq(0)").text().trim(),
                Count: parseInt(row.find("td:eq(1)").text().trim()),
                WorkingDay: row.find("td:eq(2)").text().trim(),
                Rate: row.find("td:eq(3)").text().trim(),
                Amount: row.find("td:eq(4)").text().trim()
            };

            // Only push if row has data
            if (item.LaborDescription) {
                itemslabor.push(item);
            }
        });





        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to Update this Quotation?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Continue',
            cancelButtonText: 'No, Cancel',
            confirmButtonColor: '#2AA63E',
            cancelButtonColor: '#E7180B',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                $.post('/EditQuotation/UpdateQuotation', {
                    QuotationNumber: QuotationNumber, QuotationDate: QuotationDate, Validity: Validity, ValidUntil: ValidUntil, ReferenceNumber: ReferenceNumber,
                    Requestor: Requestor, Department: Department, LocalNo: LocalNumber, QuotationTo: QuotationTo, Attention: Attention, Thru: Thru, Subject: Subject, MaterialsSubTotal: MaterialSubTotal,
                    LaborSubTotal: LaborSubTotal, Vat: Vat, Total: Total, TotalInWords: TotalInWords
                }, function (response) {
                    if (response.success) {
                        $.ajax({
                            url: '/EditQuotation/SaveItems',
                            type: 'POST',
                            contentType: 'application/json; charset=utf-8',
                            data: JSON.stringify({ items: items, QuotationNumber: QuotationNumber }),
                            success: function (response) {
                                if (!response.success) {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: 'Failed to save items.'
                                    });
                                } else {
                                    $.ajax({
                                        url: '/EditQuotation/SaveLabor',
                                        type: 'POST',
                                        contentType: 'application/json; charset=utf-8',
                                        data: JSON.stringify({ items: itemslabor, QuotationNumber: QuotationNumber }),
                                        success: function (response) {
                                            if (!response.success) {
                                                Swal.fire({
                                                    icon: 'error',
                                                    title: 'Error',
                                                    text: 'Failed to save items.'
                                                });
                                            } else {
                                                clearfield();
                                                $('#tblQuotation').DataTable().ajax.reload();
                                                $('#QuotationModal').modal('hide');
                                                $.ajax({
                                                    url: '/EditQuotation/GeneratePdf',
                                                    type: 'GET', // or POST if you prefer
                                                    data: { QuotationNumber: QuotationNumber },
                                                    xhrFields: {
                                                        responseType: 'blob' // important for binary data like PDF
                                                    },
                                                    success: function (data) {
                                                        // Create a blob URL and open/download the PDF
                                                        var blob = new Blob([data], { type: 'application/pdf' });
                                                        var link = document.createElement('a');
                                                        link.href = window.URL.createObjectURL(blob);
                                                        link.download = QuotationNumber + ".pdf";
                                                        link.click();
                                                    },
                                                    error: function (xhr, status, error) {
                                                        alert("Error generating PDF: " + error);
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                        Swal.fire({
                            icon: 'success',
                            title: 'Updated!',
                            text: 'Quotation Updated',
                            showConfirmButton: false,
                            timer: 2000 // closes automatically after 2 seconds
                        });

                    } else {
                        console.log(response.message);
                    }
                });
            }
        });
    });
    $('#btncreatedeliverymodal').on('click', function () {
        if ($('#deliveryAddress').val() == '' || $('#PONo').val() == '' || $('#PRNo').val() == '' || $('#PlateNo').val() == '' || $('#PreparedBy').val() == '') {
            iziToast.warning({
                title: 'Warning',
                message: 'Please complete all fields before adding.',
            });
            return;
        }
        Swal.fire({
            title: 'Are you sure?',
            text: 'You want to Create this Delivery Receipt?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Continue',
            cancelButtonText: 'No, Cancel',
            confirmButtonColor: '#2AA63E',
            cancelButtonColor: '#E7180B',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {

                var items = [];

                $("#DeliveryitemTable tr").each(function () {
                    var row = $(this);

                    var item = {
                        ItemDescription: row.find("td:eq(0)").text().trim(),
                        Qty: parseInt(row.find("td:eq(1)").text().trim()),
                        Unit: row.find("td:eq(2)").text().trim()
                    };

                    // Only push if row has data
                    if (item.ItemDescription) {
                        items.push(item);
                    }
                });

                var InvNo = $('#InvNo').val();
                var deliveredTo = $('#deliverTo').val();
                var Date = $('#deliverydate').val();
                var Address = $('#deliveryAddress').val();
                var PONo = $('#PONo').val();
                var PRNo = $('#PRNo').val();
                var Requestor = $('#DeliveryRequestor').val();
                var PlateNo = $('#PlateNo').val();
                var ReferenceNo = $('#DeliveryReferenceNo').val();
                var PreparedBy = $('#PreparedBy').val();
                $.post('/EditQuotation/InsertDeliveryItems', {
                    InvNo: InvNo, DeliveredTo: deliveredTo, Date: Date, Address: Address,
                    ReferenceNo: ReferenceNo, PONo: PONo, PRNo: PRNo, Requestor: Requestor, PlateNo: PlateNo, PreparedBy:PreparedBy
                }, function (result) {
                    if (result) {
                        $.ajax({
                            url: '/EditQuotation/SaveDeliveryItems',
                            type: 'POST',
                            contentType: 'application/json; charset=utf-8',
                            data: JSON.stringify({ items: items, InvNo: InvNo }),
                            success: function (response) {
                                if (!response.success) {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: 'Failed to save items.'
                                    });
                                } else {
                                    $.ajax({
                                        url: '/EditQuotation/GenerateDeliveryPdf',
                                        type: 'GET', // or POST if you prefer
                                        data: { InvNo: InvNo},
                                        xhrFields: {
                                            responseType: 'blob' // important for binary data like PDF
                                        },
                                        success: function (data) {
                                            // Create a blob URL and open/download the PDF
                                            var blob = new Blob([data], { type: 'application/pdf' });
                                            var link = document.createElement('a');
                                            link.href = window.URL.createObjectURL(blob);
                                            link.download = InvNo + ".pdf";
                                            link.click();
                                        },
                                        error: function (xhr, status, error) {
                                            alert("Error generating PDF: " + error);
                                        }
                                    });
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Delivery Created!',
                                        text: 'Successfully Created',
                                        showConfirmButton: false,
                                        timer: 2000
                                    });
                                     $('#deliveryAddress').val('');
                                     $('#PONo').val('');
                                     $('#PRNo').val('');
                                    $('#deliverymodal').modal('hide');
                                }
                            }
                        });

                        //Swal.fire({
                        //    icon: 'success',
                        //    title: 'Delivery Created!',
                        //    text: 'Successfully Created',
                        //    showConfirmButton: false,
                        //    timer: 2000 
                        //});
                    }
                });
            }
        });
    });


    $('#DeliveryitemTable tbody').on('click', '.deleteBtn', function () {
        $('#DeliveryitemTable').DataTable().row($(this).parents('tr')).remove().draw(false);
    });

    $('#tblQuotation').on('click', '#btndelivery', function () {
        $.get('/EditQuotation/GetNumber', function (data) {
            $('#InvNo').val(data.number[0].InvNo);
        });

        var table = $('#tblQuotation').DataTable();
        var data = table.row($(this).closest('tr')).data();
        var QuotationNumber = data.QuotationNumber;
        var DeliveryTo = data.QuotationTo;
        var Requestor = data.Requestor;
        var RefNo = data.ReferenceNumber;

        // Get current date
        var today = new Date();

        // Format as MM/DD/YYYY
        var formattedDate = ("0" + (today.getMonth() + 1)).slice(-2) + "/" +
            ("0" + today.getDate()).slice(-2) + "/" +
            today.getFullYear();


        $('#deliverTo').val(DeliveryTo);
        $('#deliverydate').val(formattedDate);
        $('#DeliveryRequestor').val(Requestor);
        $('#DeliveryReferenceNo').val(RefNo);

        $('#DeliveryitemTable').DataTable().destroy();
        $('#DeliveryitemTable').DataTable({
            lengthChange: false,
            paging: false,
            searching: false,
            responsive: true,
            scrollX: true,
            scrollY: '400px',
            info: true,

            ajax: {
                url: '/EditQuotation/GetDeliveryItemList', // controller action
                type: 'GET',
                data: { QuotationNumber: QuotationNumber },
                dataSrc: 'result',
            },

            columns: [
                { data: 'ItemDescription', className: 'text-center' },
                { data: 'Qty', className: 'text-center' },
                { data: 'Unit', className: 'text-center' },
                {
                    data: 'Action', render: function (data, type, row) {
                        return `<button class="btn btn-danger btn-sm deleteBtn"><i class="fa fa-trash"></i> Delete</button>`
                    }, className: 'text-center'
                }
            ]
        });
    });

    function clearfield() {
        $('#requestor').val(null).trigger('change');
        $('#changevalidity').val(null).trigger('change');
        $('#referenceNumber').val("");
        $('#quotationTo').val("");
        $('#attention').val("");
        $('#thru').val("");
        $('#subject').val("");
        $('#itemTable').DataTable().clear().draw();
        $('#laborTable').DataTable().clear().draw();
        $('#totalitemsamount').val("");
        $('#totallaboramount').val("");
        $('#materialtotal').val("");
        $('#labortotal').val("");
        $('#vat').val("");
        $('#totalamounts').val("");
        $('#inWords').text('');
    }
});
