'use client'

import { useState } from 'react'
import { mockConversations } from '@/data/mock'
import { Conversation, Message } from '@/types'
import { SearchIcon, SendIcon, WhatsAppIcon, InstagramIcon, MailIcon, PhoneIcon } from '@/components/icons'

function getChannelIcon(channel: string, size = 14) {
  switch (channel) {
    case 'whatsapp': return <WhatsAppIcon size={size} className="text-green-500" />
    case 'instagram': return <InstagramIcon size={size} className="text-pink-500" />
    case 'email': return <MailIcon size={size} className="text-blue-500" />
    default: return <PhoneIcon size={size} className="text-gray-500" />
  }
}

function getChannelColor(channel: string) {
  switch (channel) {
    case 'whatsapp': return 'bg-green-500'
    case 'instagram': return 'bg-pink-500'
    case 'email': return 'bg-blue-500'
    case 'facebook': return 'bg-blue-600'
    default: return 'bg-gray-500'
  }
}

function timeAgo(dateStr: string): string {
  const now = new Date('2026-02-09T12:00:00Z')
  const date = new Date(dateStr)
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `hace ${days}d`
  if (hours > 0) return `hace ${hours}h`
  return `hace ${minutes}m`
}

export default function ConversationsPage() {
  const [selectedConvo, setSelectedConvo] = useState<Conversation>(mockConversations[0])
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [channelFilter, setChannelFilter] = useState<string>('all')

  const filteredConvos = mockConversations.filter(c => {
    const matchesSearch = search === '' || c.contactName.toLowerCase().includes(search.toLowerCase())
    const matchesChannel = channelFilter === 'all' || c.channel === channelFilter
    return matchesSearch && matchesChannel
  })

  return (
    <div className="flex h-screen">
      {/* Conversation List */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900 mb-3">Conversaciones</h1>
          <div className="relative mb-2">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Buscar conversacion..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-1">
            {['all', 'whatsapp', 'instagram', 'email'].map(ch => (
              <button
                key={ch}
                onClick={() => setChannelFilter(ch)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  channelFilter === ch ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {ch === 'all' ? 'Todos' : ch.charAt(0).toUpperCase() + ch.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConvos.map(convo => (
            <div
              key={convo.id}
              onClick={() => setSelectedConvo(convo)}
              className={`px-4 py-3 cursor-pointer border-b border-gray-50 transition-colors ${
                selectedConvo?.id === convo.id ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${getChannelColor(convo.channel)}`}>
                  {convo.contactName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">{convo.contactName}</span>
                    <span className="text-xs text-gray-400">{timeAgo(convo.lastMessageAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {getChannelIcon(convo.channel, 12)}
                    <p className="text-xs text-gray-500 truncate">{convo.lastMessage}</p>
                  </div>
                </div>
                {convo.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    {convo.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedConvo ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${getChannelColor(selectedConvo.channel)}`}>
                {selectedConvo.contactName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{selectedConvo.contactName}</p>
                <div className="flex items-center gap-1.5">
                  {getChannelIcon(selectedConvo.channel, 12)}
                  <span className="text-xs text-gray-400 capitalize">{selectedConvo.channel}</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedConvo.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                    msg.sender === 'agent'
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                  }`}>
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'agent' ? 'text-blue-100' : 'text-gray-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && message.trim()) {
                      setMessage('')
                    }
                  }}
                />
                <button
                  onClick={() => { if (message.trim()) setMessage('') }}
                  className="bg-blue-500 text-white p-2.5 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <SendIcon size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p>Selecciona una conversacion</p>
          </div>
        )}
      </div>
    </div>
  )
}
