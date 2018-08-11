const { WebClient } = require('@slack/client');

const slack = new WebClient(process.env.SLACK_TOKEN);

module.exports = {
  notifyMention: async (mentionedUser, { repository, issue, pull_request, comment }) => {
    const type = issue || pull_request;
    const color = issue ? '#4682b4' : '#6f42c1';
    const title = issue ? `Issue #${issue.number}` : `Pull Request #${pull_request.number}`;

    const attachments = [
      {
        color,
        author_name: repository.name,
        author_link: repository.url,
        title,
        title_link: type.url,
        text: type.title,
      },
      {
        color,
        author_name: comment.author,
        author_link: comment.author_url,
        title: 'Comment',
        title_link: comment.url,
        text: comment.text,
        thumb_url: comment.author_thumb,
      },
    ];

    await slack.chat.postMessage({
      channel: (await slack.im.open({
        user: mentionedUser.slack,
      })).channel.id,
      text: `Mentioned by <@${comment.author}>`,
      attachments: JSON.stringify(attachments),
    });
  },
  notifyInProduction: async (suscribedUser, { sender, issue }) => {
    const attachments = [
      {
        color: '#BFFF00',
        text: `Issue #${issue.number}`,
        title: issue.title,
        title_link: issue.url,
      },
    ];

    await slack.chat.postMessage({
      channel: (await slack.im.open({
        user: suscribedUser.slack,
      })).channel.id,
      text: `🎉 Released in production 🎉`,
      attachments: JSON.stringify(attachments),
    });
  },
};
