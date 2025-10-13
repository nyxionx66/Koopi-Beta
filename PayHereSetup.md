# PayHere Integration Setup Guide

This guide will walk you through the process of setting up your PayHere account and connecting it to your Koopi store to handle Pro plan subscriptions.

---

## Step 1: Get Your PayHere Credentials

1.  **Log in to your PayHere Dashboard.**
2.  Navigate to the **Settings** section.
3.  You will find your **Merchant ID** and **Merchant Secret**.
4.  Copy both of these values.

---

## Step 2: Configure Your Domain

1.  In your PayHere Dashboard, go to the **Domains & Credentials** tab.
2.  Add your domain to the list of approved domains. For local development, you will need to use a tool like `ngrok` to get a public URL.

---

## Step 3: Update Your Environment File

1.  Open the `.env.local` file in your project.
2.  Fill in the values you copied from the previous steps:

    ```
    # .env.local

    # ... other keys

    # PayHere
    PAYHERE_MERCHANT_ID=your_payhere_merchant_id
    PAYHERE_MERCHANT_SECRET=your_payhere_merchant_secret
    ```

    -   Replace `your_payhere_merchant_id` with your PayHere Merchant ID.
    -   Replace `your_payhere_merchant_secret` with your PayHere Merchant Secret.

---

## Step 4: Restart Your Development Server

After updating the `.env.local` file, you must restart your development server for the changes to take effect.

Your PayHere integration is now fully configured!