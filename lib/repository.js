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

    add: function(members, callback) {
      for (var i in members) {
        var newMember = new TeamMember(members[i]);
        newMember.save(callback);
      }
    },

    remove: function(users, callback) {
      TeamMember.remove({ slackId: { $in:users } }, function(err, member){
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
