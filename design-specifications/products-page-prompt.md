# Products Page Design Specification for Pure HTML/CSS/JS Implementation

## Overview
Create a comprehensive products management page with Arabic RTL support, modern design aesthetics, and responsive layout. The page should follow Apple-level design principles with clean, sophisticated visual presentation.

## Page Structure & Layout

### 1. Header Section
- **Background**: Primary green gradient (`#388E3C` to `#2E7D32`)
- **Height**: 64px (4rem)
- **Content**: 
  - Left: Hamburger menu button (white, hover: `rgba(255,255,255,0.1)`)
  - Center: Page title "إدارة المنتجات" (white, 18px font)
  - Right: App version button + notification bell with red badge
- **Typography**: Cairo font family, RTL direction
- **Shadow**: `0 4px 6px rgba(0,0,0,0.1)`

### 2. Main Content Container
- **Background**: Gradient from white to `#f8f9fa`
- **Padding**: 24px on desktop, 16px on mobile
- **Max-width**: 100% with proper overflow handling
- **Direction**: RTL (right-to-left)

### 3. Action Bar (Top Section)
- **Layout**: Flexbox, space-between alignment
- **Gap**: 16px between elements
- **Mobile**: Stack vertically with full-width buttons

#### Title Section (Right)
- **Main Title**: "إدارة المنتجات" - 32px font, bold, `#212529`
- **Subtitle**: "إدارة شاملة لجميع منتجات متجرك" - 16px, `#6c757d`

#### Action Buttons (Left)
Three buttons in a row:
1. **Sales Button**: 
   - Background: `#198754` (green)
   - Text: "عملية بيع" with TrendingUp icon
   - Hover: `#157347`
   - Shadow: `0 4px 12px rgba(25,135,84,0.3)`

2. **Purchase Button**:
   - Background: `#0d6efd` (blue)
   - Text: "عملية شراء" with ShoppingBag icon
   - Hover: `#0b5ed7`
   - Shadow: `0 4px 12px rgba(13,110,253,0.3)`

3. **Add Product Button**:
   - Background: `#388E3C` (primary green)
   - Text: "إضافة منتج جديد" with Plus icon
   - Hover: `#2E7D32`
   - Shadow: `0 4px 12px rgba(56,142,60,0.3)`

**Button Specs**:
- Height: 40px
- Padding: 8px 16px
- Border-radius: 8px
- Font-weight: 500
- Transition: all 200ms ease
- Hover: slight scale (1.02) + enhanced shadow

### 4. Products List Card

#### Card Container
- **Background**: White with subtle gradient to `#f8f9fa`
- **Border-radius**: 12px
- **Shadow**: `0 8px 32px rgba(0,0,0,0.12)`
- **Border**: 1px solid `rgba(222,226,230,0.4)`
- **Padding**: 32px on desktop, 16px on mobile

#### Card Header
- **Title**: "قائمة المنتجات (20)" with Package icon
- **Font**: 24px bold, `#388E3C` color
- **Icon**: 32px, same color as title
- **Margin-bottom**: 32px

#### View Toggle (Right side of header)
- **Container**: Rounded background `#f8f9fa` with padding 12px
- **Buttons**: Grid/List toggle buttons
- **Active state**: White background with shadow
- **Inactive state**: Transparent
- **Icons**: Grid and List icons, 24px

#### Search Section
- **Layout**: Flexbox with gap 16px
- **Search Input**:
  - Width: 100% (flex-grow)
  - Height: 64px on desktop, 40px on mobile
  - Padding: 16px 56px 16px 16px (RTL)
  - Border: 1px solid `#dee2e6`
  - Border-radius: 8px
  - Font-size: 20px on desktop, 14px on mobile
  - Placeholder: "البحث بالاسم، الفئة أو رقم الإختصار..."
  - Search icon: Positioned left, 24px, `#6c757d`
  - Focus: Border `#388E3C`, shadow `0 0 0 3px rgba(56,142,60,0.1)`

- **Voice Search Button**:
  - Background: White border `#dee2e6`
  - Hover: `#388E3C` background
  - Icon: Microphone, 16px
  - Text: "بحث صوتي" (hidden on mobile)
  - Active state: Red background for recording

### 5. Products Grid/List Display

#### Grid View (Desktop: 3 columns, Mobile: 2 columns)
**Product Card Specifications**:

- **Container**:
  - Background: White with gradient to `#f8f9fa`
  - Border-radius: 16px
  - Shadow: `0 4px 16px rgba(0,0,0,0.08)`
  - Border: 1px solid `#e9ecef`
  - Padding: 24px on desktop, 12px on mobile
  - Hover: Scale 1.02, enhanced shadow
  - Transition: all 300ms ease

- **Header Section**:
  - Product name: 18px bold, `#212529`
  - Badges: Category, Low stock, Expiring soon
  - Dropdown menu: Three dots, right-aligned

- **Info Grid** (4 columns on desktop):
  1. **Quantity Section**:
     - Background: `#f8f9fa` to `#e9ecef` gradient
     - Border-radius: 12px
     - Padding: 20px
     - Icon: Package, 24px, `#6c757d`
     - Value: 32px bold, red if low stock
     - Unit: 14px, `#6c757d`

  2. **Purchase Price**:
     - Background: Blue gradient `#e3f2fd` to `#bbdefb`
     - SAR price: 20px bold, `#1976d2`
     - YER price: 16px, `#1565c0`

  3. **Selling Price**:
     - Background: Green gradient `#e8f5e8` to `#c8e6c8`
     - SAR price: 20px bold, `#2e7d32`
     - YER price: 16px, `#1b5e20`

  4. **Profit Margin**:
     - Background: Purple gradient `#f3e5f5` to `#e1bee7`
     - Percentage: 20px bold with trend icon
     - Color: Green for positive, red for negative

