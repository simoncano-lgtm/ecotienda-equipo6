const TARIFA = 950;
const DIAS_MES = 30;

const productos = [
    { id: 1, nombre: "Bombillo LED 9 W", categoria: "iluminacion", precio: 8900, wattsAntes: 60, wattsDespues: 9, horasDia: 5 },
    { id: 2, nombre: "Panel LED 18 W", categoria: "iluminacion", precio: 35000, wattsAntes: 40, wattsDespues: 18, horasDia: 8 },
    { id: 3, nombre: "Reflector LED 50 W", categoria: "iluminacion", precio: 59000, wattsAntes: 250, wattsDespues: 50, horasDia: 6 },
    { id: 4, nombre: "Nevera eficiente", categoria: "electrodomesticos", precio: 1890000, wattsAntes: 80, wattsDespues: 40, horasDia: 24 },
    { id: 5, nombre: "Aire acondicionado inverter", categoria: "electrodomesticos", precio: 2100000, wattsAntes: 1400, wattsDespues: 900, horasDia: 6 },
    { id: 6, nombre: "Regleta con apagado automático", categoria: "electrodomesticos", precio: 65000, wattsAntes: 15, wattsDespues: 0, horasDia: 20 },
    { id: 7, nombre: "Calentador solar de agua", categoria: "solar", precio: 1200000, wattsAntes: 3500, wattsDespues: 0, horasDia: 0.5 },
    { id: 8, nombre: "Kit de panel solar 550 W", categoria: "solar", precio: 2400000, wattsAntes: 550, wattsDespues: 0, horasDia: 4.5 }
];

let carrito = [];

function ahorroKwhMes(producto) {
    return (producto.wattsAntes - producto.wattsDespues) * producto.horasDia * DIAS_MES / 1000;
}

function ahorroPesosMes(producto) {
    return ahorroKwhMes(producto) * TARIFA;
}

function pesos(valor) {
    return "$" + Math.round(valor).toLocaleString("es-CO");
}

function nombreCategoria(categoria) {
    if (categoria === "iluminacion") {
        return "Iluminación";
    } else if (categoria === "electrodomesticos") {
        return "Electrodomésticos";
    } else {
        return "Energía solar";
    }
}

function mostrarProductos(categoria = "todas", busqueda = "") {
    const contenedor = document.querySelector("#productos");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    for (const producto of productos) {
        if (categoria !== "todas" && producto.categoria !== categoria) {
            continue;
        }
        if (busqueda && !producto.nombre.toLowerCase().includes(busqueda.toLowerCase())) {
            continue;
        }

        contenedor.innerHTML += `
            <article class="tarjeta">
                <span class="categoria">${nombreCategoria(producto.categoria)}</span>
                <h3>${producto.nombre}</h3>
                <p>Reemplaza un equipo de ${producto.wattsAntes} W. Ahorra <span class="ahorro">${ahorroKwhMes(producto).toFixed(1)} kWh</span> al mes.</p>
                <p class="precio">${pesos(producto.precio)}</p>
                <p>Ahorro al mes: <span class="ahorro">${pesos(ahorroPesosMes(producto))}</span></p>
                <button class="btn btn-primary btn-sm" data-id="${producto.id}">Agregar al carrito</button>
            </article>`;
    }
}

function agregarAlCarrito(id) {
    for (const producto of productos) {
        if (producto.id === id) {
            carrito.push(producto);
        }
    }
    mostrarCarrito();
}

function mostrarCarrito() {
    const lista = document.querySelector("#lista-carrito");
    if (!lista) return;
    lista.innerHTML = "";
    let total = 0;
    let ahorroMes = 0;

    for (const producto of carrito) {
        lista.innerHTML += `<li>${producto.nombre}: ${pesos(producto.precio)}</li>`;
        total += producto.precio;
        ahorroMes += ahorroPesosMes(producto);
    }

    document.querySelector("#total").textContent = "Total: " + pesos(total);

    if (carrito.length === 0) {
        document.querySelector("#ahorro").textContent = "El carrito está vacío.";
    } else {
        const meses = Math.ceil(total / ahorroMes);
        document.querySelector("#ahorro").textContent = `Ahorra ${pesos(ahorroMes)} al mes: la compra se paga sola en ${meses} meses.`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarProductos("todas");
    mostrarCarrito();

    const botonesFiltro = document.querySelectorAll(".filtro");
    for (const boton of botonesFiltro) {
        boton.addEventListener("click", function () {
            for (const otro of botonesFiltro) {
                otro.classList.remove("activo");
            }
            boton.classList.add("activo");
            const buscador = document.querySelector("#buscador");
            const textoBusq = buscador ? buscador.value : "";
            mostrarProductos(boton.dataset.categoria, textoBusq);
        });
    }

    const buscadorInput = document.querySelector("#buscador");
    if (buscadorInput) {
        buscadorInput.addEventListener("input", function (e) {
            const botonActivo = document.querySelector(".filtro.activo");
            const cat = botonActivo ? botonActivo.dataset.categoria : "todas";
            mostrarProductos(cat, e.target.value);
        });
    }

    const contenedorProd = document.querySelector("#productos");
    if (contenedorProd) {
        contenedorProd.addEventListener("click", function (evento) {
            if (evento.target.dataset.id) {
                agregarAlCarrito(Number(evento.target.dataset.id));
            }
        });
    }

    const btnVaciar = document.querySelector("#vaciar");
    if (btnVaciar) {
        btnVaciar.addEventListener("click", function () {
            carrito = [];
            mostrarCarrito();
        });
    }
});
