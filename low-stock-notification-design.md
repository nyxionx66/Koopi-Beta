# Low-Stock Notification System Design

This document outlines the design for a new system to notify sellers when their product or variant stock is low.

## 1. Firestore Data Model

### `notifications` Collection

A new collection named `notifications` will be created in Firestore to store all notifications for sellers.

**Document Structure:**

Each document in the `notifications` collection will have the following structure:

```typescript
{
  "id": "string", // Unique identifier for the notification
  "userId": "string", // ID of the user (seller) to whom the notification belongs
  "storeId": "string", // ID of the store where the low-stock item is located
  "type": "'LOW_STOCK_PRODUCT' | 'LOW_STOCK_VARIANT'", // Type of notification
  "message": "string", // A human-readable message for the notification
  "productId": "string", // ID of the product that is low on stock
  "productName": "string", // Name of the product
  "variantId": "string | null", // ID of the variant, if applicable
  "variantName": "string | null", // Name of the variant, if applicable
  "remainingStock": "number", // The remaining stock quantity
  "isRead": "boolean", // Flag to indicate if the notification has been read
  "createdAt": "Timestamp" // Timestamp of when the notification was created
}
```

### New `Notification` Type

The following TypeScript type definition should be added to `types.ts` to ensure type safety across the application:

```typescript
export type Notification = {
  id: string;
  userId: string;
  storeId: string;
  type: 'LOW_STOCK_PRODUCT' | 'LOW_STOCK_VARIANT';
  message: string;
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  remainingStock: number;
  isRead: boolean;
  createdAt: any;
};
```

## 2. Backend Logic

A backend process will be implemented as an API route, triggered by a cron job, to check for low stock levels.

**Stock Threshold:**

The stock threshold is defined as **less than or equal to 10**.

**Process Steps:**

1.  **Query Products and Variants:** The process will query all documents from the `products` collection.
2.  **Identify Low-Stock Items:** It will iterate through each product and its variants to identify items where the `inventory` or `variantStock` has fallen below the defined threshold.
3.  **Create Notifications:** For each low-stock item, a new document will be created in the `notifications` collection with the appropriate data.
4.  **Trigger Email:** After creating the notification document, the system will trigger an email to the seller.

## 3. Email Template

The email template will be designed to be clear, concise, and actionable.

**Subject Line:**

`Low Stock Alert for [Product Name]`

**Data Structure:**

The email template will require the following data:

```typescript
interface LowStockEmailData {
  productName: string;
  variantName?: string;
TAIN
  remainingStock: number;
  linkToProduct: string;
}
```

**Email Content:**

The email will use the existing base template and will include the following dynamic content:

-   A clear message indicating that the product or variant is low on stock.
-   The name of the product and variant (if applicable).
-   The remaining stock quantity.
-   A call-to-action button linking directly to the product page in the seller's dashboard.

---