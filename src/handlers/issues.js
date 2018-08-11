const { getSuscribedUsers, getAuthor } = require('../utils');
const { notifyInProduction } = require('../slack');

const { OOPS_NO_HANDLER, EVERYTHING_OK } = require('../constants/messages');

module.exports = async ({ action, label, issue, sender }) => {
  if (action !== 'labeled') return OOPS_NO_HANDLER;

  if (label.name === 'blocked') {
    const suscribedUsers = getSuscribedUsers('production');

    const data = {
      sender: {
        name: getAuthor(sender),
      },
      issue: {
        number: issue.number,
        title: issue.title,
        url: issue.html_url,
      },
    };

    await Promise.all(suscribedUsers.map(suscribedUser => notifyInProduction(suscribedUser, data)));

    return EVERYTHING_OK;
  }

  return OOPS_NO_HANDLER;
};
