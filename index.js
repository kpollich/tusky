require('dotenv').config()

const axios = require('axios')
const EventSource = require('eventsource')

const STREAMING_ENDPOINT = `${process.env.MASTODON_URL}/api/v1/streaming/public`
const URL = `${STREAMING_ENDPOINT}?access_token=${process.env.ACCESS_TOKEN}`

const source = new EventSource(URL)

source.addEventListener('update', event => {
  // Rip out the data we care about from the event payload
  const data = JSON.parse(event.data)
  const { uri, content } = data
  const { avatar, username } = data.account

  // Build the "status" URL so Slack will properly unfurl our link later
  const statusId = uri.match(/statuses\/([0-9]+)/)[1]
  const statusUrl = `${process.env.MASTODON_URL}/web/statuses/${statusId}`

  // Look for an image (href property) so we can include it in the Slack payload
  // and get an image preview to unfurl
  const imageLinkMatch = content.match(/href="([^"]*)"/)

  const text = !!imageLinkMatch
    ? `New post from ${username} on Memestodon!\n<${statusUrl}>\n${imageLinkMatch[1]}`
    : `New post from ${username} on Memestodon!\n<${statusUrl}>`

  const payload = {
    text,
    unfurl_links: true
  }

  axios.post(process.env.SLACK_WEBHOOK_ENDPOINT, payload).catch(error => {
    console.error(error)
  })
})

source.onerror = error => {
  console.error('Error occurred in Mastodon stream', error)
}

source.onclose = () => {
  console.log('Connection to Mastodon closed')
}
