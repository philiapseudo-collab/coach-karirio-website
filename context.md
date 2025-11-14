# Project: Fitness Influencer MVP (Kenya)

## 1. Project Goal

Build a high-conversion, 1-page MVP website for a Kenyan fitness influencer. The primary business objective is **not** to sell a product, but to **build an owned audience** via a high-value lead magnet.

## 2. Core User Flow & Strategy

The strategy is a **phone-first, SMS-based funnel**. We are explicitly **avoiding email** as it is not an effective channel in the target market (Kenya).

1.  **Page:** A single landing page (static, very fast).
2.  **Offer:** A free PDF ("5-Day Fitness Kickstart").
3.  **Action:** The user enters their **phone number** (not email) into a form.
4.  **Consent:** The user *must* check a box to consent to SMS/WhatsApp marketing (Kenya DPA compliance).
5.  **Delivery:** Upon submission, a backend function sends an **SMS** to the user with a link to the PDF.

## 3. Tech Stack

* **Frontend:** **Astro** (for a fast, static site).
* **Styling:** **Tailwind CSS**.
* **Backend:** **Serverless Functions** (e.g., Vercel/Netlify Functions, or a file in `pages/api/` if using Astro's server-side rendering).
* **SMS API:** **Africa's Talking**. We are *not* using Twilio, as Africa's Talking is the market-specific choice for Kenya.

## 4. Key Files & Structure

* `src/pages/index.astro`: The main landing page. This will contain the Hero, the Opt-In Form, Social Proof, and an "Events" promo section.
* `src/pages/api/send-sms.ts` (or similar endpoint): This will be the serverless function that:
    1.  Receives the `POST` request from the `index.astro` form.
    2.  Validates the phone number.
    3.  Makes an API call to the Africa's Talking SMS API.
    4.  Sends the "Here is your plan: [link-to-pdf]" message.

## 5. Key Personas & Roles

* **User:** You are an expert software developer with 30 years of experience, a 200 IQ, and a strategic, product-focused mindset.
* **AI (Cursor):** You are my AI pair-programmer, assisting in the execution of this well-defined plan. Follow the tech stack and strategy outlined above.