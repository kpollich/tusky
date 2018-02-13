require("dotenv").config();

const axios = require("axios");
const EventSource = require("eventsource");

const STREAMING_ENDPOINT = `${
  process.env.MASTODON_URL
}/api/v1/streaming/${process.env.ENDPOINT}`;
const URL = `${STREAMING_ENDPOINT}?access_token=${process.env.ACCESS_TOKEN}`;

const source = new EventSource(URL);

source.addEventListener("update", event => {
  const data = JSON.parse(event.data);
  const text = createSlackMessage(data);

  const payload = {
    text,
    unfurl_links: true
  };

  axios.post(process.env.SLACK_WEBHOOK_ENDPOINT, payload).catch(error => {
    console.error(error);
  });
});

source.onerror = error => {
  console.error("Error occurred in Mastodon stream", error);
};

source.onclose = () => {
  console.log("Connection to Mastodon closed");
};

function createSlackMessage(data) {
  const { uri, content } = data;
  const { username } = data.account;

  // The url is provided in the payload
  const statusUrl = data.url;

  const defaultText = `New post from ${username} on Mastodon!\n<${statusUrl}>`;
  console.log(`Post: ${username} - ${statusUrl}.`);

  // The presence of a `media_attachments` array denotes an uploaded or pasted image. Mastodon handles
  // creating a link tag for these by default, and so they're included in the unfurled message in Slack,
  // so we skip creating an unfurl-friendly link here if it's not required.
  const hasMediaItem = data.media_attachments && data.media_attachments.length;

  // This is an inelegant way of looking for expandable links in the Mastodon payload. By tacking
  // this link on to the end of the Slack message, Slack will unfurl the link. This lets us display
  // images in Slack when a link is posted on Mastodon.
  const imageLinkMatch = content.match(/href="([^"]*)"/);

  // Mastodon posts with no uploaded/pasted items and a link get an unfurl-friendly link appended
  if (!hasMediaItem && !!imageLinkMatch) {
    return `New post from ${username} on Mastodon!\n<${statusUrl}>\n${
      imageLinkMatch[1]
    }`;
  }

  return defaultText;
}
