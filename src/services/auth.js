const { totp } = require("otplib");

const { BuyerEnt, PeddlerEnt } = require("../entities/domain");
const { utils, error } = require("../lib");
const { eventEmitter, eventTypes } = require("../events");
const {
	user: { permissions, types },
} = require("../db/mongo/enums");

const AppError = error.AppError;
const errorCodes = error.errorCodes;
const errMessages = error.messages;
const { Result, generateJwtToken } = utils;

module.exports = class Auth {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async signIn(userDto) {
		const { userMapper } = this.mappers;

		let foundUser = await userMapper.findUser({
			$and: [
				{ email: { $exists: true } },
				{ email: userDto.email },
				{ type: types.BUYER },
			],
		});

		if (foundUser) {
			const isPasswordMatch = await foundUser.comparePassword(userDto.password);

			if (isPasswordMatch) {
				const objRepr = foundUser.toDto();
				const token = generateJwtToken({ ...objRepr });

				objRepr.token = token;

				return Result.ok(objRepr);
			} else {
				return Result.fail(
					new AppError({
						message: errMessages.incorrectPassword,
						name: errorCodes.IncorrectPasswordError.name,
						statusCode: errorCodes.IncorrectPasswordError.statusCode,
					})
				);
			}
		} else {
			return Result.fail(
				new AppError({
					message: errMessages.incorrectEmail,
					name: errorCodes.IncorrectEmailError.name,
					statusCode: errorCodes.IncorrectEmailError.statusCode,
				})
			);
		}
	}

	async peddlerSignIn(userDto) {
		const { userMapper } = this.mappers;

		let foundUser = await userMapper.findUser({
			$and: [
				{ userName: { $exists: true } },
				{ userName: userDto.userName },
				{ type: { $in: [types.DRIVER, types.PEDDLER] } },
			],
		});

		if (foundUser) {
			if (foundUser.isDriver()) {
				if (!foundUser.isActiveUser()) {
					return Result.fail(
						new AppError({
							message: errMessages.disabledAccount,
							name: errorCodes.DisabledAccountError.name,
							statusCode: errorCodes.DisabledAccountError.statusCode,
						})
					);
				}

				if (foundUser.isDeletedUser()) {
					return Result.fail(
						new AppError({
							message: errMessages.deletedAccount,
							name: errorCodes.DeletedAccountError.name,
							statusCode: errorCodes.DeletedAccountError.statusCode,
						})
					);
				}
			}
			const isPasswordMatch = await foundUser.comparePassword(userDto.password);

			if (isPasswordMatch) {
				const objRepr = foundUser.toDto();

				let token;
				if (foundUser.isPeddler()) {
					token = generateJwtToken(
						{ ...objRepr, permission: permissions.PERM000 },
						"1h"
					);

					eventEmitter.emit(eventTypes.loggedIn, foundUser);
				} else {
					token = generateJwtToken(objRepr);
				}

				objRepr.token = token;

				return Result.ok(objRepr);
			} else {
				return Result.fail(
					new AppError({
						message: errMessages.incorrectPassword,
						name: errorCodes.IncorrectPasswordError.name,
						statusCode: errorCodes.IncorrectPasswordError.statusCode,
					})
				);
			}
		} else {
			return Result.fail(
				new AppError({
					message: errMessages.incorrectUsername,
					name: errorCodes.IncorrectUsernameError.name,
					statusCode: errorCodes.IncorrectUsernameError.statusCode,
				})
			);
		}
	}

	async adminSignIn(userDto) {
		const { userMapper } = this.mappers;

		let foundUser = await userMapper.findUser({
			email: userDto.email,
			type: types.ADMIN,
		});

		if (foundUser) {
			const isPasswordMatch = await foundUser.comparePassword(userDto.password);

			if (isPasswordMatch) {
				const objRepr = foundUser.toDto();
				const token = generateJwtToken({ ...objRepr });
				objRepr.token = token;

				return Result.ok(objRepr);
			} else {
				return Result.fail(
					new AppError({
						message: errMessages.incorrectPassword,
						name: errorCodes.IncorrectPasswordError.name,
						statusCode: errorCodes.IncorrectPasswordError.statusCode,
					})
				);
			}
		} else {
			return Result.fail(
				new AppError({
					message: errMessages.incorrectEmail,
					name: errorCodes.IncorrectEmailError.name,
					statusCode: errorCodes.IncorrectEmailError.statusCode,
				})
			);
		}
	}

	async peddlerSignUp(userDto) {
		const { userMapper } = this.mappers;

		let foundUser = await userMapper.findUser({
			_id: userDto.id,
		});

		if (foundUser && foundUser.userName) {
			const isPasswordMatch = await foundUser.comparePassword(userDto.password);

			if (isPasswordMatch) {
				const objRepr = foundUser.toDto();
				const token = generateJwtToken({ ...objRepr });
				objRepr.token = token;

				return Result.ok(objRepr);
			} else {
				return Result.fail(
					new AppError({
						message: errMessages.userNameConflict,
						name: errorCodes.NameConflictError.name,
						statusCode: errorCodes.NameConflictError.statusCode,
					})
				);
			}
		} else {
			if (!foundUser.isVerifiedPeddler()) {
				return Result.fail(
					new AppError({
						message: errMessages.unverifiedProfile,
						name: errorCodes.UnverifiedProfileError.name,
						statusCode: errorCodes.UnverifiedProfileError.statusCode,
					})
				);
			} else {
				const userEnt = new PeddlerEnt(userDto);
				const updatedUser = await userMapper.setPasswordAndUserName(
					foundUser.id,
					userEnt
				);

				const objRepr = updatedUser.toDto();
				const token = generateJwtToken({ ...objRepr });
				objRepr.token = token;

				return Result.ok({ ...objRepr });
			}
		}
	}

	async getIncompletePeddlerProfile(userDto) {
		const { userMapper } = this.mappers;

		let foundUser = await userMapper.findUser({
			email: userDto.email,
		});

		if (foundUser) {
			if (foundUser.isVerifiedPeddler()) {
				return Result.fail(
					new AppError({
						message: errMessages.duplicatePeddlerProfile,
						name: errorCodes.DuplicatePeddlerProfile.name,
						statusCode: errorCodes.DuplicatePeddlerProfile.statusCode,
					})
				);
			}

			eventEmitter.emit(eventTypes.peddlerProfileCreated, foundUser);

			const objRepr = foundUser.toDto();
			const token = generateJwtToken({ ...objRepr });
			objRepr.token = token;

			return Result.ok({ ...objRepr });
		} else {
			return Result.fail(
				new AppError({
					message: errMessages.incorrectEmail,
					name: errorCodes.IncorrectEmailError.name,
					statusCode: errorCodes.IncorrectEmailError.statusCode,
				})
			);
		}
	}

	async createPeddlerProfile(userDto) {
		const { userMapper } = this.mappers;

		let foundUser = await userMapper.findUser({
			email: userDto.email,
		});

		if (foundUser) {
			return Result.fail(
				new AppError({
					message: errMessages.emailConflict,
					name: errorCodes.EmailConflictError.name,
					statusCode: errorCodes.EmailConflictError.statusCode,
				})
			);
		} else {
			const userEnt = new PeddlerEnt(userDto);
			const newUser = await userMapper.createUser(userEnt);

			eventEmitter.emit(eventTypes.peddlerProfileCreated, newUser);

			const objRepr = newUser.toDto();
			const token = generateJwtToken({ ...objRepr });
			objRepr.token = token;

			return Result.ok({ ...objRepr });
		}
	}

	async verifyPeddlerCode(userDto) {
		const { userMapper } = this.mappers;

		let foundUser = await userMapper.findUser({
			_id: userDto.id,
			peddlerCode: userDto.peddlerCode,
		});

		if (!foundUser) {
			return Result.fail(
				new AppError({
					message: errMessages.invalidCode,
					name: errorCodes.InvalidCodeError.name,
					statusCode: errorCodes.InvalidCodeError.statusCode,
				})
			);
		} else {
			foundUser.elevatePerm();
			foundUser.isActive = true;
			const updatedUser = await userMapper.updateUserById(
				foundUser.id,
				foundUser
			);

			const objRepr = updatedUser.toDto();

			return Result.ok({ ...objRepr });
		}
	}

	async buyerSignUp(userDto) {
		const { userMapper } = this.mappers;

		let foundUser = await userMapper.findUser({
			email: userDto.email,
		});

		if (foundUser) {
			return Result.fail(
				new AppError({
					message: errMessages.emailConflict,
					name: errorCodes.EmailConflictError.name,
					statusCode: errorCodes.EmailConflictError.statusCode,
				})
			);
		} else {
			const userEnt = new BuyerEnt(userDto);

			if (userEnt.isCorporateBuyer()) {
				userEnt.isActive = false;
			} else {
				userEnt.isActive = true;
			}

			const newUser = await userMapper.createUser(userEnt);

			eventEmitter.emit(eventTypes.buyerCreated, newUser);

			const objRepr = newUser.toDto();
			const token = generateJwtToken({ ...objRepr });
			objRepr.token = token;

			return Result.ok({ ...objRepr });
		}
	}

	async resetUserPassword(newPassword, passwordResetObj) {
		const { userMapper } = this.mappers;

		const userEnt = await userMapper.resetUserPassword(
			newPassword,
			passwordResetObj
		);

		if (userEnt) {
			return Result.ok(userEnt.toDto());
		} else {
			return Result.fail(
				new AppError({
					name: errorCodes.WrongTokensError.name,
					message: errMessages.wrongTokens,
					statusCode: errorCodes.WrongTokensError.statusCode,
				})
			);
		}
	}

	async changePassword(user, inputObj) {
		const { secretMapper, userMapper } = this.mappers;

		const { otpToken, oldPassword, newPassword } = inputObj || {};

		const foundSecret = await secretMapper.findSecret(
			{ userId: user.id },
			(doc) => doc.populate("userId")
		);

		if (foundSecret) {
			const otpSecret = foundSecret.otpSecret;

			const isValidOtp = totp.check(otpToken, otpSecret);

			if (isValidOtp) {
				const isOldPasswordMatch = foundSecret.user.comparePassword(
					oldPassword
				);

				if (isOldPasswordMatch) {
					const updatedUser = await userMapper.updateUser(
						{ _id: user.id },
						{ password: newPassword }
					);

					return Result.ok(updatedUser.toDto());
				} else {
					return Result.fail(
						new AppError({
							name: errorCodes.IncorrectPasswordError.name,
							statusCode: errorCodes.IncorrectPasswordError.statusCode,
							message: errMessages.incorrectPassword,
						})
					);
				}
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

	async initPasswordReset(email) {
		const { userMapper } = this.mappers;

		const userEnt = await userMapper.findUser({ email });

		if (userEnt) {
			const passwordResetToken = userEnt.passwordResetToken;
			const passwordResetExpires = userEnt.passwordResetExpires;

			const isValidToken =
				passwordResetToken &&
				passwordResetExpires &&
				new Date(passwordResetExpires).getTime() > Date.now();

			if (!isValidToken) {
				userEnt.generatePasswordReset();
			}
			// userMapper.updateUserById(userEnt.id, userEnt);

			eventEmitter.emit(eventTypes.sendPasswordResetCode, userEnt);

			return Result.ok({
				id: userEnt.id,
				resetToken: userEnt.passwordResetToken,
				resetExpires: new Date(userEnt.passwordResetExpires),
			});
		} else {
			return Result.fail(
				new AppError({
					name: errorCodes.IncorrectEmailError.name,
					message: errMessages.incorrectEmail,
					statusCode: errorCodes.IncorrectEmailError.statusCode,
				})
			);
		}
	}

	async sendResetCode(passwordResetToken) {
		const { userMapper } = this.mappers;

		const userEnt = await userMapper.findUser({
			$and: [{ passwordResetToken: { $exists: true } }, { passwordResetToken }],
		});

		if (userEnt) {
			const passwordResetToken = userEnt.passwordResetToken;
			const passwordResetExpires = userEnt.passwordResetExpires;

			const isValidToken =
				passwordResetToken &&
				passwordResetExpires &&
				new Date(passwordResetExpires).getTime() > Date.now();

			if (!isValidToken) {
				userEnt.generatePasswordReset();
			}

			eventEmitter.emit(eventTypes.sendPasswordResetCode, userEnt);

			return Result.ok({
				id: userEnt.id,
				resetToken: userEnt.passwordResetToken,
				resetExpires: new Date(userEnt.passwordResetExpires),
			});
		} else {
			return Result.fail(
				new AppError({
					name: "InvalidToken",
					message: "invalid token",
					statusCode: 401,
				})
			);
		}
	}
};
