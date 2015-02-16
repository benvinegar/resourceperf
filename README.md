# resourceperf

This is the source code for resourceperf.com, a non-existent website because the code is like 1% finished.

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

## Running

```bash
npm start
```

Then visit [http://localhost:30000](http://localhost:30000)