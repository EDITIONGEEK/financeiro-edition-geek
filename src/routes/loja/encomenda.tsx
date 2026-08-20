import { createFileRoute } from "@tanstack/react-router";
import { PublicStore } from "../../components/public-store";

export const Route = createFileRoute("/loja/encomenda")({ component: CustomOrderPage });

function CustomOrderPage() {
  return <PublicStore customOrder />;
}
