function logout() {
    // 🔹 Clear login data (localStorage/sessionStorage)
    localStorage.removeItem("isLoggedIn");
    sessionStorage.clear();

    // 🔹 Redirect to login page
    window.location.href = "/Home/Login";
}
