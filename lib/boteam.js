
function Boteam(repo) {
  var boteam = {};

  var extractMembers = function(message) {
    var mentionMemberPattern = /(<@[A-Z]\w+>)/g;
    return message.match(mentionMemberPattern);
  }

  boteam.onAdd = function onAdd(bot, message) {
    console.log(message);
    var newMembers = extractMembers(message.text);

    if (newMembers == null || newMembers.lenght == 0) {
      bot.reply(message, "Sorry I couldn't understand who add. :(");

    } else {
      for (var member of newMembers) {
        repo.teamMember.save({
          channel: message.channel,
          slackId: member
        }, function(err) {
          bot.reply(message, "Done.");
        });
      }

    }
  },

  boteam.onDelete = function onDelete(bot, message) {
    console.log(message);
    var newMembers = extractMembers(message.text);

    if (newMembers == null || newMembers.lenght == 0) {
      bot.reply(message, "Sorry I couldn't understand who remove. :(");

    } else {
      for (var member of newMembers) {
        repo.teamMember.removeBySlackId(member, function(err, member) {
          bot.reply(message, "Removed " + member.slackId + " from this team." );
        });
      }

    }
  }

  boteam.onHelp = function onHelp(bot, message) {
    var members = repo.teamMember.fromChannel(message.channel,
      function(err, members){
        console.log(members);
        var all = members.map(function(m){ return m.slackId }).join(", ")
        console.log(all);

        if (all.length == 0) {
          bot.reply(message, "No one can help you, sorry. :/");
        } else {
          bot.reply(message, "Guys please help here. Team:" + all);
        }

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
