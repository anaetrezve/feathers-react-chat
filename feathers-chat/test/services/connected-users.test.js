const app = require('../../src/app');

describe('\'connected-users\' service', () => {
  it('registered the service', () => {
    const service = app.service('connected-users');
    expect(service).toBeTruthy();
  });
});
