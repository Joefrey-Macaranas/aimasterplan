// Enrollment engine: statuses, pricing with coupons/scholarships, purchases, invoices.
// Pure + tested. Screens persist purchases to AsyncStorage; backend mirrors in Postgres.
import type { EnrollmentStatus } from '../types/models';
import { PRODUCTS, COUPONS } from '../data/enrollment';

export const STATUSES: EnrollmentStatus[] = ['pending', 'active', 'completed', 'suspended'];

export interface Quote { productId: string; subtotal: number; discount: number; total: number; coupon?: string; free: boolean }
export interface Purchase {
  id: string; email: string; productId: string; productTitle: string;
  subtotal: number; discount: number; total: number; coupon?: string;
  at: string; kind: 'free' | 'once' | 'sub' | 'scholarship';
}

export function findCoupon(code: string) {
  const c = code.trim().toUpperCase();
  return COUPONS.find((x) => x.code === c);
}

export function quote(productId: string, couponCode = '', scholarshipText = ''): { ok: boolean; error?: string; quote?: Quote } {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return { ok: false, error: 'Unknown plan.' };
  if (product.kind === 'free') return { ok: true, quote: { productId, subtotal: 0, discount: 0, total: 0, free: true } };
  let pct = 0;
  let coupon: string | undefined;
  if (couponCode.trim()) {
    const c = findCoupon(couponCode);
    if (!c) return { ok: false, error: 'That code is not valid. Try WELCOME20.' };
    if (c.needsApplication && scholarshipText.trim().length < 20) {
      return { ok: false, error: 'SCHOLAR100 needs your story first (20+ characters below).' };
    }
    pct = c.pctOff;
    coupon = c.code;
  }
  const discount = Math.round((product.priceCents * pct) / 100);
  return { ok: true, quote: { productId, subtotal: product.priceCents, discount, total: product.priceCents - discount, coupon, free: product.priceCents - discount === 0 } };
}

export function statusAfterPurchase(kind: Purchase['kind']): EnrollmentStatus {
  return 'active'; // every path (free included) activates immediately in MVP
}

export function statusAfterCompletion(overallPct: number, current: EnrollmentStatus): EnrollmentStatus {
  if (overallPct >= 100) return 'completed';
  return current;
}

export function purchaseIdFor(email: string, productId: string, at: string): string {
  let h = 0;
  for (const c of `${email}::${productId}::${at}`) h = (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0;
  return `INV-${h.toString(16).toUpperCase().padStart(8, '0')}`;
}

export function makePurchase(email: string, productId: string, q: Quote, at = new Date().toISOString()): Purchase {
  const product = PRODUCTS.find((p) => p.id === productId)!;
  const scholarship = (q.coupon === 'SCHOLAR100' || q.free) && product.kind !== 'free';
  return {
    id: purchaseIdFor(email, productId, at), email,
    productId, productTitle: product.title,
    subtotal: q.subtotal, discount: q.discount, total: q.total,
    coupon: q.coupon, at,
    kind: product.kind === 'free' ? 'free' : scholarship ? 'scholarship' : product.kind,
  };
}

export function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function receiptText(p: Purchase): string {
  const lines = [
    'AI-MasterPlan — receipt',
    `Invoice: ${p.id}`,
    `Date: ${p.at.slice(0, 10)} • Billed to: ${p.email}`,
    `Plan: ${p.productTitle} (${p.kind})`,
    `Subtotal: ${money(p.subtotal)}`,
    `Discount${p.coupon ? ` (${p.coupon})` : ''}: -${money(p.discount)}`,
    `Charged: ${money(p.total)}`,
    'Verify enrollment: profile → enrollment status = active.',
  ];
  return lines.join('\n');
}
