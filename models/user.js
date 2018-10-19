const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    githubID: {type: String, required: true},
    username: {type: String, required: true},
    displayName: {type: String, required: true},
    accessToken: {type: String, required: true}
})

UserSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', UserSchema);
