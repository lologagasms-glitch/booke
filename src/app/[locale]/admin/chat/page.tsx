'use client'

import { useEffect, useState } from 'react'
import { TransletText } from '@/app/lib/services/translation/transletText'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'

export default function AdminChatPage() {
  const [activeConversationId, setActiveConversationId] = useState<string>('')
  const [input, setInput] = useState('')
  const [showList, setShowList] = useState(true)
  const qc = useQueryClient()

  const conversationsQuery = useQuery({
    queryKey: ['chat-getConversations'],
    queryFn: async () => {
      const res = await fetch('/api/chat/getConversations')
      const json = await res.json()
      return json.conversations || []
    },
    refetchInterval: 8000,
  })

  const messagesQuery = useQuery({
    queryKey: ['chat-getMessages', activeConversationId],
    queryFn: async () => {
      const res = await fetch(`/api/chat/getMessages?conversationId=${activeConversationId}`)
      const json = await res.json()
      return json.messages || []
    },
    enabled: !!activeConversationId,
    refetchInterval: 4000,
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/chat/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: input, conversationId: activeConversationId }) })
      if (!res.ok) throw new Error('send failed')
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['chat-getMessages', activeConversationId] })
      qc.invalidateQueries({ queryKey: ['chat-getConversations'] })
      setInput('')
    },
  })

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id)
    setShowList(false)
  }

  const handleBack = () => {
    setShowList(true)
    setActiveConversationId('')
  }

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-6">
      {/* Mobile header when chat is open */}
      {activeConversationId && (
        <div className="md:hidden flex items-center gap-3 mb-3">
          <button onClick={handleBack} className="text-blue-600 font-semibold">
            ← <TransletText>Retour</TransletText>
          </button>
          <div className="font-semibold truncate">{activeConversationId}</div>
        </div>
      )}

      {/* Conversations list */}
      <div className={`${showList ? 'flex' : 'hidden'} md:flex md:w-1/3 flex-col bg-white p-2`}>
        <div className="mb-4 px-1">
          <h2 className="text-lg font-semibold text-gray-800 tracking-tight"><TransletText>Conversations</TransletText></h2>
        </div>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 m-2 p-2">
          {(conversationsQuery.data || []).map((c: any) => (
            <button
              key={c.id}
              onClick={() => handleSelectConversation(c.id)}
              className={`w-full text-left rounded-2xl border  p-4 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400 ${activeConversationId === c.id ? 'ring-3 ring-blue-500 shadow-md text-white bg-blue-600' : 'bg-white text-gray-800'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className={`text-sm font-medium ${activeConversationId === c.id ? 'text-white' : 'text-gray-900'}`}>{c.user?.email || c.userId}</div>
                  <div className={`text-xs mt-1 ${activeConversationId === c.id ? 'text-white' : 'text-gray-500'}`}>{new Date(c.lastMessageAt).toLocaleString()}</div>
                </div>
                {c.hasUnreadMessages && (
                  <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${activeConversationId === c.id ? 'bg-white text-blue-700' : 'bg-blue-100 text-blue-700'}`}>
                    <TransletText>Non lu</TransletText>
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat panel */}
      <div className={`${showList ? 'hidden' : 'flex'} md:flex md:w-2/3 border rounded-xl bg-white flex-col`}>
        <div className="p-4 border-b">
          <div className="font-semibold ">{activeConversationId ? activeConversationId : ''}</div>
        </div>
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {(messagesQuery.data || []).map((m: any) => (
            <div key={m.id} className={`flex ${m.senderRole.toLowerCase() === 'admin' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded-2xl shadow ${m.senderRole.toLowerCase() === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white border'}`}>
                <div>{m.content}</div>
                <div className="text-[10px] opacity-70 mt-1">{new Date(m.createdAt).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
        </div>
        {activeConversationId && (
          <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="p-4 flex items-center gap-2 border-t">
            <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 border rounded-xl px-3 py-2 text-gray-800" />
            <button type="submit" disabled={!activeConversationId || !input} className="px-4 py-2 rounded-xl bg-blue-600  flex items-center gap-2">
              <PaperAirplaneIcon className="w-5 h-5" />
              <TransletText>Envoyer</TransletText>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
