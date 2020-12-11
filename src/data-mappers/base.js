module.exports = class BaseDataMapper {
	_toEntity(doc = {}, EntityClass, transforms = {}) {
		const entity = new EntityClass();

		for (let key in doc) {
			const newKey = transforms[key] || key;
			entity[newKey] = doc[key];
		}

		return entity;
	}

	_toPersistence(entity = {}, transforms = {}) {
		const doc = {};

		for (let key in entity) {
			const newKey = transforms[key] || key;
			doc[newKey] = entity[key];
		}

		return doc;
	}
};
