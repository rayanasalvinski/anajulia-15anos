"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
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
  ChevronDown,
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
const GOOGLE_FORM_ENTRY_ACOMPANHANTES_ADULTOS = "entry.1135942399"
const GOOGLE_FORM_ENTRY_ACOMPANHANTES_CRIANCAS = "entry.57422357"

const GOOGLE_FORM_TARGET_FRAME = "google-forms-hidden-frame"

/**
 * Envia a confirmação para o Google Forms de forma silenciosa (sem redirecionar o usuário).
 * Cria um formulário HTML de verdade e o envia mirando num iframe escondido — é exatamente o
 * mesmo mecanismo de um envio manual do formulário, o método mais confiável que existe pra isso.
 */
function registrarConfirmacaoNoFormulario(nome: string, acompanhantesAdultos: string, acompanhantesCriancas: string) {
  try {
    const form = document.createElement("form")
    form.action = GOOGLE_FORM_ACTION
    form.method = "POST"
    form.target = GOOGLE_FORM_TARGET_FRAME
    form.style.display = "none"

    const campos: Record<string, string> = {
      [GOOGLE_FORM_ENTRY_NOME]: nome,
      [GOOGLE_FORM_ENTRY_ACOMPANHANTES_ADULTOS]: acompanhantesAdultos,
      [GOOGLE_FORM_ENTRY_ACOMPANHANTES_CRIANCAS]: acompanhantesCriancas,
    }

    Object.entries(campos).forEach(([name, value]) => {
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = name
      input.value = value
      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()
    setTimeout(() => form.remove(), 3000)
  } catch (error) {
    // Mesmo que o registro falhe, não bloqueia a confirmação via WhatsApp
    console.error("Não foi possível registrar a confirmação no formulário:", error)
  }
}

/* ---------- Indicador de "role para baixo" (mobile) ---------- */
function ScrollHint() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 30) setVisible(false)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center sm:hidden">
      <div className="animate-bounce rounded-full bg-brand p-2 shadow-lg shadow-brand/40 ring-4 ring-white/60">
        <ChevronDown className="size-5 text-white" strokeWidth={3} />
      </div>
    </div>
  )
}

/* ---------- Player de música (Spotify, visível + controlável) ---------- */
const SPOTIFY_TRACK_URI = "spotify:track:2yKqqZQOYhzAfmU0ye6tVQ"

function MusicPlayer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<any>(null)
  const [ready, setReady] = useState(false)

  // Cria o player oficial do Spotify DENTRO do próprio contêiner visível (mesmo lugar de sempre)
  useEffect(() => {
    const w = window as any

    function setup(IFrameAPI: any) {
      if (!containerRef.current) return
      IFrameAPI.createController(
        containerRef.current,
        { uri: SPOTIFY_TRACK_URI, width: "100%", height: "80" },
        (EmbedController: any) => {
          controllerRef.current = EmbedController
          setReady(true)
        },
      )
    }

    if (w.Spotify?.Embed) {
      setup(w.Spotify.Embed)
    } else {
      w.onSpotifyIframeApiReady = setup
      if (!document.getElementById("spotify-iframe-api")) {
        const script = document.createElement("script")
        script.id = "spotify-iframe-api"
        script.src = "https://open.spotify.com/embed/iframe-api/v1"
        script.async = true
        document.body.appendChild(script)
      }
    }
  }, [])

  // No primeiro toque em qualquer lugar da página (inclusive nos botões), a música começa sozinha
  useEffect(() => {
    if (!ready) return
    const tryPlay = () => {
      try {
        controllerRef.current?.play()
      } catch (error) {
        console.error("Não foi possível iniciar a música automaticamente:", error)
      }
    }
    document.addEventListener("click", tryPlay, { once: true, capture: true })
    document.addEventListener("touchstart", tryPlay, { once: true, capture: true })
    return () => {
      document.removeEventListener("click", tryPlay, { capture: true })
      document.removeEventListener("touchstart", tryPlay, { capture: true })
    }
  }, [ready])

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[420px] px-3 pb-3">
      <div
        ref={containerRef}
        style={{ borderRadius: 14, minHeight: 80, overflow: "hidden" }}
        className="shadow-lg shadow-black/20"
      />
    </div>
  )
}

