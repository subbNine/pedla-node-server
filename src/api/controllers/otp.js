const BaseController = require("./base");

const { otp: otpService } = require("../../services");
const { OtpDto } = require("../../entities/dtos");

module.exports = class Otp extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
	}

	async verifyOtp(req, res, next) {
		const { otpToken } = req.body;
		const user = req._App.user;

		const otpDto = new OtpDto();
		otpDto.otpToken = otpToken;
		otpDto.user = user;

		const result = await otpService.verifyOtp(otpDto);

		this.response(result, res);
	}

	async resendOtp(req, res, next) {
		const user = req._App.user;

		const result = otpService.resendOtp(user);

		this.response(result, res);
	}
};
