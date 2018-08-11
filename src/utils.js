const users = require('./constants/users');

module.exports = {
  getMentionedUsers(comment) {
    return users.filter(user => comment.body.match(new RegExp(`@${user.github}`)));
  },

  getAuthor(comment) {
    return users.find(user => user.github === comment.user.login).name;
  },
};
