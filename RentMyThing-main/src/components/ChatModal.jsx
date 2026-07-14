import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, ShieldCheck, MessageSquare } from 'lucide-react';
import { api } from '../api';

export default function ChatModal({ user, recipient, recipientId, recipientName, recipientDetails, onClose }) {
  const rawDetails = recipient?.details || recipientDetails || 'Verified Campus Peer';
  const peerDetailsString = typeof rawDetails === 'object' && rawDetails !== null
    ? (rawDetails.title ? `Regarding: ${rawDetails.title}` : rawDetails.category || 'Gear Rental Peer')
    : String(rawDetails);

  const peer = recipient || {
    id: recipientId || 'peer',
    name: recipientName || 'Campus Student',
    details: peerDetailsString
  };

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendError, setSendError] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const loadMessages = useCallback(async () => {
    try {
      const data = await api.getMessages(peer.id);
      setMessages(data || []);
    } catch (err) {
      console.error('Chat load error:', err);
    } finally {
      setLoading(false);
    }
  }, [peer.id]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 4000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;
    setSendError('');
    setSending(true);
    try {
      await api.sendMessage(peer.id, inputText.trim());
      setInputText('');
      loadMessages();
    } catch (err) {
      setSendError(err.message || 'Failed to send. Try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: 'rgba(15,17,23,0.5)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }} className="anim-in">
      <div className="card" style={{
        width: '100%', maxWidth: 460, height: 560,
        display: 'flex', flexDirection: 'column',
        background: 'var(--surface)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
          background: 'var(--surface-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: 'var(--coral)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700,
            }}>
              {peer.name?.[0]?.toUpperCase() || 'P'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>{peer.name}</h4>
                <span className="badge badge-green" style={{ padding: '2px 6px', fontSize: 10 }}>Verified</span>
              </div>
              <p className="body-sm" style={{ fontSize: 11 }}>{peerDetailsString}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Mutual safety reminder */}
        <div style={{ background: 'var(--coral-light)', padding: '8px 16px', borderBottom: '1px solid var(--coral-mid)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={14} color="var(--coral)" />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--coral)' }}>
            Always verify handover OTP at pickup inside campus hostel premises.
          </span>
        </div>

        {/* Message body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading ? (
            <p className="body-sm" style={{ textAlign: 'center' }}>Connecting to student peer...</p>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto 0' }}>
              <MessageSquare size={32} color="var(--ink-faint)" style={{ margin: '0 auto 8px' }} />
              <p className="body-sm">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((m, idx) => {
              const isMine = m.senderId === user?.id || m.senderEmail === user?.email;
              return (
                <div
                  key={idx}
                  style={{
                    alignSelf: isMine ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: 16,
                    background: isMine ? 'var(--coral)' : 'var(--surface-2)',
                    color: isMine ? '#fff' : 'var(--ink)',
                    border: isMine ? 'none' : '1px solid var(--border)',
                    fontSize: 13,
                  }}
                >
                  <p style={{ margin: 0, wordBreak: 'break-word' }}>{m.content || m.text}</p>
                  <span style={{ fontSize: 10, opacity: 0.7, display: 'block', textAlign: 'right', marginTop: 4 }}>
                    {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                  </span>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <form onSubmit={handleSend} style={{ padding: '14px 16px', borderTop: '1px solid var(--border)' }}>
          {sendError && (
            <div style={{
              fontSize: 12, color: 'var(--coral)', background: 'var(--coral-light)',
              padding: '6px 12px', borderRadius: 8, marginBottom: 8
            }}>
              ⚠️ {sendError}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Write message to student host..."
              className="input"
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              style={{ padding: '10px 16px', opacity: sending ? 0.6 : 1 }}
              disabled={sending}
            >
              <Send size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
