const { UserEnt } = require("../entities/domain");
const { utils } = require("../lib");
const { eventEmitter, eventTypes } = require("../events");
const { permissions } = require("../db/mongo/enums/user");

const { Result, generateJwtToken } = utils;

module.exports = class User {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async updateUser(userDto) {
		const { userMapper } = this.mappers;
		const userEnt = new UserEnt(userDto);

		let updatedUser = await userMapper.updateUserById(userEnt.id, userEnt);

		if (updatedUser) {
			eventEmitter.emit(eventTypes.userProfileCreated, updatedUser);

			const objRepr = updatedUser.repr();
			const token = generateJwtToken(objRepr);
			return Result.ok({ ...objRepr, token });
		}
	}

	async verifyRegisteredPeddler(userDto) {
		const { userMapper } = this.mappers;
		const userEnt = new UserEnt(userDto);

		userEnt.permission = permissions.PERM001;
		userEnt.isActivePeddler = true;
		let updatedUser = await userMapper.updateUserById(userEnt.id, userEnt);

		if (updatedUser) {
			eventEmitter.emit(eventTypes.peddlerVerified, updatedUser);

			const objRepr = updatedUser.repr();
			return Result.ok({ ...objRepr });
		}
	}

	async rejectRegisteredPeddler(userDto) {
		const { userMapper } = this.mappers;

		userDto.isActivePeddler = false;

		const userEnt = new UserEnt(userDto);

		userEnt.isActivePeddler = false;

		let updatedUser = await userMapper.updateUserById(userEnt.id, userEnt);

		if (updatedUser) {
			eventEmitter.emit(eventTypes.peddlerRejected, updatedUser);

			const objRepr = updatedUser.repr();
			return Result.ok({ ...objRepr });
		}
	}

	async getPeddlers(status) {
		const { userMapper } = this.mappers;

		const peddlers = await userMapper.findPeddlersByVStatus(status);

		if (peddlers) {
			return Result.ok(peddlers.map((eachUser) => eachUser.repr()));
		} else {
			return Result.ok([]);
		}
	}

	async getProfile(userId) {
		const { userMapper } = this.mappers;

		const user = await userMapper.findUser({ _id: userId });

		if (user) {
			return Result.ok(user.repr());
		}
	}

	async updateProfile(userDto) {
		const { userMapper } = this.mappers;
		const userEnt = new UserEnt(userDto);

		let updatedUser = await userMapper.updateUserById(userEnt.id, userEnt);

		if (updatedUser) {
			const objRepr = updatedUser.repr();
			return Result.ok({ ...objRepr });
		}
	}

	async togglePresence(userDto) {
		const { userMapper } = this.mappers;
		const userEnt = new UserEnt(userDto);

		let updatedUser = await userMapper.updateUserById(userEnt.id, userEnt);

		if (updatedUser) {
			const objRepr = updatedUser.repr();
			return Result.ok({ id: objRepr.id, presence: objRepr.presence });
		}
	}

	async checkUserExistence(userDto) {
		const { userMapper } = this.mappers;
		const userEnt = new UserEnt(userDto);

		let user = await userMapper.searchFor(userEnt);

		if (user) {
			return Result.ok(true);
		} else {
			return Result.ok(false);
		}
	}
};
