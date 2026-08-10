import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownLeft, ArrowRight, ArrowUpRight, Bell, Boxes, Calculator, CalendarDays, Check,
  ChevronDown, ChevronLeft, ChevronRight, CircleHelp, ClipboardList, Clock3, CreditCard,
  FileBarChart, FileText, Gem, LayoutDashboard, LockKeyhole, Menu, MoreHorizontal, Package,
  PanelLeft, Plus, Printer, Receipt, Search, Settings, ShoppingBag, ShoppingCart, Store,
  Tags, Truck, UserRound, UsersRound, Wallet, Wrench, X,
} from "lucide-react";
import logoUrl from "../../Logo Redondo.png";

export const Route = createFileRoute("/")({ component: Index });

type NavItem = { label: string; icon: LucideIcon; locked?: boolean; badge?: string; group?: string };

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Composição de Preços", icon: Calculator, locked: true },
  { label: "Orçamentos", icon: FileText },
  { label: "Controle de Pedidos", icon: Package },
  { label: "Análises", icon: FileBarChart, locked: true },
  { label: "Financeiro", icon: Wallet },
  { label: "Clientes", icon: UsersRound },
  { label: "Recursos", icon: Boxes },
  { label: "Produtos", icon: Gem },
  { label: "Mercado Livre", icon: ShoppingBag, group: "marketplaces" },
  { label: "Shopee", icon: ShoppingCart, badge: "EM BREVE" },
  { label: "Melhor Envio", icon: Truck },
];

const transactions = [
  { id: 1, name: "Google Workspace", category: "Software", date: "08 ago, 2026", value: "R$ 145,90", status: "Pago", kind: "out" },
  { id: 2, name: "Venda #2048 · Cliente novo", category: "Receita de vendas", date: "07 ago, 2026", value: "R$ 2.850,00", status: "Recebido", kind: "in" },
  { id: 3, name: "Mercado Livre", category: "Fornecedores", date: "06 ago, 2026", value: "R$ 980,00", status: "Pago", kind: "out" },
];

function Index() {
  const [active, setActive] = useState("Dashboard");
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
        {navItems.map(({ label, icon: Icon, locked, badge, group }) => <div key={label} className={group === "marketplaces" ? "nav-group-start" : ""}><button className={`nav-item ${active === label ? "active" : ""}`} onClick={() => selectPage(label)}><Icon size={17} /><span>{label}</span>{locked && <LockKeyhole size={13} className="nav-lock" />}{badge && <em>{badge}</em>}</button></div>)}
        <p className="nav-label nav-bottom">CONFIGURAÇÕES</p>
        <button className={`nav-item ${active === "Usuários" ? "active" : ""}`} onClick={() => selectPage("Usuários")}><Settings size={17} /><span>Configurações</span></button>
        <button className="nav-item" onClick={() => notify("Central de ajuda em breve")}><CircleHelp size={17} /><span>Central de ajuda</span></button>
      </nav>
      <div className="sidebar-user"><div className="user-avatar">J</div><div><b>julianaeditiongeek...</b><span>Juliana Edition Geek</span></div><ChevronRight size={15} /></div>
    </aside>
    <main className="main-content">
      <div className="trial-bar"><span><Gem size={14} /> Teste grátis do Plano Pro</span><span><Clock3 size={13} /> 6d 23h 57min</span><button onClick={() => notify("Plano Pro selecionado")}>Fazer Upgrade</button></div>
      <header className="topbar"><button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Menu size={22} /></button><div className="breadcrumb"><span>Edition Geek</span><b>/</b><strong>{activeItem?.label || active}</strong></div><div className="top-actions"><button className="icon-button" aria-label="Notificações" onClick={() => notify("Você não tem novas notificações")}><Bell size={18} /><i /></button><div className="profile"><div className="profile-avatar">J</div><div><b>Juliana</b><span>Administradora</span></div><ChevronDown size={15} /></div></div></header>
      <div className="page-wrap"><PageContent active={active} onAdd={() => setShowAdd(true)} onNotify={notify} /><footer className="footer-note"><span>© 2026 Edition Geek</span><span>Dados atualizados agora <i /></span></footer></div>
    </main>
    {showAdd && <QuickOrderModal onClose={() => setShowAdd(false)} onSave={() => { setShowAdd(false); notify("Pedido salvo com sucesso"); }} />}
    {toast && <div className="toast"><span>✓</span>{toast}</div>}
  </div>;
}

