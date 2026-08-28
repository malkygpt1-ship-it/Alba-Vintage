# Credentials and Settings

The starter intentionally does not contain real credentials.

## Recommended production model

1. Store the database connection string and n8n API key as server-side environment variables.
2. Create Shopify, eBay, Depop and Google Sheets credentials in n8n's credential store.
3. Do not put marketplace secrets in `NEXT_PUBLIC_*` variables or browser JavaScript.
4. The Settings UI should only send secrets to a server-side endpoint over HTTPS.
5. That endpoint can provision/update n8n credentials through the n8n API, or store secrets in a dedicated secret manager and have n8n retrieve them server-side.

## Why not inject credentials directly from the browser?

A browser-facing settings form that writes directly into n8n would expose your n8n API key and create a serious privilege-escalation risk. The safe pattern is:

`Browser → authenticated Next.js server route → n8n API / secret store`

## Required connections

- **PostgreSQL:** run `db/schema.sql`.
- **Shopify:** Admin API access + order/inventory webhooks.
- **eBay:** Sell APIs + notification/webhook endpoint.
- **Depop:** Selling API access; Depop API access is subject to their approval/availability.
- **Google Sheets:** OAuth/service-account credential in n8n and a `Sales` sheet.

## Suggested Google Sheets columns

`Date | SKU | Platform | Order ID | Sale Price | Platform Fees | Postage | Cost | Profit`

The database remains authoritative; Sheets is an accounting/reporting mirror.
