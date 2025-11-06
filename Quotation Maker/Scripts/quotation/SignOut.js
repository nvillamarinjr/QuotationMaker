function logout() {
    localStorage.removeItem("isLoggedIn");
    sessionStorage.clear();

    iziToast.show({
        theme: 'dark',
        icon: 'fa fa-sign-out',
        message: 'Signing-out!',
        position: 'topCenter',       
        progressBarColor: 'rgb(0, 255, 184)',
        close: false,        
        timeout: 2000,             
        pauseOnHover: false,         
        drag: false,                
        overlay: true,              
        overlayClose: false,      
        displayMode: 'once',         
    });

    setTimeout(() => {
        window.location.href = "/Home/Login";  
    }, 2000);
}
