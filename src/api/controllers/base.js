module.exports = class BaseController {
	response(result, res) {
		if (result.isFailure) {
			return this._error(result.error, res);
		}
		return this._response(result.getValue(), res);
	}

	_response(obj, res) {
		return res.json(obj);
	}

	_bindAll(obj) {
		const objMethods = Object.getOwnPropertyNames(
			Object.getPrototypeOf(obj)
		);

		for (let methodName of objMethods) {
			if (typeof obj[methodName] === "function") {
				const isExemptedMethod =
					methodName === "constructor" ||
					methodName === "bindAll" ||
					false;

				if (!isExemptedMethod) {
					obj[methodName] = obj[methodName].bind(obj);
				}
			}
		}
	}

	_error(err = {}, res) {
		return res.status(err.statusCode).json(err);
	}
};
