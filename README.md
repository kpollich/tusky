# tusky

A Dockerized Node service for pushing new toots from a [Mastodon](https://api.slack.com/incoming-webhooks) instance to a Slack channel.

![tusky](https://user-images.githubusercontent.com/6766512/33136218-b2c14bba-cf72-11e7-97bf-fa2f4b2018c8.png)

## Running tusky

### What you'll need

* A Mastodon URL and access token
* A Slack "incoming webhook" endpoint
* Docker (Or Node 6+ and Yarn if running natively)

Create a `.env` file in your `tusky` directory that defines the following environment variables:

```bash
ACCESS_TOKEN=mastodon-access-token
MASTODON_URL=https://some-mastodon-instance.com
SLACK_WEBHOOK_ENDPOINT=https://hook.some-slack-instance.com
```

Once you have your environment variables set up, run `docker-compose up -d` to start the container. This will start a `tusky` Docker container in the background. After that you're all set - tusky will listen for new Mastodon toots and post to your configured Slack endpoint to push the toots into your Slack instance.

Note: This doesn't have crash recovery or any real error handling yet, so the docker container may die intermittently. 

## Non-Dockerized Use

Install dependencies with [Yarn](https://yarnpkg.com/en/)

```bash
cd tusky
yarn
```

Start app with `yarn start` or use [nodemon](https://github.com/remy/nodemon) for auto-reloading in development. e.g. `nodemon index.js`.
