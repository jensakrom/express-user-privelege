/**
 * Created by Jens on 12/12/2017.
 */
var User = require('../models/user');
var async = require('async');

exports.index = function (req, res) {
  async.parallel({
    user_count: function(callback) {
      User.count(callback);
    },

  }, function(err, results) {
    res.render('index', { title: '====== User =====', error: err, data: results });
  });
};

exports.user_list = function (req, res, next) {
  User.find()
      .sort([['name', 'ascending']])
      .exec(function (err, list_users) {
        if (err){return next(err)}
        //Successful, so render
        res.render('user_list', {title: 'User List', list_users: list_users})
      })
};

exports.genre_list = function(req, res, next) {

  User.find()
      .sort([['name', 'ascending']])
      .exec(function (err, list_genres) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('genre_list', { title: 'Genre List', list_genres:  list_genres});
      });

};

exports.user_create_post = function(req, res, next) {

  req.checkBody('name', 'First name must be specified.').notEmpty(); //We won't force Alphanumeric, because people might have spaces.
  req.checkBody('username', 'First name must be specified.').notEmpty();
  req.checkBody('password', 'Fill password..').notEmpty();
  req.checkBody('admin', 'admin must be fill');
  req.checkBody('location', 'location');
  req.sanitize('name').escape();
  req.sanitize('username').escape();
  req.sanitize('name').trim();
  req.sanitize('username').trim();

  //Run the validators (sanitizing date below causes validation error)
  // var errors = req.validationErrors();
  // req.sanitize('date_of_birth').toDate();
  // req.sanitize('date_of_death').toDate();


  var user = new User(
      { name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        admin: req.body.admin,
        location: req.body.location
      });

  if (errors) {
    res.render('author_form', { title: 'Create Author', user: user, errors: errors});
    return;
  }
  else {
    // Data from form is valid

    user.save(function (err) {
      if (err) { return next(err); }
      //successful - redirect to new user record.
      res.redirect(user.url);
    });

  }

};