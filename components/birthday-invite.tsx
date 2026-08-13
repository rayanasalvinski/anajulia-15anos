"use client"

import type React from "react"
import { useState } from "react"
import {
  MapPin,
  Gift,
  MessageCircle,
  ArrowLeft,
  Check,
  Share2,
  Shirt,
  Footprints,
  SprayCan,
  Gem,
  Palette,
  Ticket,
  CalendarHeart,
  Clock,
} from "lucide-react"

type View = "home" | "localizacao" | "presenca" | "presente"

const FESTA = {
  nome: "Ana Julia",
  diaSemana: "Sábado",
  mes: "Outubro",
  dia: "10",
  hora: "19h",
  ano: "2026",
  local: "Salão das Araucárias II",
  endereco: "Col. Taquaral — São Mateus do Sul — PR",
  cidade: "CEP 83900-000",
  mapsQuery: "Salão das Araucárias II, Colônia Taquaral, São Mateus do Sul, PR, 83900-000",
  whatsapp: "5542999967306",
  traje: "Esporte Fino",
  avisoTraje: "Por favor, evite roupas na cor rosa.",
  confirmarAte: "01/10/2026",
}

// Formulário do Google que registra a lista de confirmados numa planilha
const GOOGLE_FORM_ID = "1FAIpQLSd1LKf48OipATQR1lpz_yKTIFvsyw35II-QiJMdOFKC00oDoA"
const GOOGLE_FORM_ACTION = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`
const GOOGLE_FORM_ENTRY_NOME = "entry.442733613"
const GOOGLE_FORM_ENTRY_ACOMPANHANTES = "entry.1135942399"

/**
 * Envia a confirmação para o Google Forms de forma silenciosa (sem redirecionar o usuário).
 * Usa modo "no-cors" porque o Google Forms não retorna cabeçalhos CORS, mas o envio funciona normalmente.
 */
async function registrarConfirmacaoNoFormulario(nome: string, acompanhantes: string) {
  try {
    const dados = new URLSearchParams()
    dados.append(GOOGLE_FORM_ENTRY_NOME, nome)
    // O campo "Acompanhantes" no formulário aceita resposta livre via "outra opção"
    dados.append(GOOGLE_FORM_ENTRY_ACOMPANHANTES, "__other_option__")
    dados.append(`${GOOGLE_FORM_ENTRY_ACOMPANHANTES}.other_option_response`, acompanhantes)

    await fetch(GOOGLE_FORM_ACTION, {
      method: "POST",
      mode: "no-cors",
      body: dados,
    })
  } catch (error) {
    // Mesmo que o registro falhe, não bloqueia a confirmação via WhatsApp
    console.error("Não foi possível registrar a confirmação no formulário:", error)
  }
}

export function BirthdayInvite() {
  const [view, setView] = useState<View>("home")

  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-[radial-gradient(circle_at_50%_0%,oklch(0.6_0.2_352),oklch(0.35_0.18_353))] p-0 sm:p-6">
      {/* Moldura do celular */}
      <div className="relative flex w-full max-w-[420px] flex-col overflow-hidden bg-card shadow-[0_25px_80px_-20px_rgba(150,0,80,0.6)] sm:rounded-[2.75rem] sm:border-[10px] sm:border-neutral-900">
        {/* Fundo glitter */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90"
          style={{ backgroundImage: "url(/glitter-pink-bg.png)" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_bottom,oklch(0.98_0.02_350/0.35),oklch(0.98_0.02_350/0.55)_45%,oklch(0.98_0.02_350/0.85))]"
          aria-hidden="true"
        />

        {/* Conteúdo */}
        <div className="relative z-10 flex min-h-dvh flex-col px-6 pb-4 pt-6 sm:pb-6 sm:pt-10 sm:min-h-[780px]">
          {view === "home" && <HomeView onNavigate={setView} />}
          {view === "localizacao" && <LocalizacaoView onBack={() => setView("home")} />}
          {view === "presenca" && <PresencaView onBack={() => setView("home")} />}
          {view === "presente" && <PresenteView onBack={() => setView("home")} />}
        </div>
      </div>
    </main>
  )
}

/* ---------- Cabeçalho reutilizável ---------- */
function InviteHeader() {
  return (
    <header className="text-center">
      <div className="flex items-end justify-center gap-2">
        <span
          className="font-serif text-6xl sm:text-8xl font-black leading-none text-brand"
          style={{ textShadow: "0 4px 16px oklch(0.42 0.2 355 / 0.55)" }}
        >
          15
        </span>
        <span
          className="mb-1 font-script text-3xl sm:text-4xl leading-none text-brand-deep"
          style={{ textShadow: "0 2px 8px oklch(0.98 0.02 350 / 0.9)" }}
        >
          anos
        </span>
      </div>
      <h1
        className="mt-1 font-script text-4xl sm:text-6xl leading-tight text-brand-deep"
        style={{ textShadow: "0 2px 10px oklch(0.98 0.02 350 / 0.9)" }}
      >
        {FESTA.nome}
      </h1>
    </header>

  )
}

/* ---------- Tela inicial ---------- */
function HomeView({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <InviteHeader />

      <div className="mt-3 sm:mt-6 space-y-2 sm:space-y-3 text-center">
        <p className="text-pretty text-sm font-medium leading-relaxed text-brand-deep">
          Para viver as emoções deste dia tão importante, quero estar ao lado de pessoas especiais como você!
        </p>
        <p
          className="font-serif text-base sm:text-lg font-bold text-brand-deep"
          style={{ textShadow: "0 1px 6px oklch(0.98 0.02 350 / 0.8)" }}
        >
          Conto com a sua presença!
        </p>
      </div>

      {/* Data */}
      <div className="mx-auto mt-4 sm:mt-6 flex items-stretch gap-3 rounded-2xl border border-border bg-surface/90 px-4 py-2.5 sm:py-3 shadow-md shadow-brand/10 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center pr-3 text-right">
          <span className="text-[0.7rem] font-bold uppercase tracking-widest text-brand-deep">{FESTA.diaSemana}</span>
        </div>
        <div className="flex flex-col items-center justify-center border-x border-border px-4">
          <span className="font-serif text-4xl sm:text-5xl font-bold leading-none text-brand">{FESTA.dia}</span>
          <span className="mt-1 text-[0.7rem] font-bold uppercase tracking-widest text-brand-deep">{FESTA.mes}</span>
        </div>
        <div className="flex flex-col items-center justify-center pl-3">
          <span className="text-[0.7rem] font-bold uppercase tracking-widest text-brand-deep">Às</span>
          <span className="text-lg font-bold text-brand-deep">{FESTA.hora}</span>
        </div>
      </div>

      {/* Traje e avisos */}
      <div className="mx-auto mt-3 sm:mt-4 w-full space-y-1.5 rounded-2xl border border-border bg-surface/90 px-4 py-2.5 sm:py-3 text-center backdrop-blur-sm">
        <p className="text-sm font-semibold text-brand-deep">
          Traje: <span className="text-brand">{FESTA.traje}</span>
        </p>
        <p className="text-xs font-medium text-brand-deep">{FESTA.avisoTraje}</p>
        <p className="text-xs font-medium text-brand-deep/70">Confirme sua presença até {FESTA.confirmarAte}</p>
      </div>

      {/* Botões */}
      <div className="mt-4 sm:mt-8 flex flex-col gap-2 sm:gap-3">
        <ActionButton icon={<MapPin className="size-5" />} label="Localização" onClick={() => onNavigate("localizacao")} />
        <ActionButton
          icon={<MessageCircle className="size-5" />}
          label="Confirmar Presença"
          onClick={() => onNavigate("presenca")}
        />
        <ActionButton
          icon={<Gift className="size-5" />}
          label="Sugestão de Presente"
          onClick={() => onNavigate("presente")}
        />
      </div>

      <p className="mt-2 sm:mt-4 text-center text-xs text-muted-foreground">Clique nos botões para interagir</p>

      <footer className="mt-auto flex items-center justify-center gap-2 border-t border-border pt-2 sm:pt-4 text-xs text-muted-foreground">
        <Share2 className="size-3.5" />
        <span>Compartilhe este convite</span>
      </footer>
    </div>
  )
}

/* ---------- Botão principal ---------- */
function ActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-full bg-brand-soft px-6 py-3 sm:py-3.5 text-brand-deep shadow-md shadow-brand/20 transition-all duration-200 hover:brightness-105 active:scale-[0.98]"
    >
      <span className="grid size-9 place-items-center rounded-full bg-surface text-brand transition-transform group-hover:scale-110">
        {icon}
      </span>
      <span className="text-sm font-bold uppercase tracking-wider">{label}</span>
    </button>
  )
}

/* ---------- Cabeçalho de sub-tela ---------- */
function SubHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-card/70 px-3 py-1.5 text-sm font-medium text-brand-deep backdrop-blur-sm transition-colors hover:bg-card"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </button>
      <div className="text-center">
        <p
          className="font-serif text-3xl font-bold text-brand"
          style={{ textShadow: "0 2px 10px oklch(0.98 0.02 350 / 0.9)" }}
        >
          15 anos
        </p>
        <p
          className="font-script text-4xl leading-tight text-brand-deep"
          style={{ textShadow: "0 2px 8px oklch(0.98 0.02 350 / 0.9)" }}
        >
          {FESTA.nome}
        </p>
        <h2 className="mt-2 font-serif text-2xl font-bold text-foreground">{title}</h2>
        <div className="mx-auto mt-1 h-px w-24 bg-border" />
      </div>
    </div>
  )
}

/* ---------- Tela: Localização ---------- */
function LocalizacaoView({ onBack }: { onBack: () => void }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(FESTA.mapsQuery)}`
  return (
    <div className="flex flex-1 flex-col">
      <SubHeader title="Localização" onBack={onBack} />

      <div className="rounded-2xl border border-border bg-surface/90 p-6 text-center shadow-md shadow-brand/10 backdrop-blur-sm">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-surface text-brand shadow-sm ring-1 ring-border">
          <MapPin className="size-7" />
        </div>
        <p className="mt-4 font-serif text-xl font-bold text-brand-deep">{FESTA.local}</p>
        <p className="mt-1 text-sm font-medium text-brand-deep">{FESTA.endereco}</p>
        <p className="text-sm font-medium text-brand-deep">{FESTA.cidade}</p>

        <div className="mt-4 flex items-center justify-center gap-4 text-sm font-semibold text-brand-deep">
          <span className="inline-flex items-center gap-1">
            <CalendarHeart className="size-4 text-brand" /> {FESTA.dia}/10/{FESTA.ano}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-4 text-brand" /> {FESTA.hora}
          </span>
        </div>
      </div>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-soft px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-deep shadow-md shadow-brand/20 transition-all hover:brightness-105 active:scale-[0.98]"
      >
        <MapPin className="size-5 text-brand" />
        Abrir no Google Maps
      </a>
    </div>
  )
}

