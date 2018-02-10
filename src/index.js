const express = require('express');
const bodyParser = require('body-parser');
const Slack = require('slack-node');
const { promisify } = require('util');
const users = require('./users.json');

const app = express();
const slack = promisify(new Slack(process.env.SLACK_TOKEN).api);

const notifyUser = async (mention, data) => {
  const im = await slack('im.open', {
    user: mention.slack,
  });

  const attachments = [
    {
      color: '#4682b4',
      author_name: data.repository.name,
      author_link: data.repository.url,
      title: `Issue #${data.issue.number}`,
      title_link: data.issue.url,
      text: data.issue.title,
    },
    {
      color: '#4682b4',
      author_name: data.comment.author,
      author_link: data.comment.author_url,
      title: 'Comment',
      title_link: data.comment.url,
      text: data.comment.text,
      thumb_url: data.comment.author_thumb,
    },
  ];

  const message = await slack('chat.postMessage', {
    channel: im.channel.id,
    text: `Mentioned by <@${data.comment.author}>`,
    attachments: JSON.stringify(attachments),
  });

  console.log('Message sent:\n', message);
};

app.use(bodyParser.json());

app.post('/payload', async (req, res) => {
  const { action, issue, comment, repository } = req.body;

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

  res.status(200).send('User notified.');
});

app.listen(3000, () => console.log('Listening to 3000'));
