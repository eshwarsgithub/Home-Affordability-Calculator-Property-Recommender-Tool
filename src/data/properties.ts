export type Property = {
  id: string;
  name: string;
  location: string;
  configuration: string;
  price: number; // price in INR
  carpetArea: string;
  possession: string;
  highlights: string[];
  imageUrl: string;
  whatsappNumber: string;
  detailsUrl: string;
  latitude: number;
  longitude: number;
  roi: number;
  occupancyRate: number;
  heroImages: string[];
  videoUrl?: string;
  tags?: string[];
  certification?: string;
};

export const properties: Property[] = [
  {
    id: "hhc-sunrise-1",
    name: "Harihara Sunrise Residences",
    location: "Whitefield, Bengaluru",
    configuration: "2 BHK",
    price: 6800000,
    carpetArea: "980 sq.ft",
    possession: "Ready to move",
    highlights: ["5 mins to Metro", "Clubhouse access", "75% open spaces"],
    imageUrl: "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=1600&q=80",
    whatsappNumber: "917676767676",
    detailsUrl: "https://hariharaconstructions.com/projects/sunrise",
    latitude: 12.9698,
    longitude: 77.7499,
    roi: 8.4,
    occupancyRate: 92,
    heroImages: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80",
    ],
    tags: ["Premium Residences", "Metro-Linked", "High Yield"],
    certification: "LEED Gold",
  },
  {
    id: "hhc-lakeside-1",
    name: "Lakeside Grove Villas",
    location: "Hebbal, Bengaluru",
    configuration: "3 BHK",
    price: 9400000,
    carpetArea: "1420 sq.ft",
    possession: "Dec 2026",
    highlights: ["Lake view", "Rooftop deck", "EV charging bays"],
    imageUrl: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80",
    whatsappNumber: "917676767676",
    detailsUrl: "https://hariharaconstructions.com/projects/lakeside",
    latitude: 13.0424,
    longitude: 77.5891,
    roi: 9.1,
    occupancyRate: 88,
    heroImages: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1430285561322-7808604715df?auto=format&fit=crop&w=1600&q=80",
    ],
    tags: ["Lakefront", "Luxury Villas", "EV Ready"],
  },
  {
    id: "hhc-urban-1",
    name: "Urban Crest Residences",
    location: "Electronic City, Bengaluru",
    configuration: "1.5 BHK",
    price: 4800000,
    carpetArea: "720 sq.ft",
    possession: "Jun 2025",
    highlights: ["Smart home automation", "Co-working pods", "Rooftop infinity pool"],
    imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
    whatsappNumber: "917676767676",
    detailsUrl: "https://hariharaconstructions.com/projects/urban-crest",
    latitude: 12.8426,
    longitude: 77.6633,
    roi: 7.2,
    occupancyRate: 95,
    heroImages: [
      "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1499914485622-a88fac536970?auto=format&fit=crop&w=1600&q=80",
    ],
    tags: ["Smart Living", "Young Workforce"],
  },
  {
    id: "hhc-hilltop-1",
    name: "Hilltop Terraces",
    location: "Kanakapura Road, Bengaluru",
    configuration: "3 BHK Duplex",
    price: 12200000,
    carpetArea: "1780 sq.ft",
    possession: "Mar 2027",
    highlights: ["Sunken living room", "Sky deck", "Triple height clubhouse"],
    imageUrl: "https://images.unsplash.com/photo-1459535653751-d571815e906b?auto=format&fit=crop&w=1600&q=80",
    whatsappNumber: "917676767676",
    detailsUrl: "https://hariharaconstructions.com/projects/hilltop",
    latitude: 12.8145,
    longitude: 77.5779,
    roi: 8,
    occupancyRate: 86,
    heroImages: [
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1430285561322-7808604715df?auto=format&fit=crop&w=1600&q=80",
    ],
    tags: ["Sky Deck", "Ready 2027"],
  },
  {
    id: "hhc-cascade-1",
    name: "Cascade Enclave",
    location: "Sarjapur Road, Bengaluru",
    configuration: "2.5 BHK",
    price: 7600000,
    carpetArea: "1115 sq.ft",
    possession: "Oct 2025",
    highlights: ["Biophilic landscaping", "Olympic lap pool", "Indoor golf simulator"],
    imageUrl: "https://images.unsplash.com/photo-1493247035880-efdf83c3712f?auto=format&fit=crop&w=1600&q=80",
    whatsappNumber: "917676767676",
    detailsUrl: "https://hariharaconstructions.com/projects/cascade",
    latitude: 12.9081,
    longitude: 77.699,
    roi: 7.8,
    occupancyRate: 91,
    heroImages: [
      "https://images.unsplash.com/photo-1499914485622-a88fac536970?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=1600&q=80",
    ],
    tags: ["Biophilic", "Wellness"],
  },
  {
    id: "hhc-skyline-1",
    name: "Skyline Edge",
    location: "Yelahanka, Bengaluru",
    configuration: "2 BHK",
    price: 5400000,
    carpetArea: "960 sq.ft",
    possession: "Aug 2025",
    highlights: ["Sky lounge", "Hybrid work pods", "24/7 concierge"],
    imageUrl: "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=1600&q=80",
    whatsappNumber: "917676767676",
    detailsUrl: "https://hariharaconstructions.com/projects/skyline",
    latitude: 13.1,
    longitude: 77.596,
    roi: 7.4,
    occupancyRate: 90,
    heroImages: [
      "https://images.unsplash.com/photo-1529429617124-aee711a70412?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1430285561322-7808604715df?auto=format&fit=crop&w=1600&q=80",
    ],
    tags: ["Concierge", "Hybrid Work"],
  },
  {
    id: "hhc-botanical-1",
    name: "Botanical Courts",
    location: "Devanahalli, Bengaluru",
    configuration: "Villa Plot",
    price: 3500000,
    carpetArea: "1500 sq.ft",
    possession: "Ready for registration",
    highlights: ["Managed community", "Tree-lined avenues", "Outdoor amphitheatre"],
    imageUrl: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1600&q=80",
    whatsappNumber: "917676767676",
    detailsUrl: "https://hariharaconstructions.com/projects/botanical",
    latitude: 13.223,
    longitude: 77.706,
    roi: 10.2,
    occupancyRate: 80,
    heroImages: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    ],
    tags: ["Villa Plot", "Managed"],
  },
  {
    id: "hhc-boulevard-1",
    name: "Boulevard Heights",
    location: "Bannerghatta Road, Bengaluru",
    configuration: "3 BHK",
    price: 11500000,
    carpetArea: "1650 sq.ft",
    possession: "Sep 2026",
    highlights: ["Central boulevard", "Wellness spa", "Multiplex lounge"],
    imageUrl: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80",
    whatsappNumber: "917676767676",
    detailsUrl: "https://hariharaconstructions.com/projects/boulevard",
    latitude: 12.878,
    longitude: 77.599,
    roi: 8.9,
    occupancyRate: 89,
    heroImages: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80",
    ],
    tags: ["Mixed Use", "Wellness"],
  },
];
