module.exports.select = function select(obj) { // randomly select an element from an array or an object
	if (Array.isArray(obj)) {
		const idx = Math.floor(Math.random() * obj.length);
		return obj[idx];
	}

	if (typeof obj === "object") {
		const keys = Object.keys(obj);
		const keyIdx = Math.floor(Math.random() * keys.length);
		const key = keys[keyIdx];
		return [obj[key], key];
	}
};
