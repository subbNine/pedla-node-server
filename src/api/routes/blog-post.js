const { Router } = require("express");

const { blogPostController } = require("../controllers");
const { catchAsync } = require("../../errors/helpers");

const router = Router();

/**
 * @api {get} /api/posts Get Posts
 * @apiName getUserBlogPosts
 * @apiGroup Buyer And Seller - Post
 *
 * @apiVersion 1.0.0
 *
 * @apiDescription Endpoint to get feeds for products. The product Id is used to categorize feeds
 *
 */
router.get("/posts", catchAsync(blogPostController.getPosts));

module.exports = router;
