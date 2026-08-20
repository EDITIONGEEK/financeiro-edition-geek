import { createFileRoute } from "@tanstack/react-router";
import { PublicStore } from "../components/public-store";

export const Route = createFileRoute("/loja")({ component: LojaPage });

function LojaPage() {
  return <PublicStore />;
}
