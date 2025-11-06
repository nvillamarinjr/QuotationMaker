$(document).ready(function () {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
        window.history.pushState(null, "", window.location.href);
    };

    $('#itemTable').DataTable({
        lengthChange: false,
        paging: true,
        searching: false,
        info: true,
        columnDefs: [
            { targets: '_all', className: 'text-start align-center' } // forces left alignment for all
        ]
    });

    $('#laborTable').DataTable({
        lengthChange: false,
        paging: true,
        searching: false,
        info: true,
        columnDefs: [
            { targets: '_all', className: 'text-start align-center' } // forces left alignment for all
        ]
    });

    $('#requestor').select2({
        placeholder: "Select a requestor...",
        allowClear: true,
        theme: 'bootstrap4',
        width: 'resolve'
    });

    $('#changevalidity').select2({
        placeholder: "Select validity...",
        allowClear: true,
        theme: 'bootstrap4',
        width: 'resolve'
    });

    //$('#quotationTo').select2({
    //    placeholder: "Select one...",
    //    allowClear: true,
    //    theme: 'bootstrap4',
    //    width: 'resolve'
    //});

    //$('#attention').select2({
    //    placeholder: "Select one...",
    //    allowClear: true,
    //    theme: 'bootstrap4',
    //    width: 'resolve'
    //});

    $('#itemModal, #laborModal').on('shown.bs.modal', function () {
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
    });

    // Initialize today's date
    const today = new Date();
    document.getElementById('quotationdate').value = formatDate(today);

    // Function to format date as "Month Day, Year"
    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Function to calculate future date
    function updateFutureDate() {
        const monthsToAdd = parseInt(document.getElementById('changevalidity').value);
        const baseDate = new Date(); 

        if (!isNaN(monthsToAdd)) {
            baseDate.setMonth(baseDate.getMonth() + monthsToAdd);
            document.getElementById('validity').value = formatDate(baseDate);
        } else {
            document.getElementById('validity').value = "";
        }
    }

    $('#changevalidity').on('change', function () {
        updateFutureDate();
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


    $.get('/Quotation/GetItems', function (data) {
        const item = $('#item');
        item.empty().append('<option value="" disabled selected>Select an item...</option>');

        if (data.error) {
            alert(data.error);
            return;
        }

        data.forEach(i => {
            item.append(`<option value="${i.itemname}" data-rate="${i.rate}">${i.itemname}</option>`);
        });
    }).fail(function () {
        alert("Failed to load items.");
    });

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

    $('#count').on('input change', updateLaborAmount); // update when qty changes

    function updateLaborAmount() {
        // Remove ₱ and commas before parsing
        var rateText = $('#laborrate').val().replace(/[₱,]/g, '') || 0;
        var rate = parseFloat(rateText);
        var qty = parseInt($('#count').val()) || 0;

        var total = rate * qty;

        // Format with ₱, commas, and 2 decimals
        var formattedTotal = '₱' + total.toLocaleString('en-PH', { minimumFractionDigits: 2 });
        $('#totallabor').val(formattedTotal);
    }

    function getBaseKey() {
        let d = new Date();
        let month = (d.getMonth() + 1).toString().padStart(2, '0');
        let year = d.getFullYear().toString().slice(-2);
        return "QN-" + month + year;
    }

    function showKey() {
        let base = getBaseKey();
        let count = localStorage.getItem(base) || 0;
        document.getElementById("quotationnum").value = base + "-" + (parseInt(count) + 1);
    }
    showKey();

    //function newTransaction() {
    //    let base = getBaseKey();
    //    let count = localStorage.getItem(base) || 0;
    //    count++;
    //    localStorage.setItem(base, count);
    //    document.getElementById("quotationnum").value = base + "-" + count;
    //    alert("Transaction saved! Key: " + base + "-" + count);
    //}

    // Show current key on load (no increment)

    //$("#requestor").on('change', function () {
    //    var name = $(this).val();

    //    if (name === "") {
    //        $("#department").val("");
    //        $("#localno").val("");
    //        return;
    //    }

    //    $.ajax({
    //        url: "/Quotation/GetRequestors",
    //        type: "GET",
    //        data: { name: requestor },
    //        success: function (data) {
    //            $("#department").val(data.dept);
    //            $("#localnum").val(data.localnum);
    //        },
    //        error: function () {
    //            alert("Error retrieving details");
    //        }
    //    });
    //});
    var table = $('#itemTable').DataTable();
    var labortable = $('#laborTable').DataTable();


    // When the "Add" button inside the modal is clicked
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
        table.row.add([
            item,
            qty,
            unit,
            rate,
            amount,
            '<button class="btn btn-danger btn-sm deleteBtn"><i class="fa fa-trash"></i> Delete</button>'
        ]).draw(false);

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

        // Add data to DataTable
        labortable.row.add([
            desc,
            count,
            work,
            rate,
            amount,
            '<button class="btn btn-danger btn-sm deleteLaborBtn"><i class="fa fa-trash"></i> Delete</button>'
        ]).draw(false);

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
        table.row($(this).parents('tr')).remove().draw();
        calculateItemTotal();
    });

    $('#laborTable tbody').on('click', '.deleteLaborBtn', function () {
        labortable.row($(this).parents('tr')).remove().draw();
        calculateLaborTotal();
    });

    calculateItemTotal();
    function calculateItemTotal() {
        let total = 0;
        table.column(4, { search: 'applied' }).data().each(function (value) {
            let val = value.toString().replace(/[₱,]/g, '');
            total += parseFloat(val) || 0;
        });
        $('#totalitemsamount,#materialtotal').val('₱' + total.toLocaleString(undefined, { minimumFractionDigits: 2 }));
    }

    calculateLaborTotal();
    function calculateLaborTotal() {
        let total = 0;
        labortable.column(4, { search: 'applied' }).data().each(function (value) {
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
        const totalVat = (v1 + v2) * 0.12;

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
});
