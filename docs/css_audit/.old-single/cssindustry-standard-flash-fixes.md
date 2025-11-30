This documentation outlines the industry-standard CSS properties and techniques used to manage and mitigate the negative user experience associated with **FOIT** (Flash of Invisible Text) and **FOUT** (Flash of Unstyled Text).

The goal of these techniques is to prioritize **text visibility** (avoiding FOIT) and **minimize layout shift** (reducing FOUT/CLS).

-----

## 1\. Primary Control: The `font-display` Descriptor

The `font-display` descriptor, used within the `@font-face` rule, is the single most important tool for controlling how a web font is loaded and displayed. It defines a mandatory block period (where text is invisible, causing **FOIT**) and an optional swap period (where text uses a fallback, causing **FOUT**).

| `font-display` Value | Block Period | Swap Period | Effect on Text | Recommended Use |
| :--- | :--- | :--- | :--- | :--- |
| **`swap`** | Extremely short (often 0s) | Indefinite | Shows fallback font immediately (**FOUT**), then swaps to the custom font. **Avoids FOIT.** | **Most common recommendation** for readability and performance. Text is always visible. |
| **`block`** | 3 seconds | Indefinite | **Hides text** for up to 3 seconds (**FOIT**), then displays it with the custom font. If the font doesn't load after the swap period, it continues to use the fallback (or remains invisible on some older browsers). | **Use with caution** for critical brand fonts where a flash of the wrong font is unacceptable, or when using font-size-adjust for metric matching. |
| **`fallback`** | Short (approx. 100ms) | Short (approx. 3s) | **Hides text** briefly (mild **FOIT**), then displays the fallback (**FOUT**). If the custom font loads quickly, it's used. If it loads late, the fallback is used permanently. | For non-essential fonts where rapid loading or permanent fallback is acceptable. |
| **`optional`** | Extremely short (often 0s) | Extremely short (often 0s) | The browser decides whether to load the font based on connection speed. If the font is not cached, the browser may skip loading it entirely for that page view. | For purely aesthetic fonts where its absence does not impact design or function. Avoids both FOIT and FOUT (by not loading the font). |

### Actionable Audit Step 1 (AAS-1)

> **CHECK:** Audit every `@font-face` declaration in the codebase.
> **GOAL:** Ensure all critical text fonts use `font-display: swap;` to eliminate FOIT and prioritize text visibility. Re-evaluate if any font uses `block` and justify the potential 3-second visibility delay.

-----

## 2\. Speed Optimization: Preloading and Self-Hosting

While `font-display: swap` fixes FOIT, it still results in FOUT. The best way to reduce FOUT is to simply make the custom font load *faster*.

### Technique 2.1: Preloading (High Priority Fonts)

Use the `rel="preload"` attribute to tell the browser to fetch the font asset much earlier in the critical rendering path. This accelerates the font loading, minimizing the duration of the FOUT.

```html
<link rel="preload" 
  href="/fonts/MyCustomFont.woff2" 
  as="font" 
  type="font/woff2" 
  crossorigin> 
```

| Attribute | Purpose |
| :--- | :--- |
| `rel="preload"` | Initiates an early fetch for the resource. |
| `as="font"` | Tells the browser it's a font, which allows it to apply appropriate resource prioritization. |
| `type="font/woff2"` | Optional, but improves performance by allowing the browser to skip the download if it doesn't support the format. |
| `crossorigin` | **MANDATORY** for font preloads, even if the font is on the same domain, as fonts are fetched using an anonymous cross-origin request. |

### Technique 2.2: Self-Hosting

If your fonts are hosted externally (e.g., Google Fonts, Adobe Fonts), consider self-hosting them (downloading the files and serving them from your own CDN/server). This eliminates an external DNS lookup and connection handshake, often significantly improving performance and reducing FOUT duration. **Ensure you use the highly compressed `woff2` format.**

### Actionable Audit Step 2 (AAS-2)

> **CHECK:** Review all web fonts used on the most critical pages (LCP candidates).
> **GOAL:** Implement `<link rel="preload">` for the WOFF2 files of these high-priority fonts, ensuring the `crossorigin` attribute is present. Migrate all externally loaded fonts to self-hosting if possible and use `woff2`.

