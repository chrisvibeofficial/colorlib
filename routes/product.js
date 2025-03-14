const {getOneProduct, getAllProducts, updateProduct, deleteProduct, createProduct } = require('../controllers/productController');
const uploads = require('../middlewares/multer');
const { validateProduct } = require('../middlewares/validator');


const router = require('express').Router();


router.post("/create", validateProduct, uploads.single("image"), createProduct);
router.get("/product:id", getOneProduct);
router.get("/products", getAllProducts);
router.put("/update/:id", validateProduct, uploads.single("images"), updateProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;