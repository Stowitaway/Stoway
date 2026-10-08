import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";
import { supabase } from "../lib/supabaseClient";
import { IconButton } from "../design-system/components/core/IconButton";

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
    <div className="sw-modal__scrim" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="sw-modal sw-modal--lg"
        style={{ height: "80vh", display: "flex", flexDirection: "row" }}
      >
        <div
          className={`w-full flex-col sm:flex sm:w-56 sm:shrink-0 ${mobileView === "list" ? "flex" : "hidden"}`}
          style={{ borderRight: "var(--border-width-hairline) solid var(--border-subtle)" }}
        >
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "var(--border-width-hairline) solid var(--border-subtle)", background: "var(--surface-sunken)" }}
          >
            <h2 className="m-0" style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-bold)", color: "var(--text-strong)" }}>
              {t("chat.title")}
            </h2>
            <span className="sm:hidden">
              <IconButton icon="x-lg" size="sm" label={t("modal.close")} onClick={onClose} />
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingList ? (
              <p className="p-4" style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>…</p>
            ) : conversations.length === 0 ? (
              <p className="p-4" style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
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
                  className="block w-full px-4 py-3 text-left"
                  style={{
                    fontSize: "var(--text-sm)",
                    borderBottom: "var(--border-width-hairline) solid var(--border-subtle)",
                    background: conversation.id === activeId ? "var(--surface-hover)" : "transparent",
                  }}
                >
                  <div style={{ fontWeight: "var(--weight-semibold)", color: "var(--text-strong)" }}>
                    {otherPartyName(conversation)}
                  </div>
                  {conversation.listing_title && (
                    <div className="truncate" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                      {conversation.listing_title}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        <div className={`flex-1 flex-col sm:flex ${mobileView === "thread" ? "flex" : "hidden"}`}>
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ borderBottom: "var(--border-width-hairline) solid var(--border-subtle)", background: "var(--surface-sunken)" }}
          >
            <span className="sm:hidden">
              <IconButton icon="chevron-left" size="sm" label="Back" onClick={() => setMobileView("list")} />
            </span>
            <span className="flex-1" style={{ fontWeight: "var(--weight-semibold)", color: "var(--text-strong)" }}>
              {activeConversation ? otherPartyName(activeConversation) : ""}
            </span>
            <IconButton icon="x-lg" size="sm" label={t("modal.close")} onClick={onClose} />
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {!activeConversation ? (
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>
                {t("chat.selectConversation")}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className="max-w-[75%] rounded-md px-3 py-2"
                    style={{
                      fontSize: "var(--text-sm)",
                      alignSelf: m.sender_id === user.id ? "flex-end" : "flex-start",
                      background: m.sender_id === user.id ? "var(--brand)" : "var(--surface-sunken)",
                      color: m.sender_id === user.id ? "var(--text-inverse)" : "var(--text-strong)",
                    }}
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
              className="flex gap-2 p-3"
              style={{ borderTop: "var(--border-width-hairline) solid var(--border-subtle)" }}
            >
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={t("chat.placeholder")}
                className="sw-input flex-1"
              />
              <button type="submit" disabled={sending || !messageText.trim()} className="sw-btn sw-btn--primary">
                {t("chat.send")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
