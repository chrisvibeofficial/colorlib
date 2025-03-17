const { getOneProduct, getAllProducts, updateProduct, deleteProduct, createProduct } = require('../controllers/productController');
const uploads = require('../middlewares/multer');
// const { validateProduct } = require('../middlewares/validator');


const router = require('express').Router();


router.post("/create/product", uploads.single("image"), createProduct);
router.get("/product/:productId", getOneProduct);
router.get("/products", getAllProducts);
router.put("/update/:productId", uploads.single("image"), updateProduct);
router.delete("/delete/:productId", deleteProduct);

module.exports = router;