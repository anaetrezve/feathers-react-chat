// channels-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const channels = new Schema({
    messages: [{
      type: mongooseClient.Schema.Types.ObjectId,
      ref: 'messages'
    }],
    name: { type: String, required: true }
  }, {
    timestamps: true
  });

  return mongooseClient.model('channels', channels);
};
