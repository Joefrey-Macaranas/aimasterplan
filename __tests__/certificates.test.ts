import { moduleCertId, moduleCerts, finalCert, shareText, certHtml, AUTHOR_SIGNATURE } from '../src/lib/certificates';
import { MODULES } from '../src/data/curriculum';
import { certificateId, verifyUrl } from '../src/lib/misc';

const ME = 'maya@example.com';
const ALL = ['L1M1L1'];

test('module certificates: one per module, stable IDs, locked until 100%', () => {
  const certs = moduleCerts(ME, []);
  expect(certs).toHaveLength(MODULES.length);
  expect(certs.every((c) => !c.eligible)).toBe(true);
  expect(moduleCertId(ME, 'L1M1')).toBe(moduleCertId(ME, 'L1M1'));
  expect(moduleCertId(ME, 'L1M1')).not.toBe(moduleCertId(ME, 'L1M2'));
  const full = moduleCerts(ME, ['L1M1L1', 'L1M1L2', 'L1M1L3', 'L1M1L4', 'L1M1L5']);
  expect(full.find((c) => c.moduleId === 'L1M1')).toMatchObject({ eligible: true, pct: 100 });
  expect(full.find((c) => c.moduleId === 'L1M2')?.eligible).toBe(false);
});

test('final certificate unlocks at 100% with date + verify URL', () => {
  const { LESSONS } = require('../src/data/curriculum') as typeof import('../src/data/curriculum');
  const fin = finalCert(ME, []);
  expect(fin.eligible).toBe(false);
  expect(fin.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(fin.url).toBe(verifyUrl(fin.certId));
  const done = finalCert(ME, LESSONS.map((l: { id: string }) => l.id));
  expect(done.eligible).toBe(true);
  expect(done.certId).toBe(certificateId(ME, 'AI-MasterPlan'));
});

test('share text + printable HTML carry all 6 details + signature', () => {
  const t = shareText({ student: 'Maya', program: 'L1M1', certId: 'AMP-1', url: 'https://x/1', date: '2026-10-08' });
  for (const bit of ['Maya', 'L1M1', 'AMP-1', 'https://x/1', '2026-10-08']) expect(t).toContain(bit);
  const html = certHtml({ student: 'Maya', program: 'L1M1', certId: 'AMP-1', url: 'https://x/1', date: '2026-10-08', kind: 'Module' });
  for (const bit of ['Maya', 'L1M1', 'AMP-1', 'https://x/1', '2026-10-08', AUTHOR_SIGNATURE.name]) expect(html).toContain(bit);
  expect(ALL.length).toBeGreaterThan(0);
});
