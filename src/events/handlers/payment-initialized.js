const { payment: paymentService } = require("../../services");
const { error } = require("../../errors");

module.exports = function f({ order, payment }) {
	paymentService.createPayment(order, payment).catch((err) => {
		error(err);
	});
};
