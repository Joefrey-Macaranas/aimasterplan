// Certificate system: module certificates + final program certificate.
// Pure helpers (eligibility, IDs, share text). QR/download/share wiring in the screen.
import { MODULES } from '../data/curriculum';
import { moduleProgress, overallProgress } from './progress';
import { certificateId, verifyUrl } from './misc';

export interface ModuleCert { moduleId: string; title: string; eligible: boolean; pct: number; certId: string; url: string }
export interface FinalCert { eligible: boolean; pct: number; certId: string; url: string; date: string }

export const AUTHOR_SIGNATURE = { name: 'The AI-MasterPlan Author', title: 'Course Author & Vibe Coding Coach' };

export function moduleCertId(email: string, moduleId: string): string {
  return certificateId(`${email}#${moduleId}`, 'AI-MasterPlan');
}

export function moduleCerts(email: string, completedIds: string[]): ModuleCert[] {
  return MODULES.map((m) => {
    const pct = moduleProgress(m.id, completedIds);
    const certId = moduleCertId(email || 'student', m.id);
    return { moduleId: m.id, title: m.title, eligible: pct === 100, pct, certId, url: verifyUrl(certId) };
  });
}

export function finalCert(email: string, completedIds: string[], at = new Date()): FinalCert {
  const pct = overallProgress(completedIds);
  const certId = certificateId(email || 'student', 'AI-MasterPlan');
  return { eligible: pct === 100, pct, certId, url: verifyUrl(certId), date: at.toISOString().slice(0, 10) };
}

export function shareText(opts: { student: string; program: string; certId: string; url: string; date: string }): string {
  return `${opts.student} completed "${opts.program}" (AI-MasterPlan) on ${opts.date}! Certificate ${opts.certId} — verify: ${opts.url}`;
}

/** Printable HTML for download (expo-print renders this to PDF). */
export function certHtml(opts: { student: string; program: string; certId: string; url: string; date: string; kind: 'Module' | 'Program' }): string {
  const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<html><body style="font-family:Georgia,serif;text-align:center;padding:48px;color:#111;">
<h3 style="letter-spacing:4px;color:#555;">AI-MASTERPLAN • ${opts.kind.toUpperCase()} CERTIFICATE</h3>
<h1 style="font-size:36px;">${esc(opts.student)}</h1>
<p>has successfully completed</p>
<h2>${esc(opts.program)}</h2>
<p>Completed: ${opts.date} • ID: ${opts.certId}</p>
<p>Verify: ${opts.url}</p>
<p style="margin-top:48px;font-family:cursive;font-size:28px;">${AUTHOR_SIGNATURE.name}</p>
<p>${AUTHOR_SIGNATURE.title}</p>
</body></html>`;
}
