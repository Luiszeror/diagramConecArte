import React, { useEffect, useRef } from "react";

const publicKey = "pub_test_UhCoq9pZaoRd85CDzDgIejUbnNfTAiwX";
const currency = "COP";

const WompiPago = ({ pasarelaDePago }) => {
  const widgetContainer = useRef(null);
  const amountInCents = pasarelaDePago.total * 100;
  const reference = `pedido-${Date.now()}`;

  useEffect(() => {
    const fetchAndRenderWidget = async () => {
      const res = await fetch("https://conecarte-8olx.onrender.com/pagos/pagos/firmar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reference, amountInCents, currency })
      });

      const data = await res.json();
      const signature = data.signature;
      // Limpiar si ya hay un widget
      widgetContainer.current.innerHTML = "";

      const script = document.createElement("script");
      script.src = "https://checkout.wompi.co/widget.js";
      script.setAttribute("data-render", "button");
      script.setAttribute("data-public-key", publicKey);
      script.setAttribute("data-currency", currency);
      script.setAttribute("data-amount-in-cents", amountInCents);
      script.setAttribute("data-reference", reference);
      script.setAttribute("data-signature:integrity", signature);
      script.setAttribute("data-redirect-url", "https://conecarte-v7d3.onrender.com/wompi-respuesta");

      widgetContainer.current.appendChild(script);
    };

    fetchAndRenderWidget();
  }, [pasarelaDePago.total]);

  return <form ref={widgetContainer}></form>;
};

export default WompiPago;
