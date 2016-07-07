var Botkit = require('botkit'),
  Boteam = require('./lib/boteam.js'),
  mongoose = require('Mongoose'),
  settings = require('./settings.js'),
  repo = require('./lib/repository.js'),
  controller,
  db;

controller = Botkit.slackbot({
  debug: settings.debug
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
boteam.bind(controller);
