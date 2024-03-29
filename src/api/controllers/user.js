const BaseController = require("./base");
const { UserDto, GeoDto } = require("../../entities/dtos");
const { user: userService } = require("../../services");
const {
	types: userTypes,
	presence,
	permissions,
} = require("../../db/mongo/enums").user;
const { eventEmitter, eventTypes } = require("../../events");
const { Result } = require("../../lib/utils");

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

		const result = await userService.updateBuyer(userDto);

		return this.response(result, res);
	}

	async getCorporateBuyers(req, res, next) {
		const { limit, page, active } = req.query;

		const result = await userService.getCorporateBuyers({
			isActive: +active,
			pagination: { limit, page },
		});

		return this.response(result, res);
	}

	async activateCorporateBuyer(req, res, next) {
		const userDto = new UserDto();

		const { buyerId } = req.params;

		userDto.id = buyerId;

		const result = await userService.activateCorporateBuyer(userDto);

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
		const { vstatus: status, limit, page } = req.query;

		const result = await userService.getPeddlers(status, {
			pagination: { limit, page },
		});

		return this.response(result, res);
	}

	async getProfile(req, res, next) {
		const { user } = req._App;
		const { userId } = req.params;

		const result = await userService.getProfile(userId || user.id);

		return this.response(result, res);
	}

	async userExists(req, res, next) {
		const userDto = new UserDto();

		const { email, userName } = req.query;

		userDto.email = email;
		userDto.userName = userName;

		const result = await userService.userExists(userDto);

		return this.response(result, res);
	}

	async uploadFile(req, res, next) {
		const { secure_url } = req.file || {};

		let file;
		if (secure_url) {
			file = secure_url;
		}

		return this.response(Result.ok({ url: file }), res);
	}

	async updateProfile(req, res, next) {
		const userDto = new UserDto();

		const { user } = req._App;
		const {
			firstName,
			lastName,
			address,
			phoneNumber,
			platform,
			deviceToken,
			avatarUrl,
		} = req.body;

		if (address) {
			userDto.address = address;
		}

		if (firstName) {
			userDto.firstName = firstName;
		}

		if (lastName) {
			userDto.lastName = lastName;
		}

		if (phoneNumber) {
			userDto.phoneNumber = phoneNumber;
		}

		if (avatarUrl) {
			const avatarImg = {
				imgId: "" + Date.now(),
				uri: avatarUrl,
			};

			userDto.avatarImg = avatarImg;
		}

		userDto.id = user.id;

		const result = await userService.updateProfile(userDto);

		if (deviceToken) {
			eventEmitter.emit(eventTypes.updatePushDevice, {
				platform,
				deviceToken,
				user: user.id,
			});
		}

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
		const { firstName, lastName, password, phoneNumber, userName } = req.body;

		userDto.firstName = firstName;
		userDto.lastName = lastName;
		userDto.phoneNumber = phoneNumber;
		userDto.userName = userName;
		userDto.password = password;
		userDto.peddler = user.id;
		userDto.type = userTypes.DRIVER;
		userDto.permission = permissions.PERM002;
		userDto.peddlerCode = user.peddlerCode;

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
		const { firstName, lastName, password, phoneNumber, userName } = req.body;

		userDto.firstName = firstName;
		userDto.lastName = lastName;
		userDto.phoneNumber = phoneNumber;
		userDto.userName = userName;
		userDto.password = password;
		userDto.id = driverId;
		userDto.peddlerCode = user.peddlerCode;

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

		const result = await userService.getDrivers(userDto);

		this.response(result, res);
	}

	async getUsers(req, res, next) {
		const { types, limit, page } = req.query;

		const listOfUserTypes = types
			? types
					.split(/,|\s+|\+/)
					.map((userType) => ("" + userType).toUpperCase().trim())
			: Object.values(userTypes);

		const result = await userService.getUsers(listOfUserTypes, {
			pagination: { limit, page },
		});

		this.response(result, res);
	}

	async countUsers(req, res, next) {
		const { types } = req.query;

		const listOfUserTypes = types
			? types
					.split(/,|\s+|\+/)
					.map((userType) => ("" + userType).toUpperCase().trim())
			: Object.values(userTypes);

		const result = await userService.nUsers(listOfUserTypes);

		this.response(result, res);
	}

	async searchForProductDrivers(req, res, next) {
		const { productId, quantity, page, limit, lat, lon, radius } = req.body;

		const geoDto = new GeoDto();

		let coordinates = [+lon, +lat];

		const latlon = {
			type: "Point",
			coordinates,
		};

		geoDto.latlon = latlon;
		geoDto.radius = radius;

		const result = await userService.searchForProductDrivers(
			{ productId, quantity, geo: geoDto },
			{ pagination: { page, limit: limit || 10 } }
		);

		this.response(result, res);
	}

	async getSupportAgents(req, res, next) {
		const result = await userService.getSupportAgents();

		this.response(result, res);
	}

	async disableDriver(req, res, next) {
		const { driverId } = req.params;

		const result = await userService.disableDriver(driverId);

		this.response(result, res);
	}

	async enableDriver(req, res, next) {
		const { driverId } = req.params;

		const result = await userService.enableDriver(driverId);

		this.response(result, res);
	}

	async deleteDriver(req, res, next) {
		const { driverId } = req.params;

		const result = await userService.deleteDriver(driverId);

		this.response(result, res);
	}

	async getPeddlerOnlineDrivers(req, res, next) {
		const { user: peddler } = req._App;

		const result = await userService.getPeddlerOnlineDrivers(peddler);

		return this.response(result, res);
	}
};
