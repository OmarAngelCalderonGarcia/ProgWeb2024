document.addEventListener("DOMContentLoaded", () => {
    const formularioRegistro = document.getElementById("formularioRegistro");
    const formularioLogin = document.getElementById("formularioLogin");
    const formularioResetPassword = document.getElementById("formularioResetPassword");

    const forgotPasswordLink = document.getElementById("forgotPassword");
    const resetPasswordContainer = document.getElementById("resetPasswordContainer");
    const sendCodeButton = document.getElementById("sendCodeButton");
    const verificationSection = document.getElementById("verificationSection");
    const resetPasswordButton = document.getElementById("resetPasswordButton");

    const correoInput = document.getElementById("correo");
    const correoLoginInput = document.getElementById("correoLogin");
    const passwordLoginInput = document.getElementById("passwordLogin");

    const nombreInput = document.getElementById("nombre");
    const apellidoInput = document.getElementById("apellido");
    const fechaInput = document.getElementById("fecha");
    const correoResetInput = document.getElementById("correoReset");
    const verificationCodeInput = document.getElementById("verificationCode");
    const newPasswordInput = document.getElementById("newPassword");

    const togglePasswordRegistro = document.getElementById("togglePasswordRegistro");
    const togglePasswordLogin = document.getElementById("togglePasswordLogin");
    const toggleNewPassword = document.getElementById("toggleNewPassword");

    const submitButton = document.getElementById("submitButton");

    let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    let verificationCode = "";

    function updateCorreoLoginSelect() {
        correoLoginInput.innerHTML = '<option value="">Selecciona un correo</option>';
        registeredUsers.forEach(user => {
            const option = document.createElement("option");
            option.value = user.correo;
            option.textContent = user.correo;
            correoLoginInput.appendChild(option);
        });
    }

    document.getElementById("generarCorreo").addEventListener("click", () => {
        const nombre = nombreInput.value.trim();
        const apellido = apellidoInput.value.trim();
        const fechaNacimiento = fechaInput.value.trim();

        if (nombre && apellido && fechaNacimiento) {
            const email = `${nombre.slice(0, 2)}${apellido.slice(0, 3)}${fechaNacimiento.slice(0, 4)}@gmail.com`.toLowerCase();
            correoInput.value = email;
            submitButton.disabled = false;
        } else {
            alert("Por favor, llena todos los campos.");
        }
    });

    formularioRegistro.addEventListener("submit", (e) => {
        e.preventDefault();
        const correo = correoInput.value;
        const password = document.getElementById("passwordRegistro").value.trim();

        if (validarPassword(password)) {
            registeredUsers.push({ correo, password });
            localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
            alert("Registro exitoso. ¡Ahora puedes iniciar sesión!");
            formularioRegistro.reset();
            submitButton.disabled = true;
            updateCorreoLoginSelect();
        } else {
            alert("La contraseña no cumple con los requisitos.");
        }
    });

    formularioLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        const correo = correoLoginInput.value.trim();
        const password = passwordLoginInput.value.trim();

        const user = registeredUsers.find((user) => user.correo === correo);

        if (user) {
            if (user.password === password) {
                alert("Inicio de sesión exitoso. ¡Bienvenido!");
            } else {
                alert("Contraseña incorrecta.");
            }
        } else {
            alert("Correo no registrado.");
        }
    });

    forgotPasswordLink.addEventListener("click", (e) => {
        e.preventDefault();
        resetPasswordContainer.style.display = "block";
    });

    sendCodeButton.addEventListener("click", () => {
        const correoIngresado = correoResetInput.value.trim();
        const user = registeredUsers.find((user) => user.correo === correoIngresado);

        if (user) {
            verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            alert(`Código enviado al correo: ${verificationCode}`);
            verificationSection.style.display = "block";
        } else {
            alert("El correo no está registrado.");
        }
    });

    formularioResetPassword.addEventListener("submit", (e) => {
        e.preventDefault();

        const codigoIngresado = verificationCodeInput.value.trim();
        const nuevaPassword = newPasswordInput.value.trim();

        if (codigoIngresado === verificationCode) {
            if (validarPassword(nuevaPassword)) {
                const user = registeredUsers.find((user) => user.correo === correoResetInput.value.trim());
                if (user) {
                    user.password = nuevaPassword;
                    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
                    alert("Contraseña restablecida exitosamente.");
                    resetPasswordContainer.style.display = "none";
                    formularioResetPassword.reset();
                }
            } else {
                alert("La nueva contraseña no cumple con los requisitos.");
            }
        } else {
            alert("Código de verificación incorrecto.");
        }
    });

    togglePasswordRegistro.addEventListener("click", () => togglePasswordVisibility("passwordRegistro", togglePasswordRegistro));
    togglePasswordLogin.addEventListener("click", () => togglePasswordVisibility("passwordLogin", togglePasswordLogin));
    toggleNewPassword.addEventListener("click", () => togglePasswordVisibility("newPassword", toggleNewPassword));

    function togglePasswordVisibility(inputId, toggleButton) {
        const input = document.getElementById(inputId);
        const type = input.type === "password" ? "text" : "password";
        input.type = type;
        toggleButton.textContent = type === "password" ? "Mostrar" : "Ocultar";
    }

    function validarPassword(password) {
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!$%^&*()_+={}\[\]:;"'<>,.?\/\\|`~#@.-])[A-Za-z\d!$%^&*()_+={}\[\]:;"'<>,.?\/\\|`~#@.-]{8,}$/;
        return regex.test(password);
    }   

    updateCorreoLoginSelect();
});
