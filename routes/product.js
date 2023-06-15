const express = require("express");
const router = express.Router();
const prodController = require("../controllers/productController");

/* GET users listing. */
router.route("/").get(prodController.getAll).post(prodController.create);
router
  .route("/:id")
  .get(prodController.getById)
  .put(prodController.update)
  .delete(prodController.delete);

module.exports = router;