/* ---------- Tela: Confirmação de Presença ---------- */
function PresencaView({ onBack }: { onBack: () => void }) {
  const [nome, setNome] = useState("")
  const [acompanhantes, setAcompanhantes] = useState("0")
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Registra a confirmação na planilha (via Google Forms) em paralelo, sem travar o fluxo
    registrarConfirmacaoNoFormulario(nome, acompanhantes)

    const texto = `Olá! Confirmo presença nos 15 anos da ${FESTA.nome}.%0ANome: ${nome}%0AAcompanhantes: ${acompanhantes}`
    window.open(`https://wa.me/${FESTA.whatsapp}?text=${texto}`, "_blank")
    setEnviado(true)
  }

  return (
    <div className="flex flex-1 flex-col">
      <SubHeader title="Confirmar Presença" onBack={onBack} />

      {enviado ? (
        <div className="rounded-2xl border border-border bg-surface/90 p-8 text-center shadow-md shadow-brand/10 backdrop-blur-sm">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-surface text-brand shadow-sm ring-1 ring-border">
            <Check className="size-7" />
          </div>
          <p className="mt-4 font-serif text-xl font-bold text-brand-deep">Presença confirmada!</p>
          <p className="mt-2 text-sm font-medium text-brand-deep">
            Obrigada, {nome || "convidado(a)"}! Estamos muito felizes por ter você conosco.
          </p>
          <button
            type="button"
            onClick={() => setEnviado(false)}
            className="mt-4 text-sm font-medium text-brand underline underline-offset-4"
          >
            Enviar outra confirmação
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="rounded-xl border border-border bg-surface/90 px-4 py-2.5 text-center text-xs font-medium text-brand-deep backdrop-blur-sm">
            Confirme sua presença até {FESTA.confirmarAte}
          </p>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="nome" className="text-sm font-semibold text-brand-deep">
              Seu nome
            </label>
            <input
              id="nome"
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome completo"
              className="rounded-xl border border-border bg-surface/90 px-4 py-3 text-sm text-brand-deep outline-none backdrop-blur-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="acompanhantes" className="text-sm font-semibold text-brand-deep">
              Acompanhantes
            </label>
            <select
              id="acompanhantes"
              value={acompanhantes}
              onChange={(e) => setAcompanhantes(e.target.value)}
              className="rounded-xl border border-border bg-surface/90 px-4 py-3 text-sm text-brand-deep outline-none backdrop-blur-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
            >
              {["0", "1", "2", "3", "4"].map((n) => (
                <option key={n} value={n}>
                  {n === "0" ? "Somente eu" : `${n} acompanhante${n === "1" ? "" : "s"}`}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-brand-soft px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-deep shadow-md shadow-brand/20 transition-all hover:brightness-105 active:scale-[0.98]"
          >
            <MessageCircle className="size-5 text-brand" />
            Confirmar via WhatsApp
          </button>
        </form>
      )}
    </div>
  )
}

/* ---------- Tela: Sugestão de Presente ---------- */
const PRESENTES = [
  { icon: <Shirt className="size-5" />, titulo: "Vestuário", detalhe: "Tamanho 36 adulto" },
  { icon: <Footprints className="size-5" />, titulo: "Calçados", detalhe: "Tamanho 37" },
  { icon: <Gem className="size-5" />, titulo: "Acessórios", detalhe: "Dourados" },
  { icon: <SprayCan className="size-5" />, titulo: "Perfumes e Cosméticos", detalhe: "Florais e adocicados" },
  { icon: <Palette className="size-5" />, titulo: "Maquiagem", detalhe: "" },
  { icon: <Ticket className="size-5" />, titulo: "Vale-presente", detalhe: "" },
]

function PresenteView({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <SubHeader title="Sugestão de Presente" onBack={onBack} />

      <ul className="flex flex-col gap-3">
        {PRESENTES.map((p) => (
          <li
            key={p.titulo}
            className="flex items-center gap-4 rounded-full bg-brand-soft px-5 py-3 text-brand-deep shadow-md shadow-brand/20"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface text-brand">{p.icon}</span>
            <div className="min-w-0">
              <p className="font-serif text-base font-bold leading-tight">{p.titulo}</p>
              {p.detalhe && <p className="truncate text-xs font-medium text-brand-deep/80">{p.detalhe}</p>}
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center text-sm font-medium leading-relaxed text-brand-deep">
        Sua presença já é o maior presente. Mas se quiser mimar a aniversariante, aqui vão algumas ideias com carinho.
      </p>
    </div>
  )
}
