"use client";

import Sidebar from "@/app/components/create/sidebar";
import Header from "@/app/components/layout/header";
import Footer from "@/app/components/layout/footer";
import Grid from "@/app/components/layout/grid";
import PrimerCard from "@/app/components/create/primer-card";
import ContactCard from "@/app/components/create/contact-card";
import FaqCard from "@/app/components/create/faq-card";
import PhotosCard from "@/app/components/create/photos-card";

export default function SiteContentPage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-pageblue">
      <main className="relative z-10 bg-surface rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />

          <div className="grow w-full max-w-7xl mx-auto px-4 sm:px-6 pt-40 sm:pt-48 pb-20">
            <div className="mb-10 text-left">
              <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
                Site Content
              </h1>
              <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl">
                Details, FAQs and photos that change from one administration to the next.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-stretch lg:items-start">
              <aside className="w-full lg:w-64 shrink-0">
                <Sidebar />
              </aside>

              <div className="flex-1 min-w-0 space-y-8">
                <PrimerCard />
                <ContactCard />
                <FaqCard />
                <PhotosCard />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
