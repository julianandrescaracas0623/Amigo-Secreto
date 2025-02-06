let amigos = [];

function agregarAmigo() {
    const input = document.getElementById('amigo');
    const nombre = input.value.trim();
    if (nombre) {
        amigos.push(nombre);
        actualizarListaAmigos();
        input.value = '';  // Limpia el campo de texto después de agregar el nombre
    }
}

function actualizarListaAmigos() {
    const lista = document.getElementById('listaAmigos');
    lista.innerHTML = '';  // Limpia la lista actual
    amigos.forEach((amigo) => {
        const li = document.createElement('li');
        li.textContent = amigo;
        lista.appendChild(li);
    });
}

function sortearAmigo() {
    if (amigos.length < 2) {
        alert('Debe haber al menos dos amigos para sortear.');
        return;
    }
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = '';  // Limpia los resultados anteriores
    const shuffled = amigos.sort(() => 0.5 - Math.random());  // Mezcla aleatoriamente la lista de amigos

    shuffled.forEach((amigo, index) => {
        const siguiente = shuffled[(index + 1) % shuffled.length];  // Asegura que el último amigo se empareje con el primero
        const li = document.createElement('li');
        li.textContent = `${amigo} es el amigo secreto de ${siguiente}`;
        resultado.appendChild(li);
    });
}

function limpiarTodo() {
    amigos = [];  // Limpia el array de amigos
    actualizarListaAmigos();  // Actualiza la lista en el DOM (ahora vacía)
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = '';  // Limpia los resultados del sorteo
    const input = document.getElementById('amigo');
    input.value = '';  // Limpia el campo de entrada
}
