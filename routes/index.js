const express = require('express');
const router = express.Router();

const User = require('../model/userSchma');
const passport = require('passport');
const localStrategy = require('passport-local');

passport.use(new localStrategy(User.authenticate()));

// GET ROUTES



/* GET Login page. */
router.get('/', sendToProfile, function(req, res, next) {
  res.render('Login', {isLoggedIn: !!req.user});
});

/* GET Register page. */
router.get('/register',sendToProfile, function(req, res, next) {
  res.render('Register',  {isLoggedIn: !!req.user});
});

/* GET Profile page. */
router.get('/profile', isLoggedIn, function(req, res, next) {
  User.findOne({username:req.user.username})
    .then( user => {
      res.render('Profile',  {user, isLoggedIn: !!req.user});
    }).catch( err => console.log(err));
});

/* GET Profile page. */
router.get('/updateProfile/:id', isLoggedIn, function(req, res, next) {
  User.findOne({_id:req.params.id})
    .then( user => {
      res.render('Update',  {user, isLoggedIn: !!req.user});
    }).catch( err => console.log(err));
});

/* GET Logout */
router.get('/logOut', function(req, res, next){
  req.logout();
  res.redirect('/register');
});

// POST ROUTES

/* POST Register. */
router.post('/register', function(req, res, next) {
  const { username, name, email, password } = req.body;
  let newUser = new User({ username, name, email });
  User.register(newUser, password)
  .then(function(newUserCreated){
    passport.authenticate('local')(req, res, function(){
      res.redirect('/profile');
    })
  })
  .catch(function(err){
    res.send(err);
  })

});

/* POST Login. */
router.post('/login',passport.authenticate('local', {
  successRedirect:'/profile',
  failureRedirect:'/'
}), function(req, res, next){});

/* POST Update Profile. */
router.post('/update/:id', isLoggedIn, function(req, res, next){
  const { username, name, email } = req.body;
  const updatedUser = { username, name, email };
  User.findOneAndUpdate({_id:req.params.id}, {$set:updatedUser}, {new:true})
    .then( userwithUpdation => {
        req.logIn(userwithUpdation, (err) => {
          res.redirect('/profile');
        })
    }).catch( err => res.send(err));
})


//isLoggedInMiddelware
function isLoggedIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/');
  }
}

//sendToProfile
function sendToProfile(req, res, next){
  if (req.isAuthenticated()){
    res.redirect('/profile')
  }
  else{
    return next();
  }
}



module.exports = router;
