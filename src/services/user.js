const { UserEnt } = require("../entities/domain");
const { utils } = require("../lib");
const { eventEmitter, eventTypes } = require("../events");

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

	updateProfile() {}

	getProfile() {}

	verifyPeddler() {}

	verifyBuyer() {}

	toggleOnline() {}

	toggleOffline() {}
};
