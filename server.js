const express			= require('express');
const session			= require('express-session');
const MongoDB 			= require('./public/js/db')
const passport			= require('passport');
const localStrategy		= require('passport-local').Strategy;
const bcrypt			= require('bcrypt');
const path 				= require("path");
const app				= express();
const fs 				= require('fs');



// Middleware


// (async () => {
// 	try{
// 		var db = await MongoDB.connectDB()
// 		return
// 	}
// 	catch(e){
// 		done(e)
// 	}
// })()
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'public/html'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(session({
	secret: "verygoodsecret",
	resave: false,
	saveUninitialized: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Passport.js
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
	console.log("serializing the user")
	console.log("serializing user: " + user.username)
	done(null, user);
  });

passport.deserializeUser((user, done) => {
	console.log("deserializing the user")
	console.log("deserializing user: " + user.username)
	done(null, user);
  });


passport.use(new localStrategy(function (username, password, done) {
	console.log("initiate passport's localStrategy")
	var isDone = (async (username, password, done) => {
		try{
		const result = await MongoDB.findUserByName(username, password, done)
		return result
		}
		catch(e){
			done(e)
		}
	  })(username, password, done)
	return isDone
}));

function isLoggedIn(req, res, next) {
	console.log("authenticated: " + req.isAuthenticated())
	if (req.isAuthenticated()) return next();
	res.render('login');
}

function isLoggedOut(req, res, next) {
	if (!req.isAuthenticated()) return next();
	res.render('homePage.html');
}

app.use('/homepage', function(req, res, next){
    
    var options = {
        root: path.join(__dirname)
    };
     
    var fileName = '/public/html/userInfo.html'
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err)
        } else {
            console.log('Sent:', fileName)
            next()
        }
    })
})

// ROUTES
app.get('/', isLoggedIn, (req, res) => {

	res.render('homePage.html');
});

app.get('/login', isLoggedOut, (req, res) => {
	res.render('login');
});

app.get('/about', (req, res) => {
	res.render('/index.html');
});
app.get('/loadingPage', (req, res) => {
	// let sessionId = res.socket.parser.incoming.sessionID
	// console.log(sessionId)
	// let sessionInfo = res.socket.parser.incoming.sessionStore.sessions[sessionId]
	// console.log(sessionInfo)
	// let passportUserInfo = JSON.parse(sessionInfo).passport
	// console.log(passportUserInfo)
	res.render('loadingPage.html')

	const content = `<div class="home">
	<h1>k </h1>
	<a href="/logout">aaaaaaaa</a>
	</div>`
	fs.writeFile(__dirname + '/public/html/userInfo.html', content, err => {
		if (err) {
			console.error(err);
		}
	});
//	res.render('homePage.html', JSON.stringify(passportUserInfo))
	//res.render('homePage.html')
    res.send();


});

app.get('/homepage', (req, res) => {
	res.render('homePage.html')
});



app.post('/login', passport.authenticate('local', {
	successRedirect: 'loadingPage',
	failureRedirect: 'login?error=true',
}));

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

		app.listen(3000, () => {
			console.log("Listening on port 3000");
		});

// Setup our admin user
// app.get('/setup', async (req, res) => {
// 	const exists = (async (username, password) => {
// 		const result = await MongoDB.doesUserExist(username, password)
// 		return result
// 	  })("admin", "123")
// 	if (exists) {
// 		res.redirect('/login');
// 		return;
// 	};

// 	bcrypt.genSalt(10, function (err, salt) {
// 		if (err) return next(err);
// 		bcrypt.hash("pass", salt, function (err, hash) {
// 			if (err) return next(err);
			
// 			const newAdmin = {
// 				"username": "admin",
// 				"password": hash,
// 				"role": "admin",
// 				"movies": Array
// 			};
// 			const exists = (async (username, password,role,movies) => {
// 				const result = await MongoDB.createUser(username, password)
// 				return result
// 			  })(newAdmin.username,newAdmin.password,newAdmin.role,newAdmin.movies)

// 			res.redirect('/login');
// 		});
// 	});
// });

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
//   const result = JSON.stringify(req, getCircularReplacer());
//   console.log(result);