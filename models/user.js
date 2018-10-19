const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
   githubID: {type: String, required: true}
})

UserSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', UserSchema);
