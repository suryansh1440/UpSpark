import { useSelector, useDispatch } from 'react-redux'
import { sendMessage, setActiveConversation } from '../store/messageSlice'
import { useState } from 'react'

const Messages = () => {
  const dispatch = useDispatch()
  const { conversations, messages, activeConversationId } = useSelector((state) => state.messages)
  const [draft, setDraft] = useState('')
  const activeMessages = messages[activeConversationId] || []
  const active = conversations.find((c) => c.id === activeConversationId) || conversations[0]

  const handleSend = () => {
    if (!draft.trim()) return
    dispatch(sendMessage({ conversationId: activeConversationId, text: draft.trim() }))
    setDraft('')
  }

  return (
    <div className="grid gap-4 md:grid-cols-[280px,1fr,260px]">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <input
          placeholder="Search users"
          className="w-full rounded-xl bg-white/5 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10"
        />
        <div className="mt-3 space-y-2 text-sm text-white">
          {conversations.map((item) => (
            <button
              key={item.id}
              onClick={() => dispatch(setActiveConversation(item.id))}
              className={`w-full rounded-xl px-3 py-2 text-left ${activeConversationId === item.id ? 'bg-indigo-500/20' : 'bg-slate-900/70'}`}
            >
              <div className="font-semibold">{item.name}</div>
              <div className="text-xs text-slate-400">{item.lastMessage}</div>
              <div className="text-[10px] text-slate-500">{item.time} ago</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5">
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
          <div>
            <div className="text-sm font-semibold text-white">{active?.name}</div>
            <div className="text-xs text-slate-400">Active chat</div>
          </div>
          <button className="text-xs text-indigo-200">View Profile</button>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm text-white">
          {activeMessages.map((msg) => (
            <div
              key={msg.text}
              className={`flex ${msg.from === 'You' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md rounded-xl px-3 py-2 ${
                  msg.from === 'You' ? 'bg-indigo-500/80' : 'bg-slate-900/70'
                }`}
              >
                <div className="text-[11px] text-slate-200">{msg.from}</div>
                <div>{msg.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 border-t border-white/5 p-3">
          <input
            placeholder="Type a message..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="flex-1 rounded-xl bg-white/5 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10"
          />
          <button
            onClick={handleSend}
            className="rounded-xl bg-indigo-500/90 px-4 py-2 text-sm font-semibold text-white">
            Send
          </button>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="text-lg font-semibold text-white">Context</h3>
        <div className="rounded-xl bg-slate-900/70 p-3 text-sm text-slate-200">
          <div className="font-semibold">NovaAI</div>
          <div className="text-xs text-slate-400">AI copilot for support • Seed</div>
          <div className="mt-2 text-xs text-slate-400">Funding required: ₹1.2 Cr</div>
        </div>
      </div>
    </div>
  )
}

export default Messages

