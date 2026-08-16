import { NextRequest, NextResponse } from "next/server"

const GOOGLE_FORM_ID = "1FAIpQLSd1LKf48OipATQR1lpz_yKTIFvsyw35II-QiJMdOFKC00oDoA"
const GOOGLE_FORM_ACTION = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`
const GOOGLE_FORM_ENTRY_NOME = "entry.442733613"
const GOOGLE_FORM_ENTRY_ACOMPANHANTES_ADULTOS = "entry.1135942399"
const GOOGLE_FORM_ENTRY_ACOMPANHANTES_CRIANCAS = "entry.57422357"

export async function POST(request: NextRequest) {
  try {
    const { nome, acompanhantesAdultos, acompanhantesCriancas } = await request.json()

    const dados = new URLSearchParams()
    dados.append(GOOGLE_FORM_ENTRY_NOME, String(nome ?? ""))
    dados.append(GOOGLE_FORM_ENTRY_ACOMPANHANTES_ADULTOS, String(acompanhantesAdultos ?? "0"))
    dados.append(GOOGLE_FORM_ENTRY_ACOMPANHANTES_CRIANCAS, String(acompanhantesCriancas ?? "0"))

    const resposta = await fetch(GOOGLE_FORM_ACTION, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: dados.toString(),
    })

    // O Google Forms responde com um HTML de confirmação (não JSON), então só validamos o status.
    if (!resposta.ok) {
      console.error("Google Forms respondeu com status", resposta.status)
      return NextResponse.json({ ok: false }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Erro ao registrar confirmação no Google Forms:", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
