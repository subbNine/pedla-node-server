const { totp } = require("otplib");

const { eventEmitter, eventTypes } = require("../events");
const { OtpEnt } = require("../entities/domain");
const { utils, error } = require("../lib");

const AppError = error.AppError;
const errorCodes = error.errorCodes;
const errMessages = error.messages;
const { Result, generateJwtToken } = utils;

class Otp {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async _findOtpByUserId(userId) {
		const { otpMapper } = this.mappers;
		const foundOtp = await otpMapper.findOtp({ userId }, (doc) =>
			doc.populate("userId")
		);

		return foundOtp;
	}

	async createOtp(userId) {
		const { otpMapper } = this.mappers;

		const foundOtp = await this._findOtpByUserId(userId);

		// a user can have only one otp record
		if (foundOtp) {
			foundOtp.generateOtpToken();
			return Result.ok(foundOtp);
		} else {
			const otpEnt = new OtpEnt();
			otpEnt.user.id = userId;
			await otpEnt.generateOtpSecret();
			otpEnt.generateOtpToken();

			return Result.ok(await otpMapper.createOtp(otpEnt));
		}
	}

	async verifyOtp(otpDto) {
		const { userMapper } = this.mappers;

		const foundOtp = await this._findOtpByUserId(otpDto.user.id);
		if (foundOtp) {
			const otpSecret = foundOtp.otpSecret;
			const otpToken = otpDto.otpToken;

			const isValidOtp = totp.check(otpToken, otpSecret);
			if (isValidOtp) {
				const userEnt = foundOtp.user;

				if (!userEnt.isOtpVerifiedUser()) {
					userEnt.elevatePerm();
					const updatedUserEnt = await userMapper.updateUserById(
						userEnt.id,
						userEnt
					);
					if (updatedUserEnt.isPeddler()) {
						eventEmitter.emit(
							eventTypes.alertOpsTeam,
							updatedUserEnt
						);
					}
				}

				const objRepr = userEnt.repr();
				const token = generateJwtToken(objRepr);
				return Result.ok({ token, ...objRepr });
			} else {
				return Result.fail(
					new AppError({
						name: errorCodes.ExpiredOtp.name,
						statusCode: errorCodes.ExpiredOtp.statusCode,
						message: errMessages.expiredOtp,
					})
				);
			}
		} else {
			return Result.fail(
				new AppError({
					name: errorCodes.OtpNotIssued,
					statusCode: errorCodes.OtpNotIssued.statusCode,
					message: errMessages.otpNotIssued,
				})
			);
		}
	}

	resendOtp(userEnt) {
		eventEmitter.emit(eventTypes.sendOtp, userEnt);
		return Result.ok({ success: true });
	}
}

module.exports = Otp;
