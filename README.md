# Alba Vintage

A purpose-built multi-channel inventory control centre for vintage clothing.

## Current scaffold

- Next.js control-panel UI
- PostgreSQL master inventory schema
- n8n sale-routing workflow
- n8n inventory reconciliation workflow
- Google Sheets bookkeeping target
- Shopify / eBay / Depop connector placeholders
- Secure credential architecture documentation

## Important

This repository is a **starter integration scaffold**, not yet a production-connected marketplace integration. No API keys are included. Configure credentials inside n8n and connect the approved marketplace APIs before activating workflows.

For one-of-one inventory, the safety model is:

**Database = source of truth → n8n = automation → marketplaces = channels → reconciliation = safety net.**

## Next build step

Connect the actual Shopify and eBay APIs, obtain/confirm Depop Selling API access, then add authenticated Next.js server routes for inventory and settings. A Settings panel can safely manage connection configuration when those writes happen server-side; it should never expose n8n or marketplace secrets to the browser.
