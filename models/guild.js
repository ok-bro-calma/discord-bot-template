const { prefix } = require('../util/config.js');

// a basic guild model, customize it!
// new to mongodb? its easy don't worry
// get started at https://mongoosejs.com/docs/index.html
module.exports = ({ model, Schema }) => model('guild', Schema({
  // you can add more properties here
  id: String,
  prefix: { type: String, default: prefix }
}));
