// messages-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const messages = new Schema({
    from: {
      type: mongooseClient.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    text: { type: String, required: true },
    to: {
      type: mongooseClient.Schema.Types.ObjectId,
      ref: 'users',
      required: false
    },
    channelId: {
      type: mongooseClient.Schema.Types.ObjectId,
      ref: 'channles',
      required: false
    }
  }, {
    timestamps: true
  });

  return mongooseClient.model('messages', messages);
};
