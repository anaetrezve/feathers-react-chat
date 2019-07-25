const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');
const io = require('socket.io-client');
const auth = require('@feathersjs/authentication-client');

const socket = io('http://api.feathersjs.com');
const app = feathers();

app.configure(socketio(socket));

app.configure(auth({
  header: 'Authorization',
  prefix: '',
  path: '/authentication',
  jwtStrategy: 'jwt',
  entity: 'user',
  service: 'users',
  cookie: 'feathers-jwt',
  storageKey: 'feathers-jwt',
  storage: window.localStorage
}))

export default app;
