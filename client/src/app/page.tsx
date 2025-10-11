'use client';

import Header from "./components/header";
import Footer from "./components/footer";
import EventCard from "./components/cards/eventcard";
import AnnounceCardSmall from "./components/cards/announcecardsmall";
import AnnounceCardBig from "./components/cards/announcecardbig";
import AnnounceCardMed from "./components/cards/announcecardmed";
import AdminCard from "./components/cards/admincard";
import CommitteeCard from "./components/cards/committeecard";
import AnnounceDetailsCard from "./components/cards/announcedetailscard";
import AttendanceModalCard from "./components/cards/attendancemodal";
import OfficerCard2 from "./components/cards/officercard2";
import OfficerCard1 from "./components/cards/officercard1";
import OfficerCard3 from "./components/cards/officercard3";
import FacultyCard from "./components/cards/facultycard";
import FacultyOfficerCard from "./components/cards/facultyofficercard";
import DeveloperCard from "./components/cards/developercard";
import TestimonialCard from "./components/cards/testimonialcard";

const officersData = [
  { title: "President", name: "Jorho Joseph Parino" },
  { title: "VP - Internal", name: "Shan Michael Raboy" },
  { title: "VP - External", name: "Wilfred Justin Peteros" },
  { title: "Secretary", name: "Elle Gabrielle Bernarte" },
  { title: "Treasurer", name: "Kern Philip David" },
  { title: "Auditor", name: "Gio Christian Macatual" },
  { title: "P.R.O.", name: "Trixie Dolera" },
  { title: "P.I.O.", name: "Louielyn Abella" },
  { title: "1st Year - Batch Rep.", name: "Louielyn Abella" },
  { title: "2nd Year - Batch Rep.", name: "Louielyn Abella" },
  { title: "3rd Year - Batch Rep.", name: "Louielyn Abella" },
  { title: "4th Year - Batch Rep.", name: "Louielyn Abella" },
];

const officers = [
  {
    name: 'Dela Cruz, Juana',
    position: 'President',
    image: '/faculty.png',
  },
  {
    name: 'Santos, Mark',
    position: 'Vice President',
    image: '/faculty.png',
  },
  {
    name: 'Santos, Mark',
    position: 'Vice President',
    image: '/faculty.png',
  },
];

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <main className="flex-grow pt-20 p-6">
        <h1 className="text-3xl font-rubik">Welcome to MyWebsite</h1>
        <p className="mt-4 text-primary1">This is your content area.</p>
        <EventCard
        image="/gle.png"
        title="COMPyesta"
        description="The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog."
        onRSVP={() => alert("RSVP clicked!")}
      />
      <AnnounceCardSmall
        image="/gle.png"
        category="Seminar"
        title="Acquaintance Party"
        description="The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog."
        date="September 10, 2025"
        onClick={() => alert("Card clicked!")}
      />
      <AnnounceCardBig
  title="Acquaintance Party"
  date="September 10, 2025"
  description="The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog."
  imageUrl="/gle.png"
  onClick={() => alert("Card clicked!")}
/>
<AdminCard
  image="/6th cover.png"
  title="5th Administration"
  subtitle="Year: 2025 - 2026"
  onClick={() => alert("Card clicked!")}
/>
<CommitteeCard
  title="Committee on Internal Affairs"
  image="/finance.png"
  description={[
    "In charge of planning and initiating activities, programs, and projects that cater to advancing and engaging the Computer Engineering community.",
    "Make sure that all activities, programs, and projects organized by the organization attain their objectives.",
    "Assembles a team that will manage the technical aspects of the organization’s program and/or events.",
    "Aspiring officers who have a dedication and commitment to Computer Engineering students are encouraged to apply in this committee."
  ]}
  onClick={() => console.log('Card clicked!')}
/>
<AnnounceCardMed
  image="/gle.png"
  tag="Event"
  title="Annual Innovation Conference 2024"
  description="Join us for our biggest innovation conference of the year featuring keynote speakers, workshops, and networking opportunities."
  date="December 15, 2024"
  onClick={() => alert('Conference clicked!')}
/>
<AnnounceDetailsCard
  title="Meeting Details"
  date="Friday, November 15, 2024"
  time="8:00 PM - 10:00 PM"
  location="GLE 703"
  organizer="Training and Seminar Committee"
  contact="icpep.seofficial2526@gmail.com"
  onClick={() => console.log('Meeting card clicked!')}
/>
<AttendanceModalCard
        title="Complete Meeting Attendance"
        subtitle="ICpEP.SE CIT-U Chapter - 2nd Regular Meeting"
        officers={officersData}
        onClose={() => alert("Modal closed")}
      />

<OfficerCard2
  image="/officer.svg"
  position="Vice President"
  role="Internal"
  lastName="Dela Cruz"
  firstName="Juan"
  onClick={() => alert("Card clicked!")}
/>
<OfficerCard1
  image="/officer.svg"
  position="President"
  role=""
  lastName="Dela Cruz"
  firstName="Juan"
  onClick={() => alert("Card clicked!")}
/>
<OfficerCard3
  image="/officer.svg"
  position="1st year"
  role="Representative"
  lastName="Dela Cruz"
  firstName="Juan"
  onClick={() => alert("Card clicked!")}
/>
<DeveloperCard
  name="Maica C. Eupinado"
  title="UI/UX"
  desc="Designer"
  imageSrc="/officer.svg" // your image file in /public
  details={[
    "3rd Year Batch Representative, 6th Administration",
    "Head of Training and Seminar Committee, 6th Administration",
    "UI/UX Designer of the ICpEP.SE CIT-U Chapter Official Website",
  ]}
  portfolioLink="https://portfolio-link.com"
/>

<FacultyCard
          name="Engr. Roel P. Lauron"
          position="Dean"
          image="/officer.svg"
          onClick={() => alert(`Card Clicked!`)}
        />

<div className="flex flex-wrap justify-center gap-8 p-8">
      {officers.map((o, i) => (
        <FacultyOfficerCard
          key={i}
          name={o.name}
          position={o.position}
          image={o.image}
          onClick={() => alert(`${o.name} clicked`)}
        />
      ))}
    </div>

    <TestimonialCard
  name="Virinder Bhardwaj"
  title="MD Urology"
  imageSrc="/officer.svg"
  testimonial="OneLine Health has saved me two hours daily by eliminating the need for post-clinic dictation, allowing me to finalize notes immediately. This has significantly improved efficiency and enhanced the quality of care for my community."
/>


      </main>
      <Footer />
    </div>
  );
}
