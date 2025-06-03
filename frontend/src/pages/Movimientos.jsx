import React from 'react';
import './Movimientos.css';
import pendiente5 from '../assets/pendiente5.webp'; // Asegúrate que la ruta es correcta

function Movimientos() {
  const ventasSimuladas = [
    { id: 1, producto: "Bolso artesanal", cantidad: 2, total: 50000, fecha: "2024-05-10" },
    { id: 2, producto: "Sombrero Wayuu", cantidad: 1, total: 35000, fecha: "2024-05-12" },
    { id: 3, producto: "Pulsera tejida", cantidad: 5, total: 75000, fecha: "2024-05-15" },
  ];

  return (
    <div className="movimientos-container" style={{ backgroundImage: `url(${pendiente5})` }}>
      <div className="container p-5 bg-dark bg-opacity-75 rounded text-white">
        <h2 className="text-center mb-4">Historial de Movimientos</h2>
        <table className="table table-bordered table-hover table-dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ventasSimuladas.map((venta) => (
              <tr key={venta.id}>
                <td>{venta.id}</td>
                <td>{venta.producto}</td>
                <td>{venta.cantidad}</td>
                <td>${venta.total.toLocaleString()}</td>
                <td>{venta.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Movimientos;
