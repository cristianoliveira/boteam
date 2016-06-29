
function Boteam(repo) {
  var boteam = {};

  var extractMentionedMembers = function(message) {
    var mentionMemberPattern = /(<@[A-Z]\w+>)/g;
    return message.match(mentionMemberPattern);
  }

  boteam.onAdd = function onAdd(bot, message) {
    var members = extractMentionedMembers(message.text);

    if (!members)
      return bot.reply(message, "Sorry I couldn't understand who add. :(");

    for (var member of members) {
      repo.teamMember.add({
        channel: message.channel,
        slackId: member
      }, function(err) {
        console.log(err);
        bot.reply(message, "Done.");
      });
    }
  },

  boteam.onDelete = function onDelete(bot, message) {
    var members = extractMentionedMembers(message.text);

    if (!members)
      return bot.reply(message, "Sorry I couldn't understand who remove. :(");

    for (var member of members) {
      repo.teamMember.removeBySlackId(member, function(err, member) {
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

      var all = members.map(function(m){ return m.slackId }).join(", ")
      if (!all)
        return bot.reply(message, "No one can help you, sorry. :/");

      console.log(all);
      bot.reply(message, "Guys please help here. Team: " + all);
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
