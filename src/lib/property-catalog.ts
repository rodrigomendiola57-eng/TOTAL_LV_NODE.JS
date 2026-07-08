import type { Property } from "@/types/property";

export type PropertySortOption = "price-asc" | "price-desc" | "newest";
export type BedroomFilter = "all" | "1" | "2" | "3" | "4";

export function sortProperties(
  properties: Property[],
  sort: PropertySortOption,
): Property[] {
  const list = [...properties];

  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => Number(a.price) - Number(b.price));
    case "price-desc":
      return list.sort((a, b) => Number(b.price) - Number(a.price));
    case "newest":
      return list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    default:
      return list;
  }
}

export function filterByBedrooms(
  properties: Property[],
  bedrooms: BedroomFilter,
): Property[] {
  if (bedrooms === "all") return properties;

  const minimum = Number(bedrooms);
  return properties.filter((property) => property.bedrooms >= minimum);
}

export function applyCatalogFilters(
  properties: Property[],
  sort: PropertySortOption,
  bedrooms: BedroomFilter,
): Property[] {
  return sortProperties(filterByBedrooms(properties, bedrooms), sort);
}
