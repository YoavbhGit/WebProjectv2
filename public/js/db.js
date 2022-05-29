const dotenv = require('dotenv')
dotenv.config({ path: './public/config/config.env' })

// Connection URL
const url = process.env.MONGO_URI
// Database Name
const dbName = process.env.MONGO_DB_NAME
const uri = 'mongodb://127.0.0.1:27017/myimdb'
const MongoClient = require('mongodb').MongoClient
var _db = null

const { MONGO_URI, MONGO_DB_NAME } = process.env

const connectDB = async () => {
	try {
		MongoClient.connect(uri, (err, db) => {
			if (err) {
				console.error('ERROR: 2134213213', err)
				process.exit(1)
			}
			return db
		})
	} catch (e) {
		throw e
	}
}

// initialize db object if not exists and return it
const getDB = async () => {
	if (!_db) {
		_db = await connectDB()

		if (!_db) {
			console.error(`DB Not Found`)
			process.exit(2)
		}
	}

	return _db
}

const disconnectDB = () => {
	_db.close()
}

;(async function () {
	_db = await getDB()
})()

const createUser = async (username, password) => {
	const user = { username: username, password: password }
	_db.collection('users').insertOne(user, (err, res) => {
		if (err) return false

		console.log('1 user inserted: ' + res)
		return true
	})
}

module.exports = { getDB, createUser }

// var MongoDB = require( './public/js/db');
// MongoDB.connectDB(async (err) => {
//     if (err) throw err;
//     // Load db & collections
//     var db = MongoDB.getDB();
//     db = db.db(dbName);
//     //Write your db action here

//     MongoDB.disconnectDB();
// });

//############################### Print DB as JSON ##########################
// const getCircularReplacer = () => {
//     const seen = new WeakSet();
//     return (key, value) => {
//       if (typeof value === 'object' && value !== null) {
//         if (seen.has(value)) {
//           return;
//         }
//         seen.add(value);
//       }
//       return value;
//     };
//   };

//   database.name = database;

//   const result = JSON.stringify(database, getCircularReplacer());
//   console.log(result);
