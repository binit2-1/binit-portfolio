/** Birthday: age increases on 17 November each year */
const BIRTH_YEAR = 2004;
const BIRTH_MONTH_INDEX = 10; // November (0-based)
const BIRTH_DAY = 17;

/**
 * Age in full years as of `reference` (defaults to “now”).
 * Before Nov 17 in a calendar year, the birthday for that year has not occurred yet.
 */
export function getAgeOnDate(reference: Date = new Date()): number {
  let age = reference.getFullYear() - BIRTH_YEAR;

  const hadBirthdayThisYear =
    reference.getMonth() > BIRTH_MONTH_INDEX ||
    (reference.getMonth() === BIRTH_MONTH_INDEX &&
      reference.getDate() >= BIRTH_DAY);

  if (!hadBirthdayThisYear) {
    age -= 1;
  }

  return age;
}
