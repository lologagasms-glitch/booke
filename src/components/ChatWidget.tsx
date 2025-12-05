'use client'

import { useEffect, useRef, useState } from 'react'
import { TransletText } from '@/app/lib/services/translation/transletText'
import { ChatBubbleBottomCenterTextIcon, XMarkIcon, PaperAirplaneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authClient, useSession } from '@/app/lib/auth-client'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const listRef = useRef<HTMLDivElement>(null)
  const {data:session}=useSession()
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['chat-getMessages'],
    queryFn: async () => {
      const res = await fetch('/api/chat/getMessages')
      const json = await res.json()
      return json.messages || []
    },
    refetchInterval: open ? 4000 : false,
    enabled: open,
  })
  useEffect(() => { if (data) setMessages(data) }, [data])

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages])

  const mutation = useMutation({
    mutationFn: async (payload: { content: string }) => {
      const res = await fetch('/api/chat/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('send failed')
      return res.json()
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['chat-getMessages'] }) },
  })
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    if (!session) {
      await authClient.signIn.anonymous()
    }
    mutation.mutate({ content: input.trim() })
    setInput('')
  }

  return (
    <>
      {/* Floating trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative flex items-center gap-3 group">
          <span className="hidden sm:block bg-black/60 text-white text-xs px-4 py-2 rounded-full shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <TransletText>Besoin d'aide ?</TransletText>
          </span>
          <button
            aria-label="Ouvrir le chat"
            onClick={() => setOpen(true)}
            className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-500 text-white shadow-2xl hover:shadow-yellow-500/40 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <span className="absolute inset-0 rounded-2xl animate-pulse bg-yellow-400/20" />
            <ChatBubbleBottomCenterTextIcon className="w-7 h-7 relative z-10" />
          </button>
        </div>
      </div>

      {/* Chat drawer */}
      <div
        className={[
          'fixed inset-y-0 right-0 z-50 flex flex-col',
          'w-full sm:w-[24rem]',
          'bg-white backdrop-blur-2xl',
          'border-l border-gray-200',
          'shadow-2xl shadow-yellow-900/10',
          'rounded-l-3xl',
          'transform transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          open ? 'translate-x-0' : 'translate-x-full',
          'h-screen'
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-drawer-title"
      >
        {/* Header */}
        <div className="relative flex items-center justify-between p-6 bg-yellow-500 text-white overflow-hidden">
          <div className="relative flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md ring-1 ring-white/40">
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 id="chat-drawer-title" className="text-xl font-bold tracking-tight">
                <TransletText>Contactez-nous</TransletText>
              </h3>
              <p className="text-sm text-white/80 mt-1"><TransletText>Réponse rapide garantie</TransletText></p>
            </div>
          </div>
          <button
            aria-label="Fermer"
            onClick={() => setOpen(false)}
            className="relative p-2 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-md ring-1 ring-white/40"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
          {isLoading && (
            <div className="flex justify-center">
              <div className="text-sm text-gray-400 animate-pulse"><TransletText>Chargement…</TransletText></div>
            </div>
          )}
          {messages.map((m: any) => (
            <div key={m.id} className={`flex ${m.senderRole === 'USER' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={[
                  'max-w-[80%] px-4 py-3 rounded-2xl shadow-sm',
                  m.senderRole === 'USER'
                    ? 'bg-yellow-500 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 ring-1 ring-gray-200/60 rounded-bl-sm'
                ].join(' ')}
              >
                <p className="text-sm">{m.content}</p>
                <div className="text-[10px] opacity-70 mt-1">{new Date(m.createdAt).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={submit} className="sticky bottom-0 p-5 bg-yellow-50 border-t border-yellow-200/40 space-y-4">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              required
              rows={3}
              placeholder=" "
              maxLength={500}
              className="w-full pr-10 text-gray-800 py-4 rounded-2xl border-2 border-gray-200 bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 resize-none"
            />
            <span className="absolute bottom-3 text-gray-500 right-4 text-xs text-gray-400">{input.length}/500</span>
          </div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="relative w-full flex items-center justify-center gap-2 px-4 py-4 bg-yellow-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 disabled:opacity-60"
          >
            <PaperAirplaneIcon className="w-5 h-5 relative z-10" />
            <span className="relative z-10"><TransletText>Envoyer le message</TransletText></span>
          </button>
        </form>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm sm:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
