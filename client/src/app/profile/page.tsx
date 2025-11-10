import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import PersonalInformation from "./components/personalinfo";
import RolenMembershipInformation from "./components/rolenmembership";
import SecuritySection from "./components/password";
import Header from "../components/header";
import Footer from "../components/footer";
import Grid from "../components/grid";

export default function ProfilePage() {
  const user = {
    name: "Shan Raboy",
    yearLevel: "3",
    idNumber: "12-3456-789",
    email: "gio.macatual@cit.edu",
    councilRole: "Vice President - Internal",
    committeeRole: "Head of Internal Affairs",
    membership: "both",
  };

  return (
    <section className="min-h-screen bg-white flex flex-col relative">
      <Grid />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 mb-5git pt-[9.5rem] pb-12">
          {/* Page Title */}

          {/* Title Section */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
              <div className="h-2 w-2 rounded-full bg-primary1"></div>
              <span className="font-raleway text-sm font-semibold text-primary1">
                COMPanion Information
              </span>
            </div>
            <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
              Profile
            </h1>
            <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              View your details and membership credentials within the ICpEP SE
              CIT-U Chapter.
            </p>
          </div>

          <div className="relative bg-[#00A8FF] rounded-2xl p-10 flex flex-col sm:flex-row items-center gap-5 sm:gap-10 text-white mb-6 overflow-hidden">
            <div className="w-40 h-40 rounded-full bg-blue-100 sm:ml-5 ml-0 border-primary1 border-2 flex items-center justify-center">
              <Image
                src="/officer.svg"
                alt="Profile Photo"
                width={120}
                height={120}
              />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-4xl font-bold font-rubik mb-1">
                {user.name}
              </h2>
              <p className="text-2xl opacity-90 font-rubik">
                {user.yearLevel}rd Year
              </p>
            </div>
            <div className="absolute right-[5%] top-3/4 transform -translate-y-1/2 w-[80%] h-[180%] opacity-15 pointer-events-none z-0 hidden sm:block">
              <Image
                src="/icpep logo.png"
                alt="ICpEP-SE Logo"
                fill
                className="object-contain object-right mix-blend-soft-light"
                sizes="(max-width: 768px) 150px, 300px"
              />
            </div>
          </div>

          <div className="w-full  flex flex-col gap-6 mb-5">
            <PersonalInformation
              fullName={user.name}
              idNumber={user.idNumber}
              yearLevel={user.yearLevel}
              email={user.email}
            />
            <RolenMembershipInformation
              councilRole={user.councilRole}
              committeeRole={user.committeeRole}
              membership="both"
            />

            <SecuritySection />
          </div>
        </main>
        <Footer />
      </div>
    </section>
  );
}
