const bcrypt = require("bcrypt");

const { permissions, types } = require("../../db/mongo/enums").user;

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
	avatarImage;
	presence;
	userName;
	latlon;
	peddlerCode;
	isActivePeddler;
	nTrucks;

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
		objectRepr.avatarImage = this.avatarImage || null;
		objectRepr.presence = this.presence || null;
		objectRepr.peddlerCode = this.peddlerCode || null;
		objectRepr.nTrucks = this.nTrucks || null;

		if (this.isPeddler()) {
			objectRepr.pooImage = this.pooImage || null;
			objectRepr.userName = this.userName || null;
			objectRepr.isActivePeddler = this.isActivePeddler || null;
		}

		if (this.latlon) {
			objectRepr.latlon = {
				lon: this.latlon.coordinates[0],
				lat: this.latlon.coordinates[1],
			};
		} else {
			objectRepr.latlon = this.latlon;
		}
		console.log({ objectRepr });

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

	isPeddler() {
		return this.type === types.PEDDLER;
	}

	isBuyer() {
		return this.type === types.BUYER;
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
