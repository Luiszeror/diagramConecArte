const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();
const { generarFirma } = require("../services/service");

router.post("/firmar", generarFirma);


router.post("/verificar", async (req, res) => {
  const { transactionId } = req.body;

  try {
    const response = await fetch(`https://sandbox.wompi.co/v1/transactions/${transactionId}`);
    const data = await response.json();
    return res.json(data.data);
  } catch (error) {
    console.error("Error consultando estado:", error);
    res.status(500).json({ error: "Error consultando estado" });
  }
});

router.get('/', (req, res) => {
  res.status(200).send('OK');
});

module.exports = router;
