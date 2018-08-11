const { getMentionedUsers, getAuthor } = require('../utils');
const { OOPS_NO_HANDLER, EVERYTHING_OK } = require('../constants/messages');
const { notifyUser } = require('../slack');

module.exports = async ({ action, issue, comment, repository }) => {
  if (action === 'deleted') return OOPS_NO_HANDLER;

  const mentionedUsers = getMentionedUsers(comment);

  const data = {
    repository: {
      name: repository.name,
      url: repository.html_url,
    },
    issue: {
      number: issue.number,
      title: issue.title,
      url: issue.html_url,
    },
    comment: {
      text: comment.body,
      author: getAuthor(comment),
      author_url: comment.user.html_url,
      author_thumb: comment.user.avatar_url,
      url: comment.html_url,
    },
  };

  await Promise.all(mentionedUsers.map(mentionedUser => notifyUser(mentionedUser, data)));

  return EVERYTHING_OK;
};