#### List View
- **Row Layout**: 12-column grid
- **Columns**: Name (3), Quantity (2), Purchase (3), Selling (3), Actions (1)
- **Row Height**: 80px minimum
- **Hover**: Background `#f8f9fa`
- **Border**: Bottom 1px solid `#e9ecef`

### 6. Empty State
- **Icon**: Package, 96px, `#6c757d` with 40% opacity
- **Title**: 24px, `#495057`
- **Description**: 18px, `#6c757d`
- **Padding**: 96px vertical

### 7. Product Form Modal (Add/Edit)

#### Modal Overlay
- **Background**: `rgba(0,0,0,0.5)`
- **Backdrop-filter**: blur(4px)
- **Z-index**: 1000

#### Modal Content
- **Width**: 90vw on mobile, 1024px max on desktop
- **Height**: 85vh on mobile, 90vh max on desktop
- **Background**: White
- **Border-radius**: 16px on desktop, 8px on mobile
- **Shadow**: `0 20px 60px rgba(0,0,0,0.3)`

#### Form Sections
1. **Basic Info**: Name, Unit, Category
2. **Pricing**: Purchase price, currency, profit type, profit value
3. **Inventory**: Current quantity, minimum quantity, expiry date
4. **Description**: Textarea for additional details

**Form Field Specs**:
- **Labels**: 16px medium, `#495057`
- **Inputs**: Height 48px, padding 12px, border `#ced4da`
- **Focus**: Border `#388E3C`, shadow `0 0 0 3px rgba(56,142,60,0.1)`
- **Required fields**: Red asterisk

### 8. Color System

#### Primary Colors
- **Primary Green**: `#388E3C`
- **Primary Dark**: `#2E7D32`
- **Primary Light**: `#4CAF50`

#### Status Colors
- **Success**: `#198754`
- **Warning**: `#fd7e14`
- **Error**: `#dc3545`
- **Info**: `#0dcaf0`

#### Neutral Colors
- **Background**: `#ffffff`
- **Surface**: `#f8f9fa`
- **Border**: `#dee2e6`
- **Text Primary**: `#212529`
- **Text Secondary**: `#6c757d`

#### Gradients
- **Primary**: `linear-gradient(135deg, #388E3C 0%, #2E7D32 100%)`
- **Surface**: `linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)`
- **Card**: `linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)`

### 9. Typography System

#### Font Family
- **Primary**: 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
- **Direction**: RTL (right-to-left)

#### Font Sizes
- **Desktop Title**: 32px (2rem)
- **Desktop Subtitle**: 20px (1.25rem)
- **Desktop Body**: 16px (1rem)
- **Desktop Caption**: 14px (0.875rem)
- **Mobile Title**: 24px (1.5rem)
- **Mobile Subtitle**: 18px (1.125rem)
- **Mobile Body**: 14px (0.875rem)
- **Mobile Caption**: 12px (0.75rem)

#### Font Weights
- **Light**: 300
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### 10. Spacing System (8px base)
- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
- **2xl**: 48px (3rem)

### 11. Shadow System
- **sm**: `0 2px 8px rgba(0,0,0,0.06)`
- **md**: `0 4px 16px rgba(0,0,0,0.08)`
- **lg**: `0 8px 32px rgba(0,0,0,0.12)`
- **xl**: `0 16px 64px rgba(0,0,0,0.16)`

### 12. Border Radius
- **sm**: 4px
- **md**: 8px
- **lg**: 12px
- **xl**: 16px

### 13. Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### 14. Interactive States

#### Hover Effects
- **Buttons**: Scale 1.02, enhanced shadow
- **Cards**: Scale 1.02, shadow upgrade
- **Links**: Color change to primary

#### Focus States
- **Outline**: 2px solid primary color
- **Offset**: 2px
- **Shadow**: `0 0 0 3px rgba(primary, 0.1)`

#### Active States
- **Buttons**: Scale 0.98
- **Cards**: Slight shadow reduction

### 15. Animations & Transitions
- **Default**: 200ms ease
- **Slow**: 300ms ease
- **Fast**: 150ms ease
- **Hover**: all 200ms ease
- **Focus**: all 150ms ease

### 16. Accessibility Requirements
- **Contrast**: Minimum 4.5:1 for normal text
- **Touch Targets**: Minimum 44px on mobile
- **Focus Indicators**: Visible and high contrast
- **Screen Reader**: Proper ARIA labels and roles
- **Keyboard Navigation**: Full keyboard accessibility

### 17. Mobile Specific Considerations
- **Bottom Navigation**: Fixed bottom bar with 5 main sections
- **Touch Gestures**: Swipe support for cards
- **Viewport**: Prevent horizontal scroll
- **Safe Areas**: Respect device safe areas
- **Performance**: Optimize for mobile devices

### 18. Loading States
- **Skeleton**: Animated placeholders matching content structure
- **Shimmer**: Subtle animation across skeleton elements
- **Spinners**: For button loading states
- **Progressive**: Load critical content first

This specification provides a complete blueprint for recreating the products page with pixel-perfect accuracy and modern web standards.