const productModel = require("../models/product");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.createProduct = async (req, res) => {
  try {
    const { productName, description, productPrice } = req.body;
    const file = req.file; // Handling a single image

    let image = {};

    if (file && file.path) {
      const result = await cloudinary.uploader.upload(file.path);
      fs.unlinkSync(file.path);

      image = {
        imageUrl: result.secure_url,
        imagePublicId: result.public_id,
      };
    }

    const product = new productModel({
      productName,
      description,
      productPrice,
      image,
    });

    await product.save();
    // fs.unlinkSync(file.path);

    res.status(201).json({ message: "Product Created Successfully", data: product });
  } catch (error) {
    // console.error(error.message);
    res.status(500).json({ message: "Internal Server Error: ", error: error.message });
  }
};



exports.getOneProduct = async (req, res) => {
  try {
    const { productId } = req.params


    const product = await productModel.findById(productId)

    if (!product) {
      return res.status(404).json({ message: 'product not found' })
    }

    res.status(200).json({ message: `kindly find the product below`, data: product })

  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'internal server error' })
  }
};



exports.getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();

    res.status(200).json({ message: 'all products in the database', data: products })

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'internal server error' })
  }
};



exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { productName, description, productPrice } = req.body;
    const product = await productModel.findById(productId)
    // check if the user is found and return an error if not found
    if (!product) {
      return res.status(404).json({ message: 'Product Not Found' })
    };
    const data = {
      productName,
      description,
      productPrice
    }

    if (req.file && req.file.path) {
      for (const image of product.image) {
        await cloudinary.uploader.upload.destroy(image.imagePublicId)
      }
      const picturesURL = []

      for (const image of req.files) {
        const result = await cloudinary.uploader.upload(image.path)
        fs.unlinkSync(image.path)
        const photo = {
          imageUrl: result.secure_url,
          imagePublicId: result.public_id
        }
        picturesURL.push(photo)
      }
      data.image = picturesURL;
    }
    const updateProduct = await postModel.findByIdAndUpdate(productId, data, { new: true });

    // send success response
    res.status(200).json({ message: 'Product Updated Successfully', data: photo })
  } catch (error) {
    console.log(err.message)
    res.status(500).json({ message: 'Internal Server Error' })
  }
};



exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.image && product.image.imagePublicId) {
      await cloudinary.uploader.destroy(product.image.imagePublicId);
    }

    await productModel.findByIdAndDelete(product);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};