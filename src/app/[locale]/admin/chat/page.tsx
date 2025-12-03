'use client'

import { useEffect, useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TransletText } from '@/app/lib/services/translation/transletText'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'

export default function AdminChatPage() {
  const [current, setCurrent] = useState<any | null>(null)
  const [input, setInput] = useState('')
  const socketRef = useRef<any>(null)
  const queryClient = useQueryClient()

  const { data: sessions = [] } = useQuery({
    queryKey: ['adminSessions'],
    queryFn: async () => {
      const res = await fetch('/api/messages?list=1')
      const data = await res.json()
      return data.sessions || []
    },
  })

  const { data: messages = [] } = useQuery({
    queryKey: ['adminMessages', current?.id],
    queryFn: async () => {
      if (!current) return []
      const res = await fetch(`/api/messages?sessionId=${current.id}`)
      const data = await res.json()
      return (data.messages || []).reverse()
    },
    enabled: !!current,
  })

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!current || !input) return
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: current.email || '', sessionId: current.id, message: input, from: 'admin' }),
      })
      if (socketRef.current) socketRef.current.emit('admin:reply', { email_hash: current.emailHash, message: input })
    },
    onSuccess: () => {
      queryClient.setQueryData(['adminMessages', current?.id], (old: any[]) => [
        ...old,
        { id: crypto.randomUUID(), from: 'admin', message: input, timestamp: new Date(), status: 'sent' },
      ])
      setInput('')
    },
  })

  useEffect(() => {
    ;(async () => {
      const mod = await import('socket.io-client') as any
      const url = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000'
      socketRef.current = mod.io(url + '/chat')
    })()
  }, [])

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    sendMutation.mutate()
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 border rounded-xl bg-white">
        <div className="p-4 font-semibold"><TransletText>Conversations</TransletText></div>
        <div className="divide-y max-h-[60vh] overflow-y-auto">
          {sessions.map((s: any) => (
            <button key={s.id} onClick={() => setCurrent(s)} className={`w-full text-left p-4 ${current?.id === s.id ? 'bg-blue-50' : ''}`}>
              <div className="text-sm">{s.email || s.emailHash.slice(0,8)}</div>
              <div className="text-xs text-gray-500">{new Date(s.lastActiveAt).toLocaleString()}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="md:col-span-2 border rounded-xl bg-white flex flex-col">
        <div className="p-4 border-b">
          <div className="font-semibold">{current ? (current.email || current.emailHash.slice(0,8)) : ''}</div>
        </div>
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {messages.map((m: any) => (
            <div key={m.id} className={`flex ${m.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded-2xl shadow ${m.from === 'admin' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                <div>{m.message}</div>
                <div className="text-[10px] opacity-70 mt-1">{new Date(m.timestamp).toLocaleTimeString()} • {m.status}</div>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={send} className="p-4 flex items-center gap-2 border-t">
          <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded-xl px-3 py-2" />
          <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white flex items-center gap-2">
            <PaperAirplaneIcon className="w-5 h-5" />
            <TransletText>Envoyer</TransletText>
          </button>
        </form>
      </div>
    </div>
  )
}
