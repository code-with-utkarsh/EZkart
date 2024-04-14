import express from "express";
import {
  brainTreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  deleteReviewController,
  getProductController,
  getSingleProductController,
  postReviewController,
  productCategoryController,
  productCountController,
  productFilterCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  realtedProductController,
  searchProductController,
  updateProductController,
  updateReviewController,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
// create product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

// update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get products  --> Use below router to fetch on basis of page  [/product-list/:page]
router.get("/get-product", getProductController);

//single product
router.get("/get-product/:slug", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete product
router.delete("/delete-product/:pid", deleteProductController);

//get filter product count
router.post("/product-filters-count", productFilterCountController);

//get filter product
router.post("/product-filters/:page", productFiltersController);

//get product count
router.get("/product-count", productCountController);

//get product per page
router.get("/product-list/:page", productListController);

//get search product
router.get("/search/:keyword", searchProductController);

//get similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//get category wise product
router.get("/product-category/:slug", productCategoryController);

//********************** review routes **************************//
//post review
router.post("/product-review/:pid", requireSignIn, postReviewController);

//update review
router.put("/update-review/:rid", requireSignIn, updateReviewController);

//delete review
router.delete("/delete-review/:pid/:rid", requireSignIn, deleteReviewController);

//********************* payments routes *************************//
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

export default router;
