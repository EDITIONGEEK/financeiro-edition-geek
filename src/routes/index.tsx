import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownLeft, ArrowRight, ArrowUpRight, Bell, Boxes, Calculator, CalendarDays, Check,
  ChevronDown, ChevronLeft, ChevronRight, CircleHelp, ClipboardList, CreditCard,
  FileBarChart, FileText, Gem, LayoutDashboard, Menu, MoreHorizontal, Package,
  PanelLeft, Plus, Printer, Receipt, Search, Settings, ShoppingBag, Store,
  Tags, Truck, UserRound, UsersRound, Wallet, Wrench, X, Zap, UserCog, Percent,
  PackageOpen, RotateCcw, Save, Trash2, Pencil, Info,
} from "lucide-react";
import logoUrl from "../../Logo Redondo.png";

export const Route = createFileRoute("/")({ component: Index });

type NavItem = { label: string; icon: LucideIcon; group?: string };

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Calculadora FDM", icon: Calculator },
  { label: "Orçamentos", icon: FileText },
  { label: "Controle de Pedidos", icon: Package },
  { label: "Análises", icon: FileBarChart },
  { label: "Financeiro", icon: Wallet },
  { label: "Clientes", icon: UsersRound },
  { label: "Recursos", icon: Boxes },
  { label: "Produtos", icon: Gem },
  { label: "Mercado Livre", icon: ShoppingBag, group: "marketplaces" },
  { label: "Melhor Envio", icon: Truck },
];

type Scenario = { remuneration: number; hoursPerWeek: number; weeksPerMonth: number };
type Channel = { name: string; commission: number; fixedFee: number; note: string };
type PackageItem = { name: string; cost: number | null };
type GlobalSettings = {
  fdmPower: number; fdmKwh: number; fdmPurchase: number; fdmLife: number; fdmMachineRate: number;
  resinPrice: number; resinPower: number; resinKwh: number; resinPurchase: number; resinLife: number; resinLoss: number;
  consumables: { name: string; cost: number; reference: string }[];
  scenarios: Record<string, Scenario>; activeScenario: string;
  indirect: { name: string; value: number }[];
  channels: Channel[]; packages: PackageItem[];
  defaultMargin: number; eventAdditional: number; salesTax: number;
};

type FdmForm = {
  name: string; category: string; status: string; complexity: string; filamentKg: number; materialGrams: number;
  printHours: number; printMinutes: number; design: string; slicing: string; finishing: string;
  led: number; powerSupply: number; otherLabel: string; otherCost: number; packageName: string;
  channelName: string; marketPrice: number; adjustedPrice: number; notes: string; projectUrl: string; stlFileName: string; stlDataUrl: string;
};
type FdmHistoryItem = FdmForm & { id: string; savedAt: string; costs: { fabrication: number; service: number; components: number; indirect: number; total: number; suggested: number; adjusted: number } };

const emptyFdmForm = (): FdmForm => ({ name: "", category: "Decoração", status: "Em produção", complexity: "Simples", filamentKg: 110, materialGrams: 0, printHours: 0, printMinutes: 0, design: "00:00", slicing: "00:00", finishing: "00:00", led: 0, powerSupply: 0, otherLabel: "", otherCost: 0, packageName: "", channelName: "Pix", marketPrice: 0, adjustedPrice: 0, notes: "", projectUrl: "", stlFileName: "", stlDataUrl: "" });
const initialFdmHistory: FdmHistoryItem[] = [
  { ...emptyFdmForm(), id: "angry-birds-red", name: "Angry Birds Red", category: "Colecionável", status: "Pronto para venda", complexity: "Simples", filamentKg: 120, materialGrams: 105, printHours: 4, printMinutes: 40, adjustedPrice: 35, savedAt: "Histórico importado", costs: { fabrication: 16.2, service: 0, components: 0, indirect: 0, total: 16.2, suggested: 32.4, adjusted: 35 } },
  { ...emptyFdmForm(), id: "batmovel", name: "Batmóvel", category: "Colecionável", status: "Pronto para venda", complexity: "Intermediária", materialGrams: 224, printHours: 8, printMinutes: 7, finishing: "01:00", adjustedPrice: 110, savedAt: "Histórico importado", costs: { fabrication: 30.9, service: 25, components: 0, indirect: 0, total: 55.9, suggested: 111.8, adjusted: 110 } },
  { ...emptyFdmForm(), id: "shelby-cobra", name: "1965 Shelby Cobra", category: "Colecionável", status: "Pronto para venda", complexity: "Complexa-Premium", materialGrams: 329, printHours: 11, printMinutes: 1, finishing: "01:00", adjustedPrice: 150, savedAt: "Histórico importado", costs: { fabrication: 44.68, service: 25, components: 0, indirect: 0, total: 69.68, suggested: 139.37, adjusted: 150 } },
];

const defaultSettings: GlobalSettings = {
  fdmPower: .28, fdmKwh: .15, fdmPurchase: 4500, fdmLife: 3000, fdmMachineRate: .65,
  resinPrice: 150, resinPower: .144, resinKwh: .15, resinPurchase: 3527.69, resinLife: 2000, resinLoss: 10,
  consumables: [
    { name: "Álcool IPA", cost: 1, reference: "R$ 9,65/L" }, { name: "Luvas", cost: 3, reference: "R$ 25,00/caixa" },
    { name: "Lixas", cost: .5, reference: "R$ 5,00" }, { name: "Primer", cost: .2, reference: "R$ 25,00/lata" },
    { name: "Tintas", cost: 9, reference: "R$ 20,00 médio" }, { name: "Aerógrafo/insumos", cost: 0, reference: "—" },
    { name: "Verniz", cost: .8, reference: "R$ 65,00" }, { name: "Cola", cost: .5, reference: "R$ 50,00" }, { name: "Outros consumíveis", cost: 0, reference: "—" },
  ],
  scenarios: { Atual: { remuneration: 0, hoursPerWeek: 10, weeksPerMonth: 4.33 }, Meta: { remuneration: 3000, hoursPerWeek: 5, weeksPerMonth: 4.33 }, Ideal: { remuneration: 3000, hoursPerWeek: 25, weeksPerMonth: 4.33 } },
  activeScenario: "Ideal",
  indirect: [{ name: "Aluguel / parte de casa usada", value: 0 }, { name: "Internet", value: 50 }, { name: "Manutenção de equipamentos", value: 0 }, { name: "Marketing", value: 100 }, { name: "MEI (taxa mensal)", value: 164.1 }, { name: "Outros", value: 0 }],
  channels: [
    { name: "Pix", commission: 0, fixedFee: 0, note: "—" }, { name: "Débito", commission: 2.58, fixedFee: 0, note: "—" }, { name: "Cartão de Crédito", commission: 4.91, fixedFee: 0, note: "—" }, { name: "Link de Pagamento", commission: 4.2, fixedFee: 0, note: "—" }, { name: "Mercado Livre Clássico", commission: 14, fixedFee: 0, note: "Verifique a categoria" }, { name: "Mercado Livre Premium", commission: 16, fixedFee: 0, note: "Verifique a categoria" }, { name: "TikTok Shop", commission: 6, fixedFee: 0, note: "—" }, { name: "Shopee", commission: 20, fixedFee: 4, note: "14% + 6% frete grátis obrigatório" }, { name: "Marketplace Genérico", commission: 0, fixedFee: 0, note: "Ex: Facebook Marketplace" },
  ],
  packages: [
    ["Sacola P 15x20", .12], ["Sacola M 20x30", .24], ["Sacola G 25x35", .36], ["Sacola GG 30x40", .48], ["Envelope bolha P 15x20", 1.2], ["Envelope bolha G 25x36", 3.29], ["Caixa Sedex Mini 15x11x5", 2.49], ["Caixa Sedex 00 18x12x6", 3.1], ["Caixa Sedex 0 22x11x8,5", 3.7], ["Caixa Sedex 1 24x16x7", 4.05], ["Caixa Sedex 2 18x7x9", 5.59], ["Caixa Sedex 3 32x21x12", 7.39], ["Caixa Sedex 4 40x35,5x20", 14.9], ["Caixa Sedex 5 36x28x20", 11.9], ["Caixa Sedex 6 60x28x19", 19.55], ["Saco Adesivado P", .05], ["Baú MDF P 14x23x14", 32.4], ["Tag/etiqueta", null],
  ].map(([name, cost]) => ({ name: name as string, cost: cost as number | null })),
  defaultMargin: 100, eventAdditional: 25, salesTax: 0,
};

function readSettings(): GlobalSettings { try { return { ...defaultSettings, ...JSON.parse(localStorage.getItem("edition-geek-global-settings") || "{}")} as GlobalSettings; } catch { return defaultSettings; } }
function money(value: number) { return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }

const transactions = [
  { id: 1, name: "Google Workspace", category: "Software", date: "08 ago, 2026", value: "R$ 145,90", status: "Pago", kind: "out" },
  { id: 2, name: "Venda #2048 · Cliente novo", category: "Receita de vendas", date: "07 ago, 2026", value: "R$ 2.850,00", status: "Recebido", kind: "in" },
  { id: 3, name: "Mercado Livre", category: "Fornecedores", date: "06 ago, 2026", value: "R$ 980,00", status: "Pago", kind: "out" },
];

function Index() {
  const [active, setActive] = useState("Dashboard");
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(() => readSettings());
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState("");

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const selectPage = (page: string) => { setActive(page); setMenuOpen(false); };
  const activeItem = navItems.find((item) => item.label === active);

  return <div className="print-app">
    <aside className={`sidebar ${menuOpen ? "is-open" : ""}`}>
      <div className="brand"><img className="brand-logo" src={logoUrl} alt="Edition Geek" /><div><strong>edition geek</strong><small>gestão para impressão</small></div><button className="sidebar-close" onClick={() => setMenuOpen(false)} aria-label="Fechar menu"><X size={19} /></button></div>
      <div className="workspace-switcher"><div className="workspace-avatar">EG</div><div><b>Edition Geek</b><span>Workspace principal</span></div><ChevronDown size={15} /></div>
      <nav className="side-nav">
        <p className="nav-label">MENU PRINCIPAL</p>
        {navItems.map(({ label, icon: Icon, group }) => <div key={label} className={group === "marketplaces" ? "nav-group-start" : ""}><button className={`nav-item ${active === label ? "active" : ""}`} onClick={() => selectPage(label)}><Icon size={17} /><span>{label}</span></button></div>)}
        <p className="nav-label nav-bottom">CONFIGURAÇÕES</p>
        <button className={`nav-item ${active === "Configurações" ? "active" : ""}`} onClick={() => selectPage("Configurações")}><Settings size={17} /><span>Configurações</span></button>
        <button className="nav-item" onClick={() => notify("Central de ajuda em breve")}><CircleHelp size={17} /><span>Central de ajuda</span></button>
      </nav>
      <div className="sidebar-user"><div className="user-avatar">J</div><div><b>julianaeditiongeek...</b><span>Juliana Edition Geek</span></div><ChevronRight size={15} /></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Menu size={22} /></button><div className="breadcrumb"><span>Edition Geek</span><b>/</b><strong>{activeItem?.label || active}</strong></div><div className="top-actions"><button className="icon-button" aria-label="Notificações" onClick={() => notify("Você não tem novas notificações")}><Bell size={18} /><i /></button><div className="profile"><div className="profile-avatar">J</div><div><b>Juliana</b><span>Administradora</span></div><ChevronDown size={15} /></div></div></header>
      <div className="page-wrap"><PageContent active={active} onAdd={() => setShowAdd(true)} onNotify={notify} settings={globalSettings} onSettingsChange={setGlobalSettings} /><footer className="footer-note"><span>© 2026 Edition Geek</span><span>Dados atualizados agora <i /></span></footer></div>
    </main>
    {showAdd && <QuickOrderModal onClose={() => setShowAdd(false)} onSave={() => { setShowAdd(false); notify("Pedido salvo com sucesso"); }} />}
    {toast && <div className="toast"><span>✓</span>{toast}</div>}
  </div>;
}

function PageContent({ active, onAdd, onNotify, settings, onSettingsChange }: { active: string; onAdd: () => void; onNotify: (message: string) => void; settings: GlobalSettings; onSettingsChange: (s: GlobalSettings) => void }) {
  if (active === "Dashboard") return <Dashboard onAdd={onAdd} />;
  if (active === "Calculadora FDM") return <FdmCalculator settings={settings} onNotify={onNotify} />;
  if (active === "Controle de Pedidos") return <OrdersPage onAdd={onAdd} />;
  if (active === "Financeiro") return <FinancialPage />;
  if (active === "Recursos") return <ResourcesPage />;
  if (active === "Mercado Livre") return <StorePage />;
  if (active === "Usuários") return <UsersPage onAdd={onAdd} />;
  if (active === "Configurações") return <SettingsPage settings={settings} onSave={onSettingsChange} onNotify={onNotify} />;
  const config: Record<string, { icon: LucideIcon; subtitle: string; action: string; empty: string }> = {
    "Orçamentos": { icon: FileText, subtitle: "Crie propostas profissionais para seus clientes", action: "Novo orçamento", empty: "Nenhum orçamento encontrado" },
    "Análises": { icon: FileBarChart, subtitle: "Acompanhe os indicadores do seu negócio", action: "Exportar relatório", empty: "Nenhuma análise disponível" },
    "Clientes": { icon: UsersRound, subtitle: "Gerencie seus clientes e relacionamentos", action: "Novo cliente", empty: "Nenhum cliente cadastrado" },
    "Produtos": { icon: Gem, subtitle: "Organize seu catálogo de produtos", action: "Novo produto", empty: "Nenhum produto cadastrado" },
    "Melhor Envio": { icon: Truck, subtitle: "Gerencie suas entregas em um só lugar", action: "Configurar envio", empty: "Nenhuma entrega encontrada" },
  };
  const fallback = config["Clientes"]!;
  const pageConfig = config[active] || fallback;
  return <EmptyPage title={active} subtitle={pageConfig.subtitle} icon={pageConfig.icon} action={pageConfig.action} empty={pageConfig.empty} onAdd={onAdd} />;
}

function Dashboard({ onAdd }: { onAdd: () => void }) {
  const tasks = [
    { title: "Complete seu cadastro", detail: "Os dados da sua empresa", icon: Check, done: true },
    { title: "Configure o valor do kWh", detail: "O preço da luz, pra energia entrar no custo", icon: Wrench, active: true },
    { title: "Cadastre sua impressora", detail: "A máquina que imprime suas peças", icon: Printer },
    { title: "Cadastre sua matéria-prima", detail: "Seu filamento ou resina, com o custo", icon: Boxes },
    { title: "Precifique sua primeira peça", detail: "Veja o preço certo na calculadora", icon: Calculator },
    { title: "Cadastre seu produto", detail: "Salve a peça no seu catálogo", icon: Package },
    { title: "Gere seu primeiro orçamento", detail: "Sua primeira proposta para o cliente", icon: FileText },
  ];
  return <section className="onboarding-page">
    <div className="page-heading compact-heading"><div><p className="eyebrow">SÁBADO, 09 DE AGOSTO DE 2026</p><h1>Olá, Juliana <span>👋</span></h1><p className="subtitle">Você está a poucos passos de transformar sua gestão de impressão 3D.</p></div><button className="primary-button" onClick={onAdd}><Plus size={16} /> Novo pedido</button></div>
    <div className="onboarding-intro"><strong>Bora começar:</strong><button className="link-button"><CircleHelp size={15} /> Ver como fazer</button></div>
    <div className="onboarding-list"><div className="completion"><div className="completion-track"><i /></div><b>1 de 7 concluídos</b></div>{tasks.map(({ title, detail, icon: Icon, done, active }) => <div key={title} className={`task-card ${done ? "done" : ""} ${active ? "task-active" : ""}`}><span className="task-icon"><Icon size={18} /></span><div className="task-copy"><b>{title}</b><span>{detail}</span></div><button className="video-button"><CircleHelp size={13} /> Vídeo</button>{done ? <strong className="done-label">Feito</strong> : <button className={`task-action ${active ? "filled" : ""}`} onClick={onAdd}>Fazer <ArrowRight size={15} /></button>}</div>)}</div>
  </section>;
}

