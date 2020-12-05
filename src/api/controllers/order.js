const BaseController = require("./base");

module.exports = class Order extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
	}
};
