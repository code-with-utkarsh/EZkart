import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import reviewModel from "../models/reviewModel.js";

import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// create product controller
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;
    
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ message : "Name is Required" });
      case !description:
        return res.status(500).send({ message : "Description is Required" });
      case !price:
        return res.status(500).send({ message : "Price is Required" });
      case !category:
        return res.status(500).send({ message : "Category is Required" });
      case !quantity:
        return res.status(500).send({ message : "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res.status(500).send({ message : "Photo is Required and should be less then 1MB" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};

//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .select("-reviews")
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "AllProducts ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category")
      .populate({
        path : "reviews", 
        populate : {
          path : "author"
        },
        options: {
          sort: { updatedAt: -1 } // Sort reviews by updatedAt in descending order (-1)
        }
      });
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

// get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

//delete controller
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//upate product
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;
    
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ message : "Name is Required" });
      case !description:
        return res.status(500).send({ message : "Description is Required" });
      case !price:
        return res.status(500).send({ message : "Price is Required" });
      case !category:
        return res.status(500).send({ message : "Category is Required" });
      case !quantity:
        return res.status(500).send({ message : "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res.status(500).send({ message : "Photo is Required and should be less then 1MB" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Update product",
    });
  }
};

// filter product
export const productFiltersController = async (req, res) => {
  try {
    const perPage = 8;
    const page = req.params.page ? req.params.page : 1;
   
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    
    const products = await productModel
      .find(args)
      .select("-photo")
      .select("-reviews")
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Filtering Products",
      error,
    });
  }
};

// filter product count
export const productFilterCountController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const total = await productModel.countDocuments(args);
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Count Filtering Products",
      error,
    });
  }
};

//All product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in Count All Product",
      error,
      success: false,
    });
  }
};

// product list based on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .select("-reviews")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo")
      .select("-reviews");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .select("-reviews")
      .limit(4)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// get product by catgory
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel
      .find({ category })
      .populate("category")
      .select("-photo")
      .select("-reviews");
      
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

/***************************** Review Controller *****************************/
// post review
export const postReviewController = async (req, res) => {
  try {
    const { body, rating } = req.body;
    const productId = req.params.pid;
    const userId = req.user._id;

    //validation
    const product = await productModel.findById(productId).populate("reviews");
    const userHasReview = product.reviews.some(review => review.author.equals(userId));
    if (userHasReview) {
      return res.status(409).send({ message: "Review already posted for this product" });
    }
    if(!body) return res.status(400).send({ message : "Body is Required" });

    //save review
    const review = await new reviewModel({
      body,
      rating,
      author : req.user._id,
    }).save();
    
    product.reviews.push(review);
    await product.save();

    res.status(200).send({
      success: true,
      message: "Review Posted Successfully",
      review,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Posting Review",
      error,
    });
  }
};

// update review
export const updateReviewController = async (req, res) => {
  try {
    const { rid } = req.params;
    const { body, rating } = req.body;

    //validation
    if(!body) return res.status(400).send({ message : "Body is Required" });
    if(!rid) return res.status(400).send({ message : "Review ID is Required" });
    const review = await reviewModel.findById(rid);
    if (!review) return res.status(404).send({ message: "Review not found" });    
    if (req.user._id.toString() !== review.author.toString()) {
      return res.status(403).send({message: "You are not authorized to update this review"});
    }

    // Update the review
    review.body = body;
    review.rating = rating;
    await review.save();

    res.status(200).send({
      success: true,
      message: "Review Updated Successfully",
      review,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Updating Review",
      error,
    });
  }
};

// delete review
export const deleteReviewController = async (req, res) => {
  try {
    const { pid, rid } = req.params;
    
    //validation
    if(!pid) return res.status(400).send({ message : "Product ID is Required" });
    if(!rid) return res.status(400).send({ message : "Review ID is Required" });
    const review = await reviewModel.findById(rid);
    if (!review) return res.status(404).send({ message: "Review not found" });
    if (req.user._id.toString() !== review.author.toString()) {
      return res.status(403).send({ message: "You are not authorized to delete this review" });
    }

    // Delete the review
    await productModel.findByIdAndUpdate(pid, {
      $pull: { reviews: rid },
    });
    await reviewModel.findByIdAndDelete(rid);

    res.status(200).send({
      success: true,
      message: "Review Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Deleting Review",
      error,
    });
  }
};

/*****************************payment gateway api *****************************/
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.product.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
