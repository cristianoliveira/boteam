var Botkit = require('botkit'),
  Boteam = require('./lib/boteam.js'),
  mongoose = require('Mongoose'),
  settings = require('./settings.js'),
  repo = require('./lib/repository.js'),
  controller,
  db,
  uridb;

controller = Botkit.slackbot({
  debug: true
});

controller.spawn({
  token: settings.token
}).startRTM()

db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
  console.log('Conectado ao MongoDB.')
});

mongoose.connect(settings.uridb);

boteam = Boteam(repo);
controller.hears('add',['direct_mention','mention'], boteam.onAdd);
controller.hears('remove',['direct_mention','mention'], boteam.onRemove);
controller.hears('help',['direct_mention','mention'], boteam.onHelp);
controller.hears('options',['direct_mention','mention'], boteam.onOptions);
controller.hears('/@(channel|here|everyone)/g',['message_received'],
                 boteam.onChannelCall);
