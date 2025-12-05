import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/db'
import { conversations, user } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const h = await headers()
  const session = await auth.api.getSession({ headers: h })
  const isAdmin = session?.user?.role?.toLowerCase() === 'admin'
  if (!isAdmin) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const rows = await db.select().from(conversations).orderBy(desc(conversations.hasUnreadMessages), desc(conversations.lastMessageAt))
  const result = await Promise.all(rows.map(async (c) => {
    const users = await db.select().from(user).where(eq(user.id, c.userId))
    return { ...c, user: users[0] }
  }))
  return NextResponse.json({ conversations: result })
}

