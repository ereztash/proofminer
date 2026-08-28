/* global process, console */

import { expect, test } from '@playwright/test';
import { classifyDeployment, parseCommitList } from './deployment-identity.mjs';

const BASE_URL = process.env.PROOFMINER_BASE_URL;

/**
 * Which commit this run expects to be looking at.
 *
 * The smoke reads a public alias, not the immutable per-deployment URL, so
 * "the deployed app passed" was never the same claim as "this commit passed":
 * the alias can still be pointing at the previous deployment, or at a newer
 * one. Set by the workflow on a deployment_status event, left unset for a
 * manual run against an arbitrary URL.
 */
const EXPECT_COMMIT = process.env.PROOFMINER_EXPECT_COMMIT?.trim();

/**
 * The commits that could legitimately have replaced it — everything on the
 * default branch that is strictly newer, computed by the workflow with git.
 * Empty on a manual run, and empty if the git step failed, which is the safe
 * direction: without it every mismatch is a failure.
 */
const NEWER_COMMITS = parseCommitList(process.env.PROOFMINER_NEWER_COMMITS);

// Read through the DOM rather than a locator: a <meta> in <head> is never
// visible, and a visibility-aware locator waits for it forever.
const deployedCommit = (page) =>
  page.evaluate(
    () => globalThis.document.querySelector('meta[name="proofminer-commit"]')?.content ?? null,
  );

const chooseSituation = async (page, name) => {
  await page.locator('label.choice__opt', { hasText: name }).click();
};

test.describe('production smoke', () => {
  test('the deployment names the commit it was built from', async ({ page }) => {
    const commit = await deployedCommit(page);
    console.log(`deployed commit: ${commit ?? '(absent)'}`);
    expect(commit, 'built page carries no proofminer-commit meta').toBeTruthy();
    expect(commit, 'build identity resolved to "unknown"').not.toBe('unknown');
    const verdict = classifyDeployment({
      served: commit,
      expected: EXPECT_COMMIT,
      newer: NEWER_COMMITS,
    });
    // Superseded is not a defect: two merges seconds apart fire the older
    // deployment's event after the alias has moved on, and the commit that
    // replaced it gets its own run. See ./deployment-identity.mjs.
    test.skip(
      verdict === 'superseded',
      `superseded: the alias has moved on from ${EXPECT_COMMIT} to ${commit}`,
    );
    if (EXPECT_COMMIT) {
      // A green smoke against the wrong commit is worse than a red one: it
      // reports that a change is live when the alias has not moved yet.
      expect(commit, `alias is serving ${commit}, not ${EXPECT_COMMIT}`).toBe(EXPECT_COMMIT);
    }
  });

  test.beforeEach(async ({ page }) => {
    test.skip(!BASE_URL, 'Set PROOFMINER_BASE_URL to a Vercel preview or production URL.');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => globalThis.localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
  });

  test('expert/consultant fit gate reaches First Light with an allowed action level', async ({ page }) => {
    // Screen 0 opens by naming the complaint people actually arrive with — "I
    // cannot explain what I do" — rather than the product's own mechanism. This
    // line asserted the mechanism, and went on asserting it after the copy was
    // rewritten to the complaint, so the smoke went red against a screen that
    // was right. `tests/ui/guidance.test.js` pins both halves of that rule over
    // the bundles; pinning them here too is what catches the case those tests
    // structurally cannot see, which is the bundle actually being served.
    const opening = page.getByRole('heading', { level: 1 });
    await expect(opening).toContainText(/להסביר|explain/i);
    await expect(opening).not.toContainText(/ראיה|evidence/i);

    await chooseSituation(page, /מומחה|Expert/i);

    // The material is the first thing after the fit question, and the optional
    // questions are folded behind a closed disclosure. This used to fill a
    // claim and an expected-evidence box on the way past; they were never
    // required, and a smoke that types into them proves a path no longer taken.
    await expect(page.locator('#cold-paste')).toBeVisible();
    await expect(page.locator('#fit-claim')).not.toBeVisible();
    await expect(page.locator('#fit-confidence')).toHaveCount(0);

    await page.locator('#cold-paste').fill(
      'ב-2025 ניהלתי צוות תפעול של שמונה אנשים. בנינו תהליך עבודה חדש, וזמן האספקה ירד מ-19 יום ל-7 ימים בתוך חודשיים.',
    );
    await page.getByRole('button', { name: /מצא לי את הראיות|Find my evidence/i }).click();

    await expect(page.locator('body')).toContainText(/רמת פעולה מותרת|Allowed action level/);
    await expect(page.locator('body')).toContainText(/R3|R4/);
  });

  test('weak material cannot jump straight to a draft action', async ({ page }) => {
    await chooseSituation(page, /יועץ|Consultant/i);
    await page.locator('#fit-claim').fill('אני יועץ טוב יותר מאלטרנטיבות');
    await page.locator('#fit-evidence').fill('אין לי ראיה אחת ברורה עדיין');
    await page.locator('#cold-paste').fill('אני יועץ מנוסה, יצירתי, רציני ובעל יכולות גבוהות.');
    await page.getByRole('button', { name: /מצא לי את הראיות|Find my evidence/i }).click();

    await expect(page.locator('body')).not.toContainText(/הפוך את זה לטיוטה|Turn this into a draft/);
  });

  test('concrete but mismatched evidence remains strengthening-only', async ({ page }) => {
    await chooseSituation(page, /יועץ|Consultant/i);
    await page.locator('#fit-claim').fill('אני יודע לבנות תהליכי מכירה שמביאים פניות חמות');
    await page.locator('#fit-evidence').fill('ראיה שמראה שפניות חמות הגיעו מתוכן או הפניות');
    await page.locator('#cold-paste').fill(
      'ניהלתי צוות תפעול של שמונה אנשים, בניתי תהליך עבודה חדש, וזמן האספקה ירד מ-19 יום ל-7 ימים בתוך חודשיים.',
    );
    await page.getByRole('button', { name: /מצא לי את הראיות|Find my evidence/i }).click();

    await expect(page.locator('body')).toContainText('R4');
    await expect(page.locator('body')).not.toContainText(/הפוך את זה לטיוטה|Turn this into a draft/);
  });
});
