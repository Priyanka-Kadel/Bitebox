// const crypto = require("crypto");
// const { v4 } = require("uuid");

// exports.createOrder = async (req, res, next) => {
//   const { amount } = req.body;
//   const recipeId = req.params.id;
//   const transactionUuid = v4();

//   // List all fields you will send
//   const signed_field_names = [
//     "total_amount",
//     "amount",
//     "tax_amount",
//     "transaction_uuid",
//     "product_code",
//     "product_service_charge",
//     "product_delivery_charge",
//     "success_url",
//     "failure_url"
//   ].join(",");

//   // Build the message for signature
//   const message = [
//     `total_amount=${amount}`,
//     `amount=${amount}`,
//     `tax_amount=0`,
//     `transaction_uuid=${transactionUuid}`,
//     `product_code=EPAYTEST`,
//     `product_service_charge=0`,
//     `product_delivery_charge=0`,
//     `success_url=https://localhost:5173/success`,
//     `failure_url=https://localhost:5173/failure`
//   ].join(",");

//   const signature = exports.createSignature(message);

//   const formData = {
//     amount: amount,
//     failure_url: `https://localhost:5173/failure`,
//     product_delivery_charge: "0",
//     product_service_charge: "0",
//     product_code: "EPAYTEST",
//     signature: signature,
//     signed_field_names: signed_field_names,
//     success_url: `https://localhost:5173/success`,
//     tax_amount: "0",
//     total_amount: amount,
//     transaction_uuid: transactionUuid,
//   };

//   res.json({
//     message: "Order Created Successfully",
//     formData,
//     payment_method: "esewa",
//   });
// };

// exports.verifyPayment = async (req, res, next) => {
//   try {
//     const { data } = req.query;
//     const decodedData = JSON.parse(
//       Buffer.from(data, "base64").toString("utf-8")
//     );
//     console.log(decodedData);

//     if (decodedData.status !== "COMPLETE") {
//       return res.status(400).json({ message: "error" });
//     }

//     const message = decodedData.signed_field_names
//       .split(",")
//       .map((field) => `${field}=${decodedData[field] || ""}`)
//       .join(",");
//     console.log(message);

//     const recipeId = decodedData.transaction_uuid.split("-")[0]; // Extract recipe ID
//     console.log("The recipe id is " + recipeId);

//     if (decodedData.status !== "COMPLETE") {
//       console.log("The status is not complete");
//       return res.redirect(`https://localhost:3000/failure`);
//     }

//     res.redirect("https://localhost:3000/success");
//   } catch (err) {
//     console.log(err.message);
//     return res.status(400).json({ error: err?.message || "No Orders found" });
//   }
// };

// exports.createSignature = (message) => {
//   const secret = "8gBm/:&EnhH.1/q";
//   const hmac = crypto.createHmac("sha256", secret);
//   hmac.update(message);
//   const hashInBase64 = hmac.digest("base64");
//   return hashInBase64;
// };






const crypto = require("crypto");
const { v4 } = require("uuid");

const CLIENT_URL = process.env.CLIENT_URL || "https://localhost:5173";
const SECRET_KEY = process.env.ESEWA_SECRET || "8gBm/:&EnhH.1/q";

exports.createOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const recipeId = req.params.id;

    if (!amount || !recipeId) {
      return res.status(400).json({ message: "Amount and Recipe ID are required" });
    }

    const transactionUuid = `${recipeId}-${v4()}`;

    const signed_field_names = [
      "total_amount",
      "amount",
      "tax_amount",
      "transaction_uuid",
      "product_code",
      "product_service_charge",
      "product_delivery_charge",
      "success_url",
      "failure_url"
    ].join(",");

    const message = [
      `total_amount=${amount}`,
      `amount=${amount}`,
      `tax_amount=0`,
      `transaction_uuid=${transactionUuid}`,
      `product_code=EPAYTEST`,
      `product_service_charge=0`,
      `product_delivery_charge=0`,
      `success_url=${CLIENT_URL}/success`,
      `failure_url=${CLIENT_URL}/failure`
    ].join(",");

    const signature = exports.createSignature(message);

    const formData = {
      amount: amount,
      failure_url: `${CLIENT_URL}/failure`,
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: "EPAYTEST",
      signature: signature,
      signed_field_names: signed_field_names,
      success_url: `${CLIENT_URL}/success`,
      tax_amount: "0",
      total_amount: amount,
      transaction_uuid: transactionUuid,
    };

    res.json({
      message: "Order Created Successfully",
      formData,
      payment_method: "esewa",
    });

  } catch (err) {
    console.error("Create Order Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createOrderFromCart = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }


    const transactionUuid = v4();

    const signed_field_names = [
      "total_amount",
      "amount",
      "tax_amount",
      "transaction_uuid",
      "product_code",
      "product_service_charge",
      "product_delivery_charge",
      "success_url",
      "failure_url"
    ].join(",");

    const message = [
      `total_amount=${amount}`,
      `amount=${amount}`,
      `tax_amount=0`,
      `transaction_uuid=${transactionUuid}`,
      `product_code=EPAYTEST`,
      `product_service_charge=0`,
      `product_delivery_charge=0`,
      `success_url=${CLIENT_URL}/success`,
      `failure_url=${CLIENT_URL}/failure`
    ].join(",");
    console.log("Signature string:", message);
    const signature = exports.createSignature(message);

    const formData = {
      amount: amount,
      failure_url: `${CLIENT_URL}/failure`,
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: "EPAYTEST",
      signature: signature,
      signed_field_names: signed_field_names,
      success_url: `${CLIENT_URL}/success`,
      tax_amount: "0",
      total_amount: amount,
      transaction_uuid: transactionUuid,
    };

    res.json({
      message: "Order Created Successfully",
      formData,
      payment_method: "esewa",
    });

  } catch (err) {
    console.error("Create Order From Cart Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { data } = req.query;
    const decodedData = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));

    console.log("Decoded eSewa Response:", decodedData);

    if (decodedData.status !== "COMPLETE") {
      return res.status(400).json({ message: "Payment not complete" });
    }

    const message = decodedData.signed_field_names
      .split(",")
      .map((field) => `${field}=${decodedData[field] || ""}`)
      .join(",");

    const localSignature = exports.createSignature(message);

    if (localSignature !== decodedData.signature) {
      return res.status(403).json({ message: "Invalid Signature" });
    }

    const recipeId = decodedData.transaction_uuid.split("-")[0];
    console.log("Verified Recipe ID:", recipeId);


    res.redirect(`${CLIENT_URL}/success`);

  } catch (err) {
    console.error("Verification Error:", err.message);
    res.status(400).json({ error: err?.message || "Verification failed" });
  }
};

exports.createSignature = (message) => {
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(message);
  return hmac.digest("base64");
};
