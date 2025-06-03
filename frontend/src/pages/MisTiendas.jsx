import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { EyeFill } from "react-bootstrap-icons";
import './MisTiendas.css';
import ModalProductos from "../components/ModalProductos";

const id_usuario = localStorage.getItem("id_usuario");

function MisTiendas() {
  const [tiendas, setTiendas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productosTienda, setProductosTienda] = useState([]);
  const [nombreTienda, setNombreTienda] = useState("");

  useEffect(() => {
    const obtenerTiendas = async () => {
      try {
        const response = await fetch('https://conecarte-8olx.onrender.com/vendedores/vendedores/tiendas/' + id_usuario);
        const data = await response.json();

        console.log("Respuesta del backend:", data);

        if (Array.isArray(data)) {
          setTiendas(data);
        } else {
          setTiendas([]); // o puedes mostrar un mensaje "sin tiendas"
          console.warn("La respuesta no fue un arreglo:", data);
        }
      } catch (error) {
        console.error('Error al obtener las tiendas:', error);
        setTiendas([]); // previene que sea undefined en caso de error
      }
    };

    obtenerTiendas();
  }, []);

  const [tiendaSeleccionada, setTiendaSeleccionada] = useState(null);

  const handleVerProductos = async (tienda) => {
    try {
      let response = await fetch(`https://conecarte-8olx.onrender.com/vendedores/vendedores/productos/${tienda._id}`);
      let productos = await response.json();

      let dataProductos = [];

      for (const id of productos.productos) {
        try {
          const response = await fetch(`https://conecarte-8olx.onrender.com/productos/productos/${id}`);
          const productoData = await response.json();
          dataProductos.push(productoData);
        } catch (error) {
          console.error('Error al obtener el producto:', error);
        }
      }

      setProductosTienda(dataProductos);
      setNombreTienda(tienda.nombre_tienda);
      setTiendaSeleccionada(tienda);
      setShowModal(true); // Siempre mostramos el modal, aunque esté vacío
    } catch (error) {
      console.error('Error al obtener los productos de la tienda:', error);
      setProductosTienda([]); // También limpiamos en caso de error
      setNombreTienda(tienda.nombre_tienda); // Aun así, mostramos el nombre de tienda
      setShowModal(true); // Y mostramos el modal vacío con mensaje de "sin productos"
    }
  };



  return (
    <div className="mis-tiendas-background">
     
        <div className="container tienda-contenedor">
          <h2 className="text-white text-center mb-4">Mis Tiendas</h2>
          <div className="bg-white p-4 rounded shadow">
            <Table responsive bordered hover className="text-center align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Nombre de la Tienda</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tiendas.length === 0 ? (
                  <tr>
                    <td colSpan="3">No tienes tiendas registradas.</td>
                  </tr>
                ) : (
                  tiendas.map((tienda, index) => (
                    <tr key={tienda._id}>
                      <td>{index + 1}</td>
                      <td>{tienda.nombre_tienda}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleVerProductos(tienda)}
                        >
                          <EyeFill />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        
      </div>

      {/* Modal de productos */}
      <ModalProductos
        show={showModal}
        onHide={() => setShowModal(false)}
        productos={productosTienda}
        nombreTienda={nombreTienda}
        idTienda={tiendaSeleccionada}
        refrescarProductos={() => handleVerProductos(tiendaSeleccionada)}
      />
    </div>
  );
}

export default MisTiendas;