function SettingsPage({ settings, onSave, onNotify }: { settings: GlobalSettings; onSave: (s: GlobalSettings) => void; onNotify: (message: string) => void }) {
  const [draft, setDraft] = useState<GlobalSettings>(() => structuredClone(settings));
  const set = (key: keyof GlobalSettings, value: number | string) => setDraft((s) => ({ ...s, [key]: typeof value === "string" && key === "activeScenario" ? value : Number(value) } as GlobalSettings));
  const scenario = draft.scenarios[draft.activeScenario] || draft.scenarios["Ideal"]!;
  const productiveHours = scenario.hoursPerWeek * scenario.weeksPerMonth;
  const fdmEnergy = draft.fdmPower * draft.fdmKwh;
  const fdmEstimated = draft.fdmPurchase / draft.fdmLife + fdmEnergy;
  const resinEnergy = draft.resinPower * draft.resinKwh;
  const resinDep = draft.resinPurchase / draft.resinLife;
  const indirectTotal = draft.indirect.reduce((sum, item) => sum + item.value, 0);
  const activeHour = productiveHours ? scenario.remuneration / productiveHours : 0;
  const indirectHour = productiveHours ? indirectTotal / productiveHours : 0;
  const consumableTotal = draft.consumables.reduce((sum, item) => sum + item.cost, 0);
  const updateList = (key: "consumables" | "indirect" | "channels" | "packages", index: number, patch: Record<string, string | number | null>) => setDraft((s) => { const list = [...s[key]] as Array<Record<string, unknown>>; list[index] = { ...list[index], ...patch }; return { ...s, [key]: list } as unknown as GlobalSettings; });
  const save = () => { localStorage.setItem("edition-geek-global-settings", JSON.stringify(draft)); onSave(draft); window.dispatchEvent(new Event("edition-geek-settings-changed")); onNotify("Configurações salvas com sucesso"); };
  const restore = () => { if (window.confirm("Restaurar todos os valores padrão?")) { const fresh = structuredClone(defaultSettings); setDraft(fresh); localStorage.setItem("edition-geek-global-settings", JSON.stringify(fresh)); onSave(fresh); onNotify("Padrões restaurados"); } };
  return <PageFrame icon={Settings} title="Configurações globais" subtitle="Parâmetros que alimentam automaticamente toda a precificação" action="Salvar configurações" onAction={save}>
    <div className="settings-actions"><span><Info size={13} /> Alterações aplicadas nas novas e nas fichas de custo abertas.</span><button className="secondary-button" onClick={restore}><RotateCcw size={13} /> Restaurar padrões</button></div>
    <div className="settings-indicators"><Indicator icon={UserCog} label="Valor/hora ativo do Fábio" value={money(activeHour) + "/h"} /><Indicator icon={Receipt} label="Custo indireto por hora" value={money(indirectHour) + "/h"} /><Indicator icon={Zap} label="Energia FDM / Resina" value={`${money(fdmEnergy)}/h · ${money(resinEnergy)}/h`} /></div>
    <div className="settings-grid">
      <SettingsCard title="Parâmetros de impressão FDM" icon={Printer}><div className="form-grid two"><NumberField label="Potência (kW)" value={draft.fdmPower} onChange={(v) => set("fdmPower", v)} /><NumberField label="Preço do kWh (R$)" value={draft.fdmKwh} onChange={(v) => set("fdmKwh", v)} /><NumberField label="Valor de compra (R$)" value={draft.fdmPurchase} onChange={(v) => set("fdmPurchase", v)} /><NumberField label="Vida útil (horas)" value={draft.fdmLife} onChange={(v) => set("fdmLife", v)} /></div><div className="calc-lines"><Metric label="Custo de energia por hora" value={money(fdmEnergy)} /><Metric label="Depreciação por hora" value={money(draft.fdmPurchase / draft.fdmLife)} /><Metric label="Taxa estimada (depreciação + energia)" value={money(fdmEstimated)} /></div><NumberField label="Taxa hora-máquina usada na precificação (R$/h)" value={draft.fdmMachineRate} onChange={(v) => set("fdmMachineRate", v)} /></SettingsCard>
      <SettingsCard title="Parâmetros de impressão resina" icon={PackageOpen}><div className="form-grid two"><NumberField label="Preço da resina (R$/L)" value={draft.resinPrice} onChange={(v) => set("resinPrice", v)} /><NumberField label="Potência (kW)" value={draft.resinPower} onChange={(v) => set("resinPower", v)} /><NumberField label="Preço do kWh (R$)" value={draft.resinKwh} onChange={(v) => set("resinKwh", v)} /><NumberField label="Valor de compra (R$)" value={draft.resinPurchase} onChange={(v) => set("resinPurchase", v)} /><NumberField label="Vida útil (horas)" value={draft.resinLife} onChange={(v) => set("resinLife", v)} /><NumberField label="Perdas/falhas (%)" value={draft.resinLoss} onChange={(v) => set("resinLoss", v)} /></div><div className="calc-lines"><Metric label="Custo de energia por hora" value={money(resinEnergy)} /><Metric label="Depreciação por hora" value={money(resinDep)} /></div></SettingsCard>
      <SettingsCard title="Consumíveis por peça" icon={Boxes}><div className="settings-table"><div className="settings-table-head"><span>CONSUMÍVEL</span><span>CUSTO/PEÇA</span><span>REFERÊNCIA</span></div>{draft.consumables.map((item, i) => <div className="settings-table-row" key={item.name}><span>{item.name}</span><input type="number" step="0.01" value={item.cost} onChange={(e) => updateList("consumables", i, { cost: Number(e.target.value) })} /><small>{item.reference}</small></div>)}<div className="settings-total"><b>TOTAL CONSUMÍVEIS</b><strong>{money(consumableTotal)}</strong></div></div></SettingsCard>
      <SettingsCard title="Valor/hora do Fábio" icon={UserCog}><div className="scenario-tabs">{Object.keys(draft.scenarios).map((name) => <button className={draft.activeScenario === name ? "selected" : ""} onClick={() => set("activeScenario", name)} key={name}>Cenário {name}</button>)}</div>{Object.entries(draft.scenarios).map(([name, item]) => <div className={`scenario-row ${draft.activeScenario === name ? "active" : ""}`} key={name}><b>{name}</b><NumberField label="Remuneração mensal (R$)" value={item.remuneration} onChange={(v) => setDraft((s) => ({ ...s, scenarios: { ...s.scenarios, [name]: { ...item, remuneration: v } } }))} /><NumberField label="Horas/semana" value={item.hoursPerWeek} onChange={(v) => setDraft((s) => ({ ...s, scenarios: { ...s.scenarios, [name]: { ...item, hoursPerWeek: v } } }))} /><NumberField label="Semanas/mês" value={item.weeksPerMonth} onChange={(v) => setDraft((s) => ({ ...s, scenarios: { ...s.scenarios, [name]: { ...item, weeksPerMonth: v } } }))} /><div className="scenario-result"><small>{(item.hoursPerWeek * item.weeksPerMonth).toFixed(2)} h/mês</small><strong>{money(item.hoursPerWeek * item.weeksPerMonth ? item.remuneration / (item.hoursPerWeek * item.weeksPerMonth) : 0)}/h</strong></div></div>)}<div className="active-highlight"><span>Valor/hora ativo</span><strong>{money(activeHour)}/h</strong></div><small className="helper-text">Impressão e secagem sem acompanhamento não contam como hora produtiva.</small></SettingsCard>
      <SettingsCard title="Custos indiretos mensais" icon={Receipt}><div className="settings-table">{draft.indirect.map((item, i) => <div className="settings-table-row" key={item.name}><span>{item.name}</span><input type="number" step="0.01" value={item.value} onChange={(e) => updateList("indirect", i, { value: Number(e.target.value) })} /></div>)}<div className="settings-total"><b>TOTAL MENSAL</b><strong>{money(indirectTotal)}</strong></div></div><div className="rate-highlight"><span>Rateio · {productiveHours.toFixed(2)} horas produtivas/mês</span><strong>{money(indirectHour)}/h</strong></div></SettingsCard>
      <SettingsCard title="Margens e política de preços" icon={Percent}><div className="form-grid three"><NumberField label="Margem de lucro padrão (%)" value={draft.defaultMargin} onChange={(v) => set("defaultMargin", v)} /><NumberField label="Adicional para eventos (%)" value={draft.eventAdditional} onChange={(v) => set("eventAdditional", v)} /><NumberField label="Imposto sobre venda (%)" value={draft.salesTax} onChange={(v) => set("salesTax", v)} /></div><div className="formula-box"><b>Fórmula usada na precificação</b><code>Preço = Custo Total ÷ (1 − margem% − taxas_canal% − imposto%)</code></div></SettingsCard>
      <SettingsCard title="Canais de venda" icon={Store} wide><EditableTable headers={["Canal", "Comissão (%)", "Taxa fixa/item", "Observação"]}>{draft.channels.map((item, i) => <div className="settings-table-row" key={i}><input value={item.name} onChange={(e) => updateList("channels", i, { name: e.target.value })} /><input type="number" step="0.01" value={item.commission} onChange={(e) => updateList("channels", i, { commission: Number(e.target.value) })} /><input type="number" step="0.01" value={item.fixedFee} onChange={(e) => updateList("channels", i, { fixedFee: Number(e.target.value) })} /><input value={item.note} onChange={(e) => updateList("channels", i, { note: e.target.value })} /><button className="icon-danger" onClick={() => setDraft((s) => ({ ...s, channels: s.channels.filter((_, n) => n !== i) }))}><Trash2 size={14} /></button></div>)}</EditableTable><button className="secondary-button" onClick={() => setDraft((s) => ({ ...s, channels: [...s.channels, { name: "Novo canal", commission: 0, fixedFee: 0, note: "" }] }))}><Plus size={13} /> Adicionar canal</button></SettingsCard>
      <SettingsCard title="Embalagens" icon={Package} wide><EditableTable headers={["Embalagem", "Custo (R$)"]}>{draft.packages.map((item, i) => <div className="settings-table-row" key={i}><input value={item.name} onChange={(e) => updateList("packages", i, { name: e.target.value })} /><input type="number" step="0.01" value={item.cost ?? ""} placeholder="—" onChange={(e) => updateList("packages", i, { cost: e.target.value === "" ? null : Number(e.target.value) })} /><button className="icon-danger" onClick={() => setDraft((s) => ({ ...s, packages: s.packages.filter((_, n) => n !== i) }))}><Trash2 size={14} /></button></div>)}</EditableTable><button className="secondary-button" onClick={() => setDraft((s) => ({ ...s, packages: [...s.packages, { name: "Nova embalagem", cost: 0 }] }))}><Plus size={13} /> Adicionar embalagem</button></SettingsCard>
    </div>
  </PageFrame>;
}

