"use client";

import { useRouter } from "next/navigation";
import { Home, Compass } from "lucide-react";
import Header from "./components/header";
import Footer from "./components/footer";
import Grid from "./components/grid";
import Button from "./components/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#004e89]">
      <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />

          <div className="flex grow flex-col items-center justify-center px-6 pt-38 pb-24 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-6">
              <span className="font-raleway text-sm font-semibold text-primary1">
                404 Error
              </span>
            </div>

            <h1 className="font-rubik text-7xl sm:text-9xl font-bold text-primary3 leading-none mb-4">
              404
            </h1>

            <h2 className="font-rubik text-2xl sm:text-3xl font-bold text-primary3 mb-4">
              Looks like this page took a detour.
            </h2>

            <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-md mx-auto mb-10">
              The page you&apos;re looking for doesn&apos;t exist or may have
              been moved. Let&apos;s get you back on track.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="hero"
                className="flex items-center gap-2 px-8 py-3 w-55 sm:w-auto justify-center"
                onClick={() => router.push("/home")}
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
              <Button
                variant="heroOutline"
                className="flex items-center gap-2 px-8 py-3 w-55 sm:w-auto justify-center"
                onClick={() => router.push("/events")}
              >
                <Compass className="h-4 w-4" />
                Explore Events
              </Button>
            </div>
          </div>
        </div>
      </main>

      <div className="-mt-8.75 md:-mt-20 relative z-0">
        <Footer />
      </div>
    </div>
  );
}
