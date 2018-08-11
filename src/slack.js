const { WebClient } = require('@slack/client');

const slack = new WebClient(process.env.SLACK_TOKEN);

module.exports = {
  notifyUser: async (mentionedUser, { repository, issue, pull_request, comment }) => {
    const im = await slack.im.open({
      user: mentionedUser.slack,
    });

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

    slack.chat.postMessage({
      channel: im.channel.id,
      text: `Mentioned by <@${comment.author}>`,
      attachments: JSON.stringify(attachments),
    });
  },
};
