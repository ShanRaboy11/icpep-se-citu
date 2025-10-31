import Button from "@/app/components/button";
import EventCard from "@/app/components/cards/eventcard";

export function EventsSection() {
  const events = [
    {
      image: "/gle.png",
      title: "COMPyesta",
      description:
        "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.",
    },
    {
      image: "/gle.png",
      title: "Why Choose this Biatch?",
      description:
        "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.",
    },
    {
      image: "/gle.png",
      title: "Why Choose this Biatch?",
      description:
        "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.",
    },
  ];

  return (
    // --- FIX 1: Adopted the full-screen section styling from WhyJoinSection. ---
    <section className="light-dark-background relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 py-16 sm:py-20">
      {/* --- FIX 2: Added a main content wrapper to center and constrain the content nicely. --- */}
      <div className="w-full max-w-7xl mx-auto text-center">
        {/* --- FIX 3: Removed the extra max-w-4xl div and adjusted spacing. --- */}
        <div className="mb-12 md:mb-16">
          <h2 className="font-rubik text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-black">
            UPCOMING EVENTS
          </h2>
          <p className="font-raleway text-gray-700 text-base md:text-lg max-w-3xl mx-auto leading-relaxed mt-5">
            Stay informed and engage in initiatives that foster collaboration,
            build connections, and promote continuous learning within the
            community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch">
          {events.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>

        {/* --- FIX 4: Adjusted top margin for better flow. --- */}
        <div className="mt-16">
          <Button
            variant="outline"
            className="rounded-full px-8 py-2 text-primary3 border-2 border-primary3 hover:bg-primary1 hover:text-white hover:border-primary1 transition-all"
          >
            View All
          </Button>
        </div>
      </div>
    </section>
  );
}