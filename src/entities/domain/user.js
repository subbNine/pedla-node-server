const bcrypt = require("bcrypt");
const crypto = require("crypto");
const isType = require("../../lib/utils/is-type");
const { permissions, types, buyerTypes } = require("../../db/mongo/enums").user;

module.exports = class User {
	id;
	firstName;
	lastName;
	email;
	phoneNumber;
	permission;
	createdAt;
	type;
	presence;
	latlon;
	isActive;
	password;
	avatarImg;
	address;
	passwordResetToken;
	passwordResetExpires;
	passwordResetCode;
	userName;

	constructor(fields) {
		if (fields)
			for (let key in fields) {
				this[key] = fields[key];
			}
	}

	isOtpVerifiedUser() {
		const permission = this.permission;

		if (
			permission >= permissions.PERM000 &&
			permission <= permissions.PERM002
		) {
			if (permission !== permissions.PERM000) {
				return true;
			}
		}
		return false;
	}

	generatePasswordReset() {
		this.passwordResetToken = crypto.randomBytes(20).toString("hex");
		this.passwordResetExpires = Date.now() + 3600000; //expires in an hour
	}

	isApprovedUser() {
		const permission = this.permission;

		if (permission) {
			if (permission > permissions.PERM001) {
				return true;
			}
		}
		return false;
	}

	isDriver() {
		return this.type === types.DRIVER;
	}

	isPeddler() {
		return this.type === types.PEDDLER;
	}

	isBuyer() {
		return this.type === types.BUYER;
	}

	isCorporateBuyer() {
		return this.buyerType === buyerTypes.CORPORATE;
	}

	isAdmin() {
		return this.type === types.ADMIN;
	}

	elevatePerm() {
		const currentPermission = this.permission;
		if (
			currentPermission >= permissions.PERM000 &&
			currentPermission < permissions.PERM002
		) {
			this.permission = currentPermission + 1;
		}
	}

	isVerifiedPeddler() {
		return this.peddlerCode && this.permission > permissions.PERM001;
	}

	isActiveUser() {
		return !!this.isActive;
	}

	isDeletedUser() {
		return !!this.isDeleted;
	}

	comparePassword(candidatePassword, done) {
		return new Promise((resolve, reject) => {
			bcrypt.compare(candidatePassword, this.password, (err, matched) => {
				if (err) {
					reject(err);
					if (done) {
						return done(err);
					}
				}

				resolve(matched);
				if (done) {
					return done(null, matched);
				}
			});
		});
	}

	toDto() {
		const dto = {};

		dto.id = this.id || null;
		dto.firstName = this.firstName || null;
		dto.lastName = this.lastName || null;
		dto.avatarImg =
			(isType("object", this.avatarImg) && this.avatarImg.uri) ||
			this.avatarImg ||
			null;
		dto.presence = this.presence || null;
		dto.type = this.type || null;
		dto.permission = this.permission || null;
		dto.isActive = this.isActive || false;
		dto.phoneNumber = this.phoneNumber || null;
		dto.email = this.email || null;
		dto.address = this.address || null;
		dto.userName = this.userName || null;
		dto.truck = this.truck && this.truck.toDto
			? this.truck.toDto()
			: this.truck
		if (this.latlon) {
			dto.latlon = {
				lon: this.latlon.coordinates[0],
				lat: this.latlon.coordinates[1],
			};
		} else {
			dto.latlon = this.latlon;
		}
		if (this.passwordResetToken) {
			dto.passwordResetToken = this.passwordResetToken;
		}

		return dto;
	}
};
