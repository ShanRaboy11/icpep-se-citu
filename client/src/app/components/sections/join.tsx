import { ArrowUpRight, Cpu, Rocket, Target, Network } from "lucide-react";
import CarouselGallery from "../../home/components/carousel";

const BenefitCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="relative group rounded-2xl p-6 overflow-hidden">
    {/* Softer Shimmer Glow Effect */}
    <div
      className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary1/40 via-secondary2/40 to-primary1/40 
                 bg-[length:200%_100%] blur-sm opacity-0 group-hover:opacity-50 
                 transition duration-1000 animate-shimmer"
    ></div>

    {/* Glassy Layer */}
    <div className="absolute inset-0 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-lg"></div>

    {/* Content Layer */}
    <div className="relative flex items-center gap-5 text-left">
      {/* Rounded Square Icon Container */}
      <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-primary1">
        {icon}
      </div>

      {/* Text Content */}
      <div className="flex-1">
        <h3 className="font-rubik text-xl font-bold text-secondary2">
          {title}
        </h3>
        <p className="mt-1 font-raleway text-sm text-gray-300">{description}</p>
      </div>

      {/* Arrow */}
      <ArrowUpRight className="ml-auto h-6 w-6 flex-shrink-0 text-white/30" />
    </div>
  </div>
);

export function WhyJoinSection() {
  const benefits = [
    {
      icon: <Cpu size={24} />,
      title: "Level Up Your Skills",
      description: "Access exclusive workshops and trainings.",
    },
    {
      icon: <Rocket size={24} />,
      title: "Step into Leadership",
      description: "Lead projects and gain experience.",
    },
    {
      icon: <Target size={24} />,
      title: "Challenge Yourself",
      description: "Join competitions to test your capabilities.",
    },
    {
      icon: <Network size={24} />,
      title: "Be a COMPanion",
      description: "Grow with people who share your passion.",
    },
  ];

  const galleryImages = [
    "/whyicpep.png",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop",
  ];

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-primary3 to-secondary1 py-28 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h1 className="font-rubik text-4xl sm:text-5xl font-bold text-secondary2 leading-tight mb-4">
            Why Join ICpEP SE?
          </h1>
          <p className="font-raleway text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
            Unlock your potential in a community dedicated to growth and
            innovation.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Carousel Card */}
          <div className="h-[475px] w-full overflow-hidden rounded-2xl border border-white/30">
            <CarouselGallery
              imageUrls={galleryImages}
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* Benefit Cards */}
          <div className="flex flex-col gap-6">
            {benefits.map((benefit, index) => (
              <BenefitCard key={index} {...benefit} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
