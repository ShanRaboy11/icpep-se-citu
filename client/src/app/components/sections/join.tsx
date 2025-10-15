import Image from 'next/image';

export function WhyJoinSection() {
  const benefits = [
    {
      title: "Build Connections & Networks",
      description: "Be part of a community where your passion connects you to growth and opportunity."
    },
    {
      title: "Level Up Your Skills",
      description: "Join exclusive seminars, trainings, and workshops that make learning fun and practical."
    },
    {
      title: "Step into Leadership",
      description: "Take the chance to lead projects, events, and teams while developing real-world leadership skills."
    }
  ];

  return (
    <div className="mt-50 flex mb-10 flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
      <div className="w-full lg:w-1/2 flex justify-center">
        <Image
          src="/whyicpep.png" 
          alt="ICpEP.SE Members"
          width={450}
          height={550}
          className="rounded-2xl object-cover w-full max-w-md"
        />
      </div>

      <div className="w-full lg:w-1/2">
        <h2 className="font-rubik text-3xl sm:text-4xl font-extrabold mb-5 text-black">
          WHY JOIN ICPEP.SE?
        </h2>
        <p className="font-raleway text-gray-700 mb-6 text-xl sm:text-2xl">
          Discover the opportunities that await you as part of a community dedicated to
          Computer Engineering students.
        </p>

        <ul className="mt-15 space-y-10">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full border-3 border-primary3 mt-1 mr-3"></div>
              <div>
                <p className="font-rubik font-bold text-xl text-black">{benefit.title}</p>
                <p className="font-raleway text-gray-600 text-lg">{benefit.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}