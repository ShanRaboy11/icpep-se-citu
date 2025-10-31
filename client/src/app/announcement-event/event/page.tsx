"use client";

import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import Button from "@/app/components/button";
import PreviewModal from "../components/previewdialog";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export default function EventsPage() {
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <section className="min-h-screen bg-white flex flex-col relative">
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-12">
        <Sidebar />
        <h1 className="text-2xl sm:text-3xl font-bold text-primary1 mb-2">
          Announcements/Events
        </h1>
        <div className="h-[1px] bg-gray-300 mb-6" />

        <div className="flex items-center justify-between mb-4">
          <Button variant="outline">Compose</Button>
          <Button variant="primary2" onClick={() => setPreviewOpen(true)}>
            👁️ Preview
          </Button>
        </div>

        <form className="border border-primary1 rounded-2xl p-6 space-y-4 bg-white">
          {/* Upload image */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-gray-500">📷 Upload cover image</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">
              Workshop
            </Button>
            <Button variant="secondary" size="sm">
              Seminar
            </Button>
          </div>

          <h2 className="text-xl font-semibold text-primary1 mt-6">Details</h2>
          <p className="text-sm text-gray-500">Provide key information</p>

          <input
            type="text"
            placeholder="Add a clear and descriptive title"
            className="w-full border border-gray-300 rounded-lg p-2"
          />

          <input
            type="text"
            placeholder="What is the event all about"
            className="w-full border border-gray-300 rounded-lg p-2"
          />

          <textarea
            placeholder="Agenda/program highlights"
            className="w-full border border-gray-300 rounded-lg p-2 min-h-[120px]"
          />

          {/* Date and Time */}
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Date"
              className="border border-gray-300 rounded-lg p-2"
            />
            <input
              type="text"
              placeholder="Time"
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>

          {/* Venue and Admission */}
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Venue"
              className="border border-gray-300 rounded-lg p-2"
            />
            <input
              type="text"
              placeholder="Admission (Free/Paid)"
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
            <Button variant="outline" size="sm">
              Manage RSVP
            </Button>

            <div className="flex gap-3">
              <Button variant="outline">Save Draft</Button>
              <Button variant="primary2">Publish</Button>
            </div>
          </div>
        </form>

        <PreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          content={<p>Your event preview will appear here.</p>}
        />
      </main>
      <Footer />
    </section>
  );
}
