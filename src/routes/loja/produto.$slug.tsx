import { createFileRoute, notFound } from "@tanstack/react-router";
import { PublicStore } from "../../components/public-store";
import { findPublicProduct } from "../../lib/public-store";

export const Route = createFileRoute("/loja/produto/$slug")({
  component: ProductPage,
  head: ({ params }) => {
    const product = findPublicProduct(params.slug);
    const description = product?.description.slice(0, 150) || "Produto geek premium da Edition Geek.";
    return { meta: [{ title: product ? `${product.name} • Edition Geek` : "Produto • Edition Geek" }, { name: "description", content: description }, { property: "og:title", content: product?.name || "Edition Geek" }, { property: "og:description", content: description }, { property: "og:type", content: "product" }] };
  },
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = findPublicProduct(slug);
  if (!product) throw notFound();
  return <PublicStore selectedProduct={product} />;
}
