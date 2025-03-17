const cartModel = require("../models/cart")
const productModel = require("../models/product")
const userModel = require("../models/user")

exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.user;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    };

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found"
      })
    };

    let cart = await cartModel.findOne({ userId: userId })

    if (!cart) {
      cart = new cartModel({
        user: userId,
        products: [],
      })
    };

    const productExist = cart.products.find((item) => item.productId.toString() === productId);

    if (productExist) {
      productExist.quantity += 1
      productExist.unitTotal = productExist.quantity * product.price
    } else {
      const newProduct = {
        productId: productId,
        unitPrice: product.price,
        totalPrice: product.price * productExist.quantity,
        productName: product.name,
      };

      cart.products.push(newProduct)
    }

    const subTotal = cart.products.reduce((accumulator, product) => accumulator + product.unitTotal, 0);

    cart.grandTotal = subTotal;
    await cart.save()

    res.status(201).json({
      message: "Products added to cart",
      data: cart
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};