// Cargar amigos desde localStorage si existen
let amigos = JSON.parse(localStorage.getItem('amigoSecreto_amigos')) || [];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Cargar tema al inicio
    const darkMode = localStorage.getItem('amigoSecreto_darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').checked = true;
    }
    
    // Cargar lista de amigos
    actualizarListaAmigos();
    
    // Configurar evento de Enter en el input
    document.getElementById('amigo').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            agregarAmigo();
        }
    });
});

function agregarAmigo() {
    const input = document.getElementById('amigo');
    const nombre = input.value.trim();
    const error = document.getElementById('errorMensaje');
    
    // Validaciones
    if (!nombre) {
        mostrarError('Por favor ingresa un nombre.');
        return;
    }
    
    if (nombre.length < 2) {
        mostrarError('El nombre debe tener al menos 2 caracteres.');
        return;
    }
    
    if (nombre.length > 30) {
        mostrarError('El nombre no debe exceder los 30 caracteres.');
        return;
    }
    
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(nombre)) {
        mostrarError('El nombre solo debe contener letras y espacios.');
        return;
    }
    
    if (amigos.includes(nombre)) {
        mostrarError('Ese nombre ya está en la lista.');
        return;
    }
    
    // Si pasa todas las validaciones
    amigos.push(nombre);
    guardarAmigos();
    actualizarListaAmigos();
    input.value = '';
    error.textContent = '';
}

function mostrarError(mensaje) {
    const error = document.getElementById('errorMensaje');
    error.textContent = mensaje;
    error.style.opacity = '1';
    
    // Animación del mensaje de error
    setTimeout(() => {
        error.style.opacity = '0.7';
    }, 2000);
}

function guardarAmigos() {
    localStorage.setItem('amigoSecreto_amigos', JSON.stringify(amigos));
}

function actualizarListaAmigos() {
    const lista = document.getElementById('listaAmigos');
    lista.innerHTML = '';  // Limpia la lista actual
    
    amigos.forEach((amigo, index) => {
        const li = document.createElement('li');
        li.textContent = amigo;
        li.className = 'friend-item';
        
        // Botón para eliminar amigo
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '×';
        deleteBtn.className = 'delete-btn';
        deleteBtn.title = 'Eliminar';
        deleteBtn.onclick = function(e) {
            e.stopPropagation();
            eliminarAmigo(index);
        };
        
        li.appendChild(deleteBtn);
        lista.appendChild(li);
        
        // Animación de entrada
        setTimeout(() => {
            li.style.opacity = '1';
            li.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function eliminarAmigo(index) {
    amigos.splice(index, 1);
    guardarAmigos();
    actualizarListaAmigos();
}

function sortearAmigo() {
    if (amigos.length < 2) {
        mostrarError('Debe haber al menos dos amigos para sortear.');
        return;
    }
    
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = '';  // Limpia los resultados anteriores
    
    // Mostrar animación de sorteo
    resultado.innerHTML = '<div class="sorteo-animation"><div class="loader"></div><p>Sorteando...</p></div>';
    
    setTimeout(() => {
        // Algoritmo mejorado para evitar que una persona se toque a sí misma
        let shuffled = [...amigos];
        let asignaciones = [];
        
        for (let i = 0; i < amigos.length; i++) {
            let options = shuffled.filter(name => name !== amigos[i]);
            if (options.length === 0) {
                // Si no hay opciones, reiniciar el sorteo
                return sortearAmigo();
            }
            
            // Seleccionar un amigo aleatorio
            const randomIndex = Math.floor(Math.random() * options.length);
            const amigoSecreto = options[randomIndex];
            
            // Guardar la asignación
            asignaciones.push({
                persona: amigos[i],
                amigoSecreto: amigoSecreto
            });
            
            // Remover el amigo secreto de las opciones futuras
            shuffled = shuffled.filter(name => name !== amigoSecreto);
        }
        
        // Guardar en localStorage
        localStorage.setItem('amigoSecreto_resultados', JSON.stringify(asignaciones));
        
        // Mostrar resultados
        resultado.innerHTML = '';
        asignaciones.forEach((par, index) => {
            const li = document.createElement('li');
            li.textContent = `${par.persona} es el amigo secreto de ${par.amigoSecreto}`;
            li.className = 'resultado-item';
            resultado.appendChild(li);
            
            // Animación de resultados
            setTimeout(() => {
                li.style.opacity = '1';
                li.style.transform = 'translateY(0)';
            }, index * 300);
        });
    }, 2000); // Tiempo de animación
}

function limpiarTodo() {
    if (amigos.length > 0) {
        if (!confirm('¿Estás seguro de que deseas borrar toda la lista?')) {
            return;
        }
    }
    
    amigos = [];
    localStorage.removeItem('amigoSecreto_amigos');
    localStorage.removeItem('amigoSecreto_resultados');
    
    const resultado = document.getElementById('resultado');
    resultado.innerHTML = '';
    
    const input = document.getElementById('amigo');
    input.value = '';
    
    // Mostrar mensaje de confirmación
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'confirmation-message';
    mensajeDiv.textContent = 'Lista borrada exitosamente';
    document.body.appendChild(mensajeDiv);
    
    setTimeout(() => {
        mensajeDiv.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        mensajeDiv.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(mensajeDiv);
        }, 500);
    }, 2000);
    
    actualizarListaAmigos();
}

// Función para cambiar entre modo claro y oscuro
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('amigoSecreto_darkMode', isDarkMode);
}

// Función para compartir resultados
function compartirResultados() {
    // Verificar si hay resultados para compartir
    const resultados = localStorage.getItem('amigoSecreto_resultados');
    if (!resultados || JSON.parse(resultados).length === 0) {
        mostrarError('No hay resultados para compartir. Realiza un sorteo primero.');
        return;
    }
    
    // Preparar texto para compartir
    const asignaciones = JSON.parse(resultados);
    let mensaje = "🎁 Resultados del Amigo Secreto 🎁\n\n";
    
    asignaciones.forEach(par => {
        mensaje += `${par.persona} es el amigo secreto de ${par.amigoSecreto}\n`;
    });
    
    mensaje += "\n¡Organizado con la App Amigo Secreto!";
    
    // Verificar si la API de Web Share está disponible
    if (navigator.share) {
        navigator.share({
            title: 'Amigo Secreto - Resultados',
            text: mensaje
        }).catch(error => {
            console.error('Error al compartir:', error);
            fallbackShare(mensaje);
        });
    } else {
        fallbackShare(mensaje);
    }
}

// Método alternativo para compartir (copiar al portapapeles)
function fallbackShare(texto) {
    // Crear un elemento temporal
    const el = document.createElement('textarea');
    el.value = texto;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    
    // Seleccionar y copiar el texto
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    
    // Mostrar confirmación
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'confirmation-message';
    mensajeDiv.textContent = 'Resultados copiados al portapapeles';
    document.body.appendChild(mensajeDiv);
    
    setTimeout(() => {
        mensajeDiv.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        mensajeDiv.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(mensajeDiv);
        }, 500);
    }, 3000);
}

// Función para exportar la lista de amigos
function exportarLista() {
    if (amigos.length === 0) {
        mostrarError('No hay amigos en la lista para exportar.');
        return;
    }
    
    // Crear contenido CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Amigos\n";
    
    amigos.forEach(amigo => {
        csvContent += amigo + "\n";
    });
    
    // Crear enlace de descarga
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lista_amigos_secretos.csv");
    document.body.appendChild(link);
    
    // Descargar archivo
    link.click();
    document.body.removeChild(link);
    
    // Mostrar confirmación
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'confirmation-message';
    mensajeDiv.textContent = 'Lista descargada correctamente';
    document.body.appendChild(mensajeDiv);
    
    setTimeout(() => {
        mensajeDiv.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        mensajeDiv.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(mensajeDiv);
        }, 500);
    }, 2000);
}
