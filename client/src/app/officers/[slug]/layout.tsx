import type { Metadata } from "next";
import { pageMetadata } from "@/app/utils/site";
import { departments } from "../utils/officers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const department = departments[slug];

  if (!department) return { title: "Officers" };

  return pageMetadata(
    department.title,
    `${department.description} Meet the ${department.title} of ICpEP.SE CIT-U Chapter.`,
    `/officers/${slug}`,
  );
}

export default function OfficerDepartmentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
