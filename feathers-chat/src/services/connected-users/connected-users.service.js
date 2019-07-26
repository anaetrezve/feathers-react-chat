// Initializes the `connected-users` service on path `/connected-users`
const createService = require('./connected-users.class.js');
const hooks = require('./connected-users.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/connected-users', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('connected-users');

  service.hooks(hooks);
};
