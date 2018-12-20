const { json } = require('micro');

const issuesHandler = require('./handlers/issues');
const issueCommentHandler = require('./handlers/issueComment');
const pullRequestReviewCommentHandler = require('./handlers/pullRequestReviewComment');

const { OOPS_NO_HANDLER } = require('./constants/messages');

module.exports = async req => {
  const event = req.headers['x-github-event'];
  const data = await json(req);

  // if (event === 'issues') {
  //   return await issuesHandler(data);
  // }
  if (event === 'issue_comment') {
    return await issueCommentHandler(data);
  }
  // if (event === 'pull_request_review_comment') {
  //   return await pullRequestReviewCommentHandler(data);
  // }

  return OOPS_NO_HANDLER;
};