function PageContent({ active, onAdd, onNotify }: { active: string; onAdd: () => void; onNotify: (message: string) => void }) {
  if (active === "Dashboard") return <Dashboard onAdd={onAdd} />;
  if (active === "Composição de Preços") return <PricingPage onNotify={onNotify} />;
  if (active === "Controle de Pedidos") return <OrdersPage onAdd={onAdd} />;
  if (active === "Financeiro") return <FinancialPage />;
  if (active === "Recursos") return <ResourcesPage />;
  if (active === "Mercado Livre") return <StorePage />;
  if (active === "Usuários") return <UsersPage onAdd={onAdd} />;
  const config: Record<string, { icon: LucideIcon; subtitle: string; action: string; empty: string }> = {
    "Orçamentos": { icon: FileText, subtitle: "Crie propostas profissionais para seus clientes", action: "Novo orçamento", empty: "Nenhum orçamento encontrado" },
    "Análises": { icon: FileBarChart, subtitle: "Acompanhe os indicadores do seu negócio", action: "Exportar relatório", empty: "Nenhuma análise disponível" },
    "Clientes": { icon: UsersRound, subtitle: "Gerencie seus clientes e relacionamentos", action: "Novo cliente", empty: "Nenhum cliente cadastrado" },
    "Produtos": { icon: Gem, subtitle: "Organize seu catálogo de produtos", action: "Novo produto", empty: "Nenhum produto cadastrado" },
    "Shopee": { icon: ShoppingCart, subtitle: "Venda seus produtos na Shopee", action: "Conectar loja", empty: "Integração em breve" },
    "Melhor Envio": { icon: Truck, subtitle: "Gerencie suas entregas em um só lugar", action: "Configurar envio", empty: "Nenhuma entrega encontrada" },
  };
  return <EmptyPage title={active} {...(config[active] || config.Clientes)} onAdd={onAdd} />;
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

function PricingPage({ onNotify }: { onNotify: (message: string) => void }) {
  return <PageFrame icon={Calculator} title="Produto 1" subtitle="Monte sua peça e descubra o preço ideal" action="Salvar" onAction={() => onNotify("Produto salvo") }><div className="pricing-grid"><div className="panel form-panel"><SectionTitle title="Produto 1" icon={Gem} /><div className="form-grid two"><Field label="Nome do Produto" placeholder="Ex: Porta-canetas personalizado" /><Field label="Quantidade" placeholder="1" /></div><Field label="Descrição / Especificações" placeholder="Detalhes, especificações, observações do produto..." area /><SectionTitle title="Modelagem e Impressão" icon={Printer} small /><div className="form-grid three"><Field label="Modelagem e Impressão" placeholder="Nenhum" select /><Field label="Geral (min)" placeholder="0" /><Field label="Por peça (min)" placeholder="0" /></div><div className="form-grid three"><Field label="Aquisição de Modelo (R$)" placeholder="0,00" /><Field label="Retrabalho (%)" placeholder="0" /><Field label="Urgência (%)" placeholder="0" /></div><div className="highlight-box"><SectionTitle title="Dados Unitários" icon={Calculator} small /><div className="form-grid four"><Field label="Tempo de Impressão" placeholder="Nenhum" select /><Field label="Dias" placeholder="0" /><Field label="Horas" placeholder="0" /><Field label="Minutos" placeholder="0" /></div><button className="secondary-button"><Plus size={14} /> Adicionar impressora</button></div></div><div className="pricing-side"><div className="panel form-panel"><SectionTitle title="Custos Gerais da Venda" icon={Boxes} /><div className="form-grid two"><Field label="Atendimento" placeholder="Nenhum" select /><Field label="Tempo (min)" placeholder="0" /></div><button className="secondary-button"><Plus size={14} /> Adicionar embalagem</button></div><div className="panel result-panel"><SectionTitle title="Resultado da Precificação" icon={ArrowUpRight} /><p className="subsection-label">Detalhamento de Custos</p><Metric label="Custo de Produção" value="R$ 0,00" /><Metric label="Custos Totais" value="R$ 0,00" danger /><div className="notice"><Wrench size={14} /> O custo está zerado, então a margem não altera o preço.</div><p className="subsection-label">Margem de Lucro Desejada</p><div className="profit-slider"><i /><b>50%</b></div><div className="slider-labels"><span>0%</span><span>50%</span><span>100%</span><span>150%</span></div></div></div></div></PageFrame>;
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
