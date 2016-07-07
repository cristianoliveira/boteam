var assert = require('chai').assert,
  sinon = require('sinon'),
  repo = require('../lib/repository.js'),
  Boteam = require('../lib/boteam.js'),
  bot = {},
  message = {},
  boteam = {};

describe('When adding member to team', function() {
  beforeEach(function() {
    message = {};
    bot.reply = sinon.spy();
    boteam = Boteam(repo);
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

      repo.teamMember.add = sinon.spy();

      message.text =  "add " + slackId;
      message.channel = channel;

      boteam.onAdd(bot, message);

      assert.isTrue(repo.teamMember.add.calledOnce);
      repo.teamMember.add.calledWith({
        channel: channel,
        slackId: slackId
      });
    });

    it('should add more than one to the team', function () {
      var slackId1 = "<@U1NCN9DAS>",
        slackId2 = "<@U1NCN9QWE>",
        channel= "channel_id",
        teamMemberSpy;

      repo.teamMember.add = sinon.spy();

      message.text =  "add " + slackId1 + " and " + slackId2;
      message.channel = channel;

      boteam.onAdd(bot, message);

      assert.isTrue(repo.teamMember.add.calledOnce);
      repo.teamMember.add.calledWith([{
        channel: channel,
        slackId: slackId1
      }, {
        channel: channel,
        slackId: slackId2
      }]);
    });

    it('should warning for duplicated', function () {
      var slackId1 = "<@U1NCN9DAS>",
        channel= "channel_id",
        teamMemberSpy,
        duplicatedError;

      duplicatedError = {
        code: 11000
      };

      repo.teamMember.add = sinon.stub()
      repo.teamMember.add.yields(duplicatedError, null);

      message.text =  "add " + slackId1;
      message.channel = channel;

      boteam.onAdd(bot, message);
      bot.reply.calledWith(message, "Is already member of the team.");
      assert.isTrue(bot.reply.calledOnce);
    });
  });

  describe('here|channel|everyone mentioned', function () {
    it("shouldn't add none", function() {
      message.text =  "add <@here|here> <@channel|!channel> <@everyone|!everyone>";
      boteam.onAdd(bot, message);
      sinon.assert.calledWith(bot.reply,
                              message,
                              "Sorry I couldn't understand who add. :(");
    });
  });
});

describe('When removing member from team', function() {
  beforeEach(function() {
    message = {};
    bot.reply = sinon.spy();
    boteam = Boteam(repo);
  });

  describe('no member mentioned', function () {
    it('should reply with error message', function () {
      message.text =  "remove cristian";
      boteam.onRemove(bot, message);
      sinon.assert.calledWith(bot.reply,
                              message,
                              "Sorry I couldn't understand who remove. :(");
    });
  });

  describe('member mentioned', function () {
    it('should remove from the team', function () {
      var slackId= "<@U1NCN9DAS>",
        channel= "channel_id",
        teamMemberSpy;

      repo.teamMember.remove = sinon.spy();

      message.text =  "remove " + slackId;
      message.channel = channel;

      boteam.onRemove(bot, message);

      assert.isTrue(repo.teamMember.remove.calledOnce);
      repo.teamMember.remove.calledWith({
        channel: channel,
        slackId: slackId
      });
    });

    it('should add more than one to the team', function () {
      var slackId1 = "<@U1NCN9DAS>",
        slackId2 = "<@U1NCN9QWE>",
        channel= "channel_id",
        teamMemberSpy;

      repo.teamMember.remove = sinon.spy();

      message.text =  "remove " + slackId1 + " and " + slackId2;
      message.channel = channel;

      boteam.onRemove(bot, message);

      assert.isTrue(repo.teamMember.remove.calledOnce);
      repo.teamMember.add.calledWith([{
        channel: channel,
        slackId: slackId1
      },
      {
        channel: channel,
        slackId: slackId2
      }]);
    });
  });

  describe('here|channel|everyone mentioned', function () {
    it("shouldn't add none", function() {
      message.text =  "remove <@here|here> <@channel|!channel> <@everyone|!everyone>";
      boteam.onRemove(bot, message);
      sinon.assert.calledWith(bot.reply,
                              message,
                              "Sorry I couldn't understand who remove. :(");
    });
  });
});

describe('When requesting help', function() {
  beforeEach(function() {
    message = {};
    bot.reply = sinon.spy();
    boteam = Boteam(repo);
  });

  describe("empty team", function(){
    it("should say there is no one to help", function() {
      message.text = "SOS";

      boteam.onHelp(bot, message);

      bot.reply.calledWith(message, "No one can help you, sorry. :/");
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

      repo.teamMember.fromChannel = sinon.stub()
      repo.teamMember.fromChannel.yields(null, members);

      boteam.onHelp(bot, message);

      bot.reply.calledWith(message,
                           "Guys please help here. Team: " + member1.slackId);
    });
  });
});
