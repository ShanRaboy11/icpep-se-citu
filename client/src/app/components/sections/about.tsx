import Button from "@/app/components/button";

export function AboutSection() {
  return (
    <div className="text-center max-w-3xl">
      <h2 className=" font-rubik text-4xl sm:text-5xl font-extrabold mb-4 text-black">
        ABOUT US
      </h2>
      <p className="font-raleway text-gray-700 leading-relaxed text-md md:text-xl mb-8 my-10">
        The Institute of Computer Engineers of the Philippines Student Edition (ICpEP.SE)
        CIT-U Chapter is a recognized organization of Computer Engineering students
        that fosters learning, collaboration, and innovation through seminars,
        workshops, and student-led initiatives.
      </p>
      <Button className="bg-primary3 text-white rounded-full px-8 py-3 border-primary3 hover:border-primary1 text-sm md:text-base">
        Learn more
      </Button>
    </div>
  );
}