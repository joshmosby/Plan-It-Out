var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    id: {type: String, required: true, unique: true},
    calendar: {type: String},
    location: {type: String},
    categories: {type: String}
});

module.exports = mongoose.model('User', UserSchema);