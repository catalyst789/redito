const express = require('express');
const router = express.Router();

const User = require('../model/userSchma');
const passport = require('passport');
const localStrategy = require('passport-local');

const upload = require('./multimedia');

passport.use(new localStrategy(User.authenticate()));

// GET ROUTES



/* GET Login page. */
router.get('/', sendToProfile, function(req, res, next) {
  const errors = req.flash().error || [];
  res.render('Login', {errors, isLoggedIn: !!req.user});
});

/* GET Register page. */
router.get('/register',sendToProfile, function(req, res, next) {
  res.render('Register',  {isLoggedIn: !!req.user});
});

/* GET Profile page. */
router.get('/profile', isLoggedIn, function(req, res, next) {
  User.findOne({username:req.user.username})
    .then( user => {
      console.log(user);
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
  failureFlash:true,
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

/* POST Upload Profile Picture. */
router.post('/uploadprofilepic', isLoggedIn,upload.single('avatar'), function(req, res, next){
  var addressOfImage = '/images/uploads/' + req.file.filename
  User.findOne({username:req.user.username})
    .then( user => {
        user.avatar = addressOfImage;
        user.save().then( savedUser => {
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
