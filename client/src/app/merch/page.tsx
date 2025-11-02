"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import MerchCard from "./components/merch-card"; // The new component
import { type FC } from "react";

// You can expand this interface as needed
interface MerchItem {
  name: string;
  imageSrc: string;
  price: string;
  description: string;
  features: string[];
  buyLink: string;
  isAvailable: boolean;
}

const MerchPage: FC = () => {
  // Sample data for merchandise - replace with your actual data
  const merchandise: MerchItem[] = [
    {
      name: "Varsity Jacket",
      imageSrc: "/merch-placeholder.svg", // Replace with actual image path
      price: "₱1200",
      description: "Classic collegiate style with premium embroidery.",
      features: ["Wool-blend body", "Leather sleeves", "Quilted inner lining"],
      buyLink: "https://forms.gle/your-order-form-link",
      isAvailable: true,
    },
    {
      name: "Chapter T-Shirt",
      imageSrc: "/merch-placeholder.svg", // Replace with actual image path
      price: "₱350",
      description: "Comfortable and stylish, perfect for daily wear.",
      features: [
        "100% High-Grade Cotton",
        "Available in S, M, L, XL",
        "Silkscreen print",
      ],
      buyLink: "https://forms.gle/your-order-form-link",
      isAvailable: true,
    },
    {
      name: "ICPEP.SE Lanyard",
      imageSrc: "/merch-placeholder.svg", // Replace with actual image path
      price: "₱150",
      description: "Keep your essentials close with our official lanyard.",
      features: ["Durable nylon strap", "Detachable buckle", "Metal hook"],
      buyLink: "https://forms.gle/your-order-form-link",
      isAvailable: true,
    },
    {
      name: "Tote Bag",
      imageSrc: "/merch-placeholder.svg", // Replace with actual image path
      price: "₱250",
      description: "A versatile and eco-friendly bag for your daily needs.",
      features: [
        "Heavy-duty canvas",
        "Reinforced stitching",
        "Spacious main compartment",
      ],
      buyLink: "https://forms.gle/your-order-form-link",
      isAvailable: false,
    },
    {
      name: "Enamel Pin Set",
      imageSrc: "/merch-placeholder.svg", // Replace with actual image path
      price: "₱300",
      description: "A set of three custom-designed pins for your collection.",
      features: [
        "High-quality enamel",
        "Butterfly clutch backing",
        "Includes 3 unique designs",
      ],
      buyLink: "https://forms.gle/your-order-form-link",
      isAvailable: false,
    },
    {
      name: "Sticker Pack",
      imageSrc: "/merch-placeholder.svg", // Replace with actual image path
      price: "₱100",
      description: "Decorate your gear with our waterproof vinyl stickers.",
      features: [
        "5 unique designs per pack",
        "Waterproof and scratch-resistant",
        "Perfect for laptops & tumblers",
      ],
      buyLink: "https://forms.gle/your-order-form-link",
      isAvailable: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="w-full max-w-7xl mx-auto px-6 pt-[9.5rem] pb-24 flex-grow">
          {/* Section Header - Styled like Membership page */}
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
              Show your support for ICpEP SE CIT-U Chapter with our exclusive
              line of premium merchandise made for proud members.
            </p>
          </div>

          {/* Merchandise Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {merchandise.map((item, index) => (
              <MerchCard key={index} {...item} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MerchPage;
