"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import faqService from "../../services/faq";
import Button from "../../components/button";
import { DEFAULT_FAQS, type DefaultFaq } from "../utils/default-faqs";

type FAQ = DefaultFaq;

export function FAQSection() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  const staticFaqs: FAQ[] = DEFAULT_FAQS;

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await faqService.getFAQs();
        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          setFaqs(response.data);
        } else {
          setFaqs(staticFaqs);
        }
      } catch {
        setFaqs(staticFaqs);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="light-dark-background absolute inset-0 z-0"></div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        <Image
          src="/icons/ui/question.svg"
          alt="question mark"
          width={300}
          height={300}
          className="hidden sm:block absolute top-[10%] left-[-4%] -rotate-15 blur-[6px] opacity-60"
        />
        <Image
          src="/icons/ui/question.svg"
          alt="question mark"
          width={100}
          height={100}
          className="hidden sm:block absolute top-[15%] right-[10%] sm:top-[3%] sm:right-[50%] rotate-7 blur-[7px] opacity-40"
        />
        <Image
          src="/icons/ui/question.svg"
          alt="question mark"
          width={350}
          height={350}
          className="hidden sm:block absolute bottom-[-10%] right-[-1%] rotate-15 blur-[6px] opacity-70"
        />
        <Image
          src="/icons/ui/question.svg"
          alt="question mark"
          width={150}
          height={150}
          className="hidden sm:block absolute bottom-[-5%] left-[30%] -rotate-30 blur-[7px] opacity-50"
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 py-40 pb-56 flex flex-col md:flex-row justify-between items-start w-full">
        <div className="w-full md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
          <h2 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 mb-4 leading-tight">
            Any questions? <br /> We got you.
          </h2>
          <p className="font-raleway text-bodytext mb-8 text-base md:text-lg max-w-md mx-auto md:mx-0">
            Explore our FAQs or reach out for personalized support—our team is
            here to help you.
          </p>
          <div className="flex justify-center md:justify-start">
            <Button variant="hero" onClick={() => router.push("/contact")}>
              Contact Us
            </Button>
          </div>
        </div>

        <div className="w-full md:w-1/2 min-h-85">
          <div className="space-y-4">
            {loading
              ? [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="border-b border-gray-300/80 pb-6 animate-pulse"
                  >
                    <div className="h-7 w-3/4 bg-primary3/10 rounded-md" />
                  </div>
                ))
              : faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-300/80 pb-4 cursor-pointer"
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-rubik text-primary3 text-xl font-semibold">
                        {faq.question}
                      </h3>
                      <span
                        className={`text-2xl font-bold text-primary1 transition-transform duration-300 ease-in-out ${
                          openIndex === index ? "rotate-45" : "rotate-0"
                        }`}
                      >
                        +
                      </span>
                    </div>
                    <div
                      className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
                        openIndex === index
                          ? "grid-rows-[1fr]"
                          : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="font-raleway text-bodytext text-sm md:text-base leading-relaxed pt-3">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
