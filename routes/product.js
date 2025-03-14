const {createProduct,getOneProduct,getAllProducts,updateProduct,deleteProduct} = require('../controllers/productController')
const {validateProduct} = require('../middlewares/validator')
const uploads = require('../middlewares/multer')


const router = require('express').Router();


router.post("/create",validateProduct,upload.single("image"),createProduct);
router.get("/product:id",getOneProduct);
router.get("/products",getAllProducts);
router.put("/update/:id",validateProduct,upload.single("images"),updateProduct);
router.delete("/delete/:id",deleteProduct);

module.exports = router;