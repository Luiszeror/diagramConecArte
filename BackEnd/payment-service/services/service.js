
const crypto = require("crypto");

exports.generarFirma = (req, res) => {
    const { reference, amountInCents, currency } = req.body;

    const integrityKey = process.env.INTEGRITY_KEY;

    const plainText = `${reference}${amountInCents}${currency}${integrityKey}`;
    const signature = crypto
        .createHash("sha256")
        .update(plainText)
        .digest("hex");
 
    res.json({ signature });
};
