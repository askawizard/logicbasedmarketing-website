# Logic Based Marketing — Image Assets Database

**Last Updated:** 2026-02-26
**Purpose:** Comprehensive audit and reference for all image assets used across the Logic Based Marketing website. This doc tracks what exists, what's missing, and what should be created.

---

## Current Assets

### Active Images (images/ folder)

| Filename | Path | Dimensions | Format | File Size | Current Usage | Notes |
|----------|------|-----------|--------|-----------|---------------|-------|
| `headshot.jpg` | `/images/headshot.jpg` | 800×800px | JPEG | ~110KB | Homepage hero, all OG:image tags (index, blog, vegas, etc.) | Tyler's headshot. Good quality, square crop. Currently over-used as fallback OG image. |
| `Tyler Sass Head Shot.jfif` | `/images/Tyler Sass Head Shot.jfif` | 800×800px | JFIF | ~112KB | Not currently used in HTML | Duplicate of headshot.jpg, different filename. Archive or consolidate. |

---

## Referenced but Missing Images

Images referenced in HTML/meta tags that do NOT currently exist in `/images/`:

| Image File | Referenced in | Page | Status |
|------------|---------------|------|--------|
| `cac-statistics-og.jpg` | og:image meta tag | `/blog/customer-acquisition-cost-statistics.html` | MISSING |
| `og-fire-agency.jpg` | og:image meta tag | `/blog/how-to-fire-bad-marketing-vendor.html` | MISSING |
| `og-default.jpg` | og:image meta tag | `/blog/pre-growth-hire-checklist.html`, `/blog/what-40-businesses-taught-real-cac.html` | MISSING |
| `revenue-leak-report-og.jpg` | og:image meta tag | `/blog/revenue-leak-report.html` | MISSING |
| `og-revops-small-business.jpg` | og:image meta tag | `/blog/revenue-operations-small-business.html` | MISSING |
| `logo.png` | schema.org JSON-LD | All blog posts | MISSING |

**Impact:** All blog posts currently fall back to headshot.jpg for social sharing. This significantly hurts click-through rates and brand consistency on LinkedIn, Twitter, and Facebook.

---

## Recommended Image Assets to Create

### Priority Tier 1: Social Sharing / OG Images (1200×630px)

Create page-specific OG images for social media sharing and search result previews. Currently all use `headshot.jpg`, which doesn't reinforce messaging.

**Why:** B2B audiences see these on LinkedIn. They influence whether a prospect clicks through. Generic headshot = lower CTR.

#### Blog Posts — Page-Specific OG Images

| Article Slug | File Suggestion | What It's For | Current Title | Recommended Visual |
|--------------|-----------------|---------------|----------------|-------------------|
| `customer-acquisition-cost-statistics.html` | `og-cac-statistics.jpg` | Social sharing for CAC stats article | "Customer Acquisition Cost Statistics 2026" | Bold chart: $181 (reported) vs. $2,800 (blended). Dark background, lime green accent text. |
| `how-to-fire-bad-marketing-vendor.html` | `og-fire-agency.jpg` | Social sharing for vendor breakup guide | "How to Fire a Bad Marketing Vendor" | Concept: partnership dissolving or "X" symbol over vendor relationship. Dark, clean, professional. |
| `pre-growth-hire-checklist.html` | `og-growth-checklist.jpg` | Social sharing for hiring guide | "Pre-Growth Hire Checklist" | Checklist visual with key items. Clean, actionable feel. |
| `what-40-businesses-taught-real-cac.html` | `og-40-businesses.jpg` | Social sharing for case study insights | "What 40 Businesses Taught Me About Real CAC" | Icon of 40 companies (silhouettes) + stat showing 16x growth or recovery number. |
| `revenue-leak-report.html` | `og-revenue-leak.jpg` | Social sharing for report | "Revenue Leak Report" | Visual: money/cash flowing out of funnel, or dashboard with red alerts. Conveys urgency. |
| `revenue-operations-small-business.html` | `og-revops-small-business.jpg` | Social sharing for SMB RevOps | "Revenue Operations for Small Business" | Charts/dashboards representing SMB (smaller scale). Shows operational complexity. |
| `revenue-operations-statistics.html` | `og-revops-stats.jpg` | Social sharing for RevOps stats | "Revenue Operations Statistics" | Bold stat visual (multiple data points). Professional, data-driven aesthetic. |
| `marketing-attribution-guide.html` | `og-attribution-guide.jpg` | Social sharing for attribution explainer | "Marketing Attribution Guide" | Multi-touch funnel visual showing attribution across channels. Data-focused. |
| `revenue-leak-audit-process.html` | `og-audit-process.jpg` | Social sharing for audit methodology | "Revenue Leak Audit Process" | Process flow or checklist. 5-7 steps visualized cleanly. |
| `founder-guide-revenue-operations.html` | `og-founder-guide.jpg` | Social sharing for founder playbook | "Founder's Guide to Revenue Operations" | Roadmap or strategic visual. Conveys executive-level thinking. |
| `best-tools-fractional-cro-revops.html` | `og-tools-stack.jpg` | Social sharing for tool guide | "Best Tools for Fractional CRO & RevOps" | Simple icon grid showing 4–6 tools (HubSpot, Klaviyo, etc.). Clean layout. |

#### Homepage & Core Pages — OG Images

| Page | File Suggestion | Current OG | Recommended Visual |
|------|-----------------|-----------|-------------------|
| `index.html` | `og-logic-based.jpg` | headshot.jpg | Hero messaging: "You don't have a leads problem. Find the real revenue leak." + stat ($161K/month). Dark theme, lime accent. |
| `pricing.html` | `og-pricing.jpg` | (inferred to use headshot) | Pricing tiers with "$161K/month recovered" callout. Conveys value. |
| `blog.html` | `og-blog-hub.jpg` | headshot.jpg | Blog hub visual: collection of article previews or "insights" theme. |
| `vegas.html` | `og-vegas-local.jpg` | headshot.jpg | "Fractional CRO in Las Vegas" + map pin or local indicator. Geo-specific. |
| `calculator.html` | `og-calculator.jpg` | (inferred) | "Revenue Leak Calculator" with sample output or funnel visualization. Interactive feel. |
| `one-pager.html` | `og-one-pager.jpg` | (inferred) | Professional one-pager mockup or "executive summary" visual. |
| `proposal.html` | `og-proposal.jpg` | (inferred) | Proposal template visual (professional document aesthetic). |
| `self-assessment.html` | `og-self-assessment.jpg` | (inferred) | Assessment results visual or diagnostic dashboard mockup. |

