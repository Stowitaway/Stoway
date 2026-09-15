import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";
import { supabase } from "../lib/supabaseClient";

export default function ChatModal({ initialConversationId, onClose }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [activeId, setActiveId] = useState(initialConversationId ?? null);
  const [mobileView, setMobileView] = useState(
    initialConversationId ? "thread" : "list",
  );
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    supabase
      .from("conversations")
      .select("*")
      .or(`host_id.eq.${user.id},guest_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setConversations(data ?? []);
        setLoadingList(false);
        if (!activeId && data?.length) setActiveId(data[0].id);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  useEffect(() => {
    if (!activeId) return;

    let cancelled = false;
    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", activeId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (!cancelled) setMessages(data ?? []);
      });

    const channel = supabase
      .channel(`messages-${activeId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [activeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeConversation = conversations.find((c) => c.id === activeId);

  const otherPartyName = (conversation) =>
    conversation.host_id === user.id
      ? conversation.guest_name
      : conversation.host_name;

  const handleSend = async (e) => {
    e.preventDefault();
    const body = messageText.trim();
    if (!body || !activeId) return;
    setSending(true);
    const { error } = await supabase
      .from("messages")
      .insert({ conversation_id: activeId, sender_id: user.id, body });
    setSending(false);
    if (!error) setMessageText("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-kraft-900/50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-[80vh] w-full max-w-3xl overflow-hidden rounded-lg border-2 border-kraft-400 bg-kraft-50 shadow-2xl"
      >
        <div
          className={`w-full flex-col sm:flex sm:w-56 sm:shrink-0 sm:border-r sm:border-kraft-300 ${
            mobileView === "list" ? "flex" : "hidden"
          }`}
        >
          <div className="flex items-center justify-between border-b border-kraft-300 bg-kraft-100 px-4 py-3">
            <h2 className="text-lg font-semibold text-kraft-900">
              {t("chat.title")}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("modal.close")}
              className="rounded-full px-2 py-1 text-kraft-700 hover:bg-kraft-200 sm:hidden"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingList ? (
              <p className="p-4 text-sm text-kraft-600">…</p>
            ) : conversations.length === 0 ? (
              <p className="p-4 text-sm text-kraft-600">
                {t("chat.noConversations")}
              </p>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => {
                    setActiveId(conversation.id);
                    setMobileView("thread");
                  }}
                  className={`block w-full border-b border-kraft-200 px-4 py-3 text-left text-sm ${
                    conversation.id === activeId
                      ? "bg-kraft-200"
                      : "hover:bg-kraft-100"
                  }`}
                >
                  <div className="font-medium text-kraft-900">
                    {otherPartyName(conversation)}
                  </div>
                  {conversation.listing_title && (
                    <div className="truncate text-xs text-kraft-600">
                      {conversation.listing_title}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        <div
          className={`flex-1 flex-col sm:flex ${
            mobileView === "thread" ? "flex" : "hidden"
          }`}
        >
          <div className="flex items-center gap-2 border-b border-kraft-300 bg-kraft-100 px-4 py-3">
            <button
              type="button"
              onClick={() => setMobileView("list")}
              aria-label="Back"
              className="rounded-full px-2 py-1 text-kraft-700 hover:bg-kraft-200 sm:hidden"
            >
              ‹
            </button>
            <span className="flex-1 font-medium text-kraft-900">
              {activeConversation ? otherPartyName(activeConversation) : ""}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("modal.close")}
              className="rounded-full px-2 py-1 text-kraft-700 hover:bg-kraft-200"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {!activeConversation ? (
              <p className="text-sm text-kraft-600">
                {t("chat.selectConversation")}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                      m.sender_id === user.id
                        ? "self-end bg-stamp text-kraft-50"
                        : "self-start bg-kraft-200 text-kraft-900"
                    }`}
                  >
                    {m.body}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {activeConversation && (
            <form
              onSubmit={handleSend}
              className="flex gap-2 border-t border-kraft-300 p-3"
            >
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={t("chat.placeholder")}
                className="flex-1 rounded-md border border-kraft-300 bg-white px-3 py-2 text-sm focus:border-kraft-500 focus:outline-none focus:ring-2 focus:ring-kraft-400"
              />
              <button
                type="submit"
                disabled={sending || !messageText.trim()}
                className="rounded-md bg-stamp px-4 py-2 text-sm font-medium text-kraft-50 transition hover:opacity-90 disabled:opacity-60"
              >
                {t("chat.send")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