function timeToHours(value: string) { const [hours, minutes] = value.split(":").map(Number); return (hours || 0) + (minutes || 0) / 60; }
function formatHours(value: number) { const hours = Math.floor(value); return `${String(hours).padStart(2, "0")}:${String(Math.round((value - hours) * 60)).padStart(2, "0")}`; }
function parseCsvLine(line: string) { return line.split(/[,;\t]/).map((cell) => cell.trim().replace(/^['"]|['"]$/g, "")); }

function FdmCalculator({ settings, onNotify }: { settings: GlobalSettings; onNotify: (message: string) => void }) {
  const [form, setForm] = useState<FdmForm>(() => emptyFdmForm());
  const [history, setHistory] = useState<FdmHistoryItem[]>(() => { try { return JSON.parse(localStorage.getItem("edition-geek-fdm-history") || "null") || initialFdmHistory; } catch { return initialFdmHistory; } });
  const [search, setSearch] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const selectedChannel = settings.channels.find((channel) => channel.name === form.channelName) || settings.channels[0] || { commission: 0, fixedFee: 0, name: "Pix", note: "—" };
  const selectedPackage = settings.packages.find((item) => item.name === form.packageName);
  const printHours = form.printHours + form.printMinutes / 60;
  const serviceHours = timeToHours(form.design) + timeToHours(form.slicing) + timeToHours(form.finishing);
  const material = form.materialGrams / 1000 * form.filamentKg;
  const machine = printHours * settings.fdmMachineRate;
  const energy = printHours * settings.fdmPower * settings.fdmKwh;
  const fabrication = material + machine + energy;
  const service = serviceHours * activeLaborRate(settings);
  const indirect = serviceHours * activeIndirectRate(settings);
  const components = form.led + form.powerSupply + form.otherCost + (selectedPackage?.cost || 0);
  const total = fabrication + service + components + indirect;
  const commission = (selectedChannel.commission || 0) / 100;
  const tax = settings.salesTax / 100;
  const minDenominator = 1 - commission - tax;
  const recommendedDenominator = 1 - settings.defaultMargin / 100 - commission - tax;
  const minimum = minDenominator > 0 ? total / minDenominator : 0;
  const recommended = recommendedDenominator > 0 ? total / recommendedDenominator : 0;
  const eventPrice = recommended * (1 + settings.eventAdditional / 100);
  const adjusted = form.adjustedPrice || recommended;
  const channelFee = adjusted * commission + (selectedChannel.fixedFee || 0);
  const realMargin = adjusted > 0 ? (adjusted - total) / adjusted * 100 : 0;
  const realProfit = adjusted - total - channelFee;
  const effectiveHour = serviceHours > 0 ? realProfit / serviceHours : 0;
  const targetHour = activeLaborRate(settings);
  const update = (key: keyof FdmForm, value: string | number) => setForm((current) => ({ ...current, [key]: value }));
  const costs = { fabrication, service, components, indirect, total, suggested: recommended, adjusted };
  const saveHistory = () => { const item: FdmHistoryItem = { ...form, id: `${Date.now()}`, savedAt: new Date().toLocaleString("pt-BR"), costs }; const next = [item, ...history]; setHistory(next); localStorage.setItem("edition-geek-fdm-history", JSON.stringify(next)); onNotify("Ficha salva no histórico"); };
  const loadItem = (item: FdmHistoryItem, duplicate = false) => { const { id: _id, costs: _costs, savedAt: _savedAt, ...formValues } = item; setForm({ ...formValues, name: duplicate ? `${item.name} · cópia` : item.name }); setShowHistory(false); };
  const attachStl = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; if (!file.name.toLowerCase().endsWith(".stl")) { onNotify("Selecione um arquivo STL válido"); event.target.value = ""; return; } const reader = new FileReader(); reader.onload = () => { setForm((current) => ({ ...current, stlFileName: file.name, stlDataUrl: String(reader.result || "") })); onNotify(`${file.name} anexado à ficha`); }; reader.readAsDataURL(file); event.target.value = ""; };
  const importCsv = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { const lines = String(reader.result || "").split(/\r?\n/).filter(Boolean); if (lines.length < 2) return; const headers = parseCsvLine(lines[0] || "").map((header) => header.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")); const imported = lines.slice(1).map((line, index) => { const values = parseCsvLine(line); const value = (names: string[]) => { const position = headers.findIndex((header) => names.some((name) => header.includes(name))); return position >= 0 ? values[position] || "" : ""; }; const grams = Number(value(["gramas", "material"]).replace(",", ".")) || 0; const price = Number(value(["venda ajustada", "ajustado"]).replace(",", ".")) || 0; return { ...emptyFdmForm(), id: `csv-${Date.now()}-${index}`, name: value(["nome", "produto"]) || `Produto importado ${index + 1}`, materialGrams: grams, printHours: Number(value(["horas impressao", "horas de impressao", "horas"]).replace(",", ".")) || 0, adjustedPrice: price, savedAt: "Importado via CSV", costs: { fabrication: Number(value(["custo fabricacao", "custo de fabricacao"]).replace(",", ".")) || 0, service: Number(value(["custo servico", "custo de servico"]).replace(",", ".")) || 0, components: Number(value(["custo componentes", "custo de componentes"]).replace(",", ".")) || 0, indirect: 0, total: Number(value(["custo total"]).replace(",", ".")) || 0, suggested: Number(value(["valor venda sugerido", "sugerido"]).replace(",", ".")) || 0, adjusted: price } }; }); const next = [...imported, ...history]; setHistory(next); localStorage.setItem("edition-geek-fdm-history", JSON.stringify(next)); onNotify(`${imported.length} produto(s) importado(s)`); }; reader.readAsText(file, "UTF-8"); event.target.value = ""; };
  const alertLoss = adjusted > 0 && adjusted < minimum;
  const alertLabor = serviceHours > 0 && effectiveHour < targetHour;
  const alertMarket = form.marketPrice > 0 && minimum > form.marketPrice;
  return <PageFrame icon={Calculator} title="Calculadora FDM" subtitle="Custo e preço de venda para peças em PLA nas Bambu Lab A1" action="Novo produto" onAction={() => setForm(emptyFdmForm())}>
    <div className="fdm-toolbar"><div className="fdm-context"><Zap size={15} /><span>Parâmetros globais ativos · máquina {money(settings.fdmMachineRate)}/h · Fábio {money(targetHour)}/h</span></div><div className="fdm-actions"><button className="secondary-button" onClick={() => setShowHistory((value) => !value)}><ClipboardList size={13} /> Histórico ({history.length})</button><label className="secondary-button file-button"><Tags size={13} /> Importar CSV<input type="file" accept=".csv,.tsv" onChange={importCsv} /></label><button className="secondary-button" onClick={() => window.print()}><Receipt size={13} /> Exportar PDF</button></div></div>
    <div className="fdm-layout"><div className="fdm-form-column">
      <FdmCard title="Identificação do produto" icon={Gem}><div className="form-grid two"><FdmInput label="Nome do produto / projeto" value={form.name} onChange={(value) => update("name", value)} placeholder="Ex: Dragão articulado" /><FdmSelect label="Categoria" value={form.category} options={["Decoração", "Colecionável", "Chaveiro", "Pokébola", "Espada Anime", "Estátua", "Caixa/Organizador", "Acessório", "Evento", "Outro"]} onChange={(value) => update("category", value)} /><FdmSelect label="Status" value={form.status} options={["Em produção", "Pronto para venda", "Vendido", "Cancelado"]} onChange={(value) => update("status", value)} /><FdmSelect label="Complexidade" value={form.complexity} options={["Simples", "Intermediária", "Complexa-Premium"]} onChange={(value) => update("complexity", value)} /></div><div className="form-grid two fdm-source-row"><label className="field fdm-field"><span>Link do projeto / modelo</span><div className="source-input"><input className="yellow-input" type="url" value={form.projectUrl} onChange={(event) => update("projectUrl", event.target.value)} placeholder="https://makerworld.com/pt/models/..." />{form.projectUrl && <a href={form.projectUrl} target="_blank" rel="noreferrer" aria-label="Abrir link do projeto">Abrir</a>}</div><small className="field-hint">MakerWorld ou qualquer outra fonte do modelo.</small></label><div className="field fdm-field"><span>Arquivo STL</span><label className="stl-dropzone"><input type="file" accept=".stl,model/stl" onChange={attachStl} /><PackageOpen size={17} /><span>{form.stlFileName || "Clique para anexar o STL"}</span><small>{form.stlFileName ? "Arquivo salvo junto desta ficha" : "Apenas arquivos .stl"}</small></label>{form.stlDataUrl && <div className="stl-actions"><a href={form.stlDataUrl} download={form.stlFileName}>Baixar {form.stlFileName}</a><button type="button" onClick={() => setForm((current) => ({ ...current, stlFileName: "", stlDataUrl: "" }))}>Remover</button></div>}</div></div></FdmCard>
      <FdmCard title="Parâmetros de impressão" icon={Printer}><div className="form-grid three"><FdmInput label="Custo do filamento (R$/kg)" type="number" value={form.filamentKg} onChange={(value) => update("filamentKg", Number(value))} /><FdmInput label="Material gasto (g)" type="number" value={form.materialGrams} onChange={(value) => update("materialGrams", Number(value))} /><div className="fdm-time-group"><span>Tempo de impressão</span><div><FdmInput label="Horas" type="number" value={form.printHours} onChange={(value) => update("printHours", Number(value))} /><FdmInput label="Minutos" type="number" value={form.printMinutes} onChange={(value) => update("printMinutes", Number(value))} /></div></div></div></FdmCard>
      <FdmCard title="Tempo de serviço do Fábio" icon={UserCog}><p className="fdm-helper">Considere apenas o trabalho manual. Impressão automática e secagem ficam fora.</p><div className="form-grid three"><FdmInput label="Projeto / design (hh:mm)" value={form.design} onChange={(value) => update("design", value)} placeholder="00:00" /><FdmInput label="Fatiamento / slicing (hh:mm)" value={form.slicing} onChange={(value) => update("slicing", value)} placeholder="00:00" /><FdmInput label="Montagem / acabamento (hh:mm)" value={form.finishing} onChange={(value) => update("finishing", value)} placeholder="00:00" /></div><div className="fdm-total-line"><span>Total de horas de serviço</span><strong>{formatHours(serviceHours)} · {serviceHours.toFixed(2)} h</strong></div></FdmCard>
      <FdmCard title="Componentes adicionais" icon={Boxes}><div className="form-grid three"><FdmInput label="Fita LED (R$)" type="number" value={form.led} onChange={(value) => update("led", Number(value))} /><FdmInput label="Fonte de alimentação (R$)" type="number" value={form.powerSupply} onChange={(value) => update("powerSupply", Number(value))} /><FdmInput label="Valor (R$)" type="number" value={form.otherCost} onChange={(value) => update("otherCost", Number(value))} /><FdmInput label="Descrição do item" value={form.otherLabel} onChange={(value) => update("otherLabel", value)} placeholder="Pintura, chaveiro, outros..." /><FdmSelect label="Embalagem" value={form.packageName} options={["", ...settings.packages.map((item) => item.name)]} onChange={(value) => update("packageName", value)} /></div><div className="fdm-total-line"><span>Total de componentes</span><strong>{money(components)}</strong></div></FdmCard>
      <FdmCard title="Informações de venda" icon={Store}><div className="form-grid two"><div className="channel-field"><FdmSelect label="Canal de venda" value={form.channelName} options={settings.channels.map((channel) => channel.name)} onChange={(value) => update("channelName", value)} /><small>{selectedChannel.commission.toFixed(2)}% de comissão · taxa fixa {money(selectedChannel.fixedFee || 0)}</small></div><FdmInput label="Preço de mercado / concorrente (R$)" type="number" value={form.marketPrice} onChange={(value) => update("marketPrice", Number(value))} /></div><label className="field fdm-field"><span>Observações</span><textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Observações sobre a peça, concorrência ou negociação..." /></label></FdmCard>
      <div className="fdm-save-row"><button className="secondary-button" onClick={() => setForm(emptyFdmForm())}><RotateCcw size={14} /> Limpar formulário</button><button className="primary-button" onClick={saveHistory}><Save size={14} /> Salvar no histórico</button></div>
    </div><div className="fdm-result-column"><div className="fdm-sticky">
      <FdmResultCard title="Custo de fabricação" icon={Printer}><ResultMetric label="Material" value={money(material)} /><ResultMetric label="Hora-máquina" value={money(machine)} /><ResultMetric label="Energia" value={money(energy)} /><ResultMetric label="Custo de fabricação total" value={money(fabrication)} strong /></FdmResultCard>
      <FdmResultCard title="Custo de serviço e indiretos" icon={UserCog}><ResultMetric label={`Serviço · ${serviceHours.toFixed(2)} h × ${money(targetHour)}`} value={money(service)} /><ResultMetric label="Custo indireto rateado" value={money(indirect)} /><ResultMetric label="Componentes" value={money(components)} /><ResultMetric label="CUSTO TOTAL DO PRODUTO" value={money(total)} strong /></FdmResultCard>
      <FdmResultCard title="Precificação" icon={ArrowUpRight}><PriceMetric label="Preço mínimo" value={minimum} detail="Sem lucro, já com canal e imposto" /><PriceMetric label="Preço recomendado" value={recommended} detail={`Margem padrão de ${settings.defaultMargin}%`} /><PriceMetric label="Preço para eventos" value={eventPrice} detail={`+${settings.eventAdditional}% sobre recomendado`} /><label className="field adjusted-field"><span>Valor de venda ajustado (R$)</span><input type="number" step="0.01" value={form.adjustedPrice || ""} placeholder={recommended ? recommended.toFixed(2) : "Digite seu preço"} onChange={(event) => update("adjustedPrice", Number(event.target.value))} /></label></FdmResultCard>
      <FdmResultCard title="Análise da venda" icon={FileBarChart}><div className="analysis-grid"><ResultMetric label="Margem real" value={`${realMargin.toFixed(1)}%`} /><ResultMetric label="Lucro real" value={money(realProfit)} /><ResultMetric label="Taxas do canal" value={money(channelFee)} /><ResultMetric label="Efetivo/h Fábio" value={`${money(effectiveHour)}/h`} strong /><ResultMetric label="Alvo Fábio" value={`${money(targetHour)}/h`} /></div>{(alertLoss || alertLabor || alertMarket) && <div className="fdm-alerts">{alertLoss && <div>⚠️ Venda com prejuízo!</div>}{alertLabor && <div>⚠️ Hora do Fábio subpaga nessa venda</div>}{alertMarket && <div>⚠️ Preço mínimo acima do mercado — rever viabilidade</div>}</div>}</FdmResultCard>
    </div></div></div>
    {showHistory && <div className="fdm-history panel"><div className="history-head"><div><h2>Histórico de produtos FDM</h2><p>Produtos salvos e registros importados da planilha histórica.</p></div><div className="search-box"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nome..." /></div></div><div className="history-table"><div className="history-row history-head-row"><span>PRODUTO</span><span>MATERIAL</span><span>CUSTO TOTAL</span><span>SUGERIDO</span><span>AJUSTADO</span><span /></div>{history.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())).map((item) => <div className="history-row" key={item.id}><b className="history-product"><span>{item.name}</span><small>{item.projectUrl ? <a href={item.projectUrl} target="_blank" rel="noreferrer">Projeto ↗</a> : "Sem link"}{item.stlFileName && <em title={item.stlFileName}>STL</em>}</small></b><span>{item.materialGrams} g · {item.printHours}h{String(item.printMinutes).padStart(2, "0")}</span><span>{money(item.costs.total)}</span><span>{money(item.costs.suggested)}</span><strong>{money(item.costs.adjusted)}</strong><div className="history-row-actions"><button onClick={() => loadItem(item)}>Abrir</button><button onClick={() => loadItem(item, true)}>Duplicar</button></div></div>)}</div></div>}
  </PageFrame>;
}

function activeLaborRate(settings: GlobalSettings) { const scenario = settings.scenarios[settings.activeScenario] || settings.scenarios["Ideal"]!; const hours = scenario.hoursPerWeek * scenario.weeksPerMonth; return hours ? scenario.remuneration / hours : 0; }
function activeIndirectRate(settings: GlobalSettings) { const scenario = settings.scenarios[settings.activeScenario] || settings.scenarios["Ideal"]!; const hours = scenario.hoursPerWeek * scenario.weeksPerMonth; const total = settings.indirect.reduce((sum, item) => sum + item.value, 0); return hours ? total / hours : 0; }
function FdmCard({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: ReactNode }) { return <div className="panel fdm-card"><SectionTitle title={title} icon={Icon} />{children}</div>; }
function FdmInput({ label, value, onChange, type = "text", placeholder }: { label: string; value: string | number; onChange: (value: string) => void; type?: string; placeholder?: string }) { return <label className="field fdm-field"><span>{label}</span><input className="yellow-input" type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>; }
function FdmSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label className="field fdm-field"><span>{label}</span><select className="yellow-input" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option} value={option}>{option || "Nenhuma"}</option>)}</select></label>; }
function FdmResultCard({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: ReactNode }) { return <div className="panel fdm-result-card"><SectionTitle title={title} icon={Icon} />{children}</div>; }
function ResultMetric({ label, value, strong }: { label: string; value: string; strong?: boolean }) { return <div className={`result-metric ${strong ? "strong" : ""}`}><span>{label}</span><b>{value}</b></div>; }
function PriceMetric({ label, value, detail }: { label: string; value: number; detail: string }) { return <div className="price-metric"><div><span>{label}</span><small>{detail}</small></div><strong>{value > 0 ? money(value) : "—"}</strong></div>; }

function Indicator({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) { return <div className="settings-indicator"><span><Icon size={15} /></span><div><small>{label}</small><strong>{value}</strong></div></div>; }
function SettingsCard({ title, icon: Icon, children, wide }: { title: string; icon: LucideIcon; children: ReactNode; wide?: boolean }) { return <div className={`panel settings-card ${wide ? "wide" : ""}`}><SectionTitle title={title} icon={Icon} />{children}</div>; }
function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <label className="field"><span>{label}</span><input type="number" step="0.01" value={value} onChange={(e) => onChange(Number(e.target.value))} /></label>; }
function EditableTable({ headers, children }: { headers: string[]; children: ReactNode }) { return <div className="settings-table editable"><div className="settings-table-head">{headers.map((h) => <span key={h}>{h}</span>)}</div>{children}</div>; }

function PricingPage({ onNotify, settings }: { onNotify: (message: string) => void; settings: GlobalSettings }) {
  const active = settings.scenarios[settings.activeScenario] || settings.scenarios["Ideal"]!;
  const activeHour = active.hoursPerWeek * active.weeksPerMonth ? active.remuneration / (active.hoursPerWeek * active.weeksPerMonth) : 0;
  const indirectHour = active.hoursPerWeek * active.weeksPerMonth ? settings.indirect.reduce((sum, item) => sum + item.value, 0) / (active.hoursPerWeek * active.weeksPerMonth) : 0;
  return <PageFrame icon={Calculator} title="Produto 1" subtitle="Monte sua peça e descubra o preço ideal" action="Salvar" onAction={() => onNotify("Produto salvo") }><div className="pricing-live-strip"><span><UserCog size={14} /> Mão de obra: <b>{money(activeHour)}/h</b></span><span><Wrench size={14} /> Indiretos: <b>{money(indirectHour)}/h</b></span><span><Zap size={14} /> Máquina FDM: <b>{money(settings.fdmMachineRate)}/h</b></span></div><div className="pricing-grid"><div className="panel form-panel"><SectionTitle title="Produto 1" icon={Gem} /><div className="form-grid two"><Field label="Nome do Produto" placeholder="Ex: Porta-canetas personalizado" /><Field label="Quantidade" placeholder="1" /></div><Field label="Descrição / Especificações" placeholder="Detalhes, especificações, observações do produto..." area /><SectionTitle title="Modelagem e Impressão" icon={Printer} small /><div className="form-grid three"><Field label="Modelagem e Impressão" placeholder="Nenhum" select /><Field label="Geral (min)" placeholder="0" /><Field label="Por peça (min)" placeholder="0" /></div><div className="form-grid three"><Field label="Aquisição de Modelo (R$)" placeholder="0,00" /><Field label="Retrabalho (%)" placeholder="0" /><Field label="Urgência (%)" placeholder="0" /></div><div className="highlight-box"><SectionTitle title="Dados Unitários" icon={Calculator} small /><div className="form-grid four"><Field label="Tempo de Impressão" placeholder="Nenhum" select /><Field label="Dias" placeholder="0" /><Field label="Horas" placeholder="0" /><Field label="Minutos" placeholder="0" /></div><button className="secondary-button"><Plus size={14} /> Adicionar impressora</button></div></div><div className="pricing-side"><div className="panel form-panel"><SectionTitle title="Custos Gerais da Venda" icon={Boxes} /><div className="form-grid two"><Field label="Canal de venda" placeholder="Pix" select /><Field label="Tempo (min)" placeholder="0" /></div><Field label="Embalagem" placeholder={settings.packages[0]?.name || "Nenhuma"} select /><button className="secondary-button"><Plus size={14} /> Adicionar embalagem</button></div><div className="panel result-panel"><SectionTitle title="Resultado da Precificação" icon={ArrowUpRight} /><p className="subsection-label">Detalhamento de Custos</p><Metric label="Custo de Produção" value="R$ 0,00" /><Metric label="Custos Totais" value="R$ 0,00" danger /><div className="notice"><Wrench size={14} /> Configurações globais conectadas. Os valores são atualizados ao salvar.</div><p className="subsection-label">Margem de Lucro Desejada</p><div className="profit-slider"><i /><b>{settings.defaultMargin}%</b></div><div className="slider-labels"><span>0%</span><span>50%</span><span>100%</span><span>150%</span></div></div></div></div></PageFrame>;
}

function OrdersPage({ onAdd }: { onAdd: () => void }) { return <PageFrame icon={Package} title="Controle de Pedidos" subtitle="Acompanhe e gerencie os pedidos da sua loja" action="Pedido Rápido" onAction={onAdd}><div className="filter-row"><div className="filter-tabs"><button className="selected">Todos</button><button>Em aberto</button><button>Em produção</button><button>Concluídos</button></div><div className="search-box"><Search size={15} /><input placeholder="Buscar por nome ou número..." /></div></div><div className="panel table-panel"><div className="table-head"><span>PEDIDO</span><span>CLIENTE</span><span>STATUS</span><span>ENTREGA</span><span>VALOR</span><span /></div>{transactions.map((item, index) => <div className="table-row" key={item.id}><div className="transaction-name"><span className="transaction-icon out"><Package size={15} /></span><b>#{2048 - index}</b></div><span className="category">{index === 0 ? "Ana Souza" : index === 1 ? "Carlos Lima" : "Mariana Geek"}</span><span className={`status ${index === 1 ? "in" : "pending"}`}>{index === 1 ? "Concluído" : "Em aberto"}</span><span className="date">15 ago, 2026</span><strong>R$ {index === 0 ? "320,00" : index === 1 ? "890,00" : "145,00"}</strong><button className="row-more"><MoreHorizontal size={17} /></button></div>)}</div></PageFrame>; }

function FinancialPage() { return <PageFrame icon={Wallet} title="Controle Financeiro" subtitle="Gerencie receitas, despesas e analise a saúde financeira do seu negócio" action="Nova Transação"><div className="filter-tabs wide"><button>Transações</button><button>Recebimentos Pendentes</button><button>Gráficos</button><button className="selected">Fluxo de Caixa</button></div><div className="period-panel"><button>Total</button><button>Anual</button><button className="selected">Mensal</button><button><CalendarDays size={14} /> Personalizado</button><ChevronLeft size={16} /><b>Agosto de 2026</b><ChevronRight size={16} /></div><div className="panel empty-chart"><h3>Fluxo de Caixa com Projeção</h3><p>Histórico e projeção dos próximos meses</p><span>Nenhum dado disponível</span></div></PageFrame>; }

function ResourcesPage() { return <PageFrame icon={Boxes} title="Recursos" subtitle="Gerencie os materiais e recursos usados na produção" action="Novo Acabamento"><div className="filter-tabs resource-tabs"><button>Matéria-prima</button><button className="selected">Acabamentos</button><button>Embalagens</button><button>Maquinários</button><button>Profissionais</button></div><div className="panel empty-state"><Boxes size={34} /><h3>Nenhum acabamento cadastrado</h3><p>Adicione seus materiais de acabamento</p></div></PageFrame>; }

function StorePage() { return <PageFrame icon={Store} title="Minha Loja Online" subtitle="Sua loja pra vender direto pro cliente — montada com os produtos que você já tem no 3DPM." action=""><div className="panel store-empty"><Store size={31} /><h2>Sua loja nasce pronta pra vender</h2><p>Uma loja online ou um link integrado aos produtos que você já cadastrou aparecem sozinhos na loja.</p></div><div className="setup-steps"><SetupStep number="1" title="Criar sua loja" detail="A gente monta sua loja com seus produtos em 1 clique." action="Criar minha loja grátis"/><SetupStep number="2" title="Receber os pagamentos" detail="Conecte o Mercado Pago pra o dinheiro das vendas cair na sua conta." action="Conectar Mercado Pago" disabled/></div><div className="panel fees-note"><b>Você só paga quando vende:</b><span>Pix — 3,9% por venda</span><span>Cartão — 6,9% por venda</span></div></PageFrame>; }

function UsersPage({ onAdd }: { onAdd: () => void }) { return <PageFrame icon={UsersRound} title="Usuários" subtitle="Gerencie quem pode acessar seu workspace" action="Novo Usuário" onAction={onAdd}><div className="filter-tabs settings-tabs"><button>Perfil</button><button className="selected">Usuários</button><button>Perfis</button><button>Categorias</button><button>Entregas</button><button>Calculadora</button></div><div className="toolbar-row"><div className="search-box"><Search size={15} /><input placeholder="Buscar por nome ou email..." /></div><select><option>Todos Perfis</option></select><span className="usage-pill">0/3 utilizados</span></div><div className="panel empty-state"><UsersRound size={34} /><h3>Nenhum usuário encontrado</h3><p>Adicione usuários para compartilhar o acesso ao sistema</p></div></PageFrame>; }

function EmptyPage({ title, subtitle, icon: Icon, action, empty, onAdd }: { title: string; subtitle: string; icon: LucideIcon; action: string; empty: string; onAdd: () => void }) { return <PageFrame icon={Icon} title={title} subtitle={subtitle} action={action} onAction={onAdd}><div className="toolbar-row"><div className="search-box"><Search size={15} /><input placeholder={`Buscar em ${title.toLowerCase()}...`} /></div><button className="secondary-button"><CalendarDays size={14} /> Todos</button></div><div className="panel empty-state"><Icon size={34} /><h3>{empty}</h3><p>Adicione um novo registro para começar</p></div></PageFrame>; }

function PageFrame({ icon: Icon, title, subtitle, action, onAction, children }: { icon: LucideIcon; title: string; subtitle: string; action?: string; onAction?: () => void; children: ReactNode }) { return <section className="content-page"><div className="page-heading section-heading"><div><h1><Icon size={21} /> {title}</h1><p className="subtitle">{subtitle}</p></div>{action && <button className="primary-button" onClick={onAction}><Plus size={16} /> {action}</button>}</div>{children}</section>; }
function SectionTitle({ title, icon: Icon, small }: { title: string; icon: LucideIcon; small?: boolean }) { return <div className={`section-title ${small ? "small" : ""}`}><Icon size={small ? 14 : 16} /><b>{title}</b></div>; }
function Field({ label, placeholder, select, area }: { label: string; placeholder: string; select?: boolean; area?: boolean }) { return <label className="field"><span>{label}</span>{area ? <textarea placeholder={placeholder} /> : select ? <select><option>{placeholder}</option></select> : <input placeholder={placeholder} />}</label>; }
function Metric({ label, value, danger }: { label: string; value: string; danger?: boolean }) { return <div className="metric"><span>{label}</span><b className={danger ? "danger" : ""}>{value}</b></div>; }
function SetupStep({ number, title, detail, action, disabled }: { number: string; title: string; detail: string; action: string; disabled?: boolean }) { return <div className="setup-step"><span>{number}</span><div><b>{title}</b><p>{detail}</p></div><button disabled={disabled}>{action}</button></div>; }
function QuickOrderModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) { return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal large-modal" onMouseDown={(e) => e.stopPropagation()}><div className="modal-head"><div><p className="eyebrow">PEDIDO RÁPIDO</p><h2>Novo pedido</h2></div><button className="close-button" onClick={onClose} aria-label="Fechar"><X size={18} /></button></div><div className="form-grid two"><Field label="Cliente" placeholder="Selecione um cliente" select /><Field label="Prazo de entrega (dias)" placeholder="7" /></div><div className="panel modal-section"><SectionTitle title="Custos Gerais da Venda" icon={Boxes} /><div className="form-grid two"><Field label="Atendimento / envio" placeholder="Nenhum" select /><Field label="Tempo (min)" placeholder="0" /></div><button className="secondary-button"><Plus size={14} /> Adicionar embalagem</button></div><div className="result-summary"><b>Resultado do Pedido</b><Metric label="Custo dos produtos" value="R$ 0,00" /><Metric label="Valor total" value="R$ 0,00" danger /></div><div className="modal-actions"><button className="secondary-button" onClick={onClose}>Cancelar</button><button className="primary-button" onClick={onSave}>Salvar pedido</button></div></div></div>; }
