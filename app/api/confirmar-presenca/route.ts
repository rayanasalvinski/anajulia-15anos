import { NextRequest, NextResponse } from "next/server"

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwcjFlSuFkfUKW1c4XdbJVNeJD0TciyeZp9ddrnSjbPIvvB2xRBwVmIPqo5QzcAv4An/exec"

export async function POST(request: NextRequest) {
  try {
    const { nome, acompanhantesAdultos, acompanhantesCriancas } = await request.json()

    const resposta = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: String(nome ?? ""),
        acompanhantesAdultos: String(acompanhantesAdultos ?? "0"),
        acompanhantesCriancas: String(acompanhantesCriancas ?? "0"),
      }),
      redirect: "follow",
    })

    if (!resposta.ok) {
      console.error("Apps Script respondeu com status inesperado:", resposta.status)
      return NextResponse.json({ ok: false }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Erro ao registrar confirmação na planilha:", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
