const faker = require("faker");
const User = require("../models/user");
const Product = require("../models/product");
const PeddlerProduct = require("../models/peddler-product");
const { Seeder } = require("mongoose-data-seed");

const products = { AGO: "AGO", PMS: "PMS", LPG: "LPG", DPK: "DPK" };
const userTypes = { BUYER: "BUYER", PEDDLER: "PEDDLER", ADMIN: "ADMIN" };

const data = [
	{
		name: products.AGO,
		description: faker.lorem.sentence(),
		createdAt: Date.now(),
	},
	{
		name: products.PMS,
		description: faker.lorem.sentence(),
		createdAt: Date.now(),
	},
	{
		name: products.LPG,
		description: faker.lorem.sentence(),
		createdAt: Date.now(),
	},
];

class ProductsSeeder extends Seeder {
	async shouldRun() {
		const peddlers = await User.find({
			$and: [{ type: userTypes.PEDDLER }, { permission: 2 }],
		}).limit(4);

		if (peddlers) {
			for (const peddler of peddlers) {
				for (let i = 0; i < 4; i++) {
					const productName = Object.values(products)[i];
					const productDoc = await Product.findOne({
						name: productName,
					});

					const productCommAmt = faker.random.number({
						min: 200,
						max: 400,
					});
					const productCommOnCrAmt = faker.random.number({
						min: productCommAmt,
						max: 500,
					});
					const productResAmt = faker.random.number({
						min: productCommAmt,
						max: 600,
					});

					const peddlerproduct = {
						peddlerId: peddler._id,
						productId: productDoc._id,
						residentialAmt: productResAmt,
						commercialAmt: productCommAmt,
						commercialOnCrAmt: productCommOnCrAmt,
					};

					data.push(peddlerproduct);
				}
			}
		}

		return data.length;
	}

	async run() {
		return await PeddlerProduct.insertMany(data);
	}
}

module.exports = ProductsSeeder;
