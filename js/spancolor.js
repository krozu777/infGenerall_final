
    document.addEventListener("DOMContentLoaded", function() {
      const palabra = document.querySelector('.emociones');
      palabra.innerHTML = palabra.textContent.split('').map(letter => `<span>${letter}</span>`).join('');
    });

    document.addEventListener("DOMContentLoaded", function() {
      const headings = document.querySelectorAll('.letras-cromatico');
      headings.forEach(function(heading) {
        heading.innerHTML = heading.textContent.split('').map(letter => `<span>${letter}</span>`).join('');
      });
    }); 