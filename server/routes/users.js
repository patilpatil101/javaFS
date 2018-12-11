var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');
var User = require('../models/user');

//*****************************  Registration  *********************************************************************************************************************/
router.post('/register', function(req, res){

		var newUser = new User({
				productName     : req.body.productName,
				vendorName      : req.body.vendorName,
				websiteAddress  : req.body.websiteAddress,
				password        : req.body.password,
				contactNo       : req.body.contactNo,
				email           : req.body.email,
				address         : req.body.address,
				active          : req.body.active
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log("User:=",user);
			 if(!user){
                  return res.json({ error: false });
    		 }
       			  return res.json({ success : true, userdata : user });
			 	   
		});
	
});

//*****************************  Passport Creation *********************************************************************************************************************/

passport.use(new LocalStrategy({
	usernameField: 'email',
    passwordField: 'password'
},function(username, password, done) {
		console.log("USERNAME =", username);
		console.log("PASSWORD =", password);

    User.getUserByEmail(username, function(err, user){
   		if(err) throw err;
   		  if(!user){
   		     return done(null, false, {message: 'Unknown User'});
			 }
			  
   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		  if(isMatch){
   			return done(null, user);
   		 } else {
   			return done(null, false, {message: 'Invalid password'});
   		 }
   	});
  });
}));


//*****************************  Passport SerializeUser/DeserializeUser *********************************************************************************************************************/
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

//*****************************  Login *********************************************************************************************************************/

router.post('/login',
 passport.authenticate('local',{ successRedirect:'/users/welcome', failureRedirect:'/users/fail',failureFlash: true}),
  function(req, res) {
	//res.redirect('/users/auth');
		
  });


router.get('/welcome', ensureAuthenticated, function(req, res){
	console.log("Login Success");
	res.json({ success : true });
	//res.end("Welcome To Dashboard");	
});


function ensureAuthenticated(req, res, next){
	console.log("req = ",req.isAuthenticated());
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/fail');
	}
}
//***************************************************************************************************************************************************/

router.get('/login', function(req, res){
	res.end("LOGIN API");
});


router.get('/test', function(req, res){
	res.end("TESTING API");
});



router.get('/fail', function(req, res){
	console.log("Login Fail");
	res.json({ error : false });
	//res.end('LOGIN PAGE');
});



router.get('/error', function(req, res){
	res.end("TESTING API Error");
});




router.get('/logout', function(req, res){
	console.log("Inside Server Side Logout");
	req.logout();
	res.json({ success : true });
	//req.flash('success_msg', 'You are logged out');

	//res.redirect('/users/login');


});
























































// Get Homepage
// router.get('/isAutheticated',function(req, res){
// 	//res.render('index');
	
// 		if(req.isAuthenticated()){
// 		//app.use(express.static(path.join(__dirname, '../client/dist/index.html')));
// 		return res.json({ success : true });
// 	} else {
// 		//req.flash('error_msg','You are not logged in');
// 		return res.json({ error : false });
// 	}
// });

// function ensureAuthenticated(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 		return res.json({ succes : true });
// 	} else {
// 		//req.flash('error_msg','You are not logged in');
		
// 		res.redirect('/users/test');
// 		return res.json({ error : false });
// 	}
// }
// router.get('/isAutheticated', function(req, res){
// 	if(!req.isAuthenticated()){
// 		return res.json({ error: false });
// 	} else {
// 		return res.json({ success: true });
// 	}
// });

//***************************************************************************************************************************************************/
module.exports = router;

























































//*****************************  Sending an email *********************************************************************************************************************/
// sending mail function
//   router.post('/sendemail', function(req, res){


//     // Sending Emails with SMTP, Configuring SMTP settings
//     var smtpTransport = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: "cdacb.mlab@gmail.com",
//         pass: "mlab123*"
//       }
//     });
//     var token = req.body.email;
//     var mailOptions = {
//       from: "CMVT LAB ✔ <cdacb.mlab@gmail.com>", // sender address
//       to  : req.body.email, // list of receivers
//       subject: "Welcome to CMVT LAB",
//       html : "<div><p>Welcome to <strong>CMVT LAB</strong>!</p><p>Thanks for registering with CMVT LAB."
//       +"To confirm your email address and to complete the registration process,<strong> "
//       +"Click <a href='http://"+host+"/api/activate?token="+token+"'>here</a></strong>.</p>"
//       +"<p>This is an automatically generated mail. Please do not respond to this.</p>"
//       +"<p>Thanks,"
//       +"<br>CMVT LAB TEAM"
//       +"<br>CDAC</p>"
//       +"</div></body></html>"


//     }

//     smtpTransport.sendMail(mailOptions, function(error, mailres){
//       if(error){
//         res.send("Email could not sent due to error: "+error);
//       }else{
//         res.send("Email has been sent successfully");
//       }
//       // if you don't want to use this transport object anymore, uncomment following line
//       smtpTransport.close(); // shut down the connection pool, no more messages
    

//     });

//   });


// //****************************************************************************************************************************************************************** */
//  router.get('/activate',function(req,res){
  
//     regSchema.find({"Email":req.query.token},{"Email":1, _id:0},function (err, emailres) {
//       if (err)
//       res.send(err);
//       if(emailres == 0)
//       {
//         console.log('Email ID Not Found');
//         res.json({ success: false });
//       }

//       else{

//         if(req.query.token == emailres[0].Email)
//         {
//           console.log("Your account is activated now.");
//           regSchema.update({"Active":false},{$set:{"Active":true}},function(err,updateres){
//             if (err)
//             res.send(err);
//           });

//           res.writeHead(200, {'Content-Type': 'text/html'});
//           res.write('<body style="background-color: black;">');
//           res.write('<br><h1 style="color:white; text-align: center;">Thank you. Your account has been successfully activated.</h1>');
//           res.write('</body>')
//           res.end();


//         }
//       }
//     });
//   });


//   router.get('/authenticate', function (req, res) {
//     //**** req.query.uname/pass *** it is used for getting the value from textfield whatever the value user entered **************************************************

//     regSchema.find({"Email":req.query.email},{"Password":1, _id:0},function (err, passwordres) {
//       if (err)
//       res.send(err);
    
//       if(passwordres == 0 && passwordres != req.query.password)
//       {
//         console.log('Data Not Found');
//         res.json({ error: false });
//       }
      
//       else{

//         if(req.query.password == passwordres[0].Password)
//         {
//           console.log("PASSWORD MATCH");

//           ///*********
//           regSchema.find({"Email":req.query.email},{"Active":1,"VendorName":1, _id:0},function (err, activeres) {
//             if (err)
//             res.send(err);
//             if(activeres[0].Active == true)
//             {
//               sess=req.session;
//               sess.id = req.session.id;
//               sess.vendorName = activeres[0].VendorName;
              
//               console.log('session is :: ',sess);
//               console.log('session id ::',sess.id);
//               return res.json({ success: true });
             
             
//             }
            
//             if(activeres[0].Active == false)
//             {
//               res.json({error: false});
//             }
               
//           });
          
//         }
//         else{
//            res.json({error: false});
//         }
//       }
//     });

//   });
