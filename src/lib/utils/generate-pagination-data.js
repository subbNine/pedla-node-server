module.exports = async function (model, { page, limit }, criteriaObj) {
	const totalItems = await model.countDocs(criteriaObj);

	const paginationStats = {
		totalItems,
		currentPage: page,
		totalPages: limit ? totalItems / +limit : 1,
	};

	return { pagination: { page, limit }, paginationStats };
};
