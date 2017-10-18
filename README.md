# The Church of Memes Cross Poster

Listens to a public [Mastodon](https://mastodon.social/about) feed and cross posts new toots to a Slack channel as configured by an incoming webhook integration.

Expects the following environment variables in a `.env` file

```bash
ACCESS_TOKEN=mastodon-access-token
MASTODON_URL=https://some-mastodon-instance.com
SLACK_WEBHOOK_ENDPOINT=https://hook.some-slack-instance.com
```

Dockerized for your convenience. As long as you `.env` file is set up, just run `docker-compose up -d` to start the container. App runs on a `node:8-alpine` image.

Note: This doesn't have crash recovery or any real error handling yet, so the docker container may die intermittently. 

## Non-Dockerized Use

Install dependencies with [Yarn](https://yarnpkg.com/en/)

```bash
cd churchofmemes-xposter
yarn
```

Start app with `yarn start` or use [nodemon](https://github.com/remy/nodemon) for auto-reloading. e.g. `nodemon index.js`.