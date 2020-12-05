const isType = require("./is-type");
const isObjectEmpty = require("./is-object-empty");

module.exports = class ResponseSanitizer {
	_excludes = ["__v", "password", "passcode"];
	_transforms = { _id: "id" };

	constructor(options = { transforms: {}, excludes: [] }) {
		const { transforms } = options || {};
		const { excludes } = options || {};

		if (transforms && !isObjectEmpty(transforms)) {
			this._transforms = transforms;
		}

		if (excludes && !isObjectEmpty(excludes)) {
			this._excludes =
				isType("array", excludes) &&
				excludes.map((field) => ("" + field).toLowerCase());
		}
	}

	clean(inputObj) {
		if (inputObj) {
			if (isType("object", inputObj)) {
				const jsObj = convertMongoDocToObject(inputObj);
				return this._cleanUpObject(jsObj);
			} else {
				if (isType("array", inputObj)) {
					return this._cleanUpArray(inputObj);
				}
			}
		}
		return inputObj;
	}

	_cleanUpArray(arr) {
		const c = [];
		for (let elem of arr) {
			c.push(this.clean(elem));
		}
		return c;
	}

	_cleanUpObject(obj) {
		const objProps = getObjectPropertyNames(obj);
		const newObj = {};
		for (let key of objProps) {
			if (!this._isExcludedField(key)) {
				const newKey = this._transformField(key);
				if (isType("object", obj[key])) {
					if (!isMongoId(obj[key])) {
						newObj[newKey] = !isDateObject(obj[key])
							? this.clean(obj[key])
							: obj[key];
					} else {
						newObj[newKey] = obj[key];
					}
				} else {
					newObj[newKey] = obj[key];
				}
			}
		}
		return newObj;
	}

	_isExcludedField(fields) {
		return this._excludes.includes(("" + field).toLowerCase());
	}

	_transformField(fields) {
		return "" + (this._transforms[field] || field);
	}
};

function convertMongoDocToObject(obj) {
	try {
		return { ...obj.toObject() };
	} catch (error) {
		return { ...obj };
	}
}

function getObjectPropertyNames(obj) {
	return Object.getOwnPropertyNames(obj);
}

function isDateObject(obj) {
	const date = new Date(obj);
	let isDate = true;
	if (isNaN(date.getTime())) {
		isDate = false;
	}
	return isDate;
}

function isMongoId(id) {
	return id && id._bsontype ? true : false;
}
