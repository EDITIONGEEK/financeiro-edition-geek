import { spreadsheetHistoryProducts } from "../data/spreadsheet-history";

export type PublicProduct = {
  id: string; name: string; slug: string; category: string; type: "FDM" | "Resina + Pintura"; technique: "FDM" | "Resina"; material: string;
  price: number; cost: number; source: string; description: string; scale: string; quantity: number; status: "disponivel" | "esgotado" | "encomenda";
  featured: boolean; newProduct: boolean; registeredAt: string; tags: string[]; images: string[]; eventPrice?: number;
};

const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const catalogCategories = ["Colecionáveis", "Chaveiros", "Decoração", "Pokébolas", "Espadas Anime", "Estátuas", "Organizadores", "Personalizados", "Eventos"];

export const publicProducts: PublicProduct[] = spreadsheetHistoryProducts
  .filter((item) => item.suggested > 0 || item.adjusted > 0)
  .map((item, index) => {
    const isResin = /resina/i.test(item.name) || item.filamentKg >= 145;
    const category = /pokebola/i.test(item.name) || item.source === "Pokebola" ? "Pokébolas" : /kit|gengar|mew|eevee|charizard|pokemon/i.test(item.name) ? "Colecionáveis" : /caixa|organizador|suporte/i.test(item.name) ? "Organizadores" : /espada|sabre/i.test(item.name) ? "Espadas Anime" : /estatua|busto|senna|baldur|greymon/i.test(item.name) ? "Estátuas" : "Decoração";
    const slug = `${slugify(item.name)}-${index}`;
    const price = item.adjusted || item.suggested;
    return { id: `catalog-${item.source}-${index}-${slugify(item.name)}`, name: item.name, slug, category, type: isResin ? "Resina + Pintura" : "FDM", technique: isResin ? "Resina" : "FDM", material: isResin ? "ABS-Like" : "PLA+", price, eventPrice: Math.round(price * 1.25 * 100) / 100, cost: item.total, source: item.source, description: `Impressão ${isResin ? "em resina com acabamento premium" : "FDM multipartes em filamento PLA+"}, produzida e conferida pela Edition Geek.`, scale: index % 4 === 0 ? "~20cm" : "", quantity: 1, status: "disponivel", featured: index < 6, newProduct: index < 4, registeredAt: "2025-08-20", tags: [category.toLowerCase(), isResin ? "resina" : "fdm", "presente"], images: [] };
  });

export const categories = catalogCategories;
export function getPublicProducts(): PublicProduct[] {
  if (typeof window === "undefined") return publicProducts;
  try {
    const admin = JSON.parse(localStorage.getItem("edition-geek-vitrine-admin-products") || "[]") as Array<any>;
    if (!admin.length) return publicProducts;
    return admin.map((item, index) => ({ id: String(item.id || `admin-${index}`), name: String(item.name || "Produto Edition Geek"), slug: String(item.slug || slugify(String(item.name || index))), category: String(item.category || "Outro"), type: String(item.technique || "FDM") === "FDM" ? "FDM" : "Resina + Pintura", technique: String(item.technique || "FDM") === "FDM" ? "FDM" : "Resina", material: String(item.material || "PLA+"), price: Number(item.price || 0), eventPrice: Number(item.eventPrice || 0), cost: 0, source: "Vitrine", description: String(item.description || "Produto Edition Geek produzido sob cuidado."), scale: "", quantity: Number(item.stock || 0), status: item.status === "Encomenda" ? "encomenda" : item.status === "Esgotado" ? "esgotado" : item.status === "Oculto" ? "esgotado" : "disponivel", featured: Boolean(item.featured), newProduct: Boolean(item.isNew), registeredAt: String(item.registeredAt || ""), tags: [] as string[], images: item.image ? [String(item.image)] : [] }));
  } catch { return publicProducts; }
}
export function findPublicProduct(slug: string) { const products = getPublicProducts(); return products.find((item) => item.slug === slug) || products.find((item) => slugify(item.name) === slug); }
export function formatPublicPrice(value: number) { return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