-----

## 3\. Minimizing Layout Shift (CLS Reduction)

A layout shift (the "flash" in FOUT) occurs because the custom font and the fallback font have different sizing metrics (width, height, ascent, descent). This can be mitigated using the **CSS Font Metric Adjustments**.

### Technique 3.1: The `font-size-adjust` Property (Fallback only)

The `font-size-adjust` property scales a font's $\text{x-height}$ to match the $\text{x-height}$ of another font, making the fallback font's size more closely match the custom font. This is a client-side solution used in the main CSS rules.

```css
body {
  /* Set the default font stack */
  font-family: 'CustomFont', Arial, sans-serif; 
  
  /* Apply font-size-adjust based on CustomFont's aspect ratio */
  /* If CustomFont has an aspect ratio of 0.5, and Arial has 0.52... */
  /* Using 0.5 will scale Arial down to match CustomFont's x-height */
  font-size-adjust: 0.5;
}
```

### Technique 3.2: The `size-adjust` Descriptors (Modern `@font-face`)

The `@font-face` rule now supports a set of descriptors that allow you to precisely modify the metrics of a font, which is most powerful when applied to the **fallback font** to make it mimic your custom font.

**Steps:**

1.  Identify a suitable **system font** to use as a fallback.
2.  Define a new `@font-face` rule for that system font, giving it a custom family name (e.g., `CustomFont-Fallback`).
3.  Use the `size-adjust` and related descriptors (`ascent-override`, `descent-override`, `line-gap-override`) to match its metrics to your desired web font.

<!-- end list -->

```css
/* 1. Define your custom web font with a fallback stack */
@font-face {
  font-family: 'MyCustomWebFont';
  src: url('/fonts/Custom.woff2') format('woff2');
  font-display: swap; 
}

/* 2. Define a "metric-matched" system font as the engineered fallback */
@font-face {
  font-family: 'MyCustomWebFont-Fallback';
  src: local('Arial'); /* Use a local system font */
  /* These values adjust the system font to align with 'MyCustomWebFont' */
  size-adjust: 105%; 
  ascent-override: 95%; 
  descent-override: 20%; 
  /* font-display should match the main font or be 'optional' */
}

/* 3. Use the engineered fallback in your CSS */
.text-area {
  font-family: 'MyCustomWebFont', 'MyCustomWebFont-Fallback', sans-serif;
}
```

### Actionable Audit Step 3 (AAS-3)

> **CHECK:** Analyze the CLS report for pages impacted by FOUT.
> **GOAL:** For fonts causing significant layout shift, implement the **Font Metric Adjustment** technique. Use tools (e.g., Google Fonts Helper tools) to calculate the precise `size-adjust` values to make the selected fallback font visually match the custom web font, thereby eliminating the jump when the font swaps.

-----

## 4\. Codebase Audit Checklist (For Your Agent)

Use the following checklist to ensure complete coverage for your codebase audit:

| ID | Issue to Look For | Fix/Solution | Priority |
| :--- | :--- | :--- | :--- |
| **A-1** | Text remains invisible for a period (FOIT). | Change `@font-face` to use **`font-display: swap;`**. | **High** |
| **A-2** | Large, visible jump/shift when text reappears (FOUT/CLS). | **Preload** the font file using `<link rel="preload" as="font" crossorigin>`. | **High** |
| **A-3** | Inefficient font file format. | Ensure only **WOFF2** is used for modern browsers, or WOFF/TTF/OTF for fallbacks (if necessary). | **Medium** |
| **A-4** | Font-loading delays on third-party domains. | **Self-host** all necessary font files to eliminate external connection overhead. | **Medium** |
| **A-5** | Fallback and custom fonts have dramatically different metrics (CLS). | Apply **`size-adjust`** and related override descriptors to the system fallback font to match the custom font's metrics. | **High** |
| **A-6** | Loading non-critical font variants (e.g., Bold, Italic) too early. | **Defer** the loading of non-critical variants or use `font-display: optional;` for them. | **Medium** |


