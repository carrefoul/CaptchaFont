document.addEventListener('DOMContentLoaded', () => {
    const questions = [
        "¿De qué trata la última película que viste?",
        "¿Si pudieras pasar un día en cualquier lugar del mundo, a dónde irías y por qué?",
        "¿Si pudieras aprender un nuevo hobby mañana mismo, cuál elegirías?",
        "¿Qué superpoder elegirías y por qué?",
        "Si tuvieras que ir a una isla desierta, ¿qué tres objetos cogerías contigo?",
        "¿Cuál fue el último sueño que tuviste?"
    ];

    // Mostrar una pregunta aleatoria
    const questionElement = document.getElementById('question');
    if (questionElement) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        questionElement.textContent = questions[randomIndex];
    }

    // Animación aleatoria en "CaptchaFont" para ambos headers
    const fontNameElement = document.getElementById('font-name');

    if (fontNameElement) {
        fontNameElement.addEventListener('mouseenter', () => {
            const interval = setInterval(() => {
                const randomWdth = Math.floor(Math.random() * (200 - 100 + 1)) + 100; // Rango entre 100 y 200
                const randomItal = Math.random() > 0.5 ? 1 : 0; // Alterna entre 0 y 1
                fontNameElement.style.fontVariationSettings = `'wdth' ${randomWdth}, 'ital' ${randomItal}`;
            }, 500);

            fontNameElement.addEventListener('mouseleave', () => {
                clearInterval(interval);
                fontNameElement.style.fontVariationSettings = `'wdth' 150, 'ital' 0`; // Valores por defecto
            });
        });
    }

    // Funcionalidad del área de texto en la página principal
    const typingArea = document.getElementById('typing-area');
    if (typingArea) {
        let keyDownTime = null;
        let lastKeyUpTime = null;
        let deletedCount = 0;
        let wordSpan = null;

        typingArea.addEventListener('keydown', (e) => {
            if (e.key.length === 1 || e.key === 'Backspace' || e.key === ' ') {
                e.preventDefault();
            }

            if (keyDownTime === null) keyDownTime = performance.now();

            if (e.key === 'Backspace') {
                e.preventDefault();

                if (wordSpan && wordSpan.lastChild) {
                    wordSpan.removeChild(wordSpan.lastChild);
                    if (!wordSpan.hasChildNodes()) {
                        typingArea.removeChild(wordSpan);
                        wordSpan = null;
                    }
                } else if (typingArea.lastChild) {
                    typingArea.removeChild(typingArea.lastChild);
                }

                deletedCount++;
            }
        });

        typingArea.addEventListener('keyup', (e) => {
            if (e.key === 'Backspace') return;
            if (e.key.length !== 1 && e.key !== ' ') return;

            const keyUpTime = performance.now();
            const duration = keyUpTime - keyDownTime;
            keyDownTime = null;

            const flightTime = lastKeyUpTime !== null ? keyUpTime - lastKeyUpTime : 0;
            lastKeyUpTime = keyUpTime;

            // Cálculo de 'wdth'
            const minWdth = 100, maxWdth = 200, minTimeDiff = 40, maxTimeDiff = 200;
            let newWdth = minWdth + ((duration - minTimeDiff) / (maxTimeDiff - minTimeDiff)) * (maxWdth - minWdth);
            newWdth = Math.max(minWdth, Math.min(maxWdth, newWdth));

            // Cálculo de kerning
            const minKerning = -10, maxKerning = 10, maxFlightTime = 500;
            let adjustedKerning = minKerning + ((flightTime / maxFlightTime) * (maxKerning - minKerning));
            adjustedKerning = Math.max(minKerning, Math.min(maxKerning, adjustedKerning));

            // Aumentar kerning negativo si italic está activo
            const newItalic = deletedCount > 0 ? 1 : 0;
            if (deletedCount > 0) deletedCount--;

            if (newItalic === 1) {
                adjustedKerning *= 0.5;
                adjustedKerning = Math.min(adjustedKerning, -20);
            }

            // Mostrar información en consola
            console.log({
                character: e.key,
                duration: `${duration.toFixed(2)} ms`, // Duración de la pulsación
                flightTime: `${flightTime.toFixed(2)} ms`, // Tiempo entre teclas
                wdth: newWdth.toFixed(2), // Ancho calculado
                kerning: adjustedKerning.toFixed(2), // Kerning ajustado
                italic: newItalic // Estilo italic
            });

            // Generar caracteres o espacios
            if (e.key === ' ') {
                const spaceSpan = document.createElement('span');
                spaceSpan.innerHTML = '&nbsp;';
                spaceSpan.style.marginRight = '15px'; // Espaciado fijo entre palabras
                typingArea.appendChild(spaceSpan);
                wordSpan = null; // Reiniciar contenedor
            } else {
                if (!wordSpan) {
                    wordSpan = createWordSpan();
                    typingArea.appendChild(wordSpan);
                }

                const charSpan = document.createElement('span');
                charSpan.textContent = e.key;
                charSpan.style.fontVariationSettings = `'wdth' ${newWdth.toFixed(2)}, 'ital' ${newItalic}`;
                charSpan.style.display = 'inline-block';
                charSpan.style.marginRight = `${adjustedKerning}px`;
                wordSpan.appendChild(charSpan);
            }

            // Hacer scroll automático al final
            window.scrollTo(0, document.body.scrollHeight);

            setCursorToEnd(typingArea);
        });

        function createWordSpan() {
            const span = document.createElement('span');
            span.style.whiteSpace = 'nowrap'; // Evitar que la palabra se divida
            span.style.display = 'inline-block';
            return span;
        }

        function setCursorToEnd(element) {
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(element);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    const grid = document.querySelector('.grid');
    if (grid) {
        for (let i = 97; i <= 122; i++) { // Código ASCII de 'a' a 'z'
            const letter = document.createElement('div');
            letter.classList.add('grid-letter');
            letter.textContent = String.fromCharCode(i);

            // Reiniciar el valor de wdth al dejar de hacer hover
            letter.addEventListener('mouseleave', () => {
                letter.style.fontVariationSettings = `'wdth' 150`;
            });

            grid.appendChild(letter);
        }
    }

    // Generar letras para el efecto al borrar
    const deleteGrid = document.querySelector('.delete-demo');
    if (deleteGrid) {
        for (let i = 97; i <= 122; i++) { // Código ASCII de 'a' a 'z'
            const letter = document.createElement('div');
            letter.classList.add('delete-letter');
            letter.textContent = String.fromCharCode(i);

            // Reiniciar el valor de italic al dejar de hacer hover
            letter.addEventListener('mouseleave', () => {
                letter.style.fontVariationSettings = `'wdth' 150, 'ital' 0`;
            });

            deleteGrid.appendChild(letter);
        }
    }
});
