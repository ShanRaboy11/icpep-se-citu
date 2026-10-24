import { ReactElement } from "react";

export interface SectionType {
  id: string;
  tabLabel: string;
  icon: ReactElement;
  title: string;
  content: string;
  imageUrls: string | string[];
}
