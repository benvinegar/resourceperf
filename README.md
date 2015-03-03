# resourceperf

This is the source code for [resourceperf.com](http://resourceperf.com), a non-existent website because the code is like 2% finished.

## What will it be?

Think [jsPerf](http://jsperf.com), but for comparing the different loading characteristics of HTML documents.

Users will be able to create, repeat, and share tests that could compare:

* Whether 4 x 50kb scripts load faster than a single 200kb script
* [async](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#Attributes) vs [defer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#Attributes) vs dynamic script insertion
* Whether multiple hosts for assets (e.g. cdn1.example.com, cdn2.example.com) still offers benefits over a single host
* CDN performance (e.g. Cloudflare vs Akamai vs Fastly vs Cloudfront)
* ... and many other resource-loading scenarios

## Installation

```bash
npm install
mkdir -p config && touch config/config.json
```

Add the following database config template to config.json, and edit accordingly:

```json
{
  "development": {
    "username": "yourusername",
    "password": null,
    "database": "resourceperf",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

### PostgreSQL Instructions

You're welcome to develop locally using whatever data store you want (e.g. SQLite), but I've been using Postgres on OS X. Here's some instructions to help you get started.

1. Download and install [Postgres.app](http://postgresapp.com/documentation/cli-tools.html)
 * You'll probably also want to enable Postgres.app's [CLI tools](http://postgresapp.com/documentation/cli-tools.html).

2. Create the database
	```bash
	createdb resourceperf
	```

3. Install the NodeJS pg module
	```bash
	cd resourceperf && npm install pg
	```


## Running

```bash
npm start
```

Then visit [http://localhost:30000](http://localhost:30000)
