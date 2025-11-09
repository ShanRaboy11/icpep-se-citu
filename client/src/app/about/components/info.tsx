// app/about/components/InfoSection.tsx
import { Eye, Target, ShieldCheck } from "lucide-react";
import { FC, ReactNode } from "react";

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

const InfoCard: FC<InfoCardProps> = ({ icon, title, children }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow duration-300">
    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary1/10 text-primary1 mb-4">
      {icon}
    </div>
    <h3 className="font-rubik text-xl font-bold text-primary3 mb-2">{title}</h3>
    <p className="font-raleway text-gray-600">{children}</p>
  </div>
);

const InfoSection: FC = () => (
  <section className="grid md:grid-cols-3 gap-8 mt-16">
    <InfoCard icon={<Eye size={24} />} title="Our Vision">
      To be the center of excellence in computer engineering, fostering
      innovators who lead technological advancement for a better society.
    </InfoCard>
    <InfoCard icon={<Target size={24} />} title="Our Mission">
      To provide holistic development for students through academic support,
      skills training, and community engagement, preparing them to be globally
      competent professionals.
    </InfoCard>
    <InfoCard icon={<ShieldCheck size={24} />} title="Our Core Values">
      We uphold Integrity, Passion, Excellence, Collaboration, and Service in
      all our endeavors, shaping engineers with character and competence.
    </InfoCard>
  </section>
);

export default InfoSection;
