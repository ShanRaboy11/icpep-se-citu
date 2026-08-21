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

      <main
        className="relative flex-1 overflow-hidden pb-[260px] md:pb-[220px]"
        style={{ backgroundColor: "#FEFEFF" }}
      >
        <div className="absolute inset-0">
          <div className="absolute top-3/4 left-1/2 w-64 h-64 md:w-96 md:h-96 lg:w-[50rem] lg:h-[60rem] bg-gradient-to-br from-primary1 to-white rounded-full mix-blend-multiply filter blur-3xl animate-orbit-1" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 md:w-96 md:h-96 lg:w-[30rem] lg:h-[30rem] bg-gradient-to-br from-primary1 to-white rounded-full mix-blend-multiply filter blur-3xl animate-orbit-2" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 md:w-96 md:h-96 lg:w-[60rem] lg:h-[60rem] bg-gradient-to-br from-primary1 to-white rounded-full mix-blend-multiply filter blur-3xl animate-orbit-3" />
        </div>

        <style>{`
          @keyframes orbit {
            0% {
              transform: translate(-50%, -50%) rotate(0deg) translateX(40vw) rotate(0deg);
            }
            100% {
              transform: translate(-50%, -50%) rotate(360deg) translateX(40vw) rotate(-360deg);
            }
          }

          .animate-orbit-1 {
            animation: orbit 20s linear infinite;
          }

          .animate-orbit-2 {
            animation: orbit 20s linear infinite;
            animation-delay: -6.66s;
          }

          .animate-orbit-3 {
            animation: orbit 20s linear infinite;
            animation-delay: -13.33s;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}</style>

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
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
              Have questions  or any concerns about membership, events, or partnerships — 
              reach us online or send a message through the form. 
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
