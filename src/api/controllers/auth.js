const BaseController = require("./base");
const { UserDto } = require("../../entities/dtos");
const { auth: authService } = require("../../services");
const { types: userTypes } = require("../../db/mongo/enums").user;

module.exports = class Auth extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
	}

	async signIn(req, res, next) {
		const { userName, password } = req.body;

		const userDto = new UserDto();
		userDto.userName = userName;
		userDto.password = password;

		const result = await authService.login(userDto);
		return this.response(result, res);
	}

	async peddlerSignup(req, res, next) {
		const { userName, password } = req.body;

		const userDto = new UserDto();
		userDto.userName = userName;
		userDto.password = password;
		userDto.type = userTypes.PEDDLER;

		const result = await authService.signup(userDto);
		return this.response(result, res);
	}

	async buyerSignup(req, res, next) {
		const { userName, password } = req.body;

		const userDto = new UserDto();
		userDto.userName = userName;
		userDto.password = password;
		userDto.type = userTypes.BUYER;

		const result = await authService.signup(userDto);
		return this.response(result, res);
	}
};
