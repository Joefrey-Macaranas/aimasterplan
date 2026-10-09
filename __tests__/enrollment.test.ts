import { PRODUCTS, COUPONS } from '../src/data/enrollment';
import {
  quote, makePurchase, money, receiptText,
  statusAfterPurchase, statusAfterCompletion, purchaseIdFor,
} from '../src/lib/enrollment';

test('catalog: free + one-time + subscription', () => {
  expect(PRODUCTS.map((p) => p.id)).toEqual(['free-audit', 'lifetime', 'monthly']);
  expect(PRODUCTS.find((p) => p.id === 'lifetime')?.priceCents).toBe(14900);
  expect(COUPONS.map((c) => c.code)).toEqual(['WELCOME20', 'BUILDER50', 'SCHOLAR100']);
});

test('quotes: free, coupon math, bad code, scholarship gate', () => {
  expect(quote('free-audit').ok).toBe(true);
  expect(quote('free-audit').quote?.total).toBe(0);
  const w = quote('lifetime', 'welcome20', '');
  expect(w.ok).toBe(true);
  expect(w.quote?.discount).toBe(2980);
  expect(w.quote?.total).toBe(11920);
  expect(quote('lifetime', 'NOPE', '').ok).toBe(false);
  expect(quote('lifetime', 'SCHOLAR100', 'short').ok).toBe(false);
  const s = quote('lifetime', 'scholar100', 'I need free access to build a leads system in 90 days.');
  expect(s.ok).toBe(true);
  expect(s.quote?.total).toBe(0);
  expect(money(14900)).toBe('$149.00');
});

test('purchase → active status → receipt with invoice ID', () => {
  const q = quote('monthly', '', '').quote!;
  const p = makePurchase('maya@example.com', 'monthly', q, '2026-10-08T00:00:00.000Z');
  expect(p.id).toBe(purchaseIdFor('maya@example.com', 'monthly', '2026-10-08T00:00:00.000Z'));
  expect(p.kind).toBe('sub');
  expect(statusAfterPurchase(p.kind)).toBe('active');
  const r = receiptText(p);
  for (const bit of [p.id, 'maya@example.com', 'Monthly Plan', '$19.00']) expect(r).toContain(bit);
  const free = makePurchase('a@b.co', 'free-audit', quote('free-audit').quote!);
  expect(free.kind).toBe('free');
  expect(free.total).toBe(0);
});

test('status lifecycle: pending → active → completed; suspended sticks', () => {
  expect(statusAfterCompletion(100, 'active')).toBe('completed');
  expect(statusAfterCompletion(40, 'active')).toBe('active');
  expect(statusAfterCompletion(100, 'suspended')).toBe('completed');
});
