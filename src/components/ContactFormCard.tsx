"use client";

import { useState } from "react";
import { CONTACT_EMAIL, CONTACT_FORM_ENDPOINT } from "@/lib/site";

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  topic: string;
  message: string;
};

const INITIAL_STATE: ContactFormState = {
  name: "",
  email: "",
  subject: "",
  topic: "",
  message: "",
};

export function ContactFormCard() {
  const [form, setForm] = useState<ContactFormState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<{
    tone: "idle" | "success" | "error";
    message: string;
  }>({
    tone: "idle",
    message: "",
  });

  const updateField =
    (field: keyof ContactFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitState({ tone: "idle", message: "" });

    try {
      const safeName = form.name.trim();
      const safeEmail = form.email.trim();
      const safeSubject = form.subject.trim();
      const safeTopic = form.topic.trim() || "General";
      const safeMessage = form.message.trim();

      const response = await fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: safeName,
          email: safeEmail,
          _replyto: safeEmail,
          _subject: `[Contact] ${safeSubject}`,
          topic: safeTopic,
          message: safeMessage,
          source: "/contact",
          sent_at: new Date().toISOString(),
          _template: "table",
          _captcha: "false",
        }),
      });

      const result = (await response.json()) as {
        error?: string;
        success?: string;
      };

      if (!response.ok) {
        setSubmitState({
          tone: "error",
          message: result.error || "Unable to send right now.",
        });
        return;
      }

      setSubmitState({
        tone: "success",
        message: `Message sent to ${CONTACT_EMAIL}. We will get back soon.`,
      });
      setForm(INITIAL_STATE);
    } catch {
      setSubmitState({
        tone: "error",
        message: "Network error while sending message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-form">
      <div className="contact-form-heading"><span className="document-eyebrow">Let’s talk</span><h2>Send us a note.</h2><p>Choose a subject and tell us what’s on your mind.</p></div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
              Name
            </span>
            <input
              required
              type="text"
              autoComplete="name"
              name="name"
              value={form.name}
              onChange={updateField("name")}
              disabled={isSubmitting}
              placeholder="Your name"
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)] disabled:opacity-70"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
              Email
            </span>
            <input
              required
              type="email"
              autoComplete="email"
              name="email"
              value={form.email}
              onChange={updateField("email")}
              disabled={isSubmitting}
              placeholder="you@email.com"
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)] disabled:opacity-70"
            />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
              Subject
            </span>
            <input
              required
              type="text"
              value={form.subject}
              onChange={updateField("subject")}
              disabled={isSubmitting}
              placeholder="How can we help?"
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)] disabled:opacity-70"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
              Topic <span className="field-optional">(optional)</span>
            </span>
            <input
              type="text"
              value={form.topic}
              onChange={updateField("topic")}
              disabled={isSubmitting}
              placeholder="Support, feedback, bug, etc."
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)] disabled:opacity-70"
            />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
            Message
          </span>
          <textarea
            required
            value={form.message}
            onChange={updateField("message")}
            disabled={isSubmitting}
            placeholder="Write your message..."
            className="min-h-36 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--primary)] disabled:opacity-70"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="contact-submit"
        >
          {isSubmitting ? "Sending..." : "Send message"}
        </button>

        {submitState.tone !== "idle" && (
          <p
            role="status" className={`text-xs font-medium ${
              submitState.tone === "success"
                ? "text-[var(--success)]"
                : "text-[var(--danger)]"
            }`}
          >
            {submitState.message}
          </p>
        )}
      </form>
    </div>
  );
}
