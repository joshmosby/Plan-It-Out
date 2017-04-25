var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    id: {type: String, required: true, unique: true}
});

module.exports = mongoose.model('User', UserSchema);