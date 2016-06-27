var assert = require('chai').assert,
  sinon = require('sinon'),
  repository = require('../lib/repository.js'),
  Boteam = require('../lib/boteam.js'),
  bot = {},
  message = {},
  boteam = {};

describe('When adding member to team', function() {
  beforeEach(function() {
    message = {};
    bot.reply = sinon.spy();
    boteam = Boteam(repository);
  });

  describe('no member mentioned', function () {
    it('should reply with error message', function () {
      message.text =  "add cristian";
      boteam.onAdd(bot, message);
      sinon.assert.calledWith(bot.reply,
                              message,
                              "Sorry I couldn't understand who add. :(");
    });
  });

  describe('member mentioned', function () {
    it('should add to team', function () {
      var slackId= "<@U1NCN9DAS>",
        channel= "channel_id",
        teamMemberSpy;

      repository.teamMember.save = sinon.spy();

      message.text =  "add " + slackId;
      message.channel = channel;

      boteam.onAdd(bot, message);

      assert.isTrue(repository.teamMember.save.calledOnce);
      repository.teamMember.save.calledWith({
        channel: channel,
        slackId: slackId
      });
    });

    it('should add more than one to team', function () {
      var slackId1 = "<@U1NCN9DAS>",
        slackId2 = "<@U1NCN9QWE>",
        channel= "channel_id",
        teamMemberSpy;

      repository.teamMember.save = sinon.spy();

      message.text =  "add " + slackId1 + " and " + slackId2;
      message.channel = channel;

      boteam.onAdd(bot, message);

      assert.isTrue(repository.teamMember.save.calledTwice);
      repository.teamMember.save.calledWith({
        channel: channel,
        slackId: slackId1
      });
      repository.teamMember.save.calledWith({
        channel: channel,
        slackId: slackId2
      });
    });
  });

  describe('When requesting help', function() {
    beforeEach(function() {
      message = {};
      bot.reply = sinon.spy();
      boteam = Boteam(repository);
    });

    describe("empty team", function(){
      it("should say there is no one to help", function() {
        message.text = "SOS";

        boteam.onHelp(bot, message);

        bot.reply.calledWith(message, "No one can help you, sorry. :/");
      });
    });
  });
});
