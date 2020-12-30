const { error } = require("../../errors");

module.exports = function f({ order, payment }) {
	const { payment: paymentService } = require("../../services");

	paymentService.createPayment(order, payment).catch((err) => {
		error(err);
	});
};