export function BirthdayInvite() {
  const [view, setView] = useState<View>("home")

  const navigate = (v: View) => {
    setView(v)
    window.scrollTo(0, 0)
  }

  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-[radial-gradient(circle_at_50%_0%,oklch(0.6_0.2_352),oklch(0.35_0.18_353))] p-0 sm:p-6">
      <ScrollHint key={view} />
      <MusicPlayer />
      <iframe
        name="google-forms-hidden-frame"
        title="Envio de confirmação"
        style={{ display: "none" }}
      />
      {/* Moldura do celular */}
      <div className="relative flex w-full max-w-[420px] flex-col overflow-hidden bg-card shadow-[0_25px_80px_-20px_rgba(150,0,80,0.6)] sm:rounded-[2.75rem] sm:border-[10px] sm:border-neutral-900">
        {/* Fundo glitter */}
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center opacity-90"
          style={{ backgroundImage: "url(/glitter-pink-bg.png)" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_bottom,oklch(0.98_0.02_350/0.35),oklch(0.98_0.02_350/0.55)_45%,oklch(0.98_0.02_350/0.85))]"
          aria-hidden="true"
        />

        {/* Conteúdo */}
        <div className="relative z-10 flex min-h-dvh flex-col px-6 pb-24 pt-6 sm:pb-24 sm:pt-10 sm:min-h-[780px]">
          {view === "home" && <HomeView onNavigate={navigate} />}
          {view === "localizacao" && <LocalizacaoView onBack={() => navigate("home")} />}
          {view === "presenca" && <PresencaView onBack={() => navigate("home")} />}
          {view === "presente" && <PresenteView onBack={() => navigate("home")} />}
        </div>
      </div>
    </main>
  )
}

/* ---------- Cabeçalho reutilizável ---------- */
function InviteHeader() {
  return (
    <header className="text-center">
      <p
        className="font-serif text-6xl sm:text-8xl font-bold text-brand"
        style={{ textShadow: "0 2px 10px oklch(0.98 0.02 350 / 0.9)" }}
      >
        15 anos
      </p>
      <h1
        className="mt-1 font-script text-5xl sm:text-7xl leading-tight text-brand-deep"
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
          style={{ textShadow: "0 0 14px rgba(255,255,255,0.95), 0 0 5px rgba(255,255,255,0.9), 0 2px 6px rgba(120,0,60,0.35)" }}
        >
          15 anos
        </p>
        <p
          className="font-script text-4xl leading-tight text-brand-deep"
          style={{ textShadow: "0 0 14px rgba(255,255,255,0.95), 0 0 5px rgba(255,255,255,0.9), 0 2px 6px rgba(120,0,60,0.35)" }}
        >
          {FESTA.nome}
        </p>
        <h2
          className="mt-2 font-serif text-2xl font-bold text-foreground"
          style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 1px 4px rgba(120,0,60,0.25)" }}
        >
          {title}
        </h2>
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
  const [acompanhantesAdultos, setAcompanhantesAdultos] = useState("0")
  const [acompanhantesCriancas, setAcompanhantesCriancas] = useState("0")
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Registra a confirmação na planilha (via Google Forms) em paralelo, sem travar o fluxo
    registrarConfirmacaoNoFormulario(nome, acompanhantesAdultos, acompanhantesCriancas)

    const texto = `Olá! Confirmo presença nos 15 anos da ${FESTA.nome}.%0ANome: ${nome}%0AAcompanhantes adultos: ${acompanhantesAdultos}%0ACrianças até 10 anos: ${acompanhantesCriancas}`
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
            <label htmlFor="acompanhantesAdultos" className="text-sm font-semibold text-brand-deep">
              Acompanhantes adultos
            </label>
            <select
              id="acompanhantesAdultos"
              value={acompanhantesAdultos}
              onChange={(e) => setAcompanhantesAdultos(e.target.value)}
              className="rounded-xl border border-border bg-surface/90 px-4 py-3 text-sm text-brand-deep outline-none backdrop-blur-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
            >
              {["0", "1", "2", "3", "4"].map((n) => (
                <option key={n} value={n}>
                  {n === "0" ? "Nenhum" : `${n} adulto${n === "1" ? "" : "s"}`}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="acompanhantesCriancas" className="text-sm font-semibold text-brand-deep">
              Crianças até 10 anos
            </label>
            <select
              id="acompanhantesCriancas"
              value={acompanhantesCriancas}
              onChange={(e) => setAcompanhantesCriancas(e.target.value)}
              className="rounded-xl border border-border bg-surface/90 px-4 py-3 text-sm text-brand-deep outline-none backdrop-blur-sm transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
            >
              {["0", "1", "2", "3", "4"].map((n) => (
                <option key={n} value={n}>
                  {n === "0" ? "Nenhuma" : `${n} criança${n === "1" ? "" : "s"}`}
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
