"use client";

import { MerchCardSkeleton } from "../components/feedback/skeleton-cards";
import { readCache, writeCache } from "../hooks/use-cached-fetch";
import { useEffect, useState, type FC } from "react";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import Grid from "../components/layout/grid";
import MerchCard from "../components/merch/merch-card";
import PageHeader from "../components/ui/page-header";
import { useDelayedFlag } from "@/app/components/feedback/skeleton";
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
  imageSrc: item.image || "",
  price: formatPrice(item.prices),
  status: "Available",
  buyLink: item.orderLink,
});

const MerchPage: FC = () => {
  const [merchandise, setMerchandise] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const showSkeleton = useDelayedFlag(loading);

  useEffect(() => {
    const fetchMerch = async () => {
      const cached = readCache<MerchItem[]>("merch-list");
      if (cached) {
        setMerchandise(cached);
        setLoading(false);
      }
      try {
        const items = await merchService.getAll();
        const mapped = items.filter((item) => item.isActive).map(mapMerchItem);
        setMerchandise(mapped);
        writeCache("merch-list", mapped);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchMerch();
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-pageblue">
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
              <div
                data-skeleton-hidden={showSkeleton ? undefined : ""}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {[1, 2, 3].map((i) => (
                  <MerchCardSkeleton key={i} />
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
