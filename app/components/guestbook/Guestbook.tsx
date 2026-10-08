"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface Reply {
  id: string;
  nick: string;
  text: string;
  timestamp: string;
  parentId: string;
  replyToNick: string;
  avatar?: string | null;
  link?: string | null;
}

interface Entry {
  id: string;
  nick: string;
  text: string;
  timestamp: string;
  avatar?: string | null;
  link?: string | null;
  replies?: Reply[];
}

interface ReplyTarget {
  commentId: string;
  parentId: string;
  replyToNick: string;
}

const TEXT_MAX = 500;
const STORAGE_KEYS = {
  NICK: "gb_user_nick",
  EMAIL: "gb_user_email",
  WEBSITE: "gb_user_website",
};

function fmtDate(ts: string) {
  return new Date(ts).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function ItemAvatar({
  nick,
  avatar,
}: {
  nick: string;
  avatar?: string | null;
}) {
  return (
    <div className="guestbook-avatar" aria-hidden="true">
      {avatar ? (
        <img src={avatar} alt="" loading="lazy" />
      ) : (
        <span>{nick.slice(0, 1).toUpperCase()}</span>
      )}
    </div>
  );
}

export default function Guestbook({ path }: { path: string }) {
  const [entries, setEntries] = useState<Entry[] | null>(null);

  // 表單狀態
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [hp, setHp] = useState("");
  const [text, setText] = useState("");

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<"new" | "old">("new");

  // 回覆狀態
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [replyForm, setReplyForm] = useState({
    nick: "",
    email: "",
    text: "",
    hp: "",
  });
  const [sendingReply, setSendingReply] = useState(false);

  // 初始化讀取歷史暱稱與郵箱記憶
  useEffect(() => {
    setNick(localStorage.getItem(STORAGE_KEYS.NICK) || "");
    setEmail(localStorage.getItem(STORAGE_KEYS.EMAIL) || "");
    setWebsite(localStorage.getItem(STORAGE_KEYS.WEBSITE) || "");
  }, []);

  const saveUserInfo = (n: string, e: string, w: string) => {
    localStorage.setItem(STORAGE_KEYS.NICK, n);
    localStorage.setItem(STORAGE_KEYS.EMAIL, e);
    localStorage.setItem(STORAGE_KEYS.WEBSITE, w);
  };

  const load = useCallback(() => {
    fetch(`/api/guestbook?path=${encodeURIComponent(path)}`)
      .then((r) => (r.ok ? r.json() : { entries: null }))
      .then((j) => {
        if (Array.isArray(j.entries)) setEntries(j.entries);
      })
      .catch(() => {});
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  const sorted = useMemo(() => {
    if (!entries) return null;
    return sort === "new" ? entries : [...entries].reverse();
  }, [entries, sort]);

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (sending || !text.trim()) return;

    setSending(true);
    setError(null);

    saveUserInfo(nick, email, website);

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nick, text, email, website, hp, path }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(j.error ?? "送出失敗");
        return;
      }
      setText("");
      load();
    } catch {
      setError("連線失敗，請稍後再試");
    } finally {
      setSending(false);
    }
  };

  const openReply = (
    commentId: string,
    parentId: string,
    replyToNick: string
  ) => {
    setReplyTarget({ commentId, parentId, replyToNick });
    setReplyForm({
      nick: localStorage.getItem(STORAGE_KEYS.NICK) || nick,
      email: localStorage.getItem(STORAGE_KEYS.EMAIL) || email,
      text: "",
      hp: "",
    });
    setError(null);
  };

  const cancelReply = () => {
    setReplyTarget(null);
    setReplyForm({ nick: "", email: "", text: "", hp: "" });
    setError(null);
  };

  const submitReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyTarget || sendingReply || !replyForm.text.trim()) return;

    setSendingReply(true);
    setError(null);

    saveUserInfo(replyForm.nick, replyForm.email, website);

    try {
      const { nick: rNick, email: rEmail, text: rText, hp: rHp } = replyForm;
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nick: rNick,
          email: rEmail,
          text: rText,
          hp: rHp,
          path,
          commentId: replyTarget.commentId,
          parentId: replyTarget.parentId,
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(j.error ?? "送出失敗");
        return;
      }
      setReplyTarget(null);
      setReplyForm({ nick: "", email: "", text: "", hp: "" });
      load();
    } catch {
      setError("連線失敗，請稍後再試");
    } finally {
      setSendingReply(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    isReply = false
  ) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (isReply) {
        submitReply();
      } else {
        onSubmit();
      }
    }
  };

  /* ---- 回覆表單渲染 ---- */
  const renderReplyForm = () => {
    if (!replyTarget) return null;
    return (
      <form className="guestbook-reply-form" onSubmit={submitReply}>
        <p className="guestbook-reply-form-title">
          回覆 <strong>@{replyTarget.replyToNick}</strong>
        </p>
        <div className="guestbook-fields">
          <div className="guestbook-field">
            <label htmlFor="gb-r-nick">暱稱</label>
            <input
              id="gb-r-nick"
              value={replyForm.nick}
              onChange={(e) => {
                setError(null);
                setReplyForm((f) => ({ ...f, nick: e.target.value }));
              }}
              maxLength={20}
              required
            />
          </div>
          <div className="guestbook-field">
            <label htmlFor="gb-r-mail" title="有新的回覆時會寄信通知你">
              郵箱(可選)
            </label>
            <input
              id="gb-r-mail"
              type="email"
              value={replyForm.email}
              onChange={(e) =>
                setReplyForm((f) => ({ ...f, email: e.target.value }))
              }
              maxLength={254}
            />
          </div>
        </div>
        <textarea
          className="guestbook-editor"
          placeholder={`回覆 @${replyTarget.replyToNick}… (Ctrl+Enter 送出)`}
          value={replyForm.text}
          onChange={(e) => {
            setError(null);
            setReplyForm((f) => ({ ...f, text: e.target.value }));
          }}
          onKeyDown={(e) => handleKeyDown(e, true)}
          maxLength={TEXT_MAX}
          required
        />
        <input
          className="guestbook-hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={replyForm.hp}
          onChange={(e) => setReplyForm((f) => ({ ...f, hp: e.target.value }))}
        />
        <div className="guestbook-actions">
          <span className="guestbook-counter">
            {replyForm.text.length}/{TEXT_MAX} 字
          </span>
          <button type="button" className="guestbook-btn" onClick={cancelReply}>
            取消
          </button>
          <button
            type="submit"
            className="guestbook-btn guestbook-btn--primary"
            disabled={sendingReply || !replyForm.text.trim()}
          >
            {sendingReply ? "送出中…" : "送出回覆"}
          </button>
        </div>
        {error && <p className="guestbook-error">{error}</p>}
      </form>
    );
  };

  /* ---- 遞迴渲染回覆 ---- */
  const renderReply = (
    reply: Reply,
    rootReplies: Reply[],
    commentId: string
  ): React.ReactNode => {
    const children = rootReplies.filter((r) => r.parentId === reply.id);
    return (
      <div
        key={reply.id}
        id={`gb-${reply.id}`}
        className="guestbook-reply-item"
      >
        <div className="guestbook-reply-body">
          <ItemAvatar nick={reply.nick} avatar={reply.avatar} />
          <div className="guestbook-body">
            <div className="guestbook-item-head">
              {reply.link ? (
                <a
                  className="guestbook-nick"
                  href={reply.link}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  {reply.nick}
                </a>
              ) : (
                <span className="guestbook-nick">{reply.nick}</span>
              )}
              <span className="guestbook-date">{fmtDate(reply.timestamp)}</span>
              <button
                type="button"
                className="guestbook-reply-btn"
                onClick={() => openReply(commentId, reply.id, reply.nick)}
              >
                回覆
              </button>
            </div>
            <p className="guestbook-text" style={{ whiteSpace: "pre-wrap" }}>
              <span className="guestbook-reply-to">
                回覆 @{reply.replyToNick}
              </span>{" "}
              {reply.text}
            </p>
            {replyTarget?.parentId === reply.id && renderReplyForm()}
            {children.length > 0 && (
              <div className="guestbook-replies">
                {children.map((child) =>
                  renderReply(child, rootReplies, commentId)
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderComment = (en: Entry): React.ReactNode => {
    const rootReplies = en.replies ?? [];
    const ids = new Set([en.id, ...rootReplies.map((r) => r.id)]);
    const direct = rootReplies.filter(
      (r) => r.parentId === en.id || !ids.has(r.parentId)
    );
    return (
      <li key={en.id} id={`gb-${en.id}`} className="guestbook-item">
        <ItemAvatar nick={en.nick} avatar={en.avatar} />
        <div className="guestbook-body">
          <div className="guestbook-item-head">
            {en.link ? (
              <a
                className="guestbook-nick"
                href={en.link}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                {en.nick}
              </a>
            ) : (
              <span className="guestbook-nick">{en.nick}</span>
            )}
            <span className="guestbook-date">{fmtDate(en.timestamp)}</span>
            {rootReplies.length > 0 && (
              <span className="guestbook-reply-count">
                {rootReplies.length} 回覆
              </span>
            )}
            <button
              type="button"
              className="guestbook-reply-btn"
              onClick={() => openReply(en.id, en.id, en.nick)}
            >
              回覆
            </button>
          </div>
          <p className="guestbook-text" style={{ whiteSpace: "pre-wrap" }}>
            {en.text}
          </p>
          {replyTarget?.parentId === en.id && renderReplyForm()}
          {direct.length > 0 && (
            <div className="guestbook-replies">
              {direct.map((reply) => renderReply(reply, rootReplies, en.id))}
            </div>
          )}
        </div>
      </li>
    );
  };

  return (
    <div className="guestbook">
      <h2 className="guestbook-title">說些什麼吧！</h2>

      <form className="guestbook-panel" onSubmit={onSubmit}>
        <div className="guestbook-fields">
          <div className="guestbook-field">
            <label htmlFor="gb-nick">暱稱</label>
            <input
              id="gb-nick"
              value={nick}
              onChange={(e) => {
                setError(null);
                setNick(e.target.value);
              }}
              maxLength={20}
              required
            />
          </div>
          <div className="guestbook-field">
            <label htmlFor="gb-mail" title="有新的回覆時會寄信通知你">
              郵箱(可選)
            </label>
            <input
              id="gb-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={254}
            />
          </div>
          <div className="guestbook-field">
            <label htmlFor="gb-link">網址(可選)</label>
            <input
              id="gb-link"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              maxLength={300}
            />
          </div>
        </div>

        <textarea
          className="guestbook-editor"
          placeholder="歡迎留言… (Ctrl+Enter 送出)"
          value={text}
          onChange={(e) => {
            setError(null);
            setText(e.target.value);
          }}
          onKeyDown={(e) => handleKeyDown(e, false)}
          maxLength={TEXT_MAX}
          required
        />

        <input
          className="guestbook-hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
        />

        <div className="guestbook-actions">
          <span className="guestbook-counter">
            {text.length}/{TEXT_MAX} 字
          </span>
          <button
            type="submit"
            className="guestbook-btn guestbook-btn--primary"
            disabled={sending || !text.trim()}
          >
            {sending ? "送出中…" : "送出"}
          </button>
        </div>
        {error && !replyTarget && <p className="guestbook-error">{error}</p>}
      </form>

      <div className="guestbook-meta-head">
        <div className="guestbook-total">{entries?.length ?? 0} 留言</div>
        <div className="guestbook-sort">
          <button
            type="button"
            className={sort === "new" ? "is-active" : ""}
            onClick={() => setSort("new")}
          >
            最新
          </button>
          <button
            type="button"
            className={sort === "old" ? "is-active" : ""}
            onClick={() => setSort("old")}
          >
            最早
          </button>
        </div>
      </div>

      {sorted && sorted.length > 0 ? (
        <ul className="guestbook-list">{sorted.map(renderComment)}</ul>
      ) : sorted ? (
        <p className="guestbook-empty">來發留言吧~</p>
      ) : null}
    </div>
  );
}
