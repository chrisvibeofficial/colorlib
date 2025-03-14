const productModel = require("../models/product");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.createProduct = async (req, res) => {
  try {
    const { description, productPrice } = req.body;
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
    const { id } = req.params


    const userProduct = await productModel.findById(id)

    if (!userProduct) {
      return res.status(404).json({ message: 'product not found' })
    }

    res.status(200).json({ message: `kindly find the product below`, data: userProduct })

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
    const { id: userId } = req.params;
    const { description, productPrice } = req.body;
    const product = await productModel.findById(userId)
    // check if the user is found and return an error if not found
    if (product === null) {
      return res.status(404).json({ message: 'Product Not Found' })
    };
    const data = {
      description,
      productPrice
    }

    if (req.files && req.file[0]) {
      for (const image of product.images) {
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
      data.image = picturesURl;
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
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.image && product.image.imagePublicId) {
      await cloudinary.uploader.destroy(product.image.imagePublicId);
    }

    await productModel.findByIdAndDelete(id);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};