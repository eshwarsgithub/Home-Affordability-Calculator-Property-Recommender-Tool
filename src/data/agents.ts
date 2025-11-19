export type Agent = {
  id: string;
  name: string;
  title: string;
  region: string;
  avatar: string;
  successRate: number;
  portfolioValue: string;
  specialties: string[];
  bio: string;
  certifications: string[];
  testimonials: Array<{ quote: string; author: string; title: string }>;
};

export const agents: Agent[] = [
  {
    id: "naomi-rao",
    name: "Naomi Rao",
    title: "Partner, Global Investments",
    region: "APAC & Middle East",
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=640&h=640&q=80",
    successRate: 96,
    portfolioValue: "$1.8B",
    specialties: ["Prime Residential", "Waterfront", "Hospitality"],
    bio: "Leads trophy asset acquisitions and bespoke family office mandates across Bengaluru, Dubai, and Singapore.",
    certifications: ["RERA Registered", "MRICS", "LEED AP"],
    testimonials: [
      {
        quote: "Naomi’s diligence unlocked a 22% IRR deal that no broker even surfaced.",
        author: "T. Mehta",
        title: "Chairman, Mehta Holdings",
      },
    ],
  },
  {
    id: "luca-harrington",
    name: "Luca Harrington",
    title: "Director, Portfolio Strategy",
    region: "Europe & Africa",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=640&h=640&q=80",
    successRate: 94,
    portfolioValue: "$1.2B",
    specialties: ["Boutique Hotels", "Mixed-Use", "Redevelopments"],
    bio: "Architect-turned-investment lead delivering adaptive reuse strategies across global gateway cities.",
    certifications: ["RICS", "WELL AP"],
    testimonials: [
      {
        quote: "Luca anticipated every risk scenario and kept our board comfortable through closing.",
        author: "S. Adjei",
        title: "Principal, Meridian Advisors",
      },
    ],
  },
  {
    id: "amira-shetty",
    name: "Amira Shetty",
    title: "VP, Investor Experience",
    region: "North America",
    avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=facearea&w=640&h=640&q=80",
    successRate: 92,
    portfolioValue: "$950M",
    specialties: ["Multi-Family", "PropTech", "Off-Plan"],
    bio: "Designs concierge-style journeys for limited partners while unlocking co-investment intelligence.",
    certifications: ["CCIM", "FIAAB"],
    testimonials: [
      {
        quote: "Amira’s weekly intelligence notes are now a fixture of our investment committee.",
        author: "R. D’Souza",
        title: "Managing Director, Vantara Capital",
      },
    ],
  },
];
