const { paymentMethod } = require("../../db/mongo/enums/order");
const { isType } = require("../../lib/utils");

module.exports = class Payment {
	order;
	buyer;
	driver;
	id;
	paymentMethod;
	gatewayAccessCode;
	gatewayReference;
	status;
	proofOfPayment;

	constructor(fields = {}) {
		for (let key in fields) {
			if (fields[key]) {
				this[key] = fields[key];
			}
		}
	}

	isPaystackPayment() {
		return this.paymentMethod === paymentMethod.paystack
	}

	isTransferPayment() {
		return this.paymentMethod === paymentMethod.transfer
	}

	// object representation of the domain entity.
	toDto() {
		const dto = {
			order:
				(this.order && this.order.toDto ? this.order.toDto() : this.order) ||
				null,
			id: this.id,
			transId: this.id,
			paymentMethod: this.paymentMethod,
			gatewayAccessCode: this.gatewayAccessCode,
			gatewayReference: this.gatewayReference,
			status: this.status,
			proofOfPayment:
				(isType("object", this.proofOfPayment) && this.proofOfPayment.uri) ||
				this.proofOfPayment ||
				null,
		};

		return dto;
	}
};
