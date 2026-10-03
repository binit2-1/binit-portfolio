"use client";

import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type FormEvent, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { cn } from "@repo/ui/lib/utils";
import { BUDGETS, HIRE_LIMITS, type HireErrors, PROJECT_TYPES, validateHire } from "@/lib/hire";

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full rounded-lg border border-border bg-transparent px-3 text-[0.9375rem] text-foreground outline-none transition-colors placeholder:text-muted-foreground/80 hover:border-foreground/20 focus-visible:border-foreground/40 focus-visible:ring-2 focus-visible:ring-ring/40 aria-invalid:border-destructive/70";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled])';

/** Footer "Hire me" link + the freelance enquiry dialog it opens. Posts to /api/hire. */
export function HireMe({ email, className }: { email: string; className?: string }) {
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [projectType, setProjectType] = useState<(typeof PROJECT_TYPES)[number]>(PROJECT_TYPES[0]);
  const [budget, setBudget] = useState<(typeof BUDGETS)[number] | null>(null);
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [errors, setErrors] = useState<HireErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const openDialog = () => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    // A fresh form after a sent message; keep a half-written one otherwise.
    if (status === "sent") {
      setMessage("");
      setBudget(null);
      setStatus("idle");
    }
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    returnFocusRef.current?.focus();
  };

  // Lock page scroll while the dialog is open.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = overflow;
    };
  }, [open]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDialog();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    // Keep focus inside the dialog.
    const items = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateHire({ name, email: from, message });
    setErrors(nextErrors);
    const firstInvalid = (["name", "email", "message"] as const).find((key) => nextErrors[key]);
    if (firstInvalid) {
      dialogRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: from, projectType, budget, message, company }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (data.fields) setErrors(data.fields);
        throw new Error();
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const titleId = useId();
  const descriptionId = useId();
  const firstName = name.trim().split(/\s+/)[0];

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        aria-haspopup="dialog"
        className={className}
      >
        Hire me
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-background/60 backdrop-blur-sm sm:items-center sm:px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.15 }}
            onMouseDown={(event) => event.target === event.currentTarget && closeDialog()}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              onKeyDown={onKeyDown}
              className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-xl border border-border bg-background shadow-2xl sm:rounded-xl"
              initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.97, y: 12 }}
              transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 36 }}
            >
              <button
                type="button"
                onClick={closeDialog}
                aria-label="Close"
                className="absolute top-4 right-4 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <XIcon className="size-4" />
              </button>

              {status === "sent" ? (
                <div className="px-5 pt-10 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-8">
                  <span className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground">
                    <CheckIcon weight="bold" className="size-4" />
                  </span>
                  <h2 id={titleId} className="mt-5 text-xl tracking-[-0.01em] text-foreground">
                    Message sent
                  </h2>
                  <p id={descriptionId} className="mt-2 max-w-[42ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                    Thanks{firstName ? `, ${firstName}` : ""}. I&apos;ll reply to{" "}
                    <span className="text-foreground">{from.trim()}</span> once I&apos;ve read it properly.
                  </p>
                  <button
                    type="button"
                    autoFocus
                    onClick={closeDialog}
                    className="mt-6 h-10 rounded-lg border border-border px-4 text-sm text-foreground transition-colors hover:bg-muted active:scale-[0.98]"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form noValidate onSubmit={submit} className="px-5 pt-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-6">
                  <h2 id={titleId} className="pr-10 text-xl tracking-[-0.01em] text-foreground">
                    Tell me about your project
                  </h2>
                  <p id={descriptionId} className="mt-1.5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted-foreground">
                    I take on freelance builds, from landing pages to full-stack apps. This lands straight
                    in my inbox.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field label="Name" error={errors.name}>
                      {(props) => (
                        <input
                          {...props}
                          name="name"
                          autoFocus
                          autoComplete="name"
                          maxLength={HIRE_LIMITS.name}
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          className={cn(fieldClass, "h-10")}
                        />
                      )}
                    </Field>
                    <Field label="Email" error={errors.email}>
                      {(props) => (
                        <input
                          {...props}
                          name="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          maxLength={HIRE_LIMITS.email}
                          value={from}
                          onChange={(event) => setFrom(event.target.value)}
                          className={cn(fieldClass, "h-10")}
                        />
                      )}
                    </Field>
                  </div>

                  <ChoiceGroup
                    label="What do you need?"
                    options={PROJECT_TYPES}
                    value={projectType}
                    onChange={setProjectType}
                  />
                  <ChoiceGroup
                    label="Budget"
                    hint="optional"
                    options={BUDGETS}
                    value={budget}
                    onChange={(option) => setBudget(option === budget ? null : option)}
                  />

                  <div className="mt-5">
                    <Field
                      label="Project details"
                      error={errors.message}
                      hint="What you're building, who it's for, and when you'd like it live."
                    >
                      {(props) => (
                        <textarea
                          {...props}
                          name="message"
                          rows={5}
                          maxLength={HIRE_LIMITS.message}
                          value={message}
                          onChange={(event) => setMessage(event.target.value)}
                          className={cn(fieldClass, "min-h-28 resize-y py-2.5 leading-relaxed")}
                        />
                      )}
                    </Field>
                  </div>

                  {/* Honeypot for bots; hidden from people and assistive tech. */}
                  <input
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    className="pointer-events-none absolute size-0 opacity-0"
                  />

                  {status === "error" && (
                    <p role="alert" className="mt-4 text-sm text-destructive">
                      That didn&apos;t send. Try again, or email me at{" "}
                      <a href={`mailto:${email}`} className="underline decoration-dotted underline-offset-4">
                        {email}
                      </a>
                      .
                    </p>
                  )}

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <a
                      href={`mailto:${email}`}
                      className="min-w-0 truncate text-sm text-muted-foreground underline decoration-muted-foreground/50 decoration-dotted underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
                    >
                      Prefer email?
                    </a>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="h-10 shrink-0 rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-[opacity,transform] hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                    >
                      {status === "sending" ? "Sending…" : "Send message"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

type FieldProps = {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
};

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: (props: FieldProps) => ReactNode;
}) {
  const id = useId();
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(" ");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-foreground">
        {label}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy || undefined })}
      {error ? (
        <p id={`${id}-error`} className="text-[0.8125rem] text-destructive">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-[0.8125rem] text-muted-foreground">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function ChoiceGroup<T extends string>({
  label,
  hint,
  options,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  options: readonly T[];
  value: T | null;
  onChange: (option: T) => void;
}) {
  return (
    <fieldset className="mt-5">
      <legend className="text-sm text-foreground">
        {label}
        {hint && <span className="text-muted-foreground"> ({hint})</span>}
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option === value;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option)}
              className={cn(
                "h-8 rounded-lg border px-3 text-sm transition-colors active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none",
                selected
                  ? "border-foreground/40 bg-muted text-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
