# Stripe sandbox verification

Verified 2026-10-18 in the signed-in **deluxtreme sandbox**, with Stripe explicitly showing Sandbox and reporting `livemode: false` on each checkout. No API key was used or saved. No payment, subscription, or customer was submitted.

## Test links

These public links are test-only fixtures, not consumer pricing or production checkout.

| Offering          | Price                       | Sandbox Payment Link                                |
| ----------------- | --------------------------- | --------------------------------------------------- |
| Annual membership | EUR 60.00 / year            | https://buy.stripe.com/test_00w00i9sx2b5g213MGdIA00 |
| Monthly support   | EUR 10.00 / month           | https://buy.stripe.com/test_eVq5kCdIN6rl3fffvodIA01 |
| One-time donation | Customer chooses EUR amount | https://buy.stripe.com/test_00w8wOcEJ8zt1774QKdIA02 |

The sandbox initially had no Payment Links. Created two fixed recurring products/prices and one customer-chosen one-time donation link. All three are active. Optional customer name, address, phone, tax collection, free trials, and adjustable quantities were not enabled. Stripe's own checkout may still collect necessary customer/payment information; the catalog does not.

## Consumer membership test links

Created and checked on 2026-11-07 in **deluxtreme sandbox**. These seven recurring links match the consumer preview prices; they are separate from the generic fixtures above. Every hosted checkout displayed **Sandbox**, the matching product name, EUR amount, and monthly or annual billing interval. No payment or subscription was submitted during this check.

| Membership      | Price             | Sandbox Payment Link                                |
| --------------- | ----------------- | --------------------------------------------------- |
| Basic annual    | EUR 120.00 / year | https://buy.stripe.com/test_dRm28q8ot2b53ffab4dIA03 |
| Basic monthly   | EUR 11.00 / month | https://buy.stripe.com/test_eVqfZg48d3f9033erkdIA04 |
| Plus annual     | EUR 160.00 / year | https://buy.stripe.com/test_9B64gy7kp171dTTbf8dIA05 |
| Plus monthly    | EUR 15.00 / month | https://buy.stripe.com/test_fZu4gydIN4jd9DDcjcdIA06 |
| Builder annual  | EUR 220.00 / year | https://buy.stripe.com/test_14A28q48d4jd3ff1EydIA07 |
| Builder monthly | EUR 20.00 / month | https://buy.stripe.com/test_eVqfZg8oteXRg21bf8dIA08 |
| Alumni annual   | EUR 10.00 / year  | https://buy.stripe.com/test_fZubJ048d8zt9DDbf8dIA09 |

`bun run build:nms-sandbox` enables these seven options plus the existing one-time donation. All eight links were present in both English and German in the compiled page. Default and consumer preview builds remain inert. Monthly membership amounts are independent of annual prices; Stripe may also display an annual price's monthly equivalent, explicitly billed annually.

Each new link uses quantity one with adjustment disabled, no free trial, and no optional name, address, phone, tax ID, or automatic tax collection enabled. Stripe still collects required payment/customer information for subscriptions. The app gains no payment status or membership activation behavior.

## Reproduce

```sh
bun install --frozen-lockfile
bun run build:sandbox
bun run preview
```

`build:sandbox` writes a self-contained `dist/index.html` with an explicit sandbox title and these three test links. CI also publishes this as the `contribute-sandbox-html` artifact. It replaces the current contents of `dist/`. The default `bun run build` continues to use inert placeholder links; rebuild before handing off a normal catalog. No keys, backend, Stripe SDK, or new dependencies are required.

## Observed results

On 2026-11-07, the initial consumer sandbox build's donation button was also manually checked: it opened the existing one-time donation checkout, displaying **deluxtreme sandbox**, **Sandbox**, and the editable EUR amount. No payment was submitted. The subsequent update enables the matching membership links listed above. CI publishes `contribute-nms-sandbox-html` separately.

To try a successful card payment yourself, select card payment and use `4242 4242 4242 4242`, a future expiry such as `12/34`, and CVC `123`. Use test details for other fields and leave saving payment information unchecked. Confirm the page shows Sandbox before submitting. These are [Stripe's documented test values](https://docs.stripe.com/testing); never enter real card details. A Stripe confirmation is only a simulated payment, and the catalog does not display payment status or activate a membership.

- Navigated from each link in the compiled catalog to its actual Stripe-hosted checkout.
- Annual checkout showed the intended sandbox merchant, EUR 60.00 per year, and “EUR 5.00 / month billed annually.” Stripe's read-only order summary reported EUR 6000 minor units and `livemode: false`.
- Monthly checkout showed EUR 10.00 per month. Stripe's order summary reported EUR 1000 minor units and `livemode: false`.
- Donation checkout displayed an editable one-time EUR amount. Entering 12.34 without customer/payment information produced EUR 1234 minor units and `livemode: false` in the order summary.
- Returning to the catalog did not produce a payment-success or membership-activation claim.

This verifies local link resolution, navigation, currency, and displayed billing terms. Payment completion, subscription creation, renewal, receipts, asynchronous payment handling, refunds, and production-link validation remain outside this check. The app deliberately has no fulfillment or subscription-state logic.

Sandbox links belong to the operator's test account and may be deactivated later. Production use requires account-owned live links and finalized consumer content, tracked in #7.
