
function Boteam(repo) {
  var CODE_DUPLICATED_KEY = 11000,
    boteam = {},
    extractMentionedUsers;

  extractMentionedUsers = function(message) {
    var mentionUserPattern = /([A-Z_0-9<>@]+)/g;
    return message.match(mentionUserPattern);
  };

  boteam.onAdd = function onAdd(bot, message) {
    var users = extractMentionedUsers(message.text),
      members = [];

    if (!users)
      return bot.reply(message, "Sorry I couldn't understand who add. :(");

    members = users.map(function(u) {
      return { channel: message.channel, slackId: u };
    });

    repo.teamMember.add(members, function(err) {
      if (err) {
        if (err.code == CODE_DUPLICATED_KEY) {
          return bot.reply(message, "Is already member of the team.");
        }
        return bot.reply(message, "Error while trying add. Cause: " + err);
      }

      return bot.reply(message, "Was not possible add. Cause: " + err);
    });
  };

  boteam.onRemove = function onRemove(bot, message) {
    var users = extractMentionedUsers(message.text);

    if (!users)
      return bot.reply(message, "Sorry I couldn't understand who remove. :(");

    repo.teamMember.remove(users, function(err, member) {
      var reply;

      if (err) {
        reply = "Error while try remove " + member.slackId + " from this team.";
      } else {
        reply = "Removed " + member.slackId + " from this team.";
      }

      return bot.reply(message, reply);
    });
  };

  boteam.onHelp = function onHelp(bot, message) {
    console.log(message);
    repo.teamMember.fromChannel(message.channel, function(err, members){
      if (err)
        return bot.reply(message, "Sorry was not Cause: " + err);

      console.log(members);
      var team = members.map(function(m){ return m.slackId; }).join(", ");
      if (!team)
        return bot.reply(message, "No one can help you, sorry. :/");

      return bot.reply(message, "Guys please help here. Team: " + team);
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
    console.log('onChannelCall');
    var reply = "Hi there \n" +
    "Please avoid using @ channel/here/everyone instead call me ;). \n" + 
    "Example: @boteam: help";

    bot.reply(message, reply);
  };

  return boteam;
}

module.exports = Boteam;
