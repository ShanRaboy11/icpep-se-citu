'use client';

import Header from "./components/header";
import Footer from "./components/footer";
import EventCard from "./components/cards/eventcard";
import AnnouncementCard from "./components/cards/announcementcarsmall";

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
      <AnnouncementCard
        image="/gle.png"
        category="Seminar"
        title="Acquaintance Party"
        description="The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog."
        date="September 10, 2025"
      />
      </main>
      <Footer />
    </div>
  );
}
