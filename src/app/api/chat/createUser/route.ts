"use server"
import { signinWorker } from '@/components/signAnonymous/signinWorker';
import { NextRequest, NextResponse } from 'next/server';
import { start } from "workflow/api";

export async function POST(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  try {
     await start(signinWorker, [userId]);
   
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
