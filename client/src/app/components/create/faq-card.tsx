"use client";

import { INPUT_CLASS } from "@/app/components/ui/form-styles";
import { FormCardSkeleton } from "@/app/components/feedback/skeleton-cards";
import { useEffect, useState } from "react";
import Button from "@/app/components/ui/button";
import RemoveButton from "@/app/components/ui/remove-button";
import { Check, ChevronDown, ChevronUp, Pencil, Plus } from "lucide-react";
import faqService, { FAQData } from "@/app/services/faq";
import { errorMessage } from "@/app/services/api-client";
import { MAX_FAQ_ANSWER, MAX_FAQ_QUESTION, MAX_FAQS } from "@/app/utils/site";
import { DEFAULT_FAQS } from "@/app/utils/home/default-faqs";

type Draft = { id?: string; question: string; answer: string };

const byOrder = (items: FAQData[]) =>
  [...items].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

export default function FaqCard() {
  const [faqs, setFaqs] = useState<FAQData[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);

  const load = async () => {
    const response = await faqService.getAllFAQs();
    setFaqs(byOrder(Array.isArray(response.data) ? response.data : []));
  };

  useEffect(() => {
    load()
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const run = async (task: () => Promise<void>, success?: string) => {
    setBusy(true);
    setNotice(null);
    try {
      await task();
      await load();
      if (success) setNotice({ text: success, ok: true });
    } catch (error) {
      setNotice({ text: errorMessage(error, "Something went wrong. Please try again."), ok: false });
    } finally {
      setBusy(false);
    }
  };

  const save = () => {
    if (!draft) return;
    const question = draft.question.trim();
    const answer = draft.answer.trim();
    if (!question || !answer) {
      setNotice({ text: "Add both a question and an answer.", ok: false });
      return;
    }
    run(async () => {
      if (draft.id) await faqService.updateFAQ(draft.id, { question, answer });
      else await faqService.createFAQ({ question, answer, displayOrder: faqs.length });
      setDraft(null);
    }, draft.id ? "FAQ updated." : "FAQ added.");
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= faqs.length) return;
    const next = [...faqs];
    [next[index], next[target]] = [next[target], next[index]];
    run(async () => {
      await Promise.all(
        [index, target].map((position) =>
          faqService.updateFAQ(next[position]._id as string, {
            question: next[position].question,
            answer: next[position].answer,
            displayOrder: position,
          }),
        ),
      );
    });
  };

  const remove = (faq: FAQData) =>
    run(async () => {
      await faqService.deleteFAQ(faq._id as string);
    }, "FAQ removed.");

  const useDefaults = () =>
    run(async () => {
      for (const [index, faq] of DEFAULT_FAQS.entries()) {
        await faqService.createFAQ({ ...faq, displayOrder: index });
      }
    }, "Default FAQs added. Edit them however you like.");

  const atLimit = faqs.length >= MAX_FAQS;

  return (
    <div className="bg-white rounded-4xl border border-gray-200 shadow-md p-6 sm:p-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-rubik text-xl font-bold text-primary3">FAQs</h2>
          <p className="mt-1 font-raleway text-sm text-gray-400">
            Shown in the &ldquo;Any questions?&rdquo; section of the home page, in this order.
          </p>
        </div>
        <span className="rounded-full border border-primary1/20 px-3 py-1 font-rubik text-xs font-bold text-primary1">
          {faqs.length} / {MAX_FAQS}
        </span>
      </div>

      {loading ? (
        <FormCardSkeleton />
      ) : (
        <div className="space-y-6">
          {faqs.length === 0 && !draft && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
              <p className="font-rubik text-sm font-bold text-gray-500">The default FAQs are showing</p>
              <p className="mt-1 font-raleway text-sm text-gray-400">
                Start from them and edit, or add your own from scratch.
              </p>
              <Button variant="heroOutline" onClick={useDefaults} disabled={busy} className="mt-4 px-5 py-2 text-sm">
                Start from the defaults
              </Button>
            </div>
          )}

          {faqs.length > 0 && (
            <ul className="space-y-3">
              {faqs.map((faq, index) => (
                <li
                  key={faq._id}
                  className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary1/10 font-rubik text-xs font-bold text-primary1">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-rubik text-base font-semibold text-primary3">{faq.question}</p>
                    <p className="mt-1 line-clamp-2 font-raleway text-sm text-gray-500">{faq.answer}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setDraft({ id: faq._id, question: faq.question, answer: faq.answer })}
                        disabled={busy}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 font-raleway text-sm font-semibold text-gray-500 transition-all duration-300 hover:bg-primary1/10 hover:text-primary1 disabled:opacity-50"
                      >
                        <Pencil size={15} /> Edit
                      </button>
                      <RemoveButton onClick={() => remove(faq)} disabled={busy} />
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <button
                      type="button"
                      aria-label="Move up"
                      onClick={() => move(index, -1)}
                      disabled={busy || index === 0}
                      className="cursor-pointer rounded-full p-1.5 text-gray-400 transition-colors hover:bg-primary1/10 hover:text-primary1 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronUp size={18} />
                    </button>
                    <button
                      type="button"
                      aria-label="Move down"
                      onClick={() => move(index, 1)}
                      disabled={busy || index === faqs.length - 1}
                      className="cursor-pointer rounded-full p-1.5 text-gray-400 transition-colors hover:bg-primary1/10 hover:text-primary1 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronDown size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {draft ? (
            <div className="space-y-4 rounded-2xl border border-primary1/20 bg-white p-5">
              <div className="space-y-2">
                <label className="ml-1 block text-sm font-bold font-raleway text-gray-700">
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  value={draft.question}
                  maxLength={MAX_FAQ_QUESTION}
                  onChange={(e) => setDraft({ ...draft, question: e.target.value })}
                  placeholder="How do I join?"
                  className={INPUT_CLASS}
                />
                <p className="text-right font-raleway text-xs text-gray-400">
                  {draft.question.length} / {MAX_FAQ_QUESTION}
                </p>
              </div>
              <div className="space-y-2">
                <label className="ml-1 block text-sm font-bold font-raleway text-gray-700">
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={draft.answer}
                  maxLength={MAX_FAQ_ANSWER}
                  rows={4}
                  onChange={(e) => setDraft({ ...draft, answer: e.target.value })}
                  className={`${INPUT_CLASS} resize-none`}
                />
                <p className="text-right font-raleway text-xs text-gray-400">
                  {draft.answer.length} / {MAX_FAQ_ANSWER}
                </p>
              </div>
              <div className="flex flex-wrap justify-end gap-3">
                <Button variant="heroOutline" onClick={() => setDraft(null)} disabled={busy} className="px-5 py-2 text-sm">
                  Cancel
                </Button>
                <Button variant="hero" onClick={save} disabled={busy} className="px-6 py-2 text-sm">
                  {draft.id ? "Save FAQ" : "Add FAQ"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4">
              {notice ? (
                <p
                  className={`flex items-center gap-1.5 text-xs font-bold font-raleway ${
                    notice.ok ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {notice.ok && <Check size={14} />} {notice.text}
                </p>
              ) : (
                <p className="font-raleway text-xs text-gray-400">
                  {atLimit ? `You've reached the limit of ${MAX_FAQS}. Remove one to add another.` : ""}
                </p>
              )}
              <Button
                variant="hero"
                onClick={() => {
                  setNotice(null);
                  setDraft({ question: "", answer: "" });
                }}
                disabled={busy || atLimit}
                className="px-5 py-2 text-sm sm:px-6"
              >
                <span className="inline-flex items-center gap-2">
                  <Plus size={16} /> Add FAQ
                </span>
              </Button>
            </div>
          )}

          {draft && notice && !notice.ok && (
            <p className="text-xs font-bold font-raleway text-red-500">{notice.text}</p>
          )}
        </div>
      )}
    </div>
  );
}
