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
			if (fields[key]) {
				this[key] = fields[key];
			}
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

		objectRepr.id = this.id;
		objectRepr.firstName = this.firstName;
		objectRepr.lastName = this.lastName;
		objectRepr.email = this.email;
		objectRepr.phoneNumber = this.phoneNumber;
		objectRepr.address = this.address;
		objectRepr.permission = this.permission;
		objectRepr.type = this.type;
		objectRepr.avatarImage = this.avatarImage;
		objectRepr.presence = this.presence;
		objectRepr.latlon = this.latlon;
		objectRepr.peddlerCode = this.peddlerCode;
		objectRepr.nTrucks = this.nTrucks;

		if (this.isPeddler()) {
			objectRepr.pooImage = this.pooImage;
			objectRepr.userName = this.userName;
			objectRepr.isActivePeddler = this.isActivePeddler;
		}

		// if (this.id) {
		// 	objectRepr.id = this.id;
		// }
		// if (this.lastName) {
		// 	objectRepr.lastName = this.lastName;
		// }
		// if (this.email) {
		// 	objectRepr.email = this.email;
		// }
		// if (this.phoneNumber) {
		// 	objectRepr.phoneNumber = this.phoneNumber;
		// }
		// if (this.address) {
		// 	objectRepr.address = this.address;
		// }
		// if (this.permission) {
		// 	objectRepr.permission = this.permission;
		// }
		// if (this.firstName) {
		// 	objectRepr.firstName = this.firstName;
		// }
		// if (this.type) {
		// 	objectRepr.type = this.type;
		// }
		// if (this.pooImage) {
		// 	objectRepr.pooImage = this.pooImage;
		// }
		// if (this.avatarImage) {
		// 	objectRepr.avatarImage = this.avatarImage;
		// }
		// if (this.presence) {
		// 	objectRepr.presence = this.presence;
		// }
		// if (this.userName) {
		// 	objectRepr.userName = this.userName;
		// }
		// if (this.latlon) {
		// 	objectRepr.latlon = this.latlon;
		// }
		// if (this.peddlerCode) {
		// 	objectRepr.peddlerCode = this.peddlerCode;
		// }
		// if (this.nTrucks) {
		// 	objectRepr.nTrucks = this.nTrucks;
		// }

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
