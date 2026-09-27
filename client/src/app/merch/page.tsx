"use client";

import { useEffect, useState, type FC } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";
import MerchCard from "./components/merch-card";
import PageHeader from "../components/page-header";
import merchService, { MerchItem as ApiMerchItem } from "../services/merch";

interface MerchItem {
  name: string;
  imageSrc: string;
  price: string;
  description: string;
  status: "Available" | "Coming Soon" | "Sold Out";
  buyLink?: string;
}

const formatPrice = (prices: ApiMerchItem["prices"]): string => {
  if (!prices || prices.length === 0) return "";
  const values = prices.map((p) => p.price);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? `₱${min}` : `₱${min} - ₱${max}`;
};

const mapMerchItem = (item: ApiMerchItem): MerchItem => ({
  name: item.name,
  description: item.description,
  imageSrc: item.image || "/content/gle.png",
  price: formatPrice(item.prices),
  status: "Available",
  buyLink: item.orderLink,
});

const MerchPage: FC = () => {
  const [merchandise, setMerchandise] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerch = async () => {
      try {
        const items = await merchService.getAll();
        setMerchandise(
          items.filter((item) => item.isActive).map(mapMerchItem),
        );
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchMerch();
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#004e89]">
      <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <div className="w-full max-w-7xl mx-auto px-6 pt-38 pb-24 grow">
            <PageHeader
              className="mb-20 text-center"
              badge="Official Gear"
              title="Wear Your Pride"
              subtitleClassName="max-w-3xl"
              subtitle={
                <>
                  Show your support for the ICPEP SE CIT-U Chapter with our
                  exclusive collection of high-quality merchandise.
                </>
              }
            />

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden border border-gray-100 shadow-md animate-pulse"
                  >
                    <div className="aspect-square bg-gray-100" />
                    <div className="p-6 space-y-3">
                      <div className="h-5 w-2/3 bg-gray-100 rounded-md" />
                      <div className="h-4 w-full bg-gray-100 rounded-md" />
                      <div className="h-4 w-1/2 bg-gray-100 rounded-md" />
                      <div className="h-12 w-full bg-gray-100 rounded-lg mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : merchandise.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 font-raleway text-lg">
                  No merchandise available at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {merchandise.map((item) => (
                  <MerchCard key={item.name} {...item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="-mt-8.75 md:-mt-20 relative z-0">
        <Footer />
      </div>
    </div>
  );
};

export default MerchPage;
