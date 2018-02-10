const { json } = require('micro');
const Slack = require('slack-node');
const { promisify } = require('util');
const users = require('./users.json');

const slack = promisify(new Slack(process.env.SLACK_TOKEN).api);

const notifyUser = async (mention, { repository, issue, comment }) => {
  const im = await slack('im.open', {
    user: mention.slack,
  });

  const attachments = [
    {
      color: '#4682b4',
      author_name: repository.name,
      author_link: repository.url,
      title: `Issue #${issue.number}`,
      title_link: issue.url,
      text: issue.title,
    },
    {
      color: '#4682b4',
      author_name: comment.author,
      author_link: comment.author_url,
      title: 'Comment',
      title_link: comment.url,
      text: comment.text,
      thumb_url: comment.author_thumb,
    },
  ];

  slack('chat.postMessage', {
    channel: im.channel.id,
    text: `Mentioned by <@${comment.author}>`,
    attachments: JSON.stringify(attachments),
  });
};

module.exports = async (req, res) => {
  const { action, issue, comment, repository } = await json(req);

  if (action !== 'deleted') {
    const mentions = users.filter(user => comment.body.match(new RegExp(`@${user.github}`)));

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
        author: users.find(user => user.github === comment.user.login).name,
        author_url: comment.user.html_url,
        author_thumb: comment.user.avatar_url,
        url: comment.html_url,
      },
    };

    mentions.forEach(mention => notifyUser(mention, data));
  }

  return 'User notified';
};
