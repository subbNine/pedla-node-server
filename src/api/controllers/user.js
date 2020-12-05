const BaseController = require("./base");
const { UserDto } = require("../../entities/dtos");
const { user: userService } = require("../../services");
const { types: userTypes } = require("../../db/mongo/enums").user;

module.exports = class Otp extends BaseController {
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

	async createPeddlerProfile(req, res, next) {
		const userDto = new UserDto();
		const {
			firstName,
			lastName,
			password,
			email,
			address,
			phoneNumber,
			nTrucks,
		} = req.body;

		const { user } = req._App;

		let pooImages;

		if (req.files) {
			pooImages = req.files.map((file) => {
				const { public_id, secure_url } = file;
				return {
					imgId: public_id,
					uri: secure_url,
				};
			});
		}

		userDto.address = address;
		userDto.firstName = firstName;
		userDto.lastName = lastName;
		userDto.password = password;
		userDto.email = email;
		userDto.phoneNumber = phoneNumber;
		userDto.type = userTypes.PEDDLER;
		userDto.pooImages = pooImages;
		userDto.nTrucks = nTrucks;
		userDto.id = user.id;

		const result = await userService.updateUser(userDto);

		return this.response(result, res);
	}

	async verifyRegisteredUser(req, res, next) {}

	async getProfile(req, res, next) {}

	async updateProfile(req, res, next) {}

	async toggleOnline(req, res, next) {}

	async toggleOffline(req, res, next) {}

	async getOnlinePeddlers(req, res, next) {}
};
