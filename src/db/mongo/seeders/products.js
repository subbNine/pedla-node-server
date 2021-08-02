const Product = require("../models/product");
const { Seeder } = require("mongoose-data-seed");

const products = { AGO: "AGO", PMS: "PMS", LPG: "LPG", DPK: "DPK" };

const data = [
	{
		name: products.AGO,
		description: "Automotive Gas Oil (Diesel)",
		createdAt: Date.now(),
	},
	{
		name: products.PMS,
		description: "Premium Motor Spirit (Petrol)",
		createdAt: Date.now(),
	},
	{
		name: products.LPG,
		description: "Liquefied Petroleum Gas (Gas)",
		createdAt: Date.now(),
	},
	{
		name: products.DPK,
		description: "Dual Purpose Kerosine (Kerosine)",
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
