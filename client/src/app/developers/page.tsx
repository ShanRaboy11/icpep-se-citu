// app/developers/page.tsx (or wherever your DevelopersPage component is located)

// Make sure to import your DeveloperCard component.
// Adjust the path if your DeveloperCard is in a different location.
import DeveloperCard from "@/app/components/cards/developercard"; 

export default function DevelopersPage() {
  const developers = [
    {
      name: "John Doe",
      title: "Fullstack Developer",
      desc: "React, Node.js, and everything in between.",
      imageSrc: "/developers/john_doe_silhouette.png", // Example silhouette image path
      details: [
        "Specializes in MERN stack",
        "Passionate about clean code",
        "Expert in API design",
        "Deployment via Vercel/Netlify",
      ],
      portfolioLink: "https://johndoe.com/portfolio",
    },
    {
      name: "Jane Smith",
      title: "Frontend UI/UX",
      desc: "Bringing designs to life with pixel-perfect precision.",
      imageSrc: "/developers/jane_smith_silhouette.png", // Example silhouette image path
      details: [
        "Figma to React conversion",
        "Proficient in Tailwind CSS",
        "Responsive design advocate",
        "Accessibility standards follower",
      ],
      portfolioLink: "https://janesmith.design",
    },
    {
      name: "Peter Jones",
      title: "Backend Architect",
      desc: "Building scalable and secure server solutions.",
      imageSrc: "/developers/peter_jones_silhouette.png", // Example silhouette image path
      details: [
        "Experienced with AWS/Azure",
        "Microservices expert",
        "Database optimization (SQL/NoSQL)",
        "CI/CD pipeline automation",
      ],
      portfolioLink: "https://peterjones.dev",
    },
    {
      name: "Alice Brown",
      title: "Mobile Developer",
      desc: "Creating intuitive mobile experiences for iOS & Android.",
      imageSrc: "/developers/alice_brown_silhouette.png", // Example silhouette image path
      details: [
        "React Native specialist",
        "Native module development",
        "App store deployment",
        "Performance tuning on mobile",
      ],
      portfolioLink: "https://alicebrown.app",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-800 mb-16">
          Meet Our Amazing Team
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {developers.map((developer, index) => (
            <DeveloperCard
              key={index} // It's good practice to use a unique key, index is okay for static lists
              name={developer.name}
              title={developer.title}
              desc={developer.desc}
              imageSrc={developer.imageSrc}
              details={developer.details}
              portfolioLink={developer.portfolioLink}
            />
          ))}
        </div>
      </div>
    </div>
  );
}