var express = require("express");
const {
  createOrder,
  createOrderFromCart,
  verifyPayment,
} = require("../controllers/esewaController");
const { protect } = require("../middleware/auth");
var router = express.Router();

router.post("/create/:id", protect, createOrder);

router.post("/create-from-cart", protect, createOrderFromCart);

// Route to handle the successful payment from Esewa
router.get("/success", verifyPayment);

// Route to handle the failed payment from Esewa
// router.get("/failure", handleEsewaFailure);

module.exports = router;