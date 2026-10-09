// Enrollment catalog: free audit, one-time purchase, subscription, scholarships, coupons.
// Prices in USD cents. Coupons are demo codes; production validates server-side.
export interface Product { id: string; title: string; blurb: string; kind: 'free' | 'once' | 'sub'; priceCents: number; perks: string[] }

export const PRODUCTS: Product[] = [
  { id: 'free-audit', title: 'Free Audit', blurb: 'Start learning today, pay nothing. Full Level 1 + community.', kind: 'free', priceCents: 0, perks: ['Level 1 (10 lessons)', 'Community + Meet & Greet', 'Upgrade anytime'] },
  { id: 'lifetime', title: 'Lifetime Access', blurb: 'One-time course purchase. All 10 levels + projects + certificates.', kind: 'once', priceCents: 14900, perks: ['All 111 lessons + 10 projects', 'Certificates + reviews', 'Lifetime updates'] },
  { id: 'monthly', title: 'Monthly Plan', blurb: 'Subscription while you learn. Cancel anytime, keep certificates.', kind: 'sub', priceCents: 1900, perks: ['Everything in Lifetime', 'Pause or cancel anytime', 'Best for 3–6 month finishers'] },
];

export interface Coupon { code: string; pctOff: number; note: string; needsApplication?: boolean }

export const COUPONS: Coupon[] = [
  { code: 'WELCOME20', pctOff: 20, note: 'Welcome offer — 20% off Lifetime or Monthly.' },
  { code: 'BUILDER50', pctOff: 50, note: 'Builder grant — 50% off for first projects.' },
  { code: 'SCHOLAR100', pctOff: 100, note: 'Full scholarship — needs a 20+ character application.', needsApplication: true },
];

export const SCHOLARSHIP_PROMPT = 'Why do you need free access, and what will you build in 90 days? (20+ characters)';
