"use client";
import Header from "../components/header";
import Footer from "../components/footer";
import DeveloperCard from "../components/cards/developercard";
import Grid from "../components/grid";

export default function DevelopersPage() {
  const developers = [
    {
      name: "Maica C. Eupinado",
      title: "UI/UX",
      desc: "Designer",
      imageSrc: "/officer.svg",
      bgSrc: "/bg-mai.png",
      details: [
        "3rd Year Batch Representative, 6th Administration",
        "Head of Training and Seminar Committee, 6th Administration",
        "UI/UX Designer of the ICPEP.SE CIT-U Chapter Official Website",
      ],
      githubLink: "https://github.com/Cayla07",
      portfolioLink: "#", // <-- Add actual portfolio link here
    },
    {
      name: "Gio Christian D. Macatual",
      title: "Frontend",
      desc: "Developer",
      imageSrc: "/officer.svg",
      bgSrc: "/bg-gio.png",
      details: [
        "Auditor, 6th Administration",
        "Asst. Head of Finance Committee, 6th Administration",
        "Frontend Developer of the ICPEP.SE CIT-U Chapter Official Website",
      ],
      githubLink: "https://github.com/WATRM3LON",
      portfolioLink: "#", // <-- Add actual portfolio link here
    },
    {
      name: "Shan Michael V. Raboy",
      title: "Backend",
      desc: "Developer",
      imageSrc: "/officer.svg",
      bgSrc: "/bg-shan.png",
      details: [
        "Vice President - Internal, 6th Administration",
        "Head of Internal Affairs Committee, 6th Administration",
        "Project Manager of the ICPEP.SE CIT-U Chapter Official Website",
        "Backend Developer of the ICPEP.SE CIT-U Chapter Official Website",
      ],
      githubLink: "https://github.com/ShanRaboy11",
      portfolioLink: "#", // <-- Add actual portfolio link here
    },
    {
      name: "Trixie T. Dolera",
      title: "Fullstack",
      desc: "Developer",
      imageSrc: "/officer.svg",
      bgSrc: "/bg-rexi.png",
      details: [
        "Public Relations Officer, 6th Administration",
        "Asst. Head of Public Relations Committee, 6th Administration",
        "Asst. Head of External Committee, 6th Administation",
        "Fullstack Developer of the ICPEP.SE CIT-U Chapter Official Website",
      ],
      githubLink: "https://github.com/nsfw-syntaxia",
      portfolioLink: "#", // <-- Add actual portfolio link here
    },
  ];

  return (
    // --> set up the main container for positioning
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Add the interactive grid background. It will sit at z-0. */}
      <Grid />

      {/* --> wrap all content in a div to place it on top */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="max-w-7xl mx-auto px-6 pt-[9.5rem] pb-12 w-full flex-grow">
          {/* This title section is already perfectly styled for light mode */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary1/10 px-3 py-1 mb-4">
              <div className="h-2 w-2 rounded-full bg-primary1"></div>
              <span className="font-raleway text-sm font-semibold text-primary1">
                Project Team
              </span>
            </div>
            <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-primary3 leading-tight mb-4">
              Meet the Developers
            </h1>
            <p className="font-raleway text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              The student developers who created the official ICPEP.SE CIT-U
              Chapter website as part of the Software Design course.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[0px] gap-y-14 justify-items-center max-w-[845px] mx-auto mb-16">
            {developers.map((dev, index) => (
              <DeveloperCard key={index} {...dev} />
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
