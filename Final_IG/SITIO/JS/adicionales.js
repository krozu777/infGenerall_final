

// TEORIA DEL COLOR


    function getRandomColor() {
        const randomValue = () => Math.floor(Math.random() * 256); // generates a number between 0 and 255
        return `rgb(${randomValue()}, ${randomValue()}, ${randomValue()})`; // generate RGB color
    }

    function assignColors() {
        // Clásico
        document.getElementById('red').style.backgroundColor = getRandomColor();
        document.getElementById('blue').style.backgroundColor = getRandomColor();
        document.getElementById('yellow').style.backgroundColor = getRandomColor();
        document.getElementById('green').style.backgroundColor = getRandomColor();
        document.getElementById('orange').style.backgroundColor = getRandomColor();
        document.getElementById('violet').style.backgroundColor = getRandomColor();
        
        // RGB
        document.getElementById('red-rgb').style.backgroundColor = getRandomColor();
        document.getElementById('green').style.backgroundColor = getRandomColor();
        document.getElementById('blue-rgb').style.backgroundColor = getRandomColor();
        document.getElementById('cyan').style.backgroundColor = getRandomColor();
        document.getElementById('magenta').style.backgroundColor = getRandomColor();
        document.getElementById('yellow-rgb').style.backgroundColor = getRandomColor();
    }

    // Call the function on page load
    assignColors();
