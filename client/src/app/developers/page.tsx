"use client";
import Header from "../components/header";
import Footer from "../components/footer";
import DeveloperCard from "./components/developer-card";
import Grid from "../components/grid";
import PageHeader from "../components/page-header";

export default function DevelopersPage() {
  const developers = [
    {
      name: "Maica C. Eupinado",
      title: "UI/UX",
      desc: "Designer",
      imageSrc: "/team/eupinado.png",
      bgSrc: "/team/bg-mai.png",
      imageClassName: "scale-[0.95] origin-bottom",
      details: [
        "3rd Year Batch Representative, 6th Administration",
        "Head of Training and Seminar Committee, 6th Administration",
        "UI/UX Designer of the ICPEP.SE CIT-U Chapter Official Website",
      ],
      githubLink: "https://github.com/Cayla07",
      portfolioLink: "#",
    },
    {
      name: "Gio Christian D. Macatual",
      title: "Frontend",
      desc: "Developer",
      imageSrc: "/team/macatual.png",
      bgSrc: "/team/bg-gio.png",
      details: [
        "Auditor, 6th Administration",
        "Asst. Head of Finance Committee, 6th Administration",
        "Frontend Developer of the ICPEP.SE CIT-U Chapter Official Website",
      ],
      githubLink: "https://github.com/WATRM3LON",
      portfolioLink: "#",
    },
    {
      name: "Shan Michael V. Raboy",
      title: "Backend",
      desc: "Developer",
      imageSrc: "/team/raboy.png",
      bgSrc: "/team/bg-shan.png",
      details: [
        "Vice President - Internal, 6th Administration",
        "Head of Internal Affairs Committee, 6th Administration",
        "Project Manager of the ICPEP.SE CIT-U Chapter Official Website",
        "Backend Developer of the ICPEP.SE CIT-U Chapter Official Website",
      ],
      githubLink: "https://github.com/ShanRaboy11",
      portfolioLink: "#",
    },
    {
      name: "Trixie T. Dolera",
      title: "Fullstack",
      desc: "Developer",
      imageSrc: "/team/dolera.png",
      bgSrc: "/team/bg-rexi.png",
      imageClassName: "scale-[1.095] origin-bottom",
      details: [
        "Public Relations Officer, 6th Administration",
        "Asst. Head of Public Relations Committee, 6th Administration",
        "Asst. Head of External Committee, 6th Administation",
        "Fullstack Developer of the ICPEP.SE CIT-U Chapter Official Website",
      ],
      githubLink: "https://github.com/nsfw-syntaxia",
      portfolioLink: "#",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#004e89]">
      <main className="relative z-10 bg-white rounded-b-[40px] md:rounded-b-[50px] overflow-hidden">
        <Grid />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />

          <div className="max-w-7xl mx-auto px-6 pt-38 pb-12 w-full grow">
            <PageHeader
              className="mb-16 text-center"
              badge="Project Team"
              title="Meet the Developers"
              subtitle={
                <>
                  The student developers who created the official ICPEP SE
                  CIT-U Chapter website as part of the Software Design course.
                </>
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 gap-y-14 justify-items-center max-w-211.25 mx-auto mb-16">
              {developers.map((dev, index) => (
                <DeveloperCard key={index} {...dev} />
              ))}
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
