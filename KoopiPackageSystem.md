# Koopi Subscription Plans

This document outlines the package system for Koopi sellers.

---

## Plan Tiers

### 1. Free Plan

- **Price:** LKR 0/month
- **Products:** Up to 15 product listings
- **Website Customization:**
  - Limited access to themes
  - Basic color and font options
  - Koopi branding in the footer
- **Support:** Standard email support

### 2. Pro Plan

- **Price:** LKR 500/month
- **Products:** Unlimited product listings
- **Website Customization:**
  - Full access to all themes and layouts
  - Advanced branding control (custom colors, all fonts)
  - Remove Koopi branding
- **Support:** Priority email and chat support
- **Additional Features:**
  - Detailed analytics
  - Access to marketing tools (when available)
  - Featured placement opportunities

---

## Implementation Plan

1.  **Database:** Update the `users` collection to include a `subscription` object with `plan` ('free' or 'pro'), `status` ('active', 'trialing', 'cancelled'), and `productCount`.
2.  **Signup:** Assign the 'free' plan to all new users by default upon registration.
3.  **Product Limit:** Implement a check on the "Add New Product" page to prevent users on the 'free' plan from creating more than 15 products.
4.  **UI Integration:**
    -   Add a "Pricing" section to the main landing page.
    -   Create a "Subscription" or "Billing" page in the seller dashboard to manage plans.
    -   Display plan information and limitations within the dashboard UI.
5.  **Feature Gating:** Restrict access to advanced website customization options for users on the 'free' plan.
6.  **Order Tracking UI:** Redesign the seller-facing order tracking page for a better user experience.