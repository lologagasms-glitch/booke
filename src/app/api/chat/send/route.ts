import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/db'
import { conversations, messages, user } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  const h = await headers()
  let session = await auth.api.getSession({ headers: h })
  if (!session) {
    const anon = await auth.api.signInAnonymous({ headers: h })
    if (!anon?.user) return NextResponse.json({ error: 'auth failed' }, { status: 401 })
    session = { user: anon.user } as any
  }
  const body = await req.json()
  const content = String(body.content || body.message || '').trim()
  const targetConversationId = String(body.conversationId || '')
  const targetUserId = String(body.userId || '')
  if (!content) return NextResponse.json({ error: 'content requis' }, { status: 400 })

  const isAdmin = session?.user?.role?.toLowerCase() === 'admin'
  let conversationId = ''

  if (isAdmin) {
    if (!targetConversationId && !targetUserId) {
      return NextResponse.json({ error: 'conversationId ou userId requis' }, { status: 400 })
    }
    if (targetConversationId) {
      conversationId = targetConversationId
      const conv = await db.select().from(conversations).where(eq(conversations.id, conversationId))
      if (conv.length === 0) return NextResponse.json({ error: 'conversation introuvable' }, { status: 404 })
    } else {
      const existing = await db.select().from(conversations).where(eq(conversations.userId, targetUserId))
      if (existing.length === 0) {
        const created = await db.insert(conversations).values({ userId: targetUserId }).returning()
        conversationId = created[0].id
      } else {
        conversationId = existing[0].id
      }
    }
    await db.insert(messages).values({ conversationId, senderRole: 'ADMIN', content })
    await db.update(conversations).set({ lastMessageAt: new Date(), hasUnreadMessages: false }).where(eq(conversations.id, conversationId))
    return NextResponse.json({ success: true })
  } else {
    const userId = session!.user!.id
    const existing = await db.select().from(conversations).where(eq(conversations.userId, userId))
    if (existing.length === 0) {
      const created = await db.insert(conversations).values({ userId }).returning()
      conversationId = created[0].id
    } else {
      conversationId = existing[0].id
    }
    await db.insert(messages).values({ conversationId, senderRole: 'USER', content })
    await db.update(conversations).set({ lastMessageAt: new Date(), hasUnreadMessages: true }).where(eq(conversations.id, conversationId))
    return NextResponse.json({ success: true })
  }
}
