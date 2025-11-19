import { notFound } from "next/navigation";
import { properties } from "@/data/properties";
import { PropertyDetailView } from "@/components/pages/property-detail-view";

interface PropertyDetailPageProps {
  params: {
    id: string;
  };
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = properties.find((item) => item.id === params.id);
  if (!property) {
    notFound();
  }
  const schema = {
    "@context": "https://schema.org",
    "@type": "SingleFamilyResidence",
    name: property.name,
    description: property.highlights.join(", "),
    address: {
      "@type": "PostalAddress",
      streetAddress: property.location,
      addressLocality: property.location.split(", ")[0],
      addressCountry: "IN",
    },
    price: property.price,
    priceCurrency: "INR",
    floorSize: property.carpetArea,
    url: `https://tycoon-estates.example.com/properties/${property.id}`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: property.latitude,
      longitude: property.longitude,
    },
  };
  return (
    <section className="page-shell mt-16 space-y-10">
      <PropertyDetailView property={property} />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  );
}
