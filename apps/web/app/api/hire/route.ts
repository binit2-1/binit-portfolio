import { BUDGETS, type HireRequest, PROJECT_TYPES, validateHire } from "@/lib/hire";
import { CONTACT_EMAIL } from "@/lib/social-links";

/**
 * Delivers the "Hire me" form to my inbox through Resend (https://resend.com/docs/api-reference/emails/send-email).
 * Env: RESEND_API_KEY (required), HIRE_TO_EMAIL (defaults to CONTACT_EMAIL),
 * HIRE_FROM_EMAIL (a sender on a domain verified in Resend; the default only works for the account owner's address).
 */
const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

function fail(error: string, status: number) {
  return Response.json({ error }, { status });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid request.", 400);
  }

  // Honeypot: real people never see this field. Pretend it worked.
  if (typeof body.company === "string" && body.company.length > 0) {
    return Response.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const projectType = PROJECT_TYPES.find((type) => type === body.projectType);
  const budget = BUDGETS.find((option) => option === body.budget);

  const errors = validateHire({ name, email, message });
  if (Object.keys(errors).length > 0 || !projectType) {
    return Response.json({ error: "Some fields need another look.", fields: errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[hire] RESEND_API_KEY is not set");
    return fail("The form isn't connected right now.", 503);
  }

  const enquiry: HireRequest = { name, email, projectType, budget, message };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.HIRE_FROM_EMAIL || DEFAULT_FROM,
      to: [process.env.HIRE_TO_EMAIL || CONTACT_EMAIL],
      reply_to: enquiry.email,
      subject: `Freelance: ${enquiry.projectType} for ${enquiry.name.replace(/\s+/g, " ")}`,
      text: [
        `Name: ${enquiry.name}`,
        `Email: ${enquiry.email}`,
        `Project: ${enquiry.projectType}`,
        `Budget: ${enquiry.budget ?? "Not given"}`,
        "",
        enquiry.message,
      ].join("\n"),
    }),
  }).catch(() => null);

  if (!response?.ok) {
    console.error("[hire] Resend failed", response?.status, await response?.text().catch(() => ""));
    return fail("The message didn't go through.", 502);
  }

  return Response.json({ ok: true });
}
