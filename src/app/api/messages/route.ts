import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { eq, desc } from 'drizzle-orm'
import { chatMessages, chatSessions } from '@/db/schema'
import crypto from 'crypto'
import { getIO } from '@/server/socket'
import nodemailer from 'nodemailer'

function hashEmail(email: string) {
  return crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex')
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('sessionId')
  const list = searchParams.get('list')
  if (list === '1') {
    const sessions = await db.select().from(chatSessions).orderBy(desc(chatSessions.lastActiveAt))
    return NextResponse.json({ sessions })
  }
  if (!sessionId) return NextResponse.json({ error: 'sessionId requis' }, { status: 400 })
  const messages = await db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId)).orderBy(desc(chatMessages.timestamp))
  return NextResponse.json({ messages })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const email = String(body.email || '')
  const sessionId = String(body.sessionId || '') || crypto.randomUUID()
  const text = String(body.message || '')
  const from = (body.from === 'admin' ? 'admin' : 'user') as 'user' | 'admin'
  if (!email || !text) return NextResponse.json({ error: 'email et message requis' }, { status: 400 })

  const emailHash = hashEmail(email)
  const now = new Date()
  const io = getIO()

  const existing = await db.select().from(chatSessions).where(eq(chatSessions.id, sessionId))
  if (existing.length === 0) {
    await db.insert(chatSessions).values({ id: sessionId, emailHash, email, createdAt: now, lastActiveAt: now, online: true })
  } else {
    await db.update(chatSessions).set({ lastActiveAt: now, online: true }).where(eq(chatSessions.id, sessionId))
  }

  const id = crypto.randomUUID()
  await db.insert(chatMessages).values({ id, sessionId, emailHash, from, message: text, status: 'sent', timestamp: now })

  io.of('/chat').emit(from === 'user' ? 'user:message' : 'admin:reply', { id, sessionId, email_hash: emailHash, message: text, timestamp: now })
  io.of('/chat').emit('message:delivered', { id })

  if (from === 'admin') {
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_ZOHO_FROM || '',
        pass: process.env.PASSWORD_MAIL_APP_ZOHO || '',
      },
    })
    const to = email
    await transporter.sendMail({
      from: process.env.MAIL_ZOHO_FROM || '',
      to,
      subject: 'Réponse au chat',
      html: `<p>${text}</p>`,
    })
  }

  return NextResponse.json({ success: true, id })
}

