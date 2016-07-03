var mongoose = require('Mongoose'),

TeamMember = mongoose.model('TeamMember', new mongoose.Schema({
  channel: {
    type: String,
    required: true
  },

  slackId: {
    type: String,
    required: true,
    unique: true
  }
}));

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
