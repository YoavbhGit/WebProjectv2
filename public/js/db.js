const dotenv = require('dotenv')
dotenv.config({ path: './public/config/config.env' })

// Connection URL
const url = process.env.MONGO_URI
// Database Name
const dbName = process.env.MONGO_DB_NAME
const uri = 'mongodb://localhost:27017' //myimdb'
const { MongoClient } = require('mongodb') //.MongoClient
var database = null

const { MONGO_URI, MONGO_DB_NAME } = process.env

// const connectDB = async () => {
// 	console.log("@@@@@@@@@@@@@@@@@@@")
// 	try {
// 		MongoClient.connect(uri, (err, db) => {
// 			if (err) {
// 				console.error('ERROR: 2134213213', err)
// 				process.exit(1)
// 			}
// 			console.log("Connected to DB successfully")
// 			return db
// 		})
// 	} catch (e) {
// 		console.error('ERROR: 9999999', err)
// 		throw e
// 	}
// }

const client = new MongoClient(uri);
const getDB = async function run() {
  try {
    await client.connect();
    const database = client.db('myimdb');
	if (!database) {
		console.error(`DB Not Found!`)
		process.exit(2)
	}
    console.log("Connected Successfully to DB!");
	return await database;
  }catch (e){
	  console.log('Connection to DB Failed')
	  throw e
  } 
}

const disconnectDB = () => {
	database.close()
}

async function createUser(username, password, database) {
	const user = { username: username, password: password }
	database.collection('Users').insertOne(user, (err, res) => {
		if (err)
			return false

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
