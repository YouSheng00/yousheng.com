# Formspree — Contact Form Handler

We use [Formspree](https://formspree.io) to receive contact form submissions from the website. It's a third-party form backend that lets a static site (no server) deliver form data straight to an inbox.

## What it powers

The **contact modal** on [about.html](../about.html) — opened by:
- The hero CTA ("Let's build")
- The bottom contact card ("Send a message")

When a visitor submits the form (name, email, phone, message), the data is POSTed to Formspree, which forwards it to `neuyousheng5533@gmail.com`.

## Configuration

- **Endpoint:** `https://formspree.io/f/meedznvz`
- **Form ID:** `meedznvz`
- **Receiving inbox:** `neuyousheng5533@gmail.com`
- **Plan:** Free tier (50 submissions / month)

## Where it's wired

| File | What |
|---|---|
| [about.html](../about.html) | `<form>` `action="..."` attribute; inline submit handler (`fetch` POST with `Accept: application/json`) |
| [styles.css](../styles.css) | `.contact-modal__*` styles (loading state, error banner, success view) |

## Behaviour

- **Success** → green check + "Message sent" view inside the modal; form resets
- **Error** → red-tinted error banner above the submit button; button re-enables for retry
- **Loading** → submit button disabled, arrow spins, label changes to "Sending…"

## Managing the form

Sign in at [formspree.io](https://formspree.io) to:
- View submissions
- Add spam protection (reCAPTCHA)
- Customise the notification email subject/sender
- Upgrade plan if 50/month is exceeded

## First submission

The first real submission triggers a Formspree confirmation email. Click the link in that email to activate delivery — after that, submissions arrive directly with no further action needed.
