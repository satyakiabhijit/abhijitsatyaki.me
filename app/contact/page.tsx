import { GridWrapper } from "@/app/components/GridWrapper";
import { HorizontalLine } from "@/app/components/HorizontalLine";
import { ContactForm } from "@/app/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Abhijit Satyaki",
  description: "Get in touch with Abhijit Satyaki. Have a question, project proposal, or collaboration inquiry? Send a direct message.",
};

export default function ContactPage() {
  return (
    <div className="relative">
      <span className="absolute left-1/2 top-20 -translate-y-1/2 translate-x-1/2">
        <HorizontalLine />
      </span>

      <div className="relative space-y-10 md:space-y-16">
        <div className="mx-auto text-balance pt-14 md:pt-16">
          <GridWrapper>
            <div className="mx-auto max-w-2xl text-center">
              <span className="mb-3 inline-block rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
                Let&apos;s Connect
              </span>
              <h1 className="text-4xl font-medium leading-tight tracking-tighter text-text-primary md:text-6xl md:leading-[64px]">
                Say hello or pitch an opportunity.
              </h1>
              <p className="mt-4 text-base text-gray-400 sm:text-lg">
                I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
            </div>
          </GridWrapper>
        </div>

        <span className="absolute left-1/2 top-52 -translate-y-1/2 translate-x-1/2">
          <HorizontalLine />
        </span>

        <ContactForm
          title="Send a Direct Message"
          description="Fill out the form below. Messages are secured against DDoS and spam, stored reliably, and delivered directly to my inbox."
          buttonText="Send Message"
        />
      </div>
    </div>
  );
}
