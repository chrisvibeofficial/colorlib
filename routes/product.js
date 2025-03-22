const { getOneProduct, getAllProducts, updateProduct, deleteProduct, createProduct } = require('../controllers/productController');
const uploads = require('../middlewares/multer');
// const { validateProduct } = require('../middlewares/validator');


const router = require('express').Router();


/**
 * @swagger
 * /api/v1/create/product:
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 description: The name of the product
 *                 example: "Laptop"
 *               description:
 *                 type: string
 *                 description: A brief description of the product
 *                 example: "High-performance laptop with 16GB RAM"
 *               productPrice:
 *                 type: number
 *                 description: The price of the product
 *                 example: 1200
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the product
 *     responses:
 *       201:
 *         description: Product Created Successfully
 *       500:
 *         description: Internal Server Error
 *
 * /api/v1/product/{productId}:
 *   get:
 *     summary: Get a single product by its ID
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The ID of the product
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 *
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: List of all products in the database
 *       500:
 *         description: Internal Server Error
 *
 * /api/v1/update/{productId}:
 *   put:
 *     summary: Update a product by its ID
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The ID of the product to be updated
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 description: The new name of the product
 *                 example: "Updated Laptop"
 *               description:
 *                 type: string
 *                 description: A brief description of the product
 *                 example: "Updated description for the laptop"
 *               productPrice:
 *                 type: number
 *                 description: The updated price of the product
 *                 example: 1500
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Updated image file for the product
 *     responses:
 *       200:
 *         description: Product Updated Successfully
 *       404:
 *         description: Product Not Found
 *       500:
 *         description: Internal Server Error
 *
 * /api/v1/delete/{productId}:
 *   delete:
 *     summary: Delete a product by its ID
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: The ID of the product to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal Server Error
 */



router.post("/create/product", uploads.single("image"), createProduct);
router.get("/product/:productId", getOneProduct);
router.get("/products", getAllProducts);
router.put("/update/:productId", uploads.single("image"), updateProduct);
router.delete("/delete/:productId", deleteProduct);

module.exports = router;