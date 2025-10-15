import Button from "@/app/components/button";
import EventCard from "@/app/components/cards/eventcard";

export function EventsSection() {
  const events = [
    {
      image: "/gle.png",
      title: "COMPyesta",
      description: "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog."
    },
    {
      image: "/gle.png",
      title: "Why Choose this Biatch?",
      description: "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog."
    },
    {
      image: "/gle.png",
      title: "Why Choose this Biatch?",
      description: "The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog."
    }
  ];

  return (
    <section className="w-full py-16 px-4 md:px-40 text-center mt-20 mb-20">
      <div className="max-w-4xl mx-auto mb-15">
        <h2 className="font-rubik text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-black">
          UPCOMING EVENTS
        </h2>
        <p className="font-raleway text-gray-700 text-base md:text-lg leading-relaxed mt-5">
          Stay informed and engage in initiatives that foster collaboration,
          build connections, and promote continuous learning within the community.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch">
        {events.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </div>

      <div className="mt-15">
        <Button
          variant="outline"
          className="rounded-full px-8 py-2 text-primary3 border-2 border-primary3 hover:bg-primary1 hover:text-white hover:border-primary1 transition-all"
        >
          View All
        </Button>
      </div>
    </section>
  );
}
