# API Workflow: Transaction Alerts

A Node.js script that checks bank transactions through an API and sends a push alert when a spend goes over a set limit.

## What it does

1. Fetches all transactions from a bank API using a bearer token.
2. Picks out debit transactions (amount of zero or less).
3. Converts each debit to GBP using the exchange rate for the transaction date.
4. If a debit is over £15, sends an urgent push notification through [ntfy](https://ntfy.sh).

## Tech

- Node.js (`fetch`, `async/await`, top-level await, ES modules)
- REST APIs with bearer-token authentication
- [ntfy](https://docs.ntfy.sh/publish/) for push notifications
- Secrets kept in a `.env` file, which is not committed

## Error handling

- Stops with a clear message if the transactions request fails or does not return status 200
- Reports failures from the currency-rate request and the notification request separately

## Running it locally

Requires Node.js 20.12 or newer.

1. Clone the repo and install dependencies:
```
   git clone https://github.com/AnaJ-dev/api_workflow.git
   cd api_workflow
   npm install
```
2. Create a `.env` file in the project folder:
```
   bankAPIurl=<base URL of the transactions API>
   APIbearerKey=<your API token>
   currencyPair=<base URL of the exchange-rate API>
```
3. Run it:
```
   node workflow6.js
```

## What I practised

Calling authenticated APIs, chaining several API calls together, keeping secrets out of the code, handling errors at each step, and sending alerts when a condition is met.
