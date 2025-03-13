$(document).ready(function () {
    var form = $("#contactForm");
    // Validación de formulario utilizando jQuery
    form.validate({
        rules: {
            nombre: {
                required: true,
                maxlength: 40,
                letras: true
            },
            email: {
                required: true,
                email: true,
                emailCorrecto: true,
            },
            mensaje: {
                required: true,
                maxlength: 250,
            }
        },

        // Mensajes de error
        messages: {
            nombre: {
                required: "Por favor, ingrese su nombre.",
                maxlength: "El nombre debe tener menos de 40 caracteres.",
                letras: "Ingrese solo letras en el nombre."
            },
            email: {
                required: "Por favor, ingrese su correo electrónico.",
                email: "Ingrese un correo electrónico válido.",
                emailCorrecto: "Ingrese una dirección de correo electrónico válida de Hotmail, Gmail o Yahoo.",
            },
            mensaje: {
                required: "Por favor, ingrese un mensaje.",
                maxlength: "El mensaje debe tener menos de 250 caracteres.",
            }
        },

        // Clase de CSS que aplica a los elementos de error de validación
        errorClass: "is-invalid",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            error.insertAfter(element);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass("is-valid").removeClass("is-invalid");
        }
    });

    // Método para validar que el valor tenga letras y espacios
    $.validator.addMethod("letras", function (value, element) {
        return this.optional(element) || /^[A-Za-z\s]+$/.test(value);
    }, "Ingrese solo letras en el nombre.");

    // Método para validar que los correos sean correctos
    $.validator.addMethod("emailCorrecto", function (value, element) {
        return this.optional(element) || /^[^\s@]+@(hotmail|gmail|yahoo)\.[a-z]{2,}$/i.test(value);
    }, "Ingrese una dirección de correo electrónico válida.");

    // Resetear formulario
    form.on("reset", function () {
        $("#nombre, #email, #mensaje").val(function (index, value) {
            return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        });

        $(".is-invalid").removeClass("is-invalid");
        $(".is-valid").removeClass("is-valid");
        $(".invalid-feedback").remove();
    });

    // Enviar formulario cuando sea válido
    $('#submitButton').on('click', function (event) {
        if (form.valid()) {
            // Envía el formulario manualmente utilizando JavaScript
            form[0].submit();
        }
    });
});
