const users = require('./constants/users');

module.exports = {
  getMentionedUsers(comment) {
    return users.filter(({ github }) => comment.body.match(new RegExp(`@${github}`)));
  },
  getSuscribedUsers(event) {
    return users.filter(({ suscriptions }) => suscriptions && suscriptions.includes(event));
  },
  getAuthor(sender) {
    return users.find(({ github }) => github === sender.login).name;
  },
};
