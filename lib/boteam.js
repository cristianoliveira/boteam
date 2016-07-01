
function Boteam(repo) {
  var boteam = {},
    extractMentionedUsers;

  extractMentionedUsers = function(message) {
    var mentionUserPattern = /(<@[A-Z]\w+>)/g;
    return message.match(mentionUserPattern);
  }

  boteam.onAdd = function onAdd(bot, message) {
    var users = extractMentionedUsers(message.text);

    if (!users)
      return bot.reply(message, "Sorry I couldn't understand who add. :(");

    for (var user of users) {
      repo.teamMember.add({
        channel: message.channel,
        slackId: user
      }, function(err) {
        console.log(err);
        bot.reply(message, "Done.");
      });
    }
  },

  boteam.onDelete = function onDelete(bot, message) {
    var users = extractMentionedUsers(message.text);

    if (!users)
      return bot.reply(message, "Sorry I couldn't understand who remove. :(");

    for (var user of users) {
      repo.teamMember.removeBySlackId(users, function(err, member) {
        bot.reply(message, "Removed " + member.slackId + " from this team." );
      });
    }
  }

  boteam.onHelp = function onHelp(bot, message) {
    repo.teamMember.fromChannel(message.channel, function(err, members){
      console.log(err);
      console.log(members);

      if (err)
        return bot.reply(message, "Sorry was not possible remove. Cause: " + err);

      var members = members.map(function(m){ return m.slackId }).join(", ")
      if (!members)
        return bot.reply(message, "No one can help you, sorry. :/");

      console.log(members);
      bot.reply(message, "Guys please help here. Team: " + members);
    });
  }

  boteam.onOptions = function onOptions(bot, message) {
    bot.reply(message, "Hello hello \n" +
              "I can do for you: \n" +
              " - 'add <member>' (one or more) to the channel team. \n" +
              " - 'help' calling the members for you. \n" +
              " - 'remove <member>' (one or more) from this team. \n" +
              " - 'options' showing this message :P ");
  }

  return boteam;
};

module.exports = Boteam;
