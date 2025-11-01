import Image from "next/image";
import PersonalInformation from "./components/personalinfo";
import SecuritySection from "./components/password";
import Header from "../components/header";
import Footer from "../components/footer";

export default function ProfilePage() {
  return (
    <section className="min-h-screen bg-white flex flex-col relative">
      {/* Global Header */}
      <Header />

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 mb-5git pt-[9.5rem] pb-12">
        {/* Page Title */}
        <div className="text-center sm:text-left mb-10">
          <h1 className="text-2xl sm:text-4xl font-bold font-rubik text-primary2">
            Profile
          </h1>
          <div className="h-[2px] bg-primary1 w-24 sm:w-full mt-3 mx-auto rounded-full" />
        </div>

        {/* Responsive Profile Layout */}
        <div className="flex flex-col md:flex-row gap-10">
          {/* LEFT SIDE */}
          <div className="w-full md:w-1/3 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-40 h-40 rounded-full bg-blue-100 border-primary1 border-2 flex items-center justify-center">
              <Image
                src="/officer.svg"
                alt="Profile Photo"
                width={120}
                height={120}
              />
            </div>

            {/* Name */}
            <h2 className="font-rubik font-bold text-primary1 text-3xl mt-4">
              Shan Raboy
            </h2>

            {/* Officer Role */}
            <p className="mt-4 font-rubik font-semibold text-xl text-primary3">
              Vice President - Internal
            </p>
            <p className="text-md font-raleway text-primary3">
              6th Administration
            </p>

            {/* Committee Role */}
            <p className="mt-4 font-rubik font-semibold text-xl text-primary3">
              Committee Head
            </p>
            <p className="text-md font-raleway text-primary3">
              Committee on Internal Affairs
            </p>

            <div className="flex flex-row gap-4 mt-8 md:items-center justify-between">
              <Image
                src="/council officers.png"
                alt="Profile Photo"
                width={80}
                height={80}
                className=" animate-float-slow"
              />
              <Image
                src="/internal affairs.png"
                alt="Profile Photo"
                width={80}
                height={80}
                className=" animate-float-medium"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full md:w-2/3 flex flex-col gap-6">
            <PersonalInformation
              fullName="Shan Raboy"
              idNumber="12-3456-789"
              yearLevel={3}
              email="gio.macatual@cit.edu"
              membership="both"
            />

            <SecuritySection />
          </div>
        </div>
      </main>
      <Footer />
    </section>
  );
}
