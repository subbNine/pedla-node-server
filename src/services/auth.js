const { UserEnt } = require("../entities/domain");
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
			$and: [{ email: { $exists: true } }, { email: userDto.email }],
		});

		if (foundUser) {
			const isPasswordMatch = await foundUser.comparePassword(userDto.password);

			if (isPasswordMatch) {
				const objRepr = foundUser.repr();
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
			$and: [{ userName: { $exists: true } }, { userName: userDto.userName }],
		});

		if (foundUser) {
			// console.log.log({foundUser})
			const isPasswordMatch = await foundUser.comparePassword(userDto.password);

			if (isPasswordMatch) {
				const objRepr = foundUser.repr();

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
				const objRepr = foundUser.repr();
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
				const objRepr = foundUser.repr();
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
				const userEnt = new UserEnt(userDto);
				const updatedUser = await userMapper.signup(foundUser.id, userEnt);

				const objRepr = updatedUser.repr();
				const token = generateJwtToken({ ...objRepr });
				objRepr.token = token;

				return Result.ok({ ...objRepr });
			}
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
			const userEnt = new UserEnt(userDto);
			const newUser = await userMapper.createUser(userEnt);

			eventEmitter.emit(eventTypes.peddlerProfileCreated, newUser);

			const objRepr = newUser.repr();
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
			const updatedUser = await userMapper.updateUserById(
				foundUser.id,
				foundUser
			);

			const objRepr = updatedUser.repr();

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
			const userEnt = new UserEnt(userDto);

			if (userEnt.isCorporateBuyer()) {
				userEnt.isActive = false;
			} else {
				userEnt.isActive = true;
			}

			const newUser = await userMapper.createUser(userEnt);

			eventEmitter.emit(eventTypes.buyerCreated, newUser);

			const objRepr = newUser.repr();
			const token = generateJwtToken({ ...objRepr });
			objRepr.token = token;

			return Result.ok({ ...objRepr });
		}
	}

	async resetPassword(newPassword, { passwordResetToken, passwordResetCode }) {
		const { userMapper } = this.mappers;

		const userEnt = await userMapper.updateUser(
			{
				$and: [
					{ passwordResetToken },
					{ passwordResetCode },
					{ passwordResetExpires: { $gt: new Date() } },
				],
			},
			{
				password: newPassword,
				passwordResetCode: undefined,
				passwordResetToken: undefined,
				passwordResetExpires: undefined,
			}
		);

		if (userEnt) {
			return Result.ok(userEnt.repr());
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
