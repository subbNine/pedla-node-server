const BaseMapper = require("./base");
const { BlogPostEnt, ProductEnt } = require("../entities/domain");

module.exports = class BlogPostMapper extends BaseMapper {
	constructor(models) {
		super();
		this.models = models;
	}

	async findPosts(filter, options) {
		const { BlogPost } = this.models;
		const query = BlogPost.find(this.toBlogPostPersistence(filter)).populate(
			"productId"
		);

		const { pagination } = options || {};

		const { limit = 0, page = 0 } = pagination || {};

		if (limit) {
			query.limit(+limit);

			query.skip(+limit * +page);
		}

		const docs = await query;

		const results = [];
		if (docs) {
			for (const doc of docs) {
				results.push(this.toBlogPostEntity(doc.toObject()));
			}
		}
		return results;
	}

	async findPost(filter) {
		const { BlogPost } = this.models;
		const doc = await BlogPost.findOne(
			this.toBlogPostPersistence(filter)
		).populate("productId");

		if (doc) {
			return this.toBlogPostEntity(doc.toObject());
		}
	}

	async createPost(blogPostEnt) {
		const { BlogPost } = this.models;

		const newBlogPost = this.toBlogPostPersistence(blogPostEnt);

		const doc = await BlogPost.create(newBlogPost);

		if (doc) {
			return this.toBlogPostEntity(doc.toObject());
		}
	}

	async updatePostById(id, blogPostEnt) {
		const { BlogPost } = this.models;

		const updates = this.toBlogPostPersistence(blogPostEnt);

		const doc = await BlogPost.findByIdAndUpdate(id, updates, { new: true });

		if (doc) {
			return this.toBlogPostEntity(doc.toObject());
		}
	}

	async deletePosts(ids) {
		const { BlogPost } = this.models;

		const isDeleted = await BlogPost.deleteMany({ _id: { $in: ids } });

		if (isDeleted && isDeleted.ok) {
			return isDeleted.n;
		}
	}

	async countDocs(filter) {
		const { BlogPost } = this.models;
		return await BlogPost.countDocuments(filter);
	}

	toBlogPostEntity(doc) {
		doc.productId = this.toProductEntity(doc.productId);

		return this._toEntity(doc, BlogPostEnt, {
			_id: "id",
			productId: "product",
		});
	}

	toProductEntity(doc) {
		return this._toEntity(doc, ProductEnt, {
			_id: "id",
		});
	}

	toBlogPostPersistence(ent) {
		return this._toPersistence(ent, {
			product: "productId",
		});
	}
};
