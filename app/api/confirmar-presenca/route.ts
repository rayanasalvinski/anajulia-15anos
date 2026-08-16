import { NextRequest, NextResponse } from "next/server"

const GOOGLE_FORM_ID = "1FAIpQLSd1LKf48OipATQR1lpz_yKTIFvsyw35II-QiJMdOFKC00oDoA"
const GOOGLE_FORM_VIEW_URL = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform`
const GOOGLE_FORM_ACTION = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`
const GOOGLE_FORM_ENTRY_NOME = "entry.442733613"
const GOOGLE_FORM_ENTRY_ACOMPANHANTES_ADULTOS = "entry.1135942399"
const GOOGLE_FORM_ENTRY_ACOMPANHANTES_CRIANCAS = "entry.57422357"

export async function POST(request: NextRequest) {
  try {
    const { nome, acompanhantesAdultos, acompanhantesCriancas } = await request.json()

    // 1) Carrega a página real do formulário para obter o token de sessão (fbzx) e os cookies,
    //    exatamente como acontece quando alguém abre o formulário no navegador.
    const paginaForm = await fetch(GOOGLE_FORM_VIEW_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      },
    })
    const html = await paginaForm.text()

    const fbzxMatch = html.match(/name="fbzx" value="(-?\d+)"/) ?? html.match(/"fbzx","(-?\d+)"/)
    const fbzx = fbzxMatch?.[1] ?? ""

    const cookies = paginaForm.headers.get("set-cookie") ?? ""

    // 2) Envia a resposta usando o mesmo token e cookies obtidos acima.
    const dados = new URLSearchParams()
    dados.append(GOOGLE_FORM_ENTRY_NOME, String(nome ?? ""))
    dados.append(GOOGLE_FORM_ENTRY_ACOMPANHANTES_ADULTOS, String(acompanhantesAdultos ?? "0"))
    dados.append(GOOGLE_FORM_ENTRY_ACOMPANHANTES_CRIANCAS, String(acompanhantesCriancas ?? "0"))
    if (fbzx) dados.append("fbzx", fbzx)
    dados.append("pageHistory", "0")

    const resposta = await fetch(GOOGLE_FORM_ACTION, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        ...(cookies ? { Cookie: cookies } : {}),
      },
      body: dados.toString(),
      redirect: "manual",
    })

    // O Google responde com um redirect (302) em envios bem-sucedidos, ou 200 com o form de novo se algo faltou.
    const sucesso = resposta.status === 200 || resposta.status === 302
    if (!sucesso) {
      console.error("Google Forms respondeu com status inesperado:", resposta.status)
      return NextResponse.json({ ok: false }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Erro ao registrar confirmação no Google Forms:", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
