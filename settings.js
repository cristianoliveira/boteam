module.exports = {
  // Token of Bot from Slack
  // see more: https://api.slack.com/custom-integrations
  token: process.env.SLACK_TOKEN,

  // URI to connect MongoDB
  uridb: process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/boteam',
}
