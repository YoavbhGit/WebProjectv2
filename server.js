const express = require('express')
const app = express()
app.use(express.static('public'))
const dotenv = require('dotenv')
dotenv.config({ path: './public/config/config.env' })
const bodyParser = require('body-parser')
const flash = require('express-flash')
const session = require('express-session')
app.use(
	bodyParser.urlencoded({
		extended: false,
	})
)
app.use(bodyParser.json())
const PORT = process.env.PORT || 3000
var dbName = process.env.MONGO_DB_NAME
const passport = require('passport')
var MongoDB = require('./public/js/db')
var fetchPage = require('./public/js/functions')
var mydbb = async () => {
	const result = await MongoDB.getDB()
	return result
  }
  (async () => {
	console.log(await (await mydbb()).collection('Users'))  
})()

//MongoDB.createUser("yoab", "123",mydbb)
const initializePassport = require('./public/js/passport_config')

initializePassport(passport)

app.use(flash())
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
)
app.use(passport.initialize())
app.use(passport.session())

app.listen(PORT, () => {
	console.log(`Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`)
})

// ------------------------------------------------------------------------
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/html/index.html')
})

app.post('/signup', async (req, res) => {
	// test to return an error
	res.send({
		error: 'ERROR MSG',
	})

	try {
		var username = req.body.username
		var password = req.body.password
		console.log('username:', username)
		console.log('password:', password)

		const userCreated = await MongoDB.createUser(username, password)

		if (userCreated) {
			console.log(`User ${username} Created!`)
		} else {
			console.error(`ERROR: User ${username} Creation Failed`)
		}

		// MongoDB.connectDB(async (err) => {
		// 	if (err) throw err

		// 	var db = MongoDB.getDB()
		// 	db = db.db(dbName)
		// 	var user = { username: username, password: password }
		// 	db.collection('users').insertOne(user, function (err, res) {
		// 		if (err) throw err
		// 		console.log('1 user inserted: ' + username)

		// 		MongoDB.disconnectDB()
		// 	})
		// })
	} catch (e) {
		throw e
	}
	return res.redirect('/')
})

app.post(
	'/login',
	checkNotAuthenticated,
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true,
	})
)

function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}

	res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/')
	}
	next()
}
