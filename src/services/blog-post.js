const { utils } = require("../lib");
const { BlogPostEnt } = require("../entities/domain");

const { Result } = utils;

module.exports = class Post {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async createPost(postDto) {
		const { blogPostMapper } = this.mappers;

		const newPost = await blogPostMapper.createPost(new BlogPostEnt(postDto));
		return Result.ok({ id: newPost.repr().id });
	}

	async findPost(filter) {
		const { blogPostMapper } = this.mappers;

		const foundPost = await blogPostMapper.findPost(filter);

		if (foundPost) {
			return Result.ok(foundPost.repr());
		} else {
			return Result.ok(null);
		}
	}

	async findPosts(filter, options) {
		const { blogPostMapper } = this.mappers;

		const { pagination } = options || {};
		const { limit, page } = pagination || {};

		const totalDocs = await blogPostMapper.countDocs(filter);

		const totalPages = limit ? Math.ceil(totalDocs / +limit) : 1;

		const posts = await blogPostMapper.findPosts(filter, {
			pagination: { limit: +limit || 30, page: page ? +page - 1 : 0 },
		});

		if (posts) {
			return Result.ok({
				data: posts.map((post) => post.repr()),
				pagination: { totalPages, currentPage: page || 1, totalDocs },
			});
		} else {
			return Result.ok([]);
		}
	}

	async updatePost(postDto) {
		const { blogPostMapper } = this.mappers;
		const postEnt = new BlogPostEnt(postDto);
		postEnt.updatedAt = new Date();

		let updatedPost = await blogPostMapper.updatePostById(postEnt.id, postEnt);

		if (updatedPost) {
			const objRepr = updatedPost.repr();
			return Result.ok(objRepr);
		}
	}

	async deletePosts(ids) {
		const { blogPostMapper } = this.mappers;

		let deletedPosts = await blogPostMapper.deletePosts(ids);

		if (deletedPosts) {
			return Result.ok(true);
		} else {
			return Result.ok(null);
		}
	}
};
