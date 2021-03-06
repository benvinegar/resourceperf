# resourceperf [![Build Status](https://travis-ci.org/benvinegar/resourceperf.svg?branch=master)](https://travis-ci.org/benvinegar/resourceperf)

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
cp config/database.example.json config/database.json
```

Then edit config/database.json appropriately.

### PostgreSQL Instructions

Local development and CI have been using PostgresQL as the local data store. Here's some instructions to help you get started on OS X.

1. Download and install [Postgres.app](http://postgresapp.com/documentation/cli-tools.html)
 * You'll probably also want to enable Postgres.app's [CLI tools](http://postgresapp.com/documentation/cli-tools.html).

2. Create the database(s)
	```bash
	createdb resourceperf
  createdb resourceperf_test
	```


## Running

Server:

```bash
npm start
```

Tests:

```
npm test
```

Then visit [http://localhost:3000](http://localhost:3000)
