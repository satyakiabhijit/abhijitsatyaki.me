"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GridWrapper } from "./GridWrapper";

interface ContactFormProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

interface CaptchaData {
  image: string;
  token: string;
}

export function ContactForm({
  title = "Get in Touch",
  description = "Have an opportunity, project idea, or just want to chat? Send me a message and it will be delivered straight to my inbox.",
  buttonText = "Send Message",
}: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [captcha, setCaptcha] = useState<CaptchaData | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch captcha image challenge
  const fetchCaptcha = async () => {
    setIsCaptchaLoading(true);
    try {
      const res = await fetch("/api/contact/captcha", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setCaptcha(data);
        setCaptchaAnswer("");
      }
    } catch (err) {
      console.error("Failed to fetch captcha challenge:", err);
    } finally {
      setIsCaptchaLoading(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage("");
    setIsSuccess(false);

    if (!name.trim()) {
      setStatusMessage("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setStatusMessage("Please enter your email address.");
      return;
    }

    if (!message.trim()) {
      setStatusMessage("Please enter a message.");
      return;
    }

    if (!captcha || !captchaAnswer.trim()) {
      setStatusMessage("Please enter the answer shown in the image.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          captchaAnswer: captchaAnswer.trim(),
          captchaToken: captcha.token,
          honeypot: honeypot.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSuccess(true);
        setStatusMessage(
          "Thank you! Your message has been sent to Abhijit. I'll get back to you shortly."
        );
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setCaptchaAnswer("");
        fetchCaptcha();
      } else {
        setIsSuccess(false);
        setStatusMessage(
          data.error || "Failed to send message. Please try again or email abhijitsatyaki29@gmail.com directly."
        );
        fetchCaptcha();
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setIsSuccess(false);
      setStatusMessage("Network error occurred. Please check your connection and try again.");
      fetchCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative pb-16">
      <GridWrapper>
        <div className="relative overflow-x-clip">
          <div className="drama-shadow rounded-2xl bg-dark-primary p-8 sm:p-12 md:p-16">
            {/* Architectural Border Lines */}
            <div className="absolute left-0 right-0 top-[34px] z-10 h-px w-full bg-zinc-700/60 md:top-[48px]"></div>
            <div className="absolute bottom-0 right-[34px] top-0 z-10 h-full w-px bg-zinc-700/60 md:right-[48px]"></div>
            <div className="absolute bottom-[34px] left-0 right-0 z-10 h-px w-full bg-zinc-700/60 md:bottom-[48px]"></div>
            <div className="absolute bottom-0 left-[34px] top-0 z-10 h-full w-px bg-zinc-700/60 md:left-[48px]"></div>

            {/* Corner Cross Marks */}
            <div className="absolute right-[44.5px] top-[48px] z-20 hidden h-px w-2 bg-zinc-400 md:block"></div>
            <div className="absolute right-[48px] top-[44.5px] z-20 hidden h-2 w-px bg-zinc-400 md:block"></div>
            <div className="absolute left-[44.5px] right-0 top-[48px] z-20 hidden h-px w-2 bg-zinc-400 md:block"></div>
            <div className="absolute left-[48px] right-0 top-[44.5px] z-20 hidden h-2 w-px bg-zinc-400 md:block"></div>
            <div className="absolute bottom-[48px] left-[44.5px] right-0 z-20 hidden h-px w-2 bg-zinc-400 md:block"></div>
            <div className="absolute bottom-[44.5px] left-[48px] right-0 z-20 hidden h-2 w-px bg-zinc-400 md:block"></div>
            <div className="absolute bottom-[48px] right-[44.5px] z-20 hidden h-px w-2 bg-zinc-400 md:block"></div>
            <div className="absolute bottom-[44.5px] right-[48px] z-20 hidden h-2 w-px bg-zinc-400 md:block"></div>

            <div className="relative z-20 max-w-2xl">
              {/* Header Badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <span>Direct Contact</span>
              </div>

              <h2 className="mb-3 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl md:text-4xl">
                {title}
              </h2>
              <p className="mb-8 text-sm leading-relaxed text-zinc-300 sm:text-base">
                {description}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field (hidden off-screen for bot trapping) */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    top: "-9999px",
                    opacity: 0,
                    height: 0,
                    width: 0,
                    overflow: "hidden",
                    pointerEvents: "none",
                  }}
                >
                  <label htmlFor="hp_contact_url">Leave this empty</label>
                  <input
                    type="text"
                    id="hp_contact_url"
                    name="hp_contact_url"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {/* Name & Email inputs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-300"
                    >
                      Your Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Alex Rivera"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-300"
                    >
                      Your Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Subject input */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-300"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    placeholder="Project Inquiry / Opportunity / Just saying hi"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={isLoading}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                  />
                </div>

                {/* Message textarea */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-300"
                  >
                    Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isLoading}
                    className="w-full resize-y rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                  />
                </div>

                {/* Clean Captcha Image & Answer Box — No extra clutter */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="relative h-11 w-36 shrink-0 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-inner">
                    {captcha ? (
                      <img
                        src={captcha.image}
                        alt="Security verification code"
                        className="h-full w-full select-none object-contain"
                        draggable={false}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                        Loading...
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Answer"
                    required
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    disabled={isLoading || isCaptchaLoading}
                    className="h-11 w-28 rounded-xl border border-zinc-700 bg-zinc-900/80 px-3 text-center text-sm font-medium text-white placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                  />

                  <button
                    type="button"
                    onClick={fetchCaptcha}
                    disabled={isCaptchaLoading || isLoading}
                    title="Get a new image"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/80 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white disabled:opacity-50"
                  >
                    <svg
                      className={`h-4 w-4 ${isCaptchaLoading ? "animate-spin" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-all hover:from-indigo-600 hover:to-indigo-700 hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-dark-primary disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                        <span>{buttonText}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Feedback Alert */}
                <AnimatePresence>
                  {statusMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className={`mt-4 rounded-xl border p-4 text-sm ${
                        isSuccess
                          ? "border-emerald-500/30 bg-emerald-950/30 text-emerald-300"
                          : "border-rose-500/30 bg-rose-950/30 text-rose-300"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {isSuccess ? (
                          <svg
                            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="mt-0.5 h-4 w-4 shrink-0 text-rose-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                        <span>{statusMessage}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Decorative background watermark */}
            <div className="pointer-events-none absolute -bottom-10 -right-10 hidden opacity-10 md:block lg:opacity-20">
              <svg
                width="340"
                height="340"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-indigo-400"
              >
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </GridWrapper>
    </div>
  );
}

// Export NewsletterSignUp as an alias so all existing imports throughout the app work seamlessly!
export const NewsletterSignUp = ContactForm;
export default ContactForm;
