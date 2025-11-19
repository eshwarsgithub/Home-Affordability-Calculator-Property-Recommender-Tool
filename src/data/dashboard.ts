export type Metric = {
  id: string;
  label: string;
  value: string;
  delta: number;
  trend: number[];
};

export const metrics: Metric[] = [
  {
    id: "portfolio-value",
    label: "Portfolio Value",
    value: "₹18,450 Cr",
    delta: 3.2,
    trend: [12, 16, 18, 20, 21, 24],
  },
  {
    id: "irr",
    label: "Realized IRR",
    value: "18.4%",
    delta: 0.8,
    trend: [14.2, 15.8, 16.2, 17.5, 18.1, 18.4],
  },
  {
    id: "occupancy",
    label: "Occupancy",
    value: "93%",
    delta: -0.6,
    trend: [94, 95, 94, 93, 93.5, 93],
  },
];

export type TimelineEntry = {
  id: string;
  title: string;
  date: string;
  description: string;
  status: "completed" | "in-progress" | "upcoming";
};

export const timeline: TimelineEntry[] = [
  {
    id: "dubai-offer",
    title: "Dubai Marina JV",
    date: "Nov 12, 2025",
    description: "Signed exclusivity for branded residences with 32% projected IRR.",
    status: "completed",
  },
  {
    id: "blr-handover",
    title: "Bengaluru Skyline Handover",
    date: "Nov 24, 2025",
    description: "Final snag list review + digital twin audit.",
    status: "in-progress",
  },
  {
    id: "london-roadshow",
    title: "London LP Roadshow",
    date: "Dec 08, 2025",
    description: "Closed-door investor sessions at Park Lane.",
    status: "upcoming",
  },
];

export type Holding = {
  id: string;
  asset: string;
  location: string;
  value: string;
  irr: string;
  status: "Stabilized" | "Growth" | "Exit";
};

export const holdings: Holding[] = [
  {
    id: "apex-one",
    asset: "Apex One Residences",
    location: "Mumbai",
    value: "₹3,420 Cr",
    irr: "21.3%",
    status: "Stabilized",
  },
  {
    id: "azure-palm",
    asset: "Azure Palm Marina",
    location: "Dubai",
    value: "₹2,180 Cr",
    irr: "18.9%",
    status: "Growth",
  },
  {
    id: "victoria-park",
    asset: "Victoria Park Suites",
    location: "London",
    value: "₹1,740 Cr",
    irr: "17.2%",
    status: "Exit",
  },
];
