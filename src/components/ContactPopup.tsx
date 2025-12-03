'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { 
  ChatBubbleBottomCenterTextIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  UserIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/solid'

async function sendContactMessage(data: { email: string; message: string }) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      const errBody = await response.json()
      throw new Error(errBody?.message || 'Erreur lors de l\'envoi')
    }
    
    return response.json()
  } catch (err: unknown) {
    if (err instanceof Error) throw err
    throw new Error('Erreur réseau')
  }
}

export default function ContactDrawer() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ email: '', message: '' })

  const mutation = useMutation({
    mutationFn: sendContactMessage,
    onSuccess: () => {
      setForm({ email: '', message: '' })
      setTimeout(() => setOpen(false), 2000)
    },
    onSettled: () => {
      setTimeout(() => mutation.reset(), 300)
    }
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(form)
  }

  return (
    <>
      {/* Bouton flottant moderne avec label */}
      <div className="fixed bottom-6 right-6 z-40 group">
        <div className="relative flex items-center gap-3">
          <span className="hidden sm:block bg-gray-900 text-white text-sm px-3 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Besoin d'aide ?
          </span>
          <button
            aria-label="Ouvrir le contact"
            onClick={() => setOpen(true)}
            className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
            <ChatBubbleBottomCenterTextIcon className="w-7 h-7 relative z-10" />
          </button>
        </div>
      </div>

      {/* Drawer moderne avec glassmorphism */}
      <div
        className={[
          "fixed inset-y-0 right-0 z-50 flex flex-col",
          "w-full sm:w-[28rem]",
          "bg-white/70 backdrop-blur-xl",
          "sm:border-l sm:border-white/20",
          "sm:shadow-[0_0_40px_rgba(0,0,0,0.15)]",
          "transform transition-transform duration-400 ease-[cubic-bezier(0.32,1,0.66,1)]",
          open ? "translate-x-0" : "translate-x-full",
          "h-screen"
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-drawer-title"
      >
        {/* Header avec gradient moderne */}
        <div className="relative flex items-center justify-between p-6 sm:p-5 bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />
          <div className="relative flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 id="contact-drawer-title" className="text-xl font-semibold">
                Contactez-nous
              </h3>
              <p className="text-sm text-blue-100 mt-1">Réponse rapide garantie</p>
            </div>
          </div>
          <button
            aria-label="Fermer"
            onClick={() => setOpen(false)}
            className="relative p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm ring-1 ring-white/30"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Zone de messages avec bulles modernes */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {mutation.isSuccess && (
            <div className="flex justify-start">
              <div className="max-w-[80%] bg-gradient-to-br from-green-500 to-green-600 text-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-md">
                <p className="text-sm font-medium">✅ Message envoyé avec succès !</p>
              </div>
            </div>
          )}
          
          {mutation.isError && (
            <div className="flex justify-start">
              <div className="max-w-[80%] bg-gradient-to-br from-red-500 to-red-600 text-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-md">
                <p className="text-sm font-medium">
                  {mutation.error?.message || '❌ Une erreur est survenue. Réessayez plus tard.'}
                </p>
              </div>
            </div>
          )}
          
          {!mutation.isSuccess && !mutation.isError && (
            <>
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-md">
                  <p className="text-sm font-medium">Bonjour ! 👋 Comment pouvons-nous vous aider ?</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm shadow-md ring-1 ring-gray-200">
                  <p className="text-sm">Nous vous répondons généralement dans les <span className="font-semibold text-blue-600">5 minutes</span>.</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Formulaire moderne avec floating labels */}
        <form onSubmit={submit} className="sticky bottom-0 p-5 pt-6 bg-white/90 backdrop-blur-xl border-t border-gray-200/60 space-y-5">
          <div className="relative">
            <EnvelopeIcon className="absolute left-4 top-4 w-5 h-5 text-gray-400 transition-colors peer-focus:text-blue-500" />
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              placeholder=" "
              className="peer w-full pl-11 pr-4 py-4 rounded-xl border-2 border-gray-200 bg-white/70 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200"
            />
            <label 
              htmlFor="email" 
              className="absolute left-11 top-4 text-gray-400 transition-all duration-200 pointer-events-none
              peer-focus:-top-3 peer-focus:left-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-2
              peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:left-3 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-2"
            >
              Votre email
            </label>
          </div>
          
          <div className="relative">
            <ChatBubbleLeftRightIcon className="absolute left-4 top-4 w-5 h-5 text-gray-400 transition-colors peer-focus:text-blue-500" />
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={onChange}
              required
              rows={3}
              placeholder=" "
              maxLength={500}
              className="peer w-full pl-11 pr-4 py-4 rounded-xl border-2 border-gray-200 bg-white/70 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 resize-none"
            />
            <label 
              htmlFor="message" 
              className="absolute left-11 top-4 text-gray-400 transition-all duration-200 pointer-events-none
              peer-focus:-top-3 peer-focus:left-3 peer-focus:text-xs peer-focus:text-blue-500 peer-focus:bg-white peer-focus:px-2
              peer-not-placeholder-shown:-top-3 peer-not-placeholder-shown:left-3 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:px-2"
            >
              Votre message
            </label>
            <span className="absolute bottom-3 right-4 text-xs text-gray-400">
              {form.message.length}/500
            </span>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="relative w-full flex items-center justify-center gap-2 px-4 py-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
            <PaperAirplaneIcon className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Envoyer le message</span>
          </button>
        </form>
      </div>

      {/* Backdrop amélioré */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm sm:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
