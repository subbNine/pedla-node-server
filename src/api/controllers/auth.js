const BaseController = require("./base");
const { UserDto } = require("../../entities/dtos");
const { auth: authService } = require("../../services");
const { buyerTypes } = require("../../db/mongo/enums/user");
const { types: userTypes } = require("../../db/mongo/enums").user;

module.exports = class Auth extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
	}

	async signIn(req, res, next) {
		const { email, password } = req.body;

		const userDto = new UserDto();
		userDto.email = email;
		userDto.password = password;

		const result = await authService.signIn(userDto);
		return this.response(result, res);
	}

	async peddlerSignIn(req, res, next) {
		const { userName, password } = req.body;

		const userDto = new UserDto();
		userDto.userName = userName;
		userDto.password = password;

		const result = await authService.peddlerSignIn(userDto);
		return this.response(result, res);
	}

	async adminSignIn(req, res, next) {
		const { email, password } = req.body;

		const userDto = new UserDto();
		userDto.email = email;
		userDto.password = password;

		const result = await authService.adminSignIn(userDto);
		return this.response(result, res);
	}

	async createPeddlerProfile(req, res, next) {
		const userDto = new UserDto();
		const { firstName, lastName, email, phoneNumber, nTrucks } = req.body;

		const { public_id, secure_url } = req.file || {};

		let pooImage;
		if (public_id && secure_url) {
			pooImage = {
				imgId: public_id,
				uri: secure_url,
			};
		}

		userDto.firstName = firstName;
		userDto.lastName = lastName;
		userDto.email = ("" + email).toLowerCase();
		userDto.phoneNumber = phoneNumber;
		userDto.type = userTypes.PEDDLER;
		userDto.pooImage = pooImage;
		userDto.nTrucks = nTrucks;

		const result = await authService.createPeddlerProfile(userDto);

		return this.response(result, res);
	}

	async verifyPeddlerCode(req, res, next) {
		const { code } = req.body;

		const { user } = req._App;

		const userDto = new UserDto();
		userDto.peddlerCode = code;
		userDto.id = user.id;

		const result = await authService.verifyPeddlerCode(userDto);

		return this.response(result, res);
	}

	async peddlerSignUp(req, res, next) {
		const { userName, password } = req.body;

		const { user } = req._App;

		const userDto = new UserDto();
		userDto.userName = userName;
		userDto.password = password;
		userDto.id = user.id;

		const result = await authService.peddlerSignUp(userDto);
		return this.response(result, res);
	}

	async buyerSignUp(req, res, next) {
		const userDto = new UserDto();
		const {
			firstName,
			lastName,
			email,
			address,
			phoneNumber,
			password,
			buyerType,
			cacUrl,
		} = req.body;

		userDto.firstName = firstName;
		userDto.lastName = lastName;
		userDto.email = ("" + email).toLowerCase();
		userDto.phoneNumber = phoneNumber;
		userDto.type = userTypes.BUYER;
		userDto.password = password;
		userDto.address = address;
		userDto.buyerType = buyerType
			? ("" + buyerType).toUpperCase().trim()
			: buyerTypes.REGULAR;

		if (cacUrl) {
			userDto.corporateBuyerCacImg = {
				imgId: Date.now(),
				uri: cacUrl,
			};
		}
		const result = await authService.buyerSignUp(userDto);

		return this.response(result, res);
	}
};
