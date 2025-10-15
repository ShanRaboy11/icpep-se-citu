"use client";
import  Header  from "../components/header";
import Footer from "../components/footer";
import DeveloperCard from "../components/cards/developercard"; 

export default function DevelopersPage() {
  const developers = [
    {
      name: "Maica C. Eupinado",
      title: "UI/UX",
      desc: "Designer",
      imageSrc: "/officer.svg",
      details: [
        "3rd Year Batch Representative, 6th Administration",
        "Head of Training and Seminar Committee, 6th Administration",
        "UI/UX Designer of the ICPEP.SE CIT-U Chapter Official Website",
      ],
      portfolioLink: "https://github.com/Cayla07",
    },
    {
      name: "Gio Christian D. Macatual",
      title: "Frontend",
      desc: "Developer",
      imageSrc: "/officer.svg",
      details: [
        "Auditor, 6th Administration",
        "Asst. Head of Finance Committee, 6th Administration",
        "Frontend Developer of the ICPEP.SE CIT-U Chapter Official Website",
      ],
      portfolioLink: "https://github.com/WATRM3LON",
    },
    {
      name: "Shan Michael V. Raboy",
      title: "Backend",
      desc: "Developer",
      imageSrc: "/officer.svg", 
      details: [
        "Vice President - Internal, 6th Administration",
        "Head of Internal Affairs Committee, 6th Administration",
        "Project Manager of the ICPEP.SE CIT-U Chapter Official Website",
        "Backend Developer of the ICPEP.SE CIT-U Chapter Official Website"
      ],
      portfolioLink: "https://github.com/ShanRaboy11",
    },
    {
      name: "Trixie T. Dolera",
      title: "Fullstack",
      desc: "Developer",
      imageSrc: "/officer.svg", 
      details: [
        "Public Relations Officer, 6th Administration",
        "Asst. Head of Public Relations Committee, 6th Administration",
        "Asst. Head of External Committee, 6th Administation",
        "Fullstack Developer of the ICPEP.SE CIT-U Chapter Official Website",
      ],
      portfolioLink: "https://github.com/nsfw-syntaxia",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        
        <div className="mb-12">
          <h1 className="font-rubik font-bold text-4xl sm:text-5xl text-gray-900 mb-3">
            DEVELOPERS
          </h1>
          <p className="font-raleway text-gray-600 text-base sm:text-lg">
            Meet the student developers who created the website as part of the
            Software Design course.
          </p>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 justify-items-center max-w-4xl mx-auto mb-16">
          {developers.map((dev, index) => (
            <DeveloperCard
              key={index}
              name={dev.name}
              title={dev.title}
              desc={dev.desc}
              imageSrc={dev.imageSrc}
              details={dev.details}
              portfolioLink={dev.portfolioLink}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}