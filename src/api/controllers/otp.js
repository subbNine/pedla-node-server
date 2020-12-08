const BaseController = require("./base");

const { secret: secretService } = require("../../services");
const { SecretDto } = require("../../entities/dtos");

module.exports = class Otp extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
	}

	async verifyOtp(req, res, next) {
		const { otpToken } = req.body;
		const user = req._App.user;

		const otpDto = new SecretDto();
		otpDto.otpToken = otpToken;
		otpDto.user = user;

		const result = await secretService.verifyOtp(otpDto);

		this.response(result, res);
	}

	async sendOtp(req, res, next) {
		const user = req._App.user;

		const result = secretService.createAndSendOtp(user);

		this.response(result, res);
	}
};
