# Cards.css Split Plan

**Current:** 1,470 lines in single file  
**Target:** Split into 8 modular files

## Split Structure

1. **`_card-base.css`** (~150 lines)
   - Services section containers
   - Grid layouts (services-grid, offer-grid, projects-preview)
   - Section video backgrounds
   - Base card structure

2. **`_service-card.css`** (~350 lines)
   - .service-card base styles
   - .service-card-square
   - Service icon styles
   - Service card content (h3, p, links)
   - Basic hover effects

3. **`_pricing-card.css`** (~50 lines)
   - .pricing-card styles
   - Color variants
   - Hover effects

4. **`_project-card.css`** (~150 lines)
   - .project-card-large
   - Project image, overlay, tag
   - Project content styles

5. **`_offer-panel.css`** (~250 lines)
   - .offer-panel base
   - Color variants
   - Panel elements (header, list, actions)
   - Add-ons section
   - Responsive styles

6. **`_card-variants.css`** (~200 lines)
   - Process card variants
   - Impact card variants
   - FAQ card variants
   - Achievement card variants
   - Project impact variants
   - Success card variants
   - All the mouse-tilt hover color variants

7. **`_card-sections.css`** (~200 lines)
   - Testimonials section styles
   - Expertise section styles
   - Specialized services section styles
   - Values section with stars

8. **`_card-animations.css`** (~120 lines)
   - @keyframes (iconGradientShift, offerPanelEnter, cardScaleGrow, testimonialGradientMove, rotateGradient, starFade, pulse)
   - Animation utilities

**Total:** ~1,470 lines (preserved)

