const faker = require("faker");
const User = require("../models/user");
const { Seeder } = require("mongoose-data-seed");
const { select } = require("./helpers");

const userTypes = { BUYER: "BUYER", PEDDLER: "PEDDLER", ADMIN: "ADMIN" };

const data = [];

class UsersSeeder extends Seeder {
	async shouldRun() {
		for (let i = 0; i < 20; i++) {
			const [userType] = select(userTypes),
				firstName = faker.name.firstName(),
				lastName = faker.name.lastName();

			const user = {
				firstName,
				lastName,
				email: faker.internet.email(),
				phoneNumber: faker.phone.phoneNumber(),
				permission: Math.round(Math.random() * 2 + 1),
				password: 123456,
				streetAddress: faker.address.streetAddress(),
				createdAt: Date.now(),
				type: userType,
				nTrucks: faker.random.number(10),
				userName: faker.internet.userName(firstName, lastName),
			};

			data.push(user);
		}

		return data.length;
	}

	async run() {
		let count = 1
		for(const user of data){
			await User.create(user)
			count+=1
		}
		return count
	}
}

module.exports = UsersSeeder;
