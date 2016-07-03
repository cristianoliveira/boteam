
function Boteam(repo) {
  var boteam = {},
    extractMentionedUsers;

  extractMentionedUsers = function(message) {
    var mentionUserPattern = /(<@[A-Z]\w+>)/g;
    return message.match(mentionUserPattern);
  };

  boteam.onAdd = function onAdd(bot, message) {
    var users = extractMentionedUsers(message.text),
      onError = function(err) {
        console.log("error", err);
        if (err.code == 11000) { // duplicated unique value
          bot.reply(message, "Is already member of the team.");
          return;
        }

        bot.reply(message, "Was not possible add. Cause: " + err);
      };

    if (!users)
      return bot.reply(message, "Sorry I couldn't understand who add. :(");

    for (var i in users) {
      repo.teamMember.add({ channel: message.channel, slackId: users[i] },
                          onError);
    }
  };

  boteam.onDelete = function onDelete(bot, message) {
    var users = extractMentionedUsers(message.text),
      onError = function(err, member) {
        bot.reply(message, "Removed " + member.slackId + " from this team." );
      };

    if (!users)
      return bot.reply(message, "Sorry I couldn't understand who remove. :(");

    for (var i in users) {
      repo.teamMember.removeBySlackId(users[i], onError);
    }
  };

  boteam.onHelp = function onHelp(bot, message) {
    repo.teamMember.fromChannel(message.channel, function(err, members){
      if (err)
        return bot.reply(message,
                         "Sorry was not possible remove. Cause: " + err);

      var team = members.map(function(m){ return m.slackId; }).join(", ");
      if (!team)
        return bot.reply(message, "No one can help you, sorry. :/");

      bot.reply(message, "Guys please help here. Team: " + team);
    });
  };

  boteam.onOptions = function onOptions(bot, message) {
    bot.reply(message, "Hi there \n" +
              "Let me show what I can do for you: \n" +
              " - 'add <member>' (one or more) to the channel team. \n" +
              " - 'help' calling the members for you. \n" +
              " - 'remove <member>' (one or more) from this team. \n" +
              " - 'options' showing this message :P ");
  };

  boteam.onChannelCall = function onChannelCall(bot, message) {
    var reply = "Hi there \n" +
    "Please avoid using @ channel/here/everyone instead call me ;). \n" + 
    "Example: @boteam: help";

    bot.reply(message, reply);
  };

  return boteam;
}

module.exports = Boteam;
