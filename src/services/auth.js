const { UserEnt } = require("../entities/domain");
const { utils, error } = require("../lib");
const { eventEmitter, eventTypes } = require("../events");
const {
	user: { permissions },
} = require("../db/mongo/enums");

const AppError = error.AppError;
const errorCodes = error.errorCodes;
const errMessages = error.messages;
const { Result, generateJwtToken } = utils;

module.exports = class Auth {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async signin(userDto) {
		const { userMapper } = this.mappers;

		let foundUser = await userMapper.findUser({
			userName: userDto.userName,
		});

		if (foundUser) {
			const isPasswordMatch = await foundUser.comparePassword(
				userDto.password
			);

			if (isPasswordMatch) {
				const objRepr = foundUser.repr();
				const token = generateJwtToken(
					{ ...objRepr, permission: permissions.PERM000 },
					"1h"
				);

				objRepr.token = token;
				eventEmitter.emit(eventTypes.loggedIn, foundUser);

				return Result.ok(objRepr);
			} else {
				return Result.fail(
					new AppError({
						message: errMessages.incorrectPassword,
						name: errorCodes.IncorrectPasswordError.name,
						statusCode:
							errorCodes.IncorrectPasswordError.statusCode,
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

	async signup(userDto) {
		const { userMapper } = this.mappers;

		let foundUser = await userMapper.findUser({
			userName: userDto.userName,
		});

		if (foundUser) {
			const isPasswordMatch = await foundUser.comparePassword(
				userDto.password
			);

			if (isPasswordMatch) {
				const objRepr = foundUser.repr();
				const token = generateJwtToken({ ...objRepr });
				objRepr.token = token;

				return Result.ok(objRepr);
			} else {
				return Result.fail(
					new AppError({
						message: errMessages.emailConflict,
						name: errorCodes.EmailConflictError.name,
						statusCode: errorCodes.EmailConflictError.statusCode,
					})
				);
			}
		} else {
			const userEnt = new UserEnt(userDto);
			const newUser = await userMapper.createUser(userEnt);

			const objRepr = newUser.repr();
			const token = generateJwtToken({ ...objRepr });
			objRepr.token = token;

			return Result.ok({ ...objRepr });
		}
	}
};
