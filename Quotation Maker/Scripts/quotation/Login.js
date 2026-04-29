const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

toastr.options = {
    "closeButton": true,
    "progressBar": false,
    "positionClass": "toast-bottom-right", // try toast-bottom-right, toast-top-center, etc.
    "preventDuplicates": true,
    "onclick": null,
    "timeOut": 0,
    "extendedTimeOut": 0
    /*            "timeOut": "3000", // duration the toast stays*/
};

function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (!username || !password) {
        toastr.warning("Please enter both Username and Password", "Warning");
        return; // stop further execution
    }

    fetch('/Login/UserLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                //localStorage.setItem("isLoggedIn", "true");
                //localStorage.setItem("fullName", data.fullName);
                //localStorage.setItem("IsAdmin", data.isAdmin);
                Toast.fire({
                    icon: "success",
                    title: "Signed in successfully"
                }).then(() => {
                    // Redirect after the toast closes
                    setTimeout(() => {
                        window.location.href = "/Home/Dashboard";
                    }, 1000); // small delay for smooth transition
                });

            } else {
                toastr.error(data.error, "Error");
            }
        })
        .catch(error => {
            alert('Error: ' + error);
        });
}

        //if (!localStorage.getItem("isLoggedIn")) {
        //    window.history.pushState(null, "", window.location.href);
        //    window.onpopstate = function () {
        //        window.history.pushState(null, "", window.location.href);
        //    };
        //}