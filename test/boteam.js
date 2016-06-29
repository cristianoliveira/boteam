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
    it('should add to the team', function () {
      var slackId= "<@U1NCN9DAS>",
        channel= "channel_id",
        teamMemberSpy;

      repository.teamMember.add = sinon.spy();

      message.text =  "add " + slackId;
      message.channel = channel;

      boteam.onAdd(bot, message);

      assert.isTrue(repository.teamMember.add.calledOnce);
      repository.teamMember.add.calledWith({
        channel: channel,
        slackId: slackId
      });
    });

    it('should add more than one to the team', function () {
      var slackId1 = "<@U1NCN9DAS>",
        slackId2 = "<@U1NCN9QWE>",
        channel= "channel_id",
        teamMemberSpy;

      repository.teamMember.add = sinon.spy();

      message.text =  "add " + slackId1 + " and " + slackId2;
      message.channel = channel;

      boteam.onAdd(bot, message);

      assert.isTrue(repository.teamMember.add.calledTwice);
      repository.teamMember.add.calledWith({
        channel: channel,
        slackId: slackId1
      });
      repository.teamMember.add.calledWith({
        channel: channel,
        slackId: slackId2
      });
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

  describe("has error", function(){
    it("should say was not removed", function() {
      var channel = "CHANELID",
        members = [],
        error = "some cause";

      message.text = "SOS";
      message.channel = channel;

      repository.teamMember.fromChannel = sinon.stub()
      repository.teamMember.fromChannel.yields(error, null);

      boteam.onHelp(bot, message);

      bot.reply.calledWith(message,
                           "Sorry was not possible remove. Cause: " + error);
    });
  });

  describe("has team", function(){
    it("should mention the member", function() {
      var channel = "CHANELID",
        member1 = {},
        members = [];

      member1 = { slackId: "xpto" };
      members.push(member1);

      message.text = "SOS";
      message.channel = channel;

      repository.teamMember.fromChannel = sinon.stub()
      repository.teamMember.fromChannel.yields(null, members);

      boteam.onHelp(bot, message);

      bot.reply.calledWith(message,
                           "Guys please help here. Team: " + member1.slackId);
    });
  });
});
