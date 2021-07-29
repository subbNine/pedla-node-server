const { totp } = require("otplib");

const { eventEmitter, eventTypes } = require("../events");
const { SecretEnt } = require("../entities/domain");
const { utils, error } = require("../lib");
const permissions = require("../db/mongo/enums/user/permissions");

const AppError = error.AppError;
const errorCodes = error.errorCodes;
const errMessages = error.messages;
const { Result, generateJwtToken } = utils;

class Secrets {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async _findSecretByUserId(userId) {
		const { secretMapper } = this.mappers;
		const foundSecret = await secretMapper.findSecret({ userId }, (doc) =>
			doc.populate("userId")
		);

		return foundSecret;
	}

	async initSecretsStore(userId, options) {
		const { secretMapper } = this.mappers;

		const foundSecret = await this._findSecretByUserId(userId);

		// a user can have only one secrets record
		if (foundSecret) {
			foundSecret.generateOtpToken(options);
			return Result.ok(foundSecret);
		} else {
			const secretEnt = new SecretEnt();
			secretEnt.user.id = userId;
			await secretEnt.generateOtpSecret();
			secretEnt.generateOtpToken(options);

			return Result.ok(await secretMapper.createSecret(secretEnt));
		}
	}

	async verifyOtp(secretDto) {
		const { userMapper } = this.mappers;

		const foundSecret = await this._findSecretByUserId(secretDto.user.id);
		if (foundSecret) {
			const otpSecret = foundSecret.otpSecret;
			const otpToken = secretDto.otpToken;

			const isValidOtp = totp.check(otpToken, otpSecret);
			if (isValidOtp) {
				const userEnt = foundSecret.user;

				if (!userEnt.isOtpVerifiedUser()) {
					userEnt.permission = permissions.PERM002;
					const updatedUserEnt = await userMapper.updateUserById(
						userEnt.id,
						userEnt
					);
					if (updatedUserEnt.isPeddler() || updatedUserEnt.isCorporateBuyer()) {
						eventEmitter.emit(eventTypes.alertOpsTeam, updatedUserEnt);
					}
				}

				const objRepr = userEnt.toDto();
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

	createAndSendOtp(userEnt) {
		eventEmitter.emit(eventTypes.createAndSendOtp, userEnt);
		return Result.ok({ success: true });
	}
}

module.exports = Secrets;
