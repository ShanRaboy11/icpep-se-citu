"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import MerchCard from "./components/merch-card";
import { type FC } from "react";
import { useState, useRef } from "react";
import { Sparkles } from "lucide-react";

interface MerchItem {
  name: string;
  imageSrc: string;
  price: string;
  description: string;
  status: "Available" | "Coming Soon" | "Sold Out";
  buyLink?: string;
  edit?: boolean;
}

const MerchPage: FC = () => {
  const [edit, setEdit] = useState(false);

  // We don't need double click logic anymore!
  const toggleEdit = () => {
    setEdit((prev) => !prev);
  };

  const merchandise: MerchItem[] = [
    {
      name: "Varsity Jacket",
      price: "₱1200",
      description: "Classic collegiate style with premium embroidery.",
      status: "Available",
      imageSrc: "/gle.png",
      buyLink: "https://forms.gle/your-order-form-link",
    },
    {
      name: "Chapter T-Shirt",
      price: "₱350",
      description: "Comfortable and stylish, perfect for daily wear.",
      status: "Sold Out",
      imageSrc: "/gle.png",
    },
    {
      name: "ICPEP.SE Lanyard",
      price: "₱150",
      description: "Keep your essentials close with our official lanyard.",
      status: "Available",
      imageSrc: "/gle.png",
      buyLink: "https://forms.gle/your-order-form-link",
    },
    {
      name: "Tote Bag",
      price: "₱250",
      description: "A versatile and eco-friendly bag for your daily needs.",
      status: "Coming Soon",
      imageSrc: "/gle.png",
    },
    {
      name: "Enamel Pin Set",
      price: "₱300",
      description: "A set of three custom-designed pins for your collection.",
      status: "Coming Soon",
      imageSrc: "/gle.png",
    },
    {
      name: "Sticker Pack",
      price: "₱100",
      description: "Decorate your gear with our waterproof vinyl stickers.",
      status: "Available",
      imageSrc: "/gle.png",
      buyLink: "https://forms.gle/your-order-form-link",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden select-none touch-manipulation">
      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-15 flex-grow">
          {/* Section Header */}
          <div className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
              <div className="h-2 w-2 rounded-full bg-primary1"></div>
              <span className="font-raleway text-sm font-semibold text-primary1">
                Official Gear
              </span>
            </div>
            <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
              Wear Your Pride
            </h1>
            <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
              Show your support for the ICPEP SE CIT-U Chapter with our
              exclusive collection of high-quality merchandise.
            </p>
          </div>

          {/* Merchandise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {merchandise.map((item) => (
              <MerchCard key={item.name} {...item} edit={edit} />
            ))}
          </div>
          <div className="w-full flex justify-end mt-8">
            <button
              onClick={toggleEdit}
              className={`mt-10 group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-rubik font-semibold transition-all duration-300 ${
                edit
                  ? "bg-primary1 text-white shadow-lg shadow-primary1/30 scale-105"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Sparkles
                size={18}
                className={`transition-transform duration-300 ${
                  edit ? "animate-spin-slowmo" : ""
                }`}
              />
              <span>{edit ? "Edit Mode: ON" : "Activate Edit"}</span>
            </button>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MerchPage;
