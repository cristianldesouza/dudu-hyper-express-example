const IP_MONGO = 'mongodb://localhost:27017/';

const mongoClient = require('mongodb').MongoClient;

const client = mongoClient.connect(IP_MONGO);
const dbName = 'dudu-example';

class MongoDatabase {
	async get(table, where = {}) {
		return new Promise(async (resolve) => {
			client.then(async (db) => {
				const database = db.db(dbName);
				const items = await database.collection(table).find(where).toArray();

				if (Array.isArray(items)) {
					return resolve(items);
				} else {
					return resolve([]);
				}
			});
		});
	}

	async post(table, data) {
		return new Promise(async (resolve) => {
			client.then(async (db) => {
				const database = db.db(dbName);
				await database.collection(table).insertOne(data);
				return resolve();
			});
		});
	}

	async postMany(table, data) {
		return new Promise(async (resolve) => {
			client.then(async (db) => {
				const database = db.db(dbName);
				await database.collection(table).insertMany(data);
				return resolve();
			});
		});
	}

	async upsertReplace(table, where, data) {
		return new Promise(async (resolve) => {
			client.then(async (db) => {
				const database = db.db(dbName);
				await database.collection(table).replaceOne(where, data, { upsert: true });
				return resolve();
			});
		});
	}

	async upsertUpdate(table, where, data) {
		return new Promise(async (resolve) => {
			client.then(async (db) => {
				const database = db.db(dbName);
				await database.collection(table).updateOne(where, { $set: data }, { upsert: true });
				return resolve();
			});
		});
	}

	async update(table, where, content) {
		return new Promise(async (resolve) => {
			client.then(async (db) => {
				const database = db.db(dbName);
				await database.collection(table).updateMany(where, { $set: content });
				return resolve();
			});
		});
	}

	async increment(table, where, content) {
		return new Promise(async (resolve) => {
			client.then(async (db) => {
				const database = db.db(dbName);
				await database.collection(table).updateOne(where, { $inc: content });
				return resolve();
			});
		});
	}

	async delete(table, where) {
		return new Promise(async (resolve) => {
			client.then(async (db) => {
				const database = db.db(dbName);
				await database.collection(table).deleteMany(where);
				return resolve();
			});
		});
	}

	async postReturnId(table, data) {
		return new Promise(async (resolve) => {
			client.then(async (db) => {
				const database = db.db(dbName);
				let item = await database.collection(table).insertOne(data);
				return resolve(item?.insertedId || false);
			});
		});
	}
}

module.exports = new MongoDatabase();
