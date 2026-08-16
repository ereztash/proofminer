/* global process */

import { expect, test } from '@playwright/test';

const BASE_URL = process.env.PROOFMINER_BASE_URL;

const chooseSituation = async (page, name) => {
  await page.locator('label.choice__opt', { hasText: name }).click();
};

test.describe('production smoke', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!BASE_URL, 'Set PROOFMINER_BASE_URL to a Vercel preview or production URL.');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => globalThis.localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
  });

  test('expert/consultant fit gate reaches First Light with an allowed action level', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/ראיה|evidence/i);

    await chooseSituation(page, /מומחה|Expert/i);
    await expect(page.locator('#fit-confidence')).toBeVisible();
    await expect(page.locator('#fit-claim')).toBeVisible();
    await expect(page.locator('#fit-evidence')).toBeVisible();

    await page.locator('#fit-claim').fill('אני יודע להפוך צוות מבולגן לתהליך עבודה שאפשר לנהל');
    await page.locator('#fit-evidence').fill('סיכום פרויקט שבו זמני אספקה ירדו מ-19 יום ל-7 ימים');
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
