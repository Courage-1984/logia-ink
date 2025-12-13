# Plausible Analytics: Custom Properties & Funnels Setup Guide

**Last Updated:** 2025-01-30  
**Status:** ✅ Implemented

This guide explains how to set up and use Custom Properties and Funnels in Plausible Analytics for the Logi-Ink website.

---

## Table of Contents

1. [Overview](#overview)
2. [Custom Properties Implementation](#custom-properties-implementation)
3. [Setting Up Custom Properties in Plausible Dashboard](#setting-up-custom-properties-in-plausible-dashboard)
4. [Funnels Setup Guide](#funnels-setup-guide)
5. [Tracked Events Reference](#tracked-events-reference)
6. [Testing & Verification](#testing--verification)
7. [Troubleshooting](#troubleshooting)

---

## Overview

### What Are Custom Properties?

Custom Properties (also known as custom dimensions in Google Analytics) allow you to attach additional metadata to pageviews and custom events. This enables you to:

- Filter and segment your analytics data
- Track page types, user actions, and conversion sources
- Analyze user behavior across different sections of your site
- Create more detailed reports and insights

### What Are Funnels?

Funnels track the user journey through specific conversion paths. They help you:

- Identify where users drop off in the conversion process
- Measure conversion rates at each step
- Optimize your site to improve conversions
- Understand the complete user flow from landing to conversion

---

## Custom Properties Implementation

### Important: Property Limits & Validation

Our implementation includes automatic validation to ensure compliance with Plausible's requirements:

- **Maximum 30 properties per event** - Excess properties are automatically truncated
- **Property names limited to 300 characters** - Names exceeding this are truncated
- **Property values limited to 2000 characters** - Values exceeding this are truncated
- **PII Protection** - Automatically blocks potentially personally identifiable information (emails, phone numbers, etc.)
- **Type Conversion** - All values are automatically converted to strings (Plausible requirement)

**PII Detection:** The system automatically detects and blocks:
- Email addresses (patterns containing `@` and `.`)
- Phone numbers (various formats)
- Common PII keywords (email, phone, address, ssn, passport, credit, card)

### Page-Level Custom Properties

All pages automatically track the following custom properties with every pageview:

- **`pageType`**: Type of page (e.g., 'home', 'services', 'contact', 'about', 'projects', 'pricing', 'seo-services', 'legal')
- **`pageName`**: Human-readable page name (e.g., 'Home', 'Services', 'Contact')
- **`path`**: Current page pathname

**Implementation Location:** All HTML files (`index.html`, `about.html`, `contact.html`, etc.)

**Code Example:**
```javascript
plausible.init({
  customProperties: function(eventName) {
    // This function is called for every event (pageviews and custom events)
    // eventName parameter allows conditional property assignment if needed
    const path = window.location.pathname;
    return {
      pageType: 'contact',
      pageName: 'Contact',
      path: path
    };
  }
});
```

**Note:** The `customProperties` function receives `eventName` as a parameter. You can use it to conditionally return properties (e.g., only for pageviews), but in our implementation, we return page-level properties for all events to maintain consistent tracking.

### Event-Level Custom Properties

Custom events track additional properties specific to each action. These are sent using the manual JavaScript method:

```javascript
plausible('Event Name', {
  props: {
    property1: 'value1',
    property2: 'value2'
  }
});
```

**Implementation Details:**
- Properties are automatically validated for PII (Personally Identifiable Information)
- Property names are limited to 300 characters
- Property values are limited to 2000 characters
- Maximum 30 properties per event
- All values are converted to strings (Plausible requirement)

**Tracked Events:**

#### Contact Form Submission
- **Event:** `Contact Form Submit`
- **Properties:**
  - `subject`: Form subject field value
  - `source`: Where form was submitted from (e.g., 'contact-page')
  - `page`: Current page pathname

**Implementation:** `js/pages/contact.js`

#### Service Modal Open
- **Event:** `Service Modal Open`
- **Properties:**
  - `service`: Name of the service
  - `source`: Where modal was opened from (e.g., 'services-page')
  - `page`: Current page pathname

**Implementation:** `js/pages/services.js`

#### Project View
- **Event:** `Project View`
- **Properties:**
  - `project`: Name of the project
  - `source`: Where project was viewed from (e.g., 'projects-page')
  - `page`: Current page pathname

**Implementation:** `js/pages/projects.js`

#### CTA Click
- **Event:** `CTA Click`
- **Properties:**
  - `text`: Button text
  - `location`: Where CTA is located (e.g., 'hero', 'cta-section', 'section')
  - `destination`: Where CTA leads (href value)
  - `page`: Current page pathname

**Implementation:** `js/utils/analytics.js` (automatic tracking)

---

## Setting Up Custom Properties in Plausible Dashboard

### Step 1: Access Site Settings

1. Log in to your Plausible Analytics dashboard
2. Select your site (`logi-ink.co.za`)
3. Click on **Settings** in the left sidebar
4. Navigate to **Properties** tab

### Step 2: Add Custom Properties

For each custom property you want to track, click **"Add property"** and enter:

#### Required Properties (Already Implemented)

1. **`pageType`**
   - **Description:** Type of page being viewed
   - **Values:** home, services, contact, about, projects, pricing, seo-services, legal, other

2. **`pageName`**
   - **Description:** Human-readable page name
   - **Values:** Home, Services, Contact, About, Projects, Pricing, SEO Services, Terms of Service, Privacy Policy, Other

3. **`subject`** (for Contact Form Submit events)
   - **Description:** Subject of contact form submission
   - **Values:** Dynamic (user input)

4. **`service`** (for Service Modal Open events)
   - **Description:** Name of service viewed
   - **Values:** Dynamic (service names from your site)

5. **`project`** (for Project View events)
   - **Description:** Name of project viewed
   - **Values:** Dynamic (project names from your site)

6. **`location`** (for CTA Click events)
   - **Description:** Location of CTA button
   - **Values:** hero, cta-section, section, unknown

7. **`source`** (for various events)
   - **Description:** Source of the action
   - **Values:** contact-page, services-page, projects-page, etc.

### Step 3: Verify Properties Are Tracking

1. Navigate to your Plausible dashboard
2. Go to **Goal Conversions** section
3. Click on **Properties** tab
4. You should see your custom properties listed
5. Click on a property to see its values and associated metrics

**Note:** Properties will only appear after they've been tracked at least once. Visit your site and trigger some events to generate data.

---

## Funnels Setup Guide

### Understanding Funnels

Funnels track a sequence of steps that users take before converting. Each step can be:
- A **pageview goal** (visiting a specific page)
- A **custom event** (triggering a specific action)

### Recommended Funnels for Logi-Ink

#### Funnel 1: Contact Form Conversion

**Purpose:** Track users from landing to contact form submission

**Steps:**
1. **Step 1:** Pageview → `/` (Home page)
2. **Step 2:** Pageview → `/services` OR `/pricing` OR `/about` (Engagement)
3. **Step 3:** Pageview → `/contact` (Contact page visit)
4. **Step 4:** Custom Event → `Contact Form Submit` (Conversion)

**Use Case:** Measure how many visitors start on homepage, engage with content, visit contact page, and actually submit the form.

#### Funnel 2: Service Discovery to Contact

**Purpose:** Track users who discover services and then contact

**Steps:**
1. **Step 1:** Pageview → `/services` (Services page)
2. **Step 2:** Custom Event → `Service Modal Open` (Service interest)
3. **Step 3:** Pageview → `/contact` (Contact page visit)
4. **Step 4:** Custom Event → `Contact Form Submit` (Conversion)

**Use Case:** Measure service discovery → interest → contact → conversion flow.

#### Funnel 3: Project Portfolio to Contact

**Purpose:** Track users viewing portfolio and converting

**Steps:**
1. **Step 1:** Pageview → `/projects` (Projects page)
2. **Step 2:** Custom Event → `Project View` (Project interest)
3. **Step 3:** Custom Event → `CTA Click` (Call-to-action engagement)
4. **Step 4:** Custom Event → `Contact Form Submit` (Conversion)

**Use Case:** Measure portfolio engagement → CTA click → form submission.

#### Funnel 4: Pricing Page to Contact

**Purpose:** Track pricing page visitors to conversions

**Steps:**
1. **Step 1:** Pageview → `/pricing` (Pricing page)
2. **Step 2:** Custom Event → `CTA Click` (Pricing CTA click)
3. **Step 3:** Pageview → `/contact` (Contact page visit)
4. **Step 4:** Custom Event → `Contact Form Submit` (Conversion)

**Use Case:** Measure pricing page effectiveness in driving conversions.

### How to Create a Funnel

1. **Access Funnel Settings:**
   - Log in to Plausible Analytics
   - Select your site
   - Go to **Settings** → **Funnels**

2. **Create New Funnel:**
   - Click **"Add funnel"** button
   - Enter a descriptive name (e.g., "Contact Form Conversion")

3. **Define Funnel Steps:**
   - Click **"Add step"** for each step in your funnel
   - For pageview goals: Select "Pageview" and enter the path (e.g., `/contact`)
   - For custom events: Select "Custom Event" and enter the event name (e.g., `Contact Form Submit`)
   - Add steps in the order users should complete them

4. **Save Funnel:**
   - Click **"Save"** button
   - Funnel will appear at the bottom of your dashboard once data starts flowing

### Funnel Best Practices

- **Start Simple:** Begin with 2-3 step funnels, then expand
- **Use Clear Names:** Name funnels descriptively (e.g., "Homepage to Contact")
- **Test Regularly:** Verify funnels are tracking correctly after setup
- **Monitor Drop-offs:** Focus on steps with high drop-off rates
- **Segment by Properties:** Use custom properties to filter funnel data (e.g., by `pageType` or `source`)

---

## Tracked Events Reference

### Automatic Events

These events are tracked automatically without additional code:

| Event Name | Trigger | Custom Properties |
|------------|---------|-------------------|
| Pageview | Every page load | `pageType`, `pageName`, `path` |
| CTA Click | Click on CTA buttons | `text`, `location`, `destination`, `page` |

### Manual Events

These events require specific user actions:

| Event Name | Trigger | Custom Properties | Implementation |
|------------|---------|-------------------|----------------|
| Contact Form Submit | Form submission success | `subject`, `source`, `page` | `js/pages/contact.js` |
| Service Modal Open | Service modal opened | `service`, `source`, `page` | `js/pages/services.js` |
| Project View | Project modal opened | `project`, `source`, `page` | `js/pages/projects.js` |

### Performance Events (Already Implemented)

These events are tracked by `js/utils/performance.js`:

| Event Name | Trigger | Custom Properties |
|------------|---------|-------------------|
| Web Vital - LCP | Largest Contentful Paint | `value`, `rating`, `navigationType`, `id`, `path` |
| Web Vital - CLS | Cumulative Layout Shift | `value`, `rating`, `navigationType`, `id`, `path` |
| Web Vital - INP | Interaction to Next Paint | `value`, `rating`, `navigationType`, `id`, `path` |
| Page Load Metrics | Page load complete | `path`, `dns`, `tcp`, `request`, `response`, `domProcessing`, `loadTime` |

---

## Testing & Verification

### Testing Custom Properties

1. **Open Browser DevTools Console**
2. **Manually trigger an event:**
   ```javascript
   // Test contact form submission tracking
   window.plausible('Contact Form Submit', {
     props: {
       subject: 'Test Subject',
       source: 'contact-page',
       page: '/contact'
     }
   });
   ```

3. **Check Plausible Dashboard:**
   - Go to **Goal Conversions** → **Properties** tab
   - Look for your custom property values
   - Verify events are appearing with correct properties

### Testing Funnels

1. **Complete the Funnel Steps:**
   - Manually navigate through your funnel steps
   - Trigger each event in sequence
   - Wait a few minutes for data to sync

2. **Verify in Dashboard:**
   - Go to your Plausible dashboard
   - Scroll to **Funnels** section (bottom of dashboard)
   - Check that your funnel appears and shows data
   - Verify conversion rates and drop-off percentages

### Development Mode

In development mode (`NODE_ENV !== 'production'`), analytics events are logged to the console instead of being sent to Plausible. This helps with debugging without polluting production data.

**Example Console Output:**
```
[Analytics] Would track: Contact Form Submit {props: {subject: "Test", source: "contact-page", page: "/contact"}}
```

---

## Troubleshooting

### Custom Properties Not Appearing

**Problem:** Custom properties don't show up in Plausible dashboard

**Solutions:**
1. **Verify Property Setup:**
   - Ensure properties are added in Plausible Settings → Properties
   - Check that property names match exactly (case-sensitive)

2. **Check Event Tracking:**
   - Verify events are being triggered (check browser console)
   - Ensure Plausible script is loaded correctly
   - Check for JavaScript errors in console

3. **Wait for Data:**
   - Properties only appear after at least one event with that property
   - Wait a few minutes for data to sync

4. **Verify Property Values:**
   - Ensure values are strings (not objects or arrays) - automatically handled by our implementation
   - Check that values don't exceed 2000 characters - automatically truncated
   - Verify no PII (personally identifiable information) is included - automatically blocked
   - Check browser console for validation warnings in development mode

### Funnels Not Tracking

**Problem:** Funnels show no data or incorrect data

**Solutions:**
1. **Verify Step Definitions:**
   - Check that pageview paths match exactly (including leading slash)
   - Verify custom event names match exactly (case-sensitive)
   - Ensure steps are in the correct order

2. **Check Event Names:**
   - Custom event names must match exactly (including spaces and capitalization)
   - Use the exact event names from the [Tracked Events Reference](#tracked-events-reference)

3. **Test Each Step:**
   - Manually trigger each step and verify it appears in Goals
   - Check that events are being tracked correctly

4. **Wait for Data:**
   - Funnels require at least one complete conversion to appear
   - Wait a few minutes for data to sync

### Events Not Firing

**Problem:** Custom events aren't being tracked

**Solutions:**
1. **Check Plausible Script:**
   - Verify Plausible script is loaded: `typeof window.plausible === 'function'`
   - Check for script loading errors in Network tab

2. **Verify Event Code:**
   - Check that `trackEvent()` or specific tracking functions are called
   - Verify no JavaScript errors in console
   - Ensure elements exist before tracking (check for null/undefined)

3. **Development Mode:**
   - In development, events log to console instead of sending
   - Check console for `[Analytics]` messages

4. **Ad Blockers:**
   - Some ad blockers may block Plausible
   - Test in incognito mode or disable ad blockers

---

## Additional Resources

- [Plausible Custom Properties Documentation](https://plausible.io/docs/custom-props/introduction)
- [Plausible Funnels Documentation](https://plausible.io/docs/funnel-analysis)
- [Plausible Custom Events Guide](https://plausible.io/docs/custom-event-goals)

---

## Implementation Files

- **Analytics Utility:** `js/utils/analytics.js`
- **Contact Form Tracking:** `js/pages/contact.js`
- **Service Modal Tracking:** `js/pages/services.js`
- **Project View Tracking:** `js/pages/projects.js`
- **CTA Tracking:** `js/utils/analytics.js` (automatic)
- **Page-Level Properties:** All HTML files (`index.html`, `about.html`, `contact.html`, etc.)

---

**Questions or Issues?** Check the [Troubleshooting](#troubleshooting) section or review the implementation files listed above.

