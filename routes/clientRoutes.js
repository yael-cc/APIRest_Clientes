// clientRoutes.js
const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

// Define las rutas para los clientes
router.get("/", clientController.getAllClients);
router.post("/", clientController.createClient);
router.get("/:id", clientController.getClientById);
router.put("/:id", clientController.updateClient);
router.patch("/:id", clientController.patchClient);
router.delete("/:id", clientController.deleteClient);

module.exports = router;