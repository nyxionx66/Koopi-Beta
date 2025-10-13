# 💰 Currency Replacement Guide - $ to LKR

This document lists all files that need currency symbol replacement from USD ($) to Sri Lankan Rupee (LKR).

## 📋 Task Overview
Replace all instances of `$` with `LKR ` (note the space after LKR) in price displays throughout the application.

---

## 🎯 Files to Update

### 1️⃣ **Store Pages** (Customer-Facing)

#### `/app/app/store/[storeName]/checkout/page.tsx`
**Locations to update:**
- Line ~408: `<p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>`
- Line ~418: `<span className="font-medium">${subtotal.toFixed(2)}</span>`
- Line ~426: `<span>${total.toFixed(2)}</span>`
- Line ~527: `<p className="text-sm font-semibold text-gray-900 mt-1">${item.price.toFixed(2)} each</p>`
- Line ~530: `<p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>`
- Line ~545: `<span className="font-medium">${subtotal.toFixed(2)}</span>`
- Line ~553: `<span className="font-medium">${tax.toFixed(2)}</span>`
- Line ~557: `<span>${total.toFixed(2)}</span>`

**Replace with:** `LKR ${value.toFixed(2)}`

---

#### `/app/app/store/[storeName]/order-confirmation/[orderId]/page.tsx`
**Locations to update:**
- All `$` symbols before `.toFixed(2)` for prices
- Order summary section
- Item prices
- Total calculations

**Replace with:** `LKR ${value.toFixed(2)}`

---

#### `/app/app/store/[storeName]/product/[productId]/page.tsx`
**Locations to update:**
- Product price display
- Any price calculations

**Replace with:** `LKR ${value.toFixed(2)}`

---

#### `/app/app/store/[storeName]/products/[productId]/page.tsx`
**Locations to update:**
- Line ~27 (approximately): Product price display
- Any other price references

**Replace with:** `LKR ${value.toFixed(2)}`

---

#### `/app/app/store/[storeName]/page.tsx`
**Locations to update:**
- Product grid price displays
- Any featured product prices

**Replace with:** `LKR ${value.toFixed(2)}`

---

### 2️⃣ **Buyer Pages** (Customer Dashboard)

#### `/app/app/buyer/track-order/[orderId]/page.tsx`
**Locations to update:**
- Line ~269: `${(item.price * item.quantity).toFixed(2)}`
- Line ~279: `<span className="font-medium">${order.subtotal.toFixed(2)}</span>`
- Line ~283: `<span className="font-medium">${order.shipping.toFixed(2)}</span>`
- Line ~287: `<span className="font-medium">${order.tax.toFixed(2)}</span>`
- Line ~291: `<span>${order.total.toFixed(2)}</span>`

**Replace with:** `LKR ${value.toFixed(2)}`

---

#### `/app/app/buyer/orders/page-old-backup.tsx`
**Locations to update:**
- Line ~177: Order total display

**Replace with:** `LKR ${value.toFixed(2)}`

---

#### `/app/app/buyer/track-order/[orderId]/page-old-backup.tsx`
**Locations to update:**
- All price displays in order items
- Subtotal, shipping, tax, total

**Replace with:** `LKR ${value.toFixed(2)}`

---

### 3️⃣ **Dashboard Pages** (Seller Admin)

#### `/app/app/dashboard/orders/[orderId]/page.tsx`
**Locations to update:**
- Line ~28-30 (approximately): Item price displays
- Order summary calculations
- Total amounts

**Replace with:** `LKR ${value.toFixed(2)}`

---

#### `/app/app/dashboard/orders/page.tsx`
**Locations to update:**
- Order list price displays
- Summary totals

**Replace with:** `LKR ${value.toFixed(2)}`

---

#### `/app/app/dashboard/customers/page.tsx`
**Locations to update:**
- Customer order totals
- Revenue displays

**Replace with:** `LKR ${value.toFixed(2)}`

---

### 4️⃣ **Components** (Reusable UI)

#### `/app/components/Cart.tsx`
**Locations to update:**
- Cart item prices
- Subtotal display
- Total calculations

**Replace with:** `LKR ${value.toFixed(2)}`

---

#### `/app/components/buyer/OrderCard.tsx`
**Locations to update:**
- Order card price display
- Total amount

**Replace with:** `LKR ${value.toFixed(2)}`

---

#### `/app/components/store/ProductCard.tsx`
**Locations to update:**
- Product card price display
- Compare at price (if exists)

**Replace with:** `LKR ${value.toFixed(2)}`

---

#### `/app/components/store/ReviewList.tsx`
**Locations to update:**
- Any price references in reviews

**Replace with:** `LKR ${value.toFixed(2)}`

---

#### `/app/components/store/templates/ClassicProductLayout.tsx`
**Locations to update:**
- Product price display
- Compare at price display

**Replace with:** `LKR ${value.toFixed(2)}`

---

#### `/app/components/store/templates/ModernProductLayout.tsx`
**Locations to update:**
- Product price display
- Compare at price display

**Replace with:** `LKR ${value.toFixed(2)}`

---

#### `/app/components/store/templates/MinimalistProductLayout.tsx`
**Locations to update:**
- Product price display
- Compare at price display

**Replace with:** `LKR ${value.toFixed(2)}`

---

#### `/app/components/store/templates/BoldProductLayout.tsx`
**Locations to update:**
- Product price display
- Compare at price display

**Replace with:** `LKR ${value.toFixed(2)}`

---

## 🔍 Quick Search & Replace Guide

### Method 1: VS Code Global Search & Replace
1. Open VS Code
2. Press `Ctrl+Shift+H` (Windows/Linux) or `Cmd+Shift+H` (Mac)
3. Search: `\$\{(.*?)\.toFixed\(2\)\}`
4. Replace: `LKR \${$1.toFixed(2)}`
5. **IMPORTANT:** Review each replacement before applying!

### Method 2: Manual Find & Replace
For each file listed above:
1. Open the file
2. Find all instances of: `${...toFixed(2)}`
3. Replace `$` with `LKR ` (note the space)
4. Example:
   - **Before:** `${price.toFixed(2)}`
   - **After:** `LKR ${price.toFixed(2)}`

---

## ✅ Verification Checklist

After making replacements, verify the following pages:

- [ ] Product pages show "LKR 100.00" format
- [ ] Shopping cart shows "LKR" for all prices
- [ ] Checkout page shows "LKR" for subtotal, shipping, tax, total
- [ ] Order confirmation shows "LKR" for all amounts
- [ ] Buyer order tracking shows "LKR" for prices
- [ ] Seller dashboard orders show "LKR" for prices
- [ ] All product cards in store show "LKR"

---

## 📝 Notes

1. **Already Updated:**
   - `/app/app/dashboard/products/new/page.tsx` ✅ (Changed to LKR with minimum 100 validation)

2. **Important:**
   - Make sure there's a **space** after "LKR": `LKR 100.00` ✅ (correct)
   - Not: `LKR100.00` ❌ (incorrect)

3. **Format Examples:**
   - Single price: `LKR ${price.toFixed(2)}`
   - Calculated: `LKR ${(price * quantity).toFixed(2)}`
   - With condition: `{shipping === 0 ? 'Free' : `LKR ${shipping.toFixed(2)}`}`

---

## 🚀 Once Complete

After updating all files:
1. Test the entire checkout flow
2. Verify all price displays
3. Check mobile responsive views
4. Test order placement and confirmation
5. Update the ROADMAP.md if needed

---

**Total Files to Update:** 20 files
**Estimated Time:** 30-45 minutes

Good luck! 💪
