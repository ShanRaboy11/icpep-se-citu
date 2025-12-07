"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import Header from "../../components/header";
import Footer from "../../components/footer";
import Grid from "../../components/grid";
import OfficerCard from "../components/officer-card";

import { departments } from "../utils/officers";

const OfficersPage = () => {
  const params = useParams();
  const router = useRouter();

  const slug =
    (Array.isArray(params?.slug) ? params.slug[0] : params?.slug) || "";
  const data = departments[slug];

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
        <Grid />
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center pt-[9.5rem]">
          <h1 className="text-3xl font-bold text-gray-800 font-rubik">
            Department Not Found
          </h1>
          <button
            onClick={() => router.back()}
            className="mt-4 text-primary1 underline font-raleway"
          >
            Go Back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Background Grid */}
      <Grid />

      {/* Decorative Blobs */}
      <div className="absolute top-[-10rem] left-[-15rem] w-[35rem] h-[35rem] bg-primary1/10 rounded-full filter blur-3xl opacity-60"></div>
      <div className="absolute top-1/4 right-[-18rem] w-[35rem] h-[35rem] bg-secondary2/10 rounded-full filter blur-3xl opacity-60"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-24">
          {/* Back Button */}
          <div className="mb-8 flex justify-start">
            <button
              onClick={() => router.back()}
              title="Go Back"
              className="relative flex h-12 w-12 cursor-pointer items-center justify-center 
                         rounded-full border-2 border-primary1 text-primary1 
                         overflow-hidden transition-all duration-300 ease-in-out 
                         active:scale-95 before:absolute before:inset-0 
                         before:bg-gradient-to-r before:from-transparent 
                         before:via-white/40 before:to-transparent 
                         before:translate-x-[-100%] hover:before:translate-x-[100%] 
                         before:transition-transform before:duration-700"
            >
              <ArrowLeft className="h-6 w-6 animate-nudge-left translate-x-[2px]" />
            </button>
          </div>

          {/* Header Section */}
          <div className="mb-16 text-left">
            <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
              {data.title}
            </h1>

            <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl">
              {data.description}
            </p>
          </div>

          {/* Officers Grid */}
          <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 justify-items-center">
              {data.officers.map((officer, index) => (
                <OfficerCard
                  key={index}
                  position={officer.position}
                  role={officer.role}
                  name={officer.name}
                  image="/faculty.png"
                  gradient={data.gradient}
                  shadow={data.shadow}
                />
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default OfficersPage;
