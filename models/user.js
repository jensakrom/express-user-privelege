/**
 * Created by Jens on 12/12/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  username: {type: String, required: true, unique:true, max: 100},
  password: {type: String, required: true, max: 100},
  admin: Boolean,
  location: String,
  meta:{
    age: Number,
    website: String
  },
  created_at: Date,
  updated_at: Date
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;