/** "Hire me" form: options and validation shared by the modal and `app/api/hire/route.ts`. */

export const PROJECT_TYPES = ["Website", "Web app", "Landing page", "Something else"] as const;
export const BUDGETS = ["Under $1k", "$1k - 3k", "$3k - 8k", "$8k+", "Not sure yet"] as const;

export const HIRE_LIMITS = { name: 100, email: 200, message: 4000 } as const;
export const MIN_MESSAGE_LENGTH = 20;

export type HireRequest = {
  name: string;
  email: string;
  projectType: (typeof PROJECT_TYPES)[number];
  budget?: (typeof BUDGETS)[number];
  message: string;
};

export type HireErrors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateHire(input: { name: string; email: string; message: string }): HireErrors {
  const errors: HireErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (!name) errors.name = "Tell me what to call you.";
  else if (name.length > HIRE_LIMITS.name) errors.name = "That name is a little long.";

  if (!email) errors.email = "I need an email to reply to.";
  else if (email.length > HIRE_LIMITS.email || !EMAIL_PATTERN.test(email))
    errors.email = "That email doesn't look right.";

  if (message.length < MIN_MESSAGE_LENGTH)
    errors.message = "A couple of sentences helps me reply with something useful.";
  else if (message.length > HIRE_LIMITS.message)
    errors.message = `Keep it under ${HIRE_LIMITS.message} characters.`;

  return errors;
}
