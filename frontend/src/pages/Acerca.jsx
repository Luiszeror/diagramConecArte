import React from 'react';
import './Home.css'; // Usamos el mismo CSS

function Acerca() {
  return (
    <div className="home-container">
      <div className="home-text-container">
        <div className="acerca-container">
          <h2 className="titulo-acerca">Acerca de Nosotros</h2>
          <p className="texto-acerca">
            ConectArte fue creado por Luis Esteban Robelto, Andrés Puentes y Juan Beltrán con el propósito de conectar a artesanos locales con compradores apasionados por el arte auténtico. Nuestra misión es ofrecer una plataforma accesible y amigable que potencie el talento artesanal colombiano, brindando visibilidad, oportunidades y comunidad.
          </p>
          <p className="texto-acerca">
        Además de impulsar el comercio artístico, buscamos brindar una experiencia accesible y culturalmente enriquecedora para todos los usuarios.
      </p>
        </div>
      </div>
    </div>
  );
}
      

export default Acerca;
