const { getMentionedUsers, getAuthor } = require('../utils');
const { notifyMention } = require('../slack');

const { OOPS_NO_HANDLER, EVERYTHING_OK } = require('../constants/messages');

module.exports = async ({ action, issue, comment, repository }) => {
  if (action === 'deleted' || action === 'edited') return OOPS_NO_HANDLER;

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
      url: comment.html_url,
      author: getAuthor(sender),
      author_url: sender.html_url,
      author_thumb: sender.avatar_url,
    },
  };

  await Promise.all(mentionedUsers.map(mentionedUser => notifyMention(mentionedUser, data)));

  return EVERYTHING_OK;
};
