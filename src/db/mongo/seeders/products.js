const faker = require("faker");
const Product = require("../models/product");
const { Seeder } = require("mongoose-data-seed");

const products = { AGO: "AGO", PMS: "PMS", LPG: "LPG", DPK: "DPK" };

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
	{
		name: products.DPK,
		description: faker.lorem.sentence(),
		createdAt: Date.now(),
	},
];

class ProductsSeeder extends Seeder {
	async shouldRun() {
		return data.length;
	}

	async run() {
		return Product.insertMany(data);
	}
}

module.exports = ProductsSeeder;
