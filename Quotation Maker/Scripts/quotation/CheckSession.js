$(document).ready(function () {


    let sessionTimeout = parseInt($('body').data('session-timeout'));
    let maxIdleMinutes = sessionTimeout - 0.1;


    let idletime = 0;

    function resetIdleTime() {
        idletime = 0
    }

    let idleInterval = setInterval(function () {
        idletime++;
        if (idletime >= maxIdleMinutes) {
            Swal.fire({
                icon: 'info',
                title: 'Session Expired',
                text: 'Your Session Has Expired. Please Login Again',
                confirmButtonText: 'OK'
            }).then(function () {
                window.location.href = '/Home/Login';
            });
        }
    }, 60000);

    $(document).on('mousemove keydown click scroll', resetIdleTime);

});