import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/db'
import { conversations, messages } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const h = await headers()
  let session = await auth.api.getSession({ headers: h })
  if (!session) {
    const anon = await auth.api.signInAnonymous({ headers: h })
    if (!anon?.user) return NextResponse.json({ error: 'auth failed' }, { status: 401 })
    session = { user: anon.user } as any
  }

  const { searchParams } = new URL(req.url)
  const isAdmin = session?.user?.role?.toLowerCase() === 'admin'
  let convId = searchParams.get('conversationId')
  if (!isAdmin) {
    const conv = await db.select().from(conversations).where(eq(conversations.userId, session!.user!.id))
    if (conv.length === 0) return NextResponse.json({ messages: [] })
    convId = conv[0].id
  }
  if (!convId) return NextResponse.json({ error: 'conversationId requis' }, { status: 400 })
  const list = await db.select().from(messages).where(eq(messages.conversationId, convId))
  return NextResponse.json({ messages: list })
}
