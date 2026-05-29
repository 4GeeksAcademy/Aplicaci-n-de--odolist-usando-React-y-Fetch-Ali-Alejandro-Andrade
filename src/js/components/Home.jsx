import React, { useState, useEffect } from "react";
import "../../styles/index.css";

const Home = () => {
  
  const [listaTareas, setListaTareas] = useState([]);
  const [textoNuevaTarea, setTextoNuevaTarea] = useState("");
  
  
  const nombreUsuario = "alesanchezr"; 
  const urlBase = "https://playground.4geeks.com/todo";

  
  useEffect(() => {
    const comprobarYObtenerTareas = async () => {
      try {
        
        const respuesta = await fetch(`${urlBase}/users/${nombreUsuario}`);
        
        if (respuesta.status === 404) {
          
          console.log("El usuario no existe en el servidor. Creando uno nuevo...");
          const respuestaCrear = await fetch(`${urlBase}/users/${nombreUsuario}`, {
            method: "POST"
          });
          if (respuestaCrear.ok) {
            setListaTareas([]); 
          }
        } else if (respuesta.ok) {
      
          const datos = await respuesta.json();
          setListaTareas(datos.todos || []);
        }
      } catch (error) {
        console.log("Hubo un error al iniciar la app: ", error);
      }
    };

    comprobarYObtenerTareas();
  }, []);


  const actualizarListaDesdeServidor = async () => {
    try {
      const respuesta = await fetch(`${urlBase}/users/${nombreUsuario}`);
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setListaTareas(datos.todos || []); 
      }
    } catch (error) {
      console.log("Error al refrescar las tareas: ", error);
    }
  };


  const funcionAgregarTarea = async (evento) => {
   
    if (evento.key === "Enter" && textoNuevaTarea.trim() !== "") {
      try {
        const respuesta = await fetch(`${urlBase}/todos/${nombreUsuario}`, {
          method: "POST",
          body: JSON.stringify({
            label: textoNuevaTarea,
            is_done: false
          }),
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (respuesta.ok) {
          setTextoNuevaTarea(""); 
          actualizarListaDesdeServidor(); 
        }
      } catch (error) {
        console.log("Error al intentar añadir la tarea: ", error);
      }
    }
  };


  const funcionEliminarTarea = async (idDeLaTarea) => {
    try {
      const respuesta = await fetch(`${urlBase}/todos/${idDeLaTarea}`, {
        method: "DELETE"
      });

      if (respuesta.ok) {
        actualizarListaDesdeServidor();
      }
    } catch (error) {
      console.log("Error al intentar borrar la tarea: ", error);
    }
  };

 
  const funcionLimpiarTodo = async () => {
    try {
      const respuestaBorrar = await fetch(`${urlBase}/users/${nombreUsuario}`, {
        method: "DELETE"
      });

      if (respuestaBorrar.ok) {
      
        const respuestaCrearNuevo = await fetch(`${urlBase}/users/${nombreUsuario}`, {
          method: "POST"
        });
        
        if (respuestaCrearNuevo.ok) {
          setListaTareas([]);
          console.log("¡Todas las tareas borradas con éxito!");
        }
      }
    } catch (error) {
      console.log("Error al limpiar todo el servidor: ", error);
    }
  };


  return (
    <div className="contenedor-principal">
      <h1 className="titulo-lista">Todo List</h1>
      
      <div className="caja-todo">
        {/* Input para escribir las tareas */}
        <input
          type="text"
          className="entrada-tarea"
          placeholder="¿Qué tienes que hacer hoy?"
          value={textoNuevaTarea}
          onChange={(e) => setTextoNuevaTarea(e.target.value)}
          onKeyDown={funcionAgregarTarea}
        />

        {/* Mapeo de la lista de tareas */}
        <ul className="lista-tareas">
          {listaTareas.length === 0 ? (
            <li className="mensaje-vacio">No hay tareas pendientes. ¡A descansar!</li>
          ) : (
            listaTareas.map((tarea) => (
              <li key={tarea.id} className="item-tarea">
                <span>{tarea.label}</span>
                <button 
                  className="boton-eliminar"
                  onClick={() => funcionEliminarTarea(tarea.id)}
                >
                  ✕
                </button>
              </li>
            ))
          )}
        </ul>
        
        {/* Barra inferior con el contador y el botón de borrado masivo */}
        <div className="pie-pagina">
          <span>
            {listaTareas.length} {listaTareas.length === 1 ? "tarea restante" : "tareas restantes"}
          </span>
          
          {listaTareas.length > 0 && (
            <button className="boton-limpiar-todo" onClick={funcionLimpiarTodo}>
              Limpiar todo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;