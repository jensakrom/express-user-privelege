/**
 * Created by Jens on 12/12/2017.
 */
    //Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
  console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
  //noinspection JSAnnotator
  return
}

var async = require('async');
var User = require('./models/user');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = [];

function userCreate(name, username, password, admin, location, cb) {
  // var user = new User({
  //   name: name,
  //   username: username,
  //   password: password,
  //   admin: admin,
  //   location: location
  // });

  var userdetail = {
    name: name, username: username, password: password, admin: admin, location: location
  };
  // if (genre != false) userdetail.genre = genre;

  var user = new User(userdetail);

  user.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New User: ' + user);
    users.push(user);
    cb(null, user);
  });
}

function createUsers(cb) {
  async.parallel([function (callback) {
        userCreate('Patrick', 'Rothfuss', 'pass', 'admin', 'Cigondewah', callback);
      }, // function(callback) {
        //   authorCreate('Ben', 'Bova', '1932-11-8', false, callback);
        // },
        // function(callback) {
        //   authorCreate('Isaac', 'Asimov', '1920-01-02', '1992-04-06', callback);
        // },
        // function(callback) {
        //   authorCreate('Bob', 'Billings', false, false, callback);
        // },
        // function(callback) {
        //   authorCreate('Jim', 'Jones', '1971-12-16', false, callback);
        // },
        // function(callback) {
        //   genreCreate("Fantasy", callback);
        // },
        // function(callback) {
        //   genreCreate("Science Fiction", callback);
        // },
        // function(callback) {
        //   genreCreate("French Poetry", callback);
        // },
      ], // optional callback
      cb);
}

async.series([createUsers], // optional callback
    function (err, results) {
      if (err) {
        console.log('FINAL ERR: ' + err);
      } else {
        console.log('BOOKInstances: ' + bookinstances);

      }
      //All done, disconnect from database
      mongoose.connection.close();
    });