$(document).ready(function () {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
        window.history.pushState(null, "", window.location.href);
    };

    $('#studentTable').DataTable({
        lengthChange: false,
        paging: true,
        searching: false,
        info: true
    });

    $('#laborTable').DataTable({
        lengthChange: false,
        paging: true,
        searching: false,
        info: true
    });

    $('#item').select2({
        placeholder: "Select an item...",
        allowClear: true,
        theme: 'bootstrap4'
    });

    $('#desc').select2({
        placeholder: "Select a description...",
        allowClear: true,
        theme: 'bootstrap4'
    });

    $('#requestor').select2({
        placeholder: "Select a requestor...",
        allowClear: true,
        theme: 'bootstrap4'
    });

    $('#unit').select2({
        placeholder: "Select a unit...",
        allowClear: true,
        theme: 'bootstrap4'
    });


    const today = new Date();
    const future = new Date(today);
    future.setMonth(future.getMonth() + 6);
    // Format: Month (word) Day, Year
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    const formattedFutureDate = future.toLocaleDateString('en-US', options);

    // Insert into input field
    document.getElementById("quotationdate").value = formattedDate;
    document.getElementById("validity").value = formattedFutureDate;

    $.ajax({
        url: '/Quotation/GetRequestors',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#requestor').empty();
            // Add placeholder as first option
            $('#requestor').append($('<option>', {
                value: '',
                text: '-- Select a requestor... --',
                disabled: true,
                selected: true
            }));
            if (data.error) {
                alert(data.error); // Fixed this line
            } else {
                $.each(data, function (i, item) {
                    $('#requestor').append($('<option>', {
                        value: item.requestor,
                        text: item.requestor
                    }));
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX error:", error);
            alert("Failed to load requestors. Check console for details.");
        }
    });

    $.ajax({
        url: '/Quotation/GetItems',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#item').empty();
            // Add placeholder as first option
            $('#item').append($('<option>', {
                value: '',
                text: '-- Select an item... --',
                disabled: true,
                selected: true
            }));
            if (data.error) {
                alert(data.error); // Fixed this line
            } else {
                $.each(data, function (i, item) {
                    $('#item').append($('<option>', {
                        value: item.itemname,
                        text: item.itemname,
                        'data-rate': item.rate
                    }));
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX error:", error);
            alert("Failed to load requestors. Check console for details.");
        }
    });

    $('#item').on('change', function () {
        var rate = $('#item option:selected').data('rate');
        if (rate) {
            // Ensure rate is always shown as ₱ and 2 decimal places
            var formatted = '₱' + parseFloat(rate).toFixed(2);
            $('#rate').val(formatted);
        } else {
            $('#rate').val('');
        }
    });

});
