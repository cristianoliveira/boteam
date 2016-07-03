var mongoose = require('Mongoose'),


TeamMemberSchema = new mongoose.Schema({
  channel: {
    type: String,
    required: true
  },

  slackId: {
    type: String,
    required: true
  }
});
TeamMemberSchema.index({channel: 1, slackId: 1}, {unique: true});
TeamMember = mongoose.model('TeamMember', TeamMemberSchema);

module.exports = {
  teamMember: {

    add: function(data, callback) {
      var newMember = new TeamMember(data);
      newMember.save(callback);
    },

    removeBySlackId: function(slackId, callback) {
      TeamMember.find({ slackId: slackId }, function(err, member){
        member.remove();
        console.log(err);
        callback(err, member);
      });
    },

    fromChannel: function(channel, callback) {
      TeamMember.find({ channel: channel }, function(err, members){
        console.log(err);
        callback(err, members);
      });
    }

  }
};
