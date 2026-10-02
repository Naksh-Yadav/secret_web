import { NextResponse } from 'next/server'

const events = new Set(['EXPERIENCE_STARTED','IDENTITY_CONFIRMED','FIRST_CLUE_FOUND','PUZZLE_SOLVED','CHAOS_ROOM_ENTERED','SECRET_FOUND','MEMORY_OPENED','PACKAGE_OPENED','LETTER_OPENED','VOICE_COMPLETED','FINAL_REVEAL_REACHED','EXPERIENCE_COMPLETED','SECRET_ENDING','ULTRA_SECRET_ENDING'])

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!events.has(body?.event) || typeof body?.stage !== 'string' || typeof body?.sessionId !== 'string' || body.sessionId.length > 100) return NextResponse.json({ ok: false }, { status: 400 })
    const webhook = process.env.DISCORD_WEBHOOK_URL
    if (webhook) await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: `🕵️ EXPERIENCE UPDATE\n**${body.event}**\nStage: ${body.stage}\nSession: ${body.sessionId.slice(0, 8)}…${body.context ? `\nContext: ${JSON.stringify(body.context).slice(0, 200)}` : ''}` }) })
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ ok: true }) }
}
