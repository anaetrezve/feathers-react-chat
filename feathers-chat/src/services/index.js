const users = require('./users/users.service.js');
const messages = require('./messages/messages.service.js');
const channels = require('./channels/channels.service.js');
const connectedUsers = require('./connected-users/connected-users.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(messages);
  app.configure(channels);
  app.configure(connectedUsers);
};
