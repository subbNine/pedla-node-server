const BaseController = require("./base");
const { UserDto } = require("../../entities/dtos");
const { user: userService } = require("../../services");
const {
	types: userTypes,
	presence,
	permissions,
} = require("../../db/mongo/enums").user;

module.exports = class User extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
	}

	async createBuyerProfile(req, res, next) {
		const {
			firstName,
			lastName,
			password,
			email,
			address,
			phoneNumber,
		} = req.body;

		const { user } = req._App;

		const userDto = new UserDto();
		userDto.address = address;
		userDto.firstName = firstName;
		userDto.lastName = lastName;
		userDto.password = password;
		userDto.email = email;
		userDto.phoneNumber = phoneNumber;
		userDto.type = userTypes.BUYER;
		userDto.id = user.id;

		const result = await userService.updateUser(userDto);

		return this.response(result, res);
	}

	async verifyRegisteredPeddler(req, res, next) {
		const userDto = new UserDto();

		const { peddlerId } = req.params;

		userDto.id = peddlerId;

		const result = await userService.verifyRegisteredPeddler(userDto);

		return this.response(result, res);
	}

	async rejectRegisteredPeddler(req, res, next) {
		const userDto = new UserDto();

		const { peddlerId } = req.params;

		userDto.id = peddlerId;

		const result = await userService.rejectRegisteredPeddler(userDto);

		return this.response(result, res);
	}

	async getPeddlers(req, res, next) {
		const { vstatus: status } = req.query;

		const result = await userService.getPeddlers(status);

		return this.response(result, res);
	}

	async getProfile(req, res, next) {
		const { user } = req._App;
		const { userId } = req.params;

		const result = await userService.getProfile(userId || user.id);

		return this.response(result, res);
	}

	async checkUserExistence(req, res, next) {
		const userDto = new UserDto();

		const { email, userName } = req.query;

		userDto.email = email;
		userDto.userName = userName;

		const result = await userService.checkUserExistence(userDto);

		return this.response(result, res);
	}

	async updateProfile(req, res, next) {
		const userDto = new UserDto();

		const { user } = req._App;
		const { firstName, lastName, address, phoneNumber } = req.body;

		userDto.address = address;
		userDto.firstName = firstName;
		userDto.lastName = lastName;
		userDto.phoneNumber = phoneNumber;
		userDto.id = user.id;

		const result = await userService.updateProfile(userDto);

		return this.response(result, res);
	}

	async setOnline(req, res, next) {
		const userDto = new UserDto();

		const { user } = req._App;

		userDto.id = user.id;
		userDto.presence = presence.ONLINE;

		const result = await userService.togglePresence(userDto);

		return this.response(result, res);
	}

	async setOffline(req, res, next) {
		const userDto = new UserDto();

		const { user } = req._App;

		userDto.id = user.id;
		userDto.presence = presence.OFFLINE;

		const result = await userService.togglePresence(userDto);
		return this.response(result, res);
	}

	async createDriver(req, res, next) {
		const userDto = new UserDto();

		const { user } = req._App;
		const {
			firstName,
			lastName,
			password,
			phoneNumber,
			userName,
		} = req.body;

		userDto.firstName = firstName;
		userDto.lastName = lastName;
		userDto.phoneNumber = phoneNumber;
		userDto.userName = userName;
		userDto.password = password;
		userDto.peddler = user.id;
		userDto.type = userTypes.DRIVER;
		userDto.permission = permissions.PERM002;

		const { public_id, secure_url } = req.file || {};

		if (public_id && secure_url) {
			const avatarImg = {
				imgId: public_id,
				uri: secure_url,
			};

			userDto.avatarImg = avatarImg;
		}

		const result = await userService.createDriver(userDto, user);

		return this.response(result, res);
	}

	async updateDriver(req, res, next) {
		const userDto = new UserDto();

		const { driverId } = req.params;

		const { user } = req._App;
		const {
			firstName,
			lastName,
			password,
			phoneNumber,
			userName,
		} = req.body;

		userDto.firstName = firstName;
		userDto.lastName = lastName;
		userDto.phoneNumber = phoneNumber;
		userDto.userName = userName;
		userDto.password = password;
		userDto.id = driverId;

		const { public_id, secure_url } = req.file || {};

		if (public_id && secure_url) {
			const avatarImg = {
				imgId: public_id,
				uri: secure_url,
			};

			userDto.avatarImg = avatarImg;
		}

		const result = await userService.updateDriver(userDto, user);

		return this.response(result, res);
	}

	async getDrivers(req, res, next) {
		const { peddlerId } = req.params;

		const userDto = new UserDto();

		const { user } = req._App;

		userDto.peddler = peddlerId || user.id;

		const result = await userService.findDrivers(userDto);

		this.response(result, res);
	}

	async getOnlinePeddlers(req, res, next) {}
};
