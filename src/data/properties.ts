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
    imageUrl: "/images/properties/sunrise.jpg",
    whatsappNumber: "917676767676",
    detailsUrl: "https://hariharaconstructions.com/projects/sunrise",
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
    imageUrl: "/images/properties/lakeside.jpg",
    whatsappNumber: "917676767676",
    detailsUrl: "https://hariharaconstructions.com/projects/lakeside",
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
    imageUrl: "/images/properties/urban.jpg",
    whatsappNumber: "917676767676",
    detailsUrl: "https://hariharaconstructions.com/projects/urban-crest",
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
    imageUrl: "/images/properties/hilltop.jpg",
    whatsappNumber: "917676767676",
    detailsUrl: "https://hariharaconstructions.com/projects/hilltop",
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
    imageUrl: "/images/properties/cascade.jpg",
    whatsappNumber: "917676767676",
    detailsUrl: "https://hariharaconstructions.com/projects/cascade",
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
    imageUrl: "/images/properties/skyline.jpg",
    whatsappNumber: "917676767676",
    detailsUrl: "https://hariharaconstructions.com/projects/skyline",
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
    imageUrl: "/images/properties/botanical.jpg",
    whatsappNumber: "917676767676",
    detailsUrl: "https://hariharaconstructions.com/projects/botanical",
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
    imageUrl: "/images/properties/boulevard.jpg",
    whatsappNumber: "917676767676",
    detailsUrl: "https://hariharaconstructions.com/projects/boulevard",
  },
];
