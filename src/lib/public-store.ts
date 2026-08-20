import { spreadsheetHistoryProducts } from "../data/spreadsheet-history";

export type PublicProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  type: "FDM" | "Resina + Pintura";
  price: number;
  cost: number;
  source: string;
  description: string;
  featured: boolean;
};

const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const publicProducts: PublicProduct[] = spreadsheetHistoryProducts
  .filter((item) => item.suggested > 0 || item.adjusted > 0)
  .map((item, index) => ({
    id: `catalog-${item.source}-${index}-${slugify(item.name)}`,
    name: item.name,
    slug: `${slugify(item.name)}-${index}`,
    category: /pokebola/i.test(item.name) || item.source === "Pokebola" ? "Chaveiros e Pokébolas" : /kit|gengar|mew|eevee|charizard/i.test(item.name) ? "Colecionáveis" : "Decoração",
    type: /resina/i.test(item.name) || item.filamentKg >= 145 ? "Resina + Pintura" : "FDM",
    price: item.adjusted || item.suggested,
    cost: item.total,
    source: item.source,
    description: `Peça Edition Geek produzida em ${/resina/i.test(item.name) || item.filamentKg >= 145 ? "resina com acabamento premium" : "filamento PLA de alta qualidade"}. Pronta para envio.`,
    featured: index < 6,
  }));

export const categories = Array.from(new Set(publicProducts.map((item) => item.category)));

export function findPublicProduct(slug: string) {
  return publicProducts.find((item) => item.slug === slug) || publicProducts.find((item) => slugify(item.name) === slug);
}
