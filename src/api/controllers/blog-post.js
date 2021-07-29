const BaseController = require("./base");
const { BlogPostDto } = require("../../entities/dtos");
const { blogPost } = require("../../services");
const isType = require("../../lib/utils/is-type");

module.exports = class BlogPost extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
	}

	async createPost(req, res, next) {
		const { title, body, image, productId } = req.body;

		const blogPostDto = new BlogPostDto();

		blogPostDto.title = title;
		blogPostDto.body = body;
		blogPostDto.product = productId;

		if (req.file) {
			const { secure_url, public_id } = req.file;

			if (secure_url && public_id) {
				blogPostDto.image = { imgId: secure_url, uri: public_id };
			}
		} else {
			if (isType("string", image)) {
				blogPostDto.image = {
					imgId: "" + Date.now(),
					uri: image,
				};
			}
		}

		return this.response(await blogPost.createPost(blogPostDto), res);
	}

	async getPost(req, res, next) {}

	async getPosts(req, res, next) {
		const { limit, page } = req.query;

		const posts = await blogPost.findPosts(
			{},
			{
				pagination: { limit, page },
			}
		);
		return this.response(posts, res);
	}

	async updatePost(req, res, next) {
		const { title, body, image, product } = req.body;
		const { postId } = req.params;

		const blogPostDto = new BlogPostDto();

		blogPostDto.title = title;
		blogPostDto.body = body;
		blogPostDto.product = product;
		blogPostDto.id = postId;

		if (req.file) {
			const { secure_url, public_id } = req.file;

			if (secure_url && public_id) {
				blogPostDto.image = { imgId: public_id, uri: secure_url };
			}
		} else {
			if (isType("string", image)) {
				blogPostDto.image = {
					imgId: "" + Date.now(),
					uri: image,
				};
			}
		}

		return this.response(await blogPost.updatePost(blogPostDto), res);
	}

	async deletePosts(req, res, next) {
		const { ids } = req.body;

		return this.response(
			await blogPost.deletePosts(ids && ids.length ? ids : [ids]),
			res
		);
	}
};
