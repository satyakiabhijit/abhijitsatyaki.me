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
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    email: string;
    subject: string;
    timestamp: string;
  } | null>(null);

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

  const handleResetForm = () => {
    setIsSuccess(false);
    setStatusMessage("");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setCaptchaAnswer("");
    fetchCaptcha();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage("");

    if (!name.trim()) {
      setStatusMessage("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setStatusMessage("Please enter your email address.");
      return;
    }

    if (!message.trim()) {
      setStatusMessage("Please write a message before sending.");
      return;
    }

    if (!captcha || !captchaAnswer.trim()) {
      setStatusMessage("Please enter the answer shown in the security image.");
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
        setSubmittedData({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            month: "short",
            day: "numeric",
          }),
        });
        setIsSuccess(true);
        setStatusMessage("");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setCaptchaAnswer("");
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
              <AnimatePresence mode="wait">
                {isSuccess && submittedData ? (
                  <motion.div
                    key="success-card"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="py-2 space-y-6"
                  >
                    {/* Header with animated check badge */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10">
                        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-1">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                          </span>
                          <span>Message Delivered</span>
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                          Thank you, {submittedData.name}!
                        </h2>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base leading-relaxed text-zinc-300">
                      Your message has been sent directly to Abhijit&apos;s inbox. I&apos;ve received your note and will get back to you shortly at{" "}
                      <span className="font-medium text-white underline decoration-indigo-500/50 underline-offset-4">
                        {submittedData.email}
                      </span>
                      .
                    </p>

                    {/* Transmission Receipt Details */}
                    <div className="rounded-xl border border-zinc-700/60 bg-zinc-900/70 p-5 backdrop-blur-sm space-y-3">
                      <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 pb-2 border-b border-zinc-800 flex items-center justify-between">
                        <span>Transmission Receipt</span>
                        <span className="text-emerald-400 font-normal normal-case flex items-center gap-1.5">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified &amp; Saved
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-zinc-500 block">Sender:</span>
                          <span className="text-zinc-200 font-medium">{submittedData.name} ({submittedData.email})</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">Sent At:</span>
                          <span className="text-zinc-200 font-medium">{submittedData.timestamp}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-zinc-500 block">Subject:</span>
                          <span className="text-zinc-200 font-medium">{submittedData.subject || "Direct Message"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Reset / Send another message button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleResetForm}
                        className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/90 hover:bg-zinc-700 px-5 py-2.5 text-sm font-medium text-white transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Send Another Message</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
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

                      {/* Clean Captcha Image & Answer Box */}
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

                      {/* Error Alert if any */}
                      <AnimatePresence>
                        {statusMessage && !isSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-4 text-sm text-rose-300"
                          >
                            <div className="flex items-start gap-2.5">
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
                              <span>{statusMessage}</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

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
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
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
