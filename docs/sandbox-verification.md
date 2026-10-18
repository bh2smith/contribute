# Stripe sandbox verification

Verified 2026-10-18 in the signed-in **deluxtreme sandbox**, with Stripe explicitly showing Sandbox and reporting `livemode: false` on each checkout. No API key was used or saved. No payment, subscription, or customer was submitted.

## Test links

These public links are test-only fixtures, not consumer pricing or production checkout.

| Offering | Price | Sandbox Payment Link |
| --- | --- | --- |
| Annual membership | EUR 60.00 / year | https://buy.stripe.com/test_00w00i9sx2b5g213MGdIA00 |
| Monthly support | EUR 10.00 / month | https://buy.stripe.com/test_eVq5kCdIN6rl3fffvodIA01 |
| One-time donation | Customer chooses EUR amount | https://buy.stripe.com/test_00w8wOcEJ8zt1774QKdIA02 |

The sandbox initially had no Payment Links. Created two fixed recurring products/prices and one customer-chosen one-time donation link. All three are active. Optional customer name, address, phone, tax collection, free trials, and adjustable quantities were not enabled. Stripe's own checkout may still collect necessary customer/payment information; the catalog does not.

## Reproduce

```sh
npm ci
npm run build:sandbox
npm run preview
```

`build:sandbox` writes a self-contained `dist/index.html` with an explicit sandbox title and these three test links. CI also publishes this as the `contribute-sandbox-html` artifact. It replaces the current contents of `dist/`. The default `npm run build` continues to use inert placeholder links; rebuild before handing off a normal catalog. No keys, backend, Stripe SDK, or new dependencies are required.

## Observed results

- Navigated from each link in the compiled catalog to its actual Stripe-hosted checkout.
- Annual checkout showed the intended sandbox merchant, EUR 60.00 per year, and “EUR 5.00 / month billed annually.” Stripe's read-only order summary reported EUR 6000 minor units and `livemode: false`.
- Monthly checkout showed EUR 10.00 per month. Stripe's order summary reported EUR 1000 minor units and `livemode: false`.
- Donation checkout displayed an editable one-time EUR amount. Entering 12.34 without customer/payment information produced EUR 1234 minor units and `livemode: false` in the order summary.
- Returning to the catalog did not produce a payment-success or membership-activation claim.

This verifies local link resolution, navigation, currency, and displayed billing terms. Payment completion, subscription creation, renewal, receipts, asynchronous payment handling, refunds, and production-link validation remain outside this check. The app deliberately has no fulfillment or subscription-state logic.

Sandbox links belong to the operator's test account and may be deactivated later. Production use requires account-owned live links and finalized consumer content, tracked in #7.
