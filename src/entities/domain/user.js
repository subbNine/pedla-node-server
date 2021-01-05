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
	address;
	password;
	permission;
	createdAt;
	type;
	pooImage;
	avatarImg;
	presence;
	userName;
	latlon;
	peddlerCode;
	isActivePeddler;
	isActive;
	nTrucks;
	peddler;
	truck;
	driverStats;
	corporateBuyerCacImg;
	buyerType;
	passwordResetToken;
	passwordResetExpires;
	passwordResetCode;

	constructor(fields = {}) {
		for (let key in fields) {
			this[key] = fields[key];
		}
	}

	hasProfile() {
		return this.permission > permissions.PERM000;
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

	// object representation of the domain entity.
	repr() {
		const objectRepr = {};

		objectRepr.id = this.id || null;
		objectRepr.firstName = this.firstName || null;
		objectRepr.lastName = this.lastName || null;
		objectRepr.email = this.email || null;
		objectRepr.phoneNumber = this.phoneNumber || null;
		objectRepr.address = this.address || null;
		objectRepr.permission = this.permission || null;
		objectRepr.type = this.type || null;
		objectRepr.avatarImg =
			(isType("object", this.avatarImg) && this.avatarImg.uri) ||
			this.avatarImg ||
			null;
		objectRepr.presence = this.presence || null;
		objectRepr.isActive = this.isActive || false;

		if (this.passwordResetToken) {
			objectRepr.passwordResetToken = this.passwordResetToken;
		}

		if (this.isPeddler()) {
			objectRepr.peddlerCode = this.peddlerCode || null;
			objectRepr.nTrucks = this.nTrucks || null;
		}

		if (this.isDriver()) {
			objectRepr.peddler =
				(this.peddler && this.peddler.repr
					? this.peddler.repr()
					: this.peddler) || null;
			objectRepr.driverStats = this.driverStats || null;
		}

		if (this.isBuyer()) {
			objectRepr.cacUrl =
				(isType("object", this.corporateBuyerCacImg) &&
					this.corporateBuyerCacImg.uri) ||
				this.corporateBuyerCacImg ||
				null;
			objectRepr.buyerType = ("" + this.buyerType).toLowerCase();
		}

		if (this.isPeddler()) {
			objectRepr.pooImage =
				(isType("object", this.pooImage) && this.pooImage.uri) ||
				this.pooImage ||
				null;
			objectRepr.userName = this.userName || null;
			objectRepr.isActivePeddler = this.isActivePeddler || null;
		}

		if (this.isDriver()) {
			objectRepr.userName = this.userName || null;
			objectRepr.truck = this.truck || null;
		}

		if (!this.isPeddler()) {
			if (this.latlon) {
				objectRepr.latlon = {
					lon: this.latlon.coordinates[0],
					lat: this.latlon.coordinates[1],
				};
			} else {
				objectRepr.latlon = this.latlon;
			}
		}

		return objectRepr;
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

	comparePassword(candidatePassword, done) {
		return new Promise((resolve, reject) => {
			bcrypt.compare(candidatePassword, this.password, (err, matched) => {
				if (err) {
					reject(err);
					if (done) {
						return done(err);
					}
				}
				console.log({
					candidatePassword,
					inputPassword: this.password,
				});
				resolve(matched);
				if (done) {
					return done(null, matched);
				}
			});
		});
	}
};
