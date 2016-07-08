/**
 * Presents the bot actions.
 *
 * @constructor
 * @param {Repository} Team members repository
 */
function Boteam(repo) {
  var CODE_DUPLICATED_KEY = 11000,
    boteam = {},
    extractMentionedUsers;

  extractMentionedUsers = function(message) {
    var mentionUserPattern = /(<[A-Z_0-9@]+>)/g;
    return message.match(mentionUserPattern);
  };

  /**
   * Actions of adding members
   * Occurs when bot is direct or indirectly mentioned using the key 'add'
   *
   * Ex:
   *   "@boteam: add @member"
   *
   * @param {BotkitBot} bokit bot instance
   * @param {Hash} message data from SlackApi
   */
  boteam.onAdd = function onAdd(bot, message) {
    var users = extractMentionedUsers(message.text),
      members = [];

    if (!users)
      return bot.reply(message, "Sorry I couldn't understand who add. :(");

    members = users.map(function(u) {
      return { channel: message.channel, slackId: u };
    });

    repo.add(members, function(err) {
      if (err) {
        if (err.code == CODE_DUPLICATED_KEY) {
          return bot.reply(message, "Is already member of the team.");
        }
        return bot.reply(message, "Error while trying add. Cause: " + err);
      }

      return bot.reply(message, "Added new member");
    });
  };

  /**
   * Actions of removing members
   * Occurs when bot is direct or indirectly mentioned using the key 'remove'
   *
   * Ex:
   *   "@boteam: remove @member"
   *
   * @param {BotkitBot} bokit bot instance
   * @param {Hash} message data from SlackApi
   */
  boteam.onRemove = function onRemove(bot, message) {
    var users = extractMentionedUsers(message.text);

    if (!users)
      return bot.reply(message, "Sorry I couldn't understand who remove. :(");

    repo.remove(users, function(err, data) {
      var reply;

      if (err) {
        reply = "Error while try remove from this team.";
      } else {
        reply = "Removed member from this team.";
      }

      return bot.reply(message, reply);
    });
  };

  /**
   * Actions of asking help from members
   * Occurs when bot is direct or indirectly mentioned using one of the keys:
   * help, team or show
   *
   * Ex:
   *   "@boteam: help"
   *
   * @param {BotkitBot} bokit bot instance
   * @param {Hash} message data from SlackApi
   */
  boteam.onHelp = function onHelp(bot, message) {
    repo.fromChannel(message.channel, function(err, members){
      console.log(members);
      if (err)
        return bot.reply(message,
                         "Sorry wasn't possible retrieve the team Cause: " + err);

      var team = members.map(function(m){ return m.slackId; }).join(", ");
      if (!team)
        return bot.reply(message, "No one can help you, sorry. :/");

      return bot.reply(message, "Guys please help here. Team: " + team);
    });
  };

  /**
   * Actions of asking options to boteam.
   * Occurs when bot is direct or indirectly mentioned using one of the keys:
   * options
   *
   * Ex:
   *   "@boteam: options"
   *
   * @param {BotkitBot} bokit bot instance
   * @param {Hash} message data from SlackApi
   */
  boteam.onOptions = function onOptions(bot, message) {
    bot.reply(message, "Hi there \n" +
              "Let me show what I can do for you: \n" +
              " - 'add <member>' (one or more) to the channel team. \n" +
              " - 'remove <member>' (one or more) from this team. \n" +
              " - 'help' calling the members for you. \n" +
              " - 'options' showing this message :P ");
  };

  /**
   * Binds the boteam actions on a given controller {Botikit}
   *
   * @param {Botkit.slackbot} bokit controller
   */
  boteam.bind = function(controller) {
    controller.hears('add',['direct_mention','mention'], boteam.onAdd);
    controller.hears('remove',['direct_mention','mention'], boteam.onRemove);
    controller.hears(['help', 'team','show'],['direct_mention','mention'], boteam.onHelp);
    controller.hears('options',['direct_mention','mention'], boteam.onOptions);
  }

  return boteam;
}

module.exports = Boteam;
