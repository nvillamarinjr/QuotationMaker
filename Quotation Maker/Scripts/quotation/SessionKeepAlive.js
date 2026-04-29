$(function () {
    var activityDetected = false;

    // Detect user activity
    $(document).on("click keypress mousemove", function () {
        activityDetected = true;
    });

    // Ping server every 5 minutes if activity happened
    setInterval(function () {
        if (activityDetected) {
            $.post("/Login/KeepAlive");
            activityDetected = false; // reset until next activity
        }
    }, 5 * 60 * 1000); // 5 minutes
});