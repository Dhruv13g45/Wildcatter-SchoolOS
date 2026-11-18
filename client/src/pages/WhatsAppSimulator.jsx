import React, { useState } from 'react';
import api from '../api/client.js';
import {
  MessageSquare,
  Send,
  Paperclip,
  CheckCheck,
  Bot,
  Shield,
  Sparkles,
} from 'lucide-react';

export const WhatsAppSimulator = () => {
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'Namaste! Welcome to Greenwood School Admissions.\n\nYou can chat with us right here on WhatsApp. Send your child’s name, preferred subjects, or attach their Class 10 marksheet to see if they qualify for admission!',
      time: '10:00 AM',
    },
  ]);
  const [applicantName, setApplicantName] = useState('');
  const [parentPhone, setParentPhone] = useState('+91 98765 43210');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastStructuredEvent, setLastStructuredEvent] = useState(null);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const textToSend = inputText;
    setInputText('');
    setLoading(true);

    try {
      // Simulate Meta WhatsApp Inbound Webhook payload matching PRD
      const webhookPayload = {
        message_id: `wamid_HBgM${Date.now()}`,
        parent_phone: parentPhone.replace(/\s+/g, '') || '+919876543210',
        message_type: 'text',
        text_body: textToSend,
      };

      const res = await api.post('/admissions/whatsapp-webhook', webhookPayload, {
        headers: {
          'x-bypass-signature-for-demo': 'true',
        },
      });

      setLastStructuredEvent(res.data);

      const exec = res.data.agent_execution || {};
      const candidate = exec.candidate_name || applicantName || 'Student Applicant';
      const verdict = exec.eligibility || 'DOCUMENTS_INCOMPLETE';
      const detectedClass = exec.target_class || 'Class Unspecified (Missing)';
      const stream = exec.stream || 'Under Evaluation';

      let replyMessage = '';
      if (verdict === 'DIRECT_ADMISSION_OFFERED') {
        replyMessage = `✅ *Admissions Credentials Verified*:\n\n• Candidate: ${candidate}\n• Target Grade/Class: ${detectedClass}\n• Assigned Stream: ${stream}\n• Status: Direct Admission Offered!\n\nOur Fee Assistant will send a secure fee checkout link shortly.`;
      } else if (verdict === 'INTERVIEW_REQUIRED') {
        replyMessage = `📋 *Application Received - Review Needed*:\n\n• Candidate: ${candidate}\n• Target Grade: ${detectedClass}\n• Status: Academic Interview / Counseling Required before final offer.\n\nOur counseling coordinator will call you on this number.`;
      } else if (verdict === 'DOCUMENTS_INCOMPLETE') {
        replyMessage = `ℹ️ *Missing Information*:\n\n• Candidate: ${candidate}\n• Note: We could not verify the target class or complete marks breakdown from your message.\n\nPlease reply with the exact Grade/Class applying for and Class 10 marksheet percentage.`;
      } else {
        replyMessage = `⚠️ *Assessment Result*:\n\n• Candidate: ${candidate}\n• Status: Score below direct threshold. Further academic evaluation required.`;
      }

      const botReply = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'Message received by admissions gateway! An advisor will review it shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAttachMockDocument = () => {
    setInputText(`Attached Document: Class X Marksheet for ${applicantName || 'Applicant'} [92.4% aggregate in Mathematics & Science]`);
  };

  return (
    <div className="space-y-8">
      {/* Title & Introduction with Breathing Room */}
      <div>
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              WhatsApp Admissions Assistant
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Parents can chat, submit document photos, and receive instant admission offers directly on WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* Parent Sender Profile Bar with Generous Padding */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm flex flex-wrap items-center gap-6 text-sm">
        <span className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Parent Details:</span>
        </span>
        <div className="flex items-center space-x-2.5">
          <label className="text-slate-500 dark:text-zinc-400 text-xs font-semibold">Student Name:</label>
          <input
            type="text"
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            placeholder="e.g. Vikramaditya"
            className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center space-x-2.5">
          <label className="text-slate-500 dark:text-zinc-400 text-xs font-semibold">WhatsApp Phone:</label>
          <input
            type="text"
            value={parentPhone}
            onChange={(e) => setParentPhone(e.target.value)}
            className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Authentic WhatsApp Chat Interface */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden flex flex-col h-[580px]">
            {/* WhatsApp Green Header */}
            <div className="bg-emerald-700 text-white p-4 flex items-center justify-between shadow">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    Greenwood Admissions Team
                  </h3>
                  <p className="text-xs text-emerald-100 flex items-center space-x-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse inline-block" />
                    <span>Official WhatsApp Verified Business</span>
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-800/80 text-emerald-100 border border-emerald-600 rounded-lg">
                Automated Assistant
              </span>
            </div>

            {/* Chat Messages Body with Breathing Room */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50 dark:bg-zinc-950/90">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 border border-slate-200/80 dark:border-zinc-800 rounded-tl-none whitespace-pre-line leading-relaxed'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div className="mt-1.5 flex items-center justify-end space-x-1 text-[11px] opacity-80">
                      <span>{msg.time}</span>
                      {msg.sender === 'user' && <CheckCheck className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 text-xs px-4 py-2.5 rounded-2xl flex items-center space-x-2.5 border border-slate-200 dark:border-zinc-800 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                    <span>Reading marksheet & checking eligibility...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center space-x-3"
            >
              <button
                type="button"
                onClick={handleAttachMockDocument}
                title="Attach Class X Marksheet"
                className="p-2.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-zinc-800 rounded-xl transition"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message, or click the paperclip to attach marks..."
                className="flex-1 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />

              <button
                type="submit"
                disabled={loading}
                className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Clear Explanations */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <Shield className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                How It Works
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              When a parent texts the school WhatsApp number, our Admissions AI reads their message, checks class capacity, and creates their student file automatically.
            </p>

            {lastStructuredEvent && (
              <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 space-y-2">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Created Student Profile:
                </p>
                <pre className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 font-mono text-xs text-slate-800 dark:text-zinc-300 overflow-x-auto">
                  {JSON.stringify(lastStructuredEvent, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
