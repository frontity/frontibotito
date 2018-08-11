const { json } = require('micro');

const issueHandler = require('./handlers/issueHandler');
const pullRequestHandler = require('./handlers/pullRequestHandler');

const { OOPS_NO_HANDLER } = require('./constants/messages');

module.exports = async request => {
  const req = await json(request);

  if (req.issue) return issueHandler(req);
  if (req.pull_request) return pullRequestHandler(req);

  return OOPS_NO_HANDLER;
};
