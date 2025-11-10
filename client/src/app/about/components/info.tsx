"use client";

import { useState, useEffect, FC, ReactElement, Suspense } from "react";
import Image from "next/image";
import { Box, Lightbulb, Rocket, Ribbon } from "lucide-react";

// --- NEW 3D IMPORTS ---
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

// --- SECTION & LAYOUT COMPONENTS (NO CHANGES) ---

interface SectionType {
  id: string;
  tabLabel: string;
  icon: ReactElement;
  title: string;
  content: string;
  imageUrl: string;
}

const DefaultLayout: FC<{ section: SectionType }> = ({ section }) => (
  <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
    <div className="text-left">
      <h3 className="font-rubik text-3xl sm:text-4xl font-bold mb-4 text-secondary2">
        {section.title}
      </h3>
      <p className="font-raleway text-lg sm:text-xl leading-relaxed text-gray-300">
        {section.content}
      </p>
    </div>
    <div className="w-full aspect-[4/3] relative rounded-2xl overflow-hidden shadow-lg group">
      <Image
        src={section.imageUrl}
        alt={section.title}
        fill
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
    </div>
  </div>
);

// --- UPDATED 3D MODEL VIEWER COMPONENT ---

// The Model component now accepts a 'scale' prop
function Model({ modelPath, scale }: { modelPath: string; scale: number }) {
  const { scene } = useGLTF(modelPath);

  // Use the passed 'scale' prop instead of a hardcoded value
  return <primitive object={scene} scale={scale} />;
}

// The ModelViewer now accepts a 'scale' prop to pass down to the Model
const ModelViewer: FC<{ modelPath: string; scale: number }> = ({
  modelPath,
  scale,
}) => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
      {/* Lights are essential to see the model */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[3, 3, 5]} intensity={2.5} />

      <Suspense fallback={null}>
        {/* Pass the scale prop down to the Model component */}
        <Model modelPath={modelPath} scale={scale} />
      </Suspense>

      {/* This adds the 360-degree mouse controls! */}
      <OrbitControls
        enableZoom={false} // Disable zooming with scroll
        enablePan={false} // Disable moving the model
        autoRotate // Make it slowly rotate by itself
        autoRotateSpeed={0.15}
      />
    </Canvas>
  );
};

// --- MODIFIED VisionLayout STARTS HERE ---
const VisionLayout: FC<{ section: SectionType }> = ({ section }) => {
  const visionPoints = [
    {
      iconUrl: "/target.glb",
      title: "Fostering Innovators",
      description: "Leading and inspiring technological advancement.",
      scale: 1.2, // Custom scale for this model
    },
    {
      iconUrl: "/megaphone.glb",
      title: "Ethical Leadership",
      description: "Impacting society with technical prowess and integrity.",
      scale: 1.0, // Custom scale for this model
    },
    {
      iconUrl: "/headphone.glb",
      title: "Community Driven",
      description: "Building a collaborative and supportive student network.",
      scale: 1.1, // A smaller scale for the Minecraft model
    },
  ];

  return (
    <div className="text-center">
      <div className="max-w-3xl mx-auto">
        <h3 className="font-rubik text-3xl sm:text-4xl font-bold mb-4 text-secondary2">
          {section.title}
        </h3>
        <p className="font-raleway text-lg sm:text-xl leading-relaxed text-gray-300">
          {section.content}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        {visionPoints.map((point, index) => (
          <div key={index} className="text-center group">
            <div
              className="relative w-full h-40 rounded-2xl overflow-hidden bg-white/5 p-2 mb-4 border border-white/10 transition-colors duration-300 group-hover:bg-white/10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, transparent 1px, rgba(255,255,255,0.05) 1px)",
                backgroundSize: "1rem 1rem",
              }}
            >
              {/* Pass the custom scale from our data to the ModelViewer */}
              <ModelViewer modelPath={point.iconUrl} scale={point.scale} />
            </div>
            <h4 className="font-rubik text-xl font-bold text-white">
              {point.title}
            </h4>
            <p className="font-raleway text-gray-300">{point.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
// --- MODIFIED VisionLayout ENDS HERE ---

// --- NO CHANGES BELOW THIS LINE ---

const sections: SectionType[] = [
  {
    id: "org",
    tabLabel: "ICpEP SE CIT-U",
    icon: <Box size={22} />,
    title: "Engineered for Impact",
    content:
      "The Institute of Computer Engineers of the Philippines (ICpEP) Student Edition at Cebu Institute of Technology-University is a dynamic student body dedicated to the holistic development of future computer engineers.",
    imageUrl: "/gle.png",
  },
  {
    id: "vision",
    tabLabel: "Vision",
    icon: <Lightbulb size={22} />,
    title: "Leading Innovation Forward",
    content:
      "To be a community-driven center of excellence in computer engineering, fostering innovators who lead technological advancement and are recognized for their technical prowess and ethical leadership.",
    imageUrl: "/gle.png",
  },
  {
    id: "mission",
    tabLabel: "Mission",
    icon: <Rocket size={22} />,
    title: "Empowering Change-Makers",
    content:
      "To provide holistic development for students through academic support, skills training, and community engagement, preparing them to be globally competent professionals who can solve complex problems.",
    imageUrl: "/gle.png",
  },
  {
    id: "values",
    tabLabel: "Core Values",
    icon: <Ribbon size={22} />,
    title: "Values That Inspire",
    content:
      "We uphold Integrity, Passion, Excellence, Collaboration, and Service in all our endeavors. These values shape engineers with strong character, a drive for innovation, and a commitment to competence.",
    imageUrl: "/gle.png",
  },
];

const TAB_DURATION = 7000;

const InfoSection: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % sections.length);
    }, TAB_DURATION);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const activeSection = sections[activeIndex];

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {sections.map((section, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={section.id}
              onClick={() => setActiveIndex(index)}
              className={`group w-full relative overflow-hidden flex items-center gap-3 p-2 rounded-xl text-left transition-all duration-300
          cursor-pointer
          ${
            isActive
              ? "bg-gradient-to-br from-primary3 to-secondary1 shadow-md"
              : "bg-white border-2 border-secondary3 text-black hover:bg-gradient-to-br hover:from-primary3/85 hover:to-secondary1/85"
          }`}
            >
              {isActive && (
                <div
                  key={activeIndex}
                  className="absolute left-0 top-0 bottom-0 h-full bg-white/20 animate-progress"
                  style={{ animationDuration: `${TAB_DURATION}ms` }}
                />
              )}
              <div
                className={`relative z-10 flex-shrink-0 p-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-white/10 text-secondary2"
                    : "bg-secondary3/10 text-secondary2"
                }`}
              >
                {section.icon}
              </div>
              <span
                className={`relative z-10 font-raleway text-sm font-semibold ${
                  isActive
                    ? "text-gray-300"
                    : "text-black group-hover:text-gray-100"
                }`}
              >
                {section.tabLabel}
              </span>
            </button>
          );
        })}
      </div>

      <section
        className="rounded-3xl mt-8 bg-gradient-to-br from-primary3 to-secondary1
    px-10 sm:px-16 py-16 sm:py-20 shadow-2xl text-white flex flex-col justify-center min-h-[40rem]"
      >
        <div key={activeIndex} className="animate-fade-in">
          {activeSection.id === "vision" ? (
            <VisionLayout section={activeSection} />
          ) : (
            <DefaultLayout section={activeSection} />
          )}
        </div>
      </section>
    </>
  );
};

export default InfoSection;
