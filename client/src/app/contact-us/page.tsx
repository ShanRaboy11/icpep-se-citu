"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import Footer from "../components/footer";

const CONTACT_EMAIL = "icpepse@cit.edu";
const FACEBOOK_URL = "https://www.facebook.com/cituicpep";

export default function ContactUsPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const subject = String(formData.get("subject") ?? "");
    const message = String(formData.get("message") ?? "");

    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="pt-28 md:pt-36">
            <button
              onClick={() => router.back()}
              title="Go Back"
              className="relative flex h-10 w-10 md:h-12 md:w-12 cursor-pointer items-center justify-center rounded-full border-2 border-primary1 text-primary1 transition-all duration-300 ease-in-out active:scale-95 hover:bg-primary1/5"
            >
              <ArrowLeft className="h-5 w-5 md:h-6 md:w-6 animate-nudge-left" />
            </button>
          </div>

          <div className="mb-20 pt-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1">
              <div className="h-2 w-2 rounded-full bg-primary1" />
              <span className="font-raleway text-sm font-semibold text-primary1">
                Get in Touch
              </span>
            </div>
            <h1 className="font-rubik text-5xl font-bold leading-[1.1] tracking-tight text-primary3 md:text-6xl">
              Contact Us
            </h1>
            <p className="mx-auto mt-5 max-w-2xl font-raleway text-base leading-relaxed text-slate-600 md:text-lg">
              Have a question, suggestion, or concern? Send us a message and our
              team will get back to you through email.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <aside className="rounded-3xl bg-primary3 p-8 text-white shadow-xl shadow-primary3/10 md:p-10">
              <h2 className="font-rubik text-2xl font-semibold">Stay connected</h2>
              <p className="mt-4 font-raleway leading-relaxed text-blue-100">
                Follow the official chapter channels for announcements, events,
                and organization updates.
              </p>

              <div className="mt-10 space-y-6">
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-white/20 p-4 transition-colors hover:bg-white/10"
                >
                  <Image src="/fb.svg" alt="" width={32} height={32} />
                  <span className="font-raleway font-semibold">Facebook</span>
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-4 rounded-2xl border border-white/20 p-4 transition-colors hover:bg-white/10"
                >
                  <Image src="/email.svg" alt="" width={32} height={32} />
                  <span className="break-all font-raleway font-semibold">{CONTACT_EMAIL}</span>
                </a>
              </div>
            </aside>

            <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-lg shadow-primary3/5 md:p-10">
              <h2 className="font-rubik text-2xl font-semibold text-primary3">Send an inquiry</h2>
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="font-raleway text-sm font-semibold text-bodytext">
                    Name
                    <input
                      name="name"
                      type="text"
                      required
                      className="mt-2 w-full rounded-xl border-2 border-gray-100 px-4 py-3 font-normal text-bodytext outline-none transition focus:border-primary1 focus:ring-4 focus:ring-buttonbg1"
                    />
                  </label>
                  <label className="font-raleway text-sm font-semibold text-bodytext">
                    Email
                    <input
                      name="email"
                      type="email"
                      required
                      className="mt-2 w-full rounded-xl border-2 border-gray-100 px-4 py-3 font-normal text-bodytext outline-none transition focus:border-primary1 focus:ring-4 focus:ring-buttonbg1"
                    />
                  </label>
                </div>
                <label className="block font-raleway text-sm font-semibold text-bodytext">
                  Subject
                  <input
                    name="subject"
                    type="text"
                    required
                    className="mt-2 w-full rounded-xl border-2 border-gray-100 px-4 py-3 font-normal text-bodytext outline-none transition focus:border-primary1 focus:ring-4 focus:ring-buttonbg1"
                  />
                </label>
                <label className="block font-raleway text-sm font-semibold text-bodytext">
                  Message
                  <textarea
                    name="message"
                    required
                    rows={6}
                    className="mt-2 w-full resize-y rounded-xl border-2 border-gray-100 px-4 py-3 font-normal text-bodytext outline-none transition focus:border-primary1 focus:ring-4 focus:ring-buttonbg1"
                  />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary1 px-6 py-3.5 font-raleway font-semibold text-white transition hover:bg-primary3 focus:outline-none focus:ring-2 focus:ring-primary1 focus:ring-offset-2"
                >
                  Open email client
                </button>
                {submitted && (
                  <p role="status" className="font-raleway text-sm text-primary3">
                    Your email draft is ready. Complete and send it from your email client.
                  </p>
                )}
              </form>
            </section>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