**Spec for All OG Images:**
- **Dimensions:** 1200×630px (standard OG image ratio)
- **Format:** JPG (excellent compression, universal support)
- **Text:** Always include headline + one key stat or value prop
- **Branding:** Dark background (#0a0a0a or #111111), lime green accent (#c8f65a), Inter font
- **File Size Target:** <150KB
- **Placement:** Save to `/images/` and update corresponding meta tag in HTML

---

### Priority Tier 2: Blog Featured Images / Hero Images

Create header images for each blog post. These improve visual hierarchy, reduce "wall of text" fatigue, and serve as fallback images if OG image isn't set.

**Why:** Long-form blog content needs visual breaks. Data-driven visuals build credibility. Stock photos of smiling businesspeople destroy credibility on a B2B analytics/ops blog.

| Article | File Suggestion | Dimensions | Recommended Visual |
|---------|-----------------|-----------|-------------------|
| `customer-acquisition-cost-statistics.html` | `blog-hero-cac-stats.jpg` | 1200×600px | Chart/table showing CAC breakdowns. Real data aesthetic. Use screenshot or custom infographic. |
| `how-to-fire-bad-marketing-vendor.html` | `blog-hero-vendor-breakup.jpg` | 1200×600px | Icon/concept: partnership ending, or "exit strategy" visual. No cheesy illustrations. |
| `revenue-leak-report.html` | `blog-hero-revenue-leak.jpg` | 1200×600px | Dashboard mockup or funnel with "leak" highlighted. Represent the diagnostic process visually. |
| `marketing-attribution-guide.html` | `blog-hero-attribution.jpg` | 1200×600px | Multi-touch attribution flowchart or funnel. Show customer journey across channels. |
| `revenue-operations-statistics.html` | `blog-hero-revops-stats.jpg` | 1200×600px | Multiple data visualizations (bar chart, pie, line graph). Professional, clean. |
| `23-signs-revenue-operations-broken.html` | `blog-hero-revops-broken.jpg` | 1200×600px | Broken dashboard, red warning icons, or "diagnostic" visual. Communicates problem-finding. |
| `cac30-metric.html` | `blog-hero-cac30.jpg` | 1200×600px | CAC30 metric visual: "blended cost of acquiring customer within first 30 days." Stat-focused. |
| `fully-loaded-blended-cac.html` | `blog-hero-blended-cac.jpg` | 1200×600px | Comparison graphic: platform-reported vs. fully-loaded. Shows the gap visually. |
| All other blog posts | `blog-hero-[slug].jpg` | 1200×600px | Custom visualization relevant to post topic. No stock photos. |

**Why These Matter:**
- Improve organic search CTR (Google shows hero image in search results)
- Increase blog shareability on LinkedIn, Twitter
- Professionalize content appearance
- Break up long text blocks for reader retention

**Placement:** Add to top of blog HTML as:
```html
<img src="../images/blog-hero-[slug].jpg" alt="Article topic description" class="blog-hero">
```

---

### Priority Tier 3: Trust Signals / Partner Logos

Create recognizable logo assets for tools mentioned throughout the site. These increase perceived credibility and reduce friction for prospects who use these tools.

**Why:** "We integrate with your stack" is a major buying signal. Logos remind prospects their tools work with your service.

#### Integration / Platform Logos (to create or source)

| Tool | File Suggestion | Dimensions | Where Used | Notes |
|------|-----------------|-----------|-----------|-------|
| HubSpot | `logo-hubspot.svg` | 200×40px | Best tools guide, blog posts | Check HubSpot brand guidelines; they prefer horizontal logo |
| Klaviyo | `logo-klaviyo.svg` | 200×40px | Best tools guide, SMB RevOps post | Email marketing partner |
| QuickBooks | `logo-quickbooks.svg` | 200×40px | Finance integration mentions | Financial reporting tool |
| Salesforce | `logo-salesforce.svg` | 200×40px | Tool stack, best tools guide | CRM powerhouse |
| Stripe | `logo-stripe.svg` | 200×40px | Payment flow mentions | Payment processing |
| Shopify | `logo-shopify.svg` | 200×40px | E-commerce RevOps mentions | Platform integration |
| Google Analytics | `logo-google-analytics.svg` | 200×40px | Attribution guide, analytics posts | Data foundation |
| Segment | `logo-segment.svg` | 200×40px | Data integration posts | CDP platform |
| Mixpanel | `logo-mixpanel.svg` | 200×40px | Product analytics mentions | Product tracking |
| Amplitude | `logo-amplitude.svg` | 200×40px | Product analytics mentions | Product analytics |

**Spec:**
- **Format:** SVG (scalable, small file size, professional)
- **Color Handling:** Use official brand colors; ensure dark background compatibility
- **Size:** 200×40px for horizontal integration (test against dark bg)
- **Placement:** Group logos in "integrations" section or methodology steps

**Action:** Download official SVGs from brand CDNs or request from vendor partnerships. Avoid screenshot/rasterized versions.

---

### Priority Tier 4: Data Visualizations / Infographics

Create custom graphics that tell Logic Based Marketing's story visually.

**Why:** The $161K/month recovery and 16× growth are powerful stats. Visualize them to increase memorability and shareability.

#### Key Visualizations to Create

| Graphic | File Suggestion | Dimensions | Concept | Where Used |
|---------|-----------------|-----------|---------|-----------|
| CAC Gap Chart | `infographic-cac-gap.jpg` | 800×600px | Side-by-side: Reported CAC ($181) vs. Blended CAC ($2,800). Show the hidden costs visually. | Homepage, CAC stats blog, OG images |
| 16× Growth Visual | `infographic-16x-growth.jpg` | 800×600px | Before/after funnel or growth trajectory showing 16× net income improvement. | Homepage hero, case study mentions |
| Revenue Leak Funnel | `infographic-leak-funnel.jpg` | 1000×600px | Funnel diagram with money leaking at each stage. Show where audits typically find gaps. | Revenue leak blog, homepage |
| RevOps Process Flow | `infographic-revops-process.jpg` | 1000×600px | 5–7 step methodology (Audit → Analysis → Strategy → Implementation → Monitoring). | RevOps guide, homepage |
| $161K/month Recovery | `infographic-recovery.jpg` | 800×400px | Visual representation of $161,000. Show what that actually means (headcount, tools, etc.). | Case study, testimonial sections |
| LTV:CAC Ratio Chart | `infographic-ltv-cac.jpg` | 800×500px | Show healthy vs. unhealthy LTV:CAC ratios. Educational asset for blog. | Attribution guide, CAC stats |

**Placement:** Include in blog posts, hero sections, and downloadable resources.

---

### Priority Tier 5: Tyler's Headshot Variants

The existing `headshot.jpg` (800×800px) should have derivatives for different contexts.

**Why:** One image doesn't work everywhere. Avatar crop ≠ about page crop ≠ social profile image.

| Variant | File Suggestion | Dimensions | Use Case | Notes |
|---------|-----------------|-----------|----------|-------|
| Avatar / Circle | `tyler-avatar-circle.jpg` | 400×400px | Team pages, bios, author profiles | Crop to face, round corners or masking |
| Square for Social | `tyler-social-avatar.jpg` | 500×500px | LinkedIn, Twitter, email signatures | Slightly wider headroom, professional attire fill |
| Wide (2:1 ratio) | `tyler-about-hero.jpg` | 800×400px | About page hero, speaker section | Show shoulders, partial body. Conveys approachability. |
| Vertical (Letterbox) | `tyler-vertical.jpg` | 400×800px | Mobile hero, vertical story sections | Portrait orientation, fills mobile hero |

**Action:** Crop existing headshot or commission new photos with multiple framing options.

---

### Priority Tier 6: Case Study Visuals

Redacted screenshots and before/after comparisons add credibility to "Prime USA Scales" references.

**Why:** "We found $161K/month in losses" is stronger with visual evidence. Screenshots (redacted) > testimonial text.

| Asset | File Suggestion | Dimensions | Concept | Where Used |
|-------|-----------------|-----------|---------|-----------|
| Before Dashboard | `case-study-before-dashboard.jpg` | 1200×800px | Dashboard showing missed revenue leaks (redacted sensitive data) | Case study page, homepage |
| After Dashboard | `case-study-after-dashboard.jpg` | 1200×800px | Same dashboard after optimization—showing recovered value | Case study page |
| Conversion Flow (Before) | `case-study-funnel-before.jpg` | 800×600px | Funnel with leak points highlighted | Blog posts about recovery |
| Conversion Flow (After) | `case-study-funnel-after.jpg` | 800×600px | Optimized funnel showing improved metrics | Case study, methodology |
| Attribution Model | `case-study-attribution.jpg` | 1000×600px | Multi-touch attribution showing how revenue actually flows | Attribution guide blog |

**Guidelines:**
- Redact company name, sensitive metrics (revenue, profit %)
- Keep platform UI visible (HubSpot, GA, etc.) for credibility
- Show the *methodology*, not just results (educates, not just sells)

---

### Priority Tier 7: Icons & UI Elements

Custom icons improve brand cohesion and reduce reliance on external icon libraries.

**Why:** Professional B2B sites use consistent, custom iconography. It builds polish and brand recognition.

#### Methodology Step Icons

Create 5–7 icons representing the Logic Based Marketing process:

| Step | File Suggestion | Concept | Where Used |
|------|-----------------|---------|-----------|
| Audit | `icon-audit.svg` | Magnifying glass + dashboard | Homepage methodology, RevOps guide |
| Analyze | `icon-analyze.svg` | Chart/graph with insights | Process flow, blog |
| Strategy | `icon-strategy.svg` | Lightbulb or roadmap | Process flow |
| Execute | `icon-execute.svg` | Checkmark or gears | Process flow |
| Monitor | `icon-monitor.svg` | Dashboard/eye | Process flow |
| Optimize | `icon-optimize.svg` | Upward arrow | Process flow |

**Spec:**
- Format: SVG
- Size: 64×64px (scales infinitely)
- Color: Lime green accent (#c8f65a) or inherit text color
- Style: Minimal, geometric, no gradients

---

## Unused / Archival

| Filename | Location | Status | Action |
|----------|----------|--------|--------|
| `Tyler Sass Head Shot.jfif` | `/images/` | Duplicate of headshot.jpg | Archive or delete; consolidate to .jpg |

---

## Implementation Checklist

### Phase 1: Quick Wins (1–2 weeks)
- [ ] Create 3 generic blog OG images (`og-default.jpg`, `og-cac-statistics.jpg`, `og-fire-agency.jpg`)
- [ ] Add missing `logo.png` (simple L wordmark, 200×200px)
- [ ] Update HTML meta tags to reference new OG images instead of headshot.jpg
- [ ] Test OG images on LinkedIn preview tool

### Phase 2: Blog Visual Enhancement (2–3 weeks)
- [ ] Create hero images for top 5 blog posts (CAC stats, revenue leak, RevOps guide, vendor breakup, attribution)
- [ ] Insert hero images into blog HTML
- [ ] Verify mobile responsiveness

### Phase 3: Trust & Credibility (3–4 weeks)
- [ ] Source official SVG logos for 10 integration partners (HubSpot, Klaviyo, etc.)
- [ ] Create integration logo grid for "Best Tools" blog post
- [ ] Create 2–3 data visualization infographics (CAC gap, 16× growth, revenue leak)

### Phase 4: Case Study & Tyler Variants (4–5 weeks)
- [ ] Prepare/redact case study dashboard screenshots
- [ ] Create Tyler headshot variants (avatar, social, wide, vertical)
- [ ] Add case study images to blog and homepage

### Phase 5: Polish & SEO (5–6 weeks)
- [ ] Optimize all JPGs for web (compress, lazy load)
- [ ] Add alt text to all images
- [ ] Update schema.org image references
- [ ] Test image load performance

---

## Technical Notes

### File Organization
```
/images/
├── headshot.jpg                    (current)
├── tyler-avatar-circle.jpg         (variant)
├── tyler-social-avatar.jpg         (variant)
├── tyler-about-hero.jpg            (variant)
├── tyler-vertical.jpg              (variant)
├── og-logic-based.jpg              (homepage OG)
├── og-pricing.jpg                  (pricing OG)
├── og-blog-hub.jpg                 (blog hub OG)
├── og-vegas-local.jpg              (Vegas page OG)
├── og-cac-statistics.jpg           (blog OG)
├── og-fire-agency.jpg              (blog OG)
├── og-growth-checklist.jpg         (blog OG)
├── [... other OG images ...]
├── blog-hero-cac-stats.jpg         (blog hero)
├── blog-hero-vendor-breakup.jpg    (blog hero)
├── [... other blog heros ...]
├── infographic-cac-gap.jpg         (data viz)
├── infographic-16x-growth.jpg      (data viz)
├── [... other infographics ...]
├── case-study-before-dashboard.jpg (case study)
├── case-study-after-dashboard.jpg  (case study)
├── [... other case study images ...]
├── logo-hubspot.svg                (integration)
├── logo-klaviyo.svg                (integration)
├── [... other logos ...]
├── icon-audit.svg                  (icon)
├── icon-analyze.svg                (icon)
├── [... other icons ...]
└── logo.png                        (schema.org, favicon)
```

### Image Optimization
- **JPG:** Use quality 75–80 for OG/hero images, compress to <150KB
- **SVG:** Always use SVG for logos and icons (scalable, small file size)
- **Alt text:** Every image must have descriptive alt text for SEO
- **Lazy loading:** Implement `loading="lazy"` on blog hero images

### SEO Considerations
- OG images improve LinkedIn/Twitter CTR by 30–40%
- Blog hero images improve organic CTR (Google shows in results)
- Alt text on images boosts SEO and accessibility
- Schema.org image URLs must be absolute (full domain path)

### B2B Image Philosophy
**Do:**
- Use real dashboards, charts, and data visualizations
- Show process flows and methodology
- Display logos of tools/integrations
- Use professional photography (clean, minimal)
- Keep dark background with lime green accents

**Don't:**
- Stock photos of smiling businesspeople
- Generic abstract graphics
- Blurry or low-resolution images
- Outdated tool logos or platform screenshots
- Anything that doesn't reinforce credibility

---

## Vendor/External Resources

### Design & Inspiration
- **Design reference:** Stripe, Figma, Intercom (B2B SaaS visual standards)
- **Icon source:** Feather Icons (MIT), Heroicons, IcoMoon
- **Color:** Use brand lime (#c8f65a) as accent, dark theme (#0a0a0a) as base

### Stock Photo Alternatives (if needed)
- Unsplash (free, high quality)
- Pexels (free, curated)
- Envato (paid, professional)
- Avoid: Shutterstock generic "business people" packs

### Logo Downloads
- HubSpot: https://www.hubspot.com/brand-resources
- Klaviyo: https://www.klaviyo.com/brand
- Salesforce: https://www.salesforce.com/company/legal/intellectual-property/
- Others: Check vendor websites for official brand assets

---

## Questions for Tyler

1. **Case Study Screenshots:** Do you have redacted dashboard/conversion funnel screenshots from Prime USA Scales? These would dramatically improve credibility.
2. **Tyler Headshot:** Want a professional photo shoot to create multiple variants (wide, square, vertical) for different page contexts?
3. **Animation Budget:** Are animated GIFs or SVG animations acceptable for data viz? (Can increase engagement by 10–15%.)
4. **Color Variants:** Any reason not to use lime accent (#c8f65a) in infographics, or prefer white/gray neutrality?
5. **Chart Tools:** Any preference for how to create data visualizations? (Figma, Canva, custom design?)

---

**Next Step:** Prioritize which tier to build first based on traffic & conversion impact. Phase 1 (OG images) has the fastest ROI for social sharing.
