        // --- 1. DICCIONARIO DE TRADUCCIÓN (Actualizado con Iconos en HTML) ---
        const translations = {
            es: {
                title: "Parque Paleontológico<br>Los Dedos",
                subtitle: "Tu opinión nos importa",
                btn_fast: '<i class="fas fa-rocket"></i> Encuesta Rápida',
                btn_full: '<i class="fas fa-bone"></i> Experiencia Completa',
                btn_back: '<i class="fas fa-arrow-left"></i> Volver al inicio',
                label_sector: "1. Sector a opinar:",
                opt_select: "Selecciona...",
                opt_zone1: "Zona 1: Acceso / Mandíbula",
                opt_zone2: "Zona 2: Fósiles Marinos",
                opt_zone3: "Zona 3: Formaciones Rocosas",
                opt_zone4: "Zona 4: Mirador Panorámico",
                opt_zone5: "Zona 5: Sendero General",
                label_origin: "2. Origen:",
                label_age: "3. Rango Etario:",
                opt_under18: "Menor de 18",
                opt_over65: "Mayor de 65",
                label_motive: "4. Motivo Visita:",
                opt_tourism: "Entretención / Turismo",
                opt_education: "Escolar / Universidad",
                opt_science: "Interés Científico",
                opt_passing: "De paso",
                label_rating_title: "5. Evalúa del 1 (Malo) al 5 (Excelente):",
                rate_path: "El sendero y las formaciones:",
                rate_signs: "Señalética e info educativa:",
                rate_clean: "Limpieza y conservación:",
                rate_staff: "Atención del personal:",
                label_liked: "6. ¿Qué fue lo que más te gustó?",
                ph_liked: "Ej: La vista, los fósiles...",
                label_problems: "7. ¿Algún problema o aspecto a mejorar?",
                ph_problems: "Ej: Falta sombra, baños...",
                label_nps: "¿Recomendarías el parque a un familiar u amigo? (0-10)",
                nps_no: '<i class="far fa-face-frown"></i> No',
                nps_maybe: '<i class="far fa-face-meh"></i> Quizás',
                nps_yes: '<i class="far fa-face-smile"></i> ¡Sí!',
                label_general_comment: "¿Por qué elegiste esa opción? Comentario:",
                ph_general: "Escribe aquí...",
                btn_submit: "Enviar Encuesta",
                
                acc_title: "Herramientas de Accesibilidad",
                acc_text: "Texto Grande",
                acc_contrast: "Alto Contraste",
                acc_gray: "Escala Grises",
                acc_font: "Fuente Legible",
                acc_reset: "Restablecer Todo"
            },
            en: {
                title: "Paleontological Park<br>Los Dedos",
                subtitle: "Your opinion matters",
                btn_fast: '<i class="fas fa-rocket"></i> Quick Survey',
                btn_full: '<i class="fas fa-bone"></i> Full Experience',
                btn_back: '<i class="fas fa-arrow-left"></i> Back to Start',
                label_sector: "1. Sector to rate:",
                opt_select: "Select...",
                opt_zone1: "Zone 1: Access / Jaw",
                opt_zone2: "Zone 2: Marine Fossils",
                opt_zone3: "Zone 3: Rock Formations",
                opt_zone4: "Zone 4: Panoramic Viewpoint",
                opt_zone5: "Zone 5: General Trail",
                label_origin: "2. Origin:",
                label_age: "3. Age Range:",
                opt_under18: "Under 18",
                opt_over65: "Over 65",
                label_motive: "4. Visit Reason:",
                opt_tourism: "Leisure / Tourism",
                opt_education: "School / University",
                opt_science: "Scientific Interest",
                opt_passing: "Just passing through",
                label_rating_title: "5. Rate from 1 (Poor) to 5 (Excellent):",
                rate_path: "Trails and formations:",
                rate_signs: "Signage & educational info:",
                rate_clean: "Cleanliness & conservation:",
                rate_staff: "Staff service:",
                label_liked: "6. What did you like the most?",
                ph_liked: "Ex: The view, the fossils...",
                label_problems: "7. Any problems or improvements?",
                ph_problems: "Ex: Lack of shade, restrooms...",
                label_nps: "Would you recommend the park to a friend? (0-10)",
                nps_no: '<i class="far fa-face-frown"></i> No',
                nps_maybe: '<i class="far fa-face-meh"></i> Maybe',
                nps_yes: '<i class="far fa-face-smile"></i> Yes!',
                label_general_comment: "Why did you choose that rating? Comment:",
                ph_general: "Write here...",
                btn_submit: "Submit Survey",

                acc_title: "Accessibility Tools",
                acc_text: "Large Text",
                acc_contrast: "High Contrast",
                acc_gray: "Grayscale",
                acc_font: "Readable Font",
                acc_reset: "Reset All"
            }
        };

        // --- 2. FUNCIÓN DE IDIOMA ---
        function setLanguage(lang) {
            window.lang = lang; 
            const elements = document.querySelectorAll('[data-translate]');
            elements.forEach(el => {
                const key = el.getAttribute('data-translate');
                if (translations[lang][key]) el.innerHTML = translations[lang][key];
            });
            const placeholders = document.querySelectorAll('[data-placeholder]');
            placeholders.forEach(el => {
                const key = el.getAttribute('data-placeholder');
                if (translations[lang][key]) el.setAttribute('placeholder', translations[lang][key]);
            });
            document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector(`.lang-btn[onclick="setLanguage('${lang}')"]`).classList.add('active');
        }

        // --- 3. LÓGICA DEL FORMULARIO ---
        const selectionScreen = document.getElementById('selection-screen');
        const formContainer = document.getElementById('form-container');
        const extendedFields = document.getElementById('extended-fields');
        const formTypeInput = document.getElementById('form-type');

        function selectForm(type) {
            selectionScreen.style.display = 'none';
            formContainer.style.display = 'block';

            if (type === 'fast') {
                extendedFields.classList.add('hidden');
                formTypeInput.value = 'rapido';
                setRequiredExtenso(false); 
            } else {
                extendedFields.classList.remove('hidden');
                formTypeInput.value = 'extenso';
                setRequiredExtenso(true);
            }
            document.querySelector('.container').scrollTop = 0;
        }

        function goBack() {
            formContainer.style.display = 'none';
            selectionScreen.style.display = 'block';
        }

        function setRequiredExtenso(isRequired) {
            const extendedInputs = extendedFields.querySelectorAll('input[type="radio"], textarea');
            extendedInputs.forEach(input => {
                if(input.name.startsWith('rate_')) { 
                    input.required = isRequired;
                }
            });
        }

        // --- 4. ACCESIBILIDAD ---
        function toggleAccModal() {
            const modal = document.getElementById('acc-modal-overlay');
            modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
        }

        document.getElementById('acc-modal-overlay').addEventListener('click', function(e) {
            if (e.target === this) this.style.display = 'none';
        });

        function toggleBodyClass(className, btnElement) {
            document.body.classList.toggle(className);
            if (btnElement) btnElement.classList.toggle('active');
        }

        function resetAccessibility() {
            document.body.classList.remove('acc-mode-text-lg', 'acc-mode-contrast', 'acc-mode-grayscale', 'acc-mode-readable');
            const btns = document.querySelectorAll('.acc-btn');
            btns.forEach(btn => btn.classList.remove('active'));
        }

        // --- 5. ENVÍO DATOS --
        
        function getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]').content;
}

    async function enviarFormulario() {

    const data = {
        sector: document.querySelector("select[name=sector]").value,
        nacionalidad: document.querySelector("select[name=nacionalidad]").value,
        edad: document.querySelector("select[name=edad]").value,
        motivo: document.querySelector("select[name=motivo]").value,

        rate_sendero: Number(document.querySelector("input[name=rate_sendero]:checked")?.value || 0),
        rate_info: Number(document.querySelector("input[name=rate_info]:checked")?.value || 0),
        rate_limpieza: Number(document.querySelector("input[name=rate_limpieza]:checked")?.value || 0),
        rate_personal: Number(document.querySelector("input[name=rate_personal]:checked")?.value || 0),

        comentario_positivo: document.querySelector("textarea[name=comentario_positivo]").value,
        comentario_negativo: document.querySelector("textarea[name=comentario_negativo]").value,
        comentario_general: document.querySelector("textarea[name=comentario_general]").value,

        nps: Number(document.querySelector("input[name=nps]:checked")?.value || 0),

        consent: true,
        language: window.lang || "es",
        type: document.getElementById("form-type").value  // rápido o extenso
    };

    const response = await fetch("/api/submit/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify(data)
    });

    return await response.json();
}



async function submitForm(event) {
    event.preventDefault();
    
    await enviarFormulario();  // ← ESTE ERA EL PASO QUE FALTABA
    
    alert("¡Gracias! Tu opinión es vital para el Parque Los Dedos.");
    event.target.reset();
    goBack();
}