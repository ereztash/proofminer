/**
 * What the two screens before the app owe the person reading them.
 *
 * Its own file, one walk — see the note in `./mount.js`.
 *
 * Both claims here were found by driving the built bundle in a real browser at
 * 1280, 390 and 320 px, not by reading the code, and neither was visible to any
 * test in this repository at the time.
 *
 * **A landmark.** `chrome()` wraps the app screens in `<main id="main">` and
 * returns onboarding and First Light unwrapped, because neither has a header or
 * a nav to hang beside it. The consequence was that the two screens *every*
 * first-time user sees carried no landmark at all: the skip link has nothing to
 * skip to and a screen reader has nothing to jump to. The chrome differs
 * between those screens and the app; the landmark does not.
 *
 * **What the number is.** First Light is the first place this product puts a
 * count and an allowed action level in front of somebody. A measurement
 * presented without saying what it measured reads as a ruling on whether the
 * thing is true, and this one rules on nothing of the kind — it reads the text
 * that was supplied and ranks how checkable it is. Screen 0 does say the
 * product takes your input as given, but it says it before there is any result
 * to mistake for a verdict, which is the wrong moment for it to land.
 */

import { describe, expect, it } from 'vitest';
import { mountApp } from '../../src/ui/app.js';
import heBundle from '../../src/i18n/he.js';
import enBundle from '../../src/i18n/en.js';
import { check, click, set } from './mount.js';

/** Concrete enough to clear the bar, so the walk reaches the reveal branch. */
const CONCRETE =
  'ב-2025 ניהלתי צוות תפעול של שמונה אנשים. בנינו תהליך עבודה חדש, וזמן ' +
  'האספקה ירד מ-19 יום ל-7 ימים בתוך חודשיים.';

describe('the screens before the app', () => {
  it('carry a landmark, and say what the number on them measured', () => {
    localStorage.clear();
    document.body.innerHTML = '<div id="app"></div>';
    const root = document.querySelector('#app');
    mountApp(root);

    // Onboarding: no header, no nav, but a landmark all the same.
    const onboardingMain = root.querySelector('main#main');
    expect(onboardingMain).not.toBeNull();
    expect(onboardingMain.textContent).toContain(heBundle.onboarding.painTitle);
    // The chrome that does *not* belong here, so this is a landmark and not a
    // copy of the app shell pasted onto a screen with nowhere to navigate.
    expect(root.querySelector('header.topbar')).toBeNull();
    expect(root.querySelector('nav.nav')).toBeNull();

    check(root, 'input[name="situation"][value="consultant"]');
    set(root, 'cold-paste', CONCRETE);
    click(root, 'coldStart');

    // First Light: still a landmark.
    const revealMain = root.querySelector('main#main');
    expect(revealMain).not.toBeNull();

    // Precondition — this walk really did land on the reveal and not on one of
    // the two dead ends, which carry no score for the note to be about.
    expect(root.querySelector('.proof-card__source'), 'the walk should land on the reveal').not.toBeNull();

    // The scope of the number, beside the number.
    //
    // This used to require the opposite — the note in front of the count, never
    // filed under a disclosure nobody opens — and that was right while a score
    // was on screen. The reveal no longer shows one out here; the score, the
    // band, the action level and the transfer limit are all inside "how we got
    // here". A pre-emptive explanation of a number the reader cannot see is
    // answering a question nobody asked, so the note moved in with it. The
    // guarantee is unchanged and is now asserted as a pair: **wherever the
    // score is, the scope is there too, and neither is out here.**
    const note = root.querySelector('.proof-card__scope');
    expect(note).not.toBeNull();
    expect(note.getAttribute('role')).toBe('note');
    expect(note.textContent.trim()).toBe(heBundle.firstLight.scoreScope);

    const how = note.closest('details');
    expect(how, 'the scope should sit inside the disclosure').not.toBeNull();
    expect(how.hasAttribute('open'), 'and that disclosure is closed').toBe(false);

    // The half that makes the move honest rather than a hiding place: no score
    // anywhere outside it. If one ever reappears out here without its scope,
    // this fails.
    const outside = root.querySelector('.proof-card');
    const scoresOutside = [...outside.querySelectorAll('.score-chip, [class*="score"]')].filter(
      (el) => !el.closest('details') && !el.classList.contains('proof-card__scope'),
    );
    expect(scoresOutside, 'no score may sit outside the disclosure').toHaveLength(0);
  });

  it('says it in both languages, or the English user is told less', () => {
    // Not part of the walk: a missing key here degrades silently to a blank
    // line rather than throwing, so the parity is worth asserting directly.
    expect(typeof enBundle.firstLight.scoreScope).toBe('string');
    expect(enBundle.firstLight.scoreScope.length).toBeGreaterThan(40);
    expect(heBundle.firstLight.scoreScope.length).toBeGreaterThan(40);
  });

  it('withdraws the claim rather than softening it', () => {
    // The failure this guards against is not an absent statement but a
    // reassuring one — a caveat rewritten until it reads as the thing it exists
    // to withdraw. A blocklist of words is the wrong instrument for that: the
    // English copy legitimately contains "who confirmed it from outside",
    // describing what makes a line checkable rather than asserting that
    // anything was confirmed. So each locale is held to an explicit denial.
    expect(heBundle.firstLight.scoreScope).toMatch(/לא אם הן נכונות/u);
    expect(heBundle.firstLight.scoreScope).toMatch(/לא יכול לבדוק|לא מתיימר/u);
    expect(enBundle.firstLight.scoreScope).toMatch(/not whether they are true/iu);
    expect(enBundle.firstLight.scoreScope).toMatch(/cannot check|not something this tool can check|does not claim/iu);

    // And neither may assert that this product verified anything.
    for (const bundle of [heBundle, enBundle]) {
      expect(bundle.firstLight.scoreScope).not.toMatch(
        /\bwe (?:have )?verified\b|\bis verified\b|\bare verified\b|מאומת|אימתנו/iu,
      );
    }
  });
});
