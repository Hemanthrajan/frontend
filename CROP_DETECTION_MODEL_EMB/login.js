function validateLogin(event) {
    // Prevent form submission
    event.preventDefault();

    // Get the input values
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const recaptcha = document.getElementById("recaptcha").checked;

    // Validate username, password, and captcha
    if (username === "admin" && password === "Tnega@123" && recaptcha) {
        // Redirect on success
        window.location.href = "muz_1.html";
    } else {
        // Show error message
        const errorMessage = document.getElementById("error-message");
        errorMessage.style.display = "block";
    }
}
