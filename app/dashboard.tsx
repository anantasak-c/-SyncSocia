"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Send,
  Facebook,
  Twitter,
  Instagram,
  Link2,
  LogOut,
  Loader2,
  CheckCircle2,
  XCircle,
  Zap,
  Image as ImageIcon,
  Video,
  Trash2,
  UploadCloud,
  Sparkles,
  Eye,
  Pencil,
  X,
  MessageCircle,
  Save,
  History,
  Clock,
} from "lucide-react";
import { PostPreview } from "./components/PostPreview";
import { ImageCropper } from "./components/ImageCropper";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";

// ----- Types -----

interface Account {
  _id: string;
  platform: string;
  username: string;
  displayName: string;
  isActive: boolean;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
  exiting?: boolean;
}

interface MediaItem {
  type: "image" | "video";
  url: string;
  file?: File; // for preview/reference
}

interface PostHistory {
  id: string;
  content: string;
  media_urls: string[];
  platforms: string[];
  status: string;
  created_at: string;
}

// ----- Platform helpers -----

function LineIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      style={{ ...style, fill: "currentColor" }}
    >
      <path d="M21.16 7.9c-.35-3.5-3.35-6.15-7.06-6.15-4.5 0-8.1 3.25-8.1 7.25 0 2.9 1.9 5.45 4.7 6.6.6.35.4.9.25 1.7-.1.55-.35 1.55-.35 1.55-.1.55-.25 1.15.55.75s4.9-3.2 5.5-3.65c2.3-.5 4.15-2.25 4.5-4.5.05-.35.05-.75.05-1.15 0-.15 0-.25-.04-.4z" />
    </svg>
  );
}

function TikTokIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      className={className}
      style={{ ...style, fill: "currentColor" }}
    >
      <path d="M448 209.9a210.1 210.1 0 0 1-122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a90.9 90.9 0 1 0-43 79.8h73.9V53.8a40.7 40.7 0 0 1 42.1-40.4 282.1 282.1 0 0 0 88.3 14 401.4 401.4 0 0 0 101.6-19.8v72.3z" />
    </svg>
  );
}

const PLATFORMS = [
  { key: "facebook", label: "Facebook", icon: Facebook, color: "#1877F2" },
  { key: "twitter", label: "X (Twitter)", icon: Twitter, color: "#000000" },
  { key: "instagram", label: "Instagram", icon: Instagram, color: "#E4405F" },
  { key: "tiktok", label: "TikTok", icon: TikTokIcon, color: "#000000" },
  { key: "line", label: "LINE OA", icon: LineIcon, color: "#00B900" },
] as const;

function platformIcon(platform: string) {
  const found = PLATFORMS.find((p) => p.key === platform);
  if (!found) return Link2;
  return found.icon;
}

function platformLabel(platform: string) {
  const found = PLATFORMS.find((p) => p.key === platform);
  return found?.label ?? platform;
}

function platformColor(platform: string) {
  const found = PLATFORMS.find((p) => p.key === platform);
  return found?.color ?? "#6366f1";
}

// ----- Main Page -----

export default function Dashboard() {
  const supabase = createClient();

  // Auth state
  const [user, setUser] = useState<{ id: string; email?: string } | null>(
    null
  );
  const [authLoading, setAuthLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState("");

  // App state
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<
    Record<string, boolean>
  >({});
  const [caption, setCaption] = useState("");
  const [posting, setPosting] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(
    null
  );
  const [toasts, setToasts] = useState<Toast[]>([]);

  // LINE OA State
  const [lineToken, setLineToken] = useState("");
  const [savingLine, setSavingLine] = useState(false);
  const [hasLineToken, setHasLineToken] = useState(false);
  const [showLineGuide, setShowLineGuide] = useState(false);

  // V2 Features State
  const [showPreview, setShowPreview] = useState(false);
  const [previewPlatform, setPreviewPlatform] = useState<"facebook" | "twitter" | "instagram" | "tiktok" | "line">("facebook");
  const [cropperState, setCropperState] = useState<{ isOpen: boolean; imageSrc: string; index: number }>({
    isOpen: false,
    imageSrc: "",
    index: -1,
  });

  // History State
  const [history, setHistory] = useState<PostHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // ----- Toast system -----

  const addToast = useCallback(
    (message: string, type: "success" | "error") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
        );
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 300);
      }, 4000);
    },
    []
  );

  // ----- AI Generator -----

  async function handleAiGenerate(mode: string) {
    if (!caption.trim()) {
      addToast("กรุณาพิมพ์ข้อความตั้งต้นก่อน", "error");
      return;
    }

    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: caption,
          mode,
          platform: "General", // Could be specific if user selects one platform
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setCaption(data.result);
      addToast("AI ช่วยคิดคอนเทนต์ให้แล้ว!", "success");
    } catch (err) {
      console.error(err);
      addToast("AI ทำงานผิดพลาด โปรดลองใหม่", "error");
    } finally {
      setAiLoading(false);
    }
  }

  // ----- File Upload -----

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");

    if (!isVideo && !isImage) {
      addToast("รองรับเฉพาะไฟล์รูปภาพหรือวิดีโอเท่านั้น", "error");
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      addToast("ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 50MB)", "error");
      return;
    }

    setUploading(true);
    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

      // 3. Add to state
      setMediaItems(prev => [
        ...prev,
        {
          type: isVideo ? "video" : "image",
          url: publicUrl,
          file
        }
      ]);
      
      addToast("อัปโหลดไฟล์สำเร็จ", "success");
    } catch (error) {
      console.error("Upload failed:", error);
      addToast("อัปโหลดไม่สำเร็จ กรุณาลองใหม่", "error");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  }

  function removeMedia(index: number) {
    setMediaItems(prev => prev.filter((_, i) => i !== index));
  }

  // ----- Cropper Logic -----

  function handleCropClick(index: number) {
    const item = mediaItems[index];
    if (item.type !== "image") return;
    setCropperState({
      isOpen: true,
      imageSrc: item.url,
      index: index,
    });
  }

  async function handleCropSave(croppedBlob: Blob) {
    const { index } = cropperState;
    if (index === -1) return;

    addToast("กำลังบันทึกรูปภาพ...", "success"); 

    try {
      const fileExt = "jpg";
      const fileName = `${Date.now()}-cropped.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, croppedBlob, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

      setMediaItems((prev) => {
        const newItems = [...prev];
        newItems[index] = {
          ...newItems[index],
          url: publicUrl,
          file: new File([croppedBlob], fileName, { type: "image/jpeg" }), 
        };
        return newItems;
      });

      addToast("ปรับขนาดรูปภาพสำเร็จ", "success");
      setCropperState({ isOpen: false, imageSrc: "", index: -1 });
    } catch (error) {
      console.error("Crop save failed:", error);
      addToast("บันทึกรูปภาพไม่สำเร็จ", "error");
    }
  }

  // ----- Auth -----

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u ? { id: u.id, email: u.email ?? undefined } : null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(
        session?.user
          ? { id: session.user.id, email: session.user.email ?? undefined }
          : null
      );
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");

    const fn =
      authMode === "login"
        ? supabase.auth.signInWithPassword
        : supabase.auth.signUp;

    const { error } = await fn.call(supabase.auth, {
      email: authEmail,
      password: authPassword,
    });

    if (error) {
      setAuthError(
        authMode === "login"
          ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
          : "ข้อความ Confirm ถูกส่งไปที่ Email ของคุณแล้ว"
      );
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    setAccounts([]);
    setSelectedAccounts({});
    setHasLineToken(false);
    setLineToken("");
  }

  // ----- LINE OA Logic -----

  const fetchLineToken = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.profile?.line_access_token) {
        setLineToken(data.profile.line_access_token);
        setHasLineToken(true);
      }
    } catch (error) {
      console.error("Failed to fetch LINE token", error);
    }
  }, []);

  async function handleSaveLineToken() {
    if (!lineToken.trim()) return;
    setSavingLine(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ line_access_token: lineToken }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setHasLineToken(true);
      addToast("บันทึก LINE Token เรียบร้อยแล้ว", "success");
    } catch {
      addToast("บันทึกไม่สำเร็จ กรุณาลองใหม่", "error");
    } finally {
      setSavingLine(false);
    }
  }

  // ----- Bootstrap Late profile + fetch accounts -----

  const fetchAccounts = useCallback(async () => {
    try {
      // 1. Ensure Late profile exists
      await fetch("/api/profile", { method: "POST" });

      // 2. Fetch connected accounts from Late
      const res = await fetch("/api/accounts");
      const data = await res.json();
      let combinedAccounts = data.accounts || [];

      // 3. Check for LINE token and add virtual account
      const profileRes = await fetch("/api/profile");
      const profileData = await profileRes.json();
      
      if (profileData.profile?.line_access_token) {
        setLineToken(profileData.profile.line_access_token);
        setHasLineToken(true);
        
        // Add virtual LINE account
        combinedAccounts.push({
          _id: "line_broadcast",
          platform: "line",
          username: "All Followers",
          displayName: "LINE OA",
          isActive: true
        });
      }

      setAccounts(combinedAccounts);
    } catch {
      console.error("Failed to fetch accounts");
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      setLoadingHistory(true);
      const res = await fetch("/api/history");
      const data = await res.json();
      if (data.posts) {
        setHistory(data.posts);
      }
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAccounts();
      fetchHistory();
    }
  }, [user, fetchAccounts, fetchHistory]);

  // ----- Connect platform -----

  async function handleConnect(platform: string) {
    if (platform === "line") {
      setShowLineGuide(true);
      return;
    }

    setConnectingPlatform(platform);
    try {
      const res = await fetch(`/api/connect?platform=${platform}`);
      const data = await res.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        addToast(data.error || "เชื่อมต่อไม่สำเร็จ", "error");
      }
    } catch {
      addToast("เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่", "error");
    } finally {
      setConnectingPlatform(null);
    }
  }

  // ----- Handle post-connect redirect -----

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    if (connected) {
      addToast(
        `เชื่อมต่อ ${platformLabel(connected)} สำเร็จแล้ว!`,
        "success"
      );
      window.history.replaceState({}, "", "/");
      fetchAccounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- Toggle account selection -----

  function toggleAccount(accountId: string) {
    setSelectedAccounts((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }));
  }

  // ----- Post -----

  async function handlePost() {
    const selected = accounts.filter((a) => selectedAccounts[a._id]);
    if (selected.length === 0) {
      addToast("กรุณาเลือกอย่างน้อย 1 แพลตฟอร์ม", "error");
      return;
    }
    if (!caption.trim() && mediaItems.length === 0) {
      addToast("กรุณาเขียนข้อความหรือแนบรูป/วิดีโอ", "error");
      return;
    }

    setPosting(true);
    try {
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: caption,
          platforms: selected.map((a) => ({
            platform: a.platform,
            accountId: a._id,
          })),
          mediaItems: mediaItems.map(m => ({ type: m.type, url: m.url })),
          // Default TikTok settings for simplicity
          tiktokSettings: {
            privacyLevel: "PUBLIC_TO_EVERYONE",
            allowComment: true,
            allowDuet: true,
            allowStitch: true
          }
        }),
      });

      const data = await res.json();
      if (data.success) {
        addToast("โพสต์สำเร็จแล้ว! ข้อความถูกส่งไปยังโซเชียลของคุณ", "success");
        setCaption("");
        setMediaItems([]);
        setSelectedAccounts({});
        fetchHistory();
      } else {
        addToast(data.error || "โพสต์ไม่สำเร็จ กรุณาลองใหม่", "error");
      }
    } catch {
      addToast("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", "error");
    } finally {
      setPosting(false);
    }
  }

  // ----- Render: Loading -----

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  // ----- Render: Auth Screen -----

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <Zap className="w-9 h-9 text-primary-500" />
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                SyncSocial
              </h1>
            </div>
            <p className="text-lg text-slate-500">
              โพสต์โซเชียลง่ายๆ ในที่เดียว
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-primary-100/40 border border-white/60 p-8">
            <h2 className="text-xl font-semibold text-center mb-6">
              {authMode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
            </h2>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  อีเมล
                </label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-lg rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  รหัสผ่าน
                </label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 text-lg rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                />
              </div>

              {authError && (
                <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg py-2">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 text-lg font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-lg shadow-primary-200 hover:shadow-primary-300 active:scale-[0.98]"
              >
                {authMode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
              </button>
            </form>

            <div className="mt-5 text-center">
              <button
                onClick={() =>
                  setAuthMode(authMode === "login" ? "register" : "login")
                }
                className="text-primary-600 hover:text-primary-700 font-medium text-sm transition"
              >
                {authMode === "login"
                  ? "ยังไม่มีบัญชี? สมัครสมาชิก"
                  : "มีบัญชีแล้ว? เข้าสู่ระบบ"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----- Render: Dashboard -----

  const selectedCount = Object.values(selectedAccounts).filter(Boolean).length;

  return (
    <div className="min-h-screen">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border backdrop-blur-xl ${
              t.exiting ? "toast-exit" : "toast-enter"
            } ${
              t.type === "success"
                ? "bg-emerald-50/90 border-emerald-200 text-emerald-800"
                : "bg-red-50/90 border-red-200 text-red-800"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{t.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Zap className="w-7 h-7 text-primary-500" />
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              SyncSocial
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400 hidden sm:block">
              {user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              <LogOut className="w-4 h-4" />
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Connect Socials Section */}
        <section className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-200/50 border border-white/60 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-1">
            เชื่อมต่อโซเชียลของคุณ
          </h2>
          <p className="text-sm text-slate-400 mb-5">
            กดเพื่อเชื่อมต่อบัญชีโซเชียลที่ต้องการโพสต์
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PLATFORMS.map((p) => {
              const Icon = p.icon;
              const connected = accounts.some(
                (a) => a.platform === p.key && a.isActive
              );
              const lineReady = p.key === "line" && hasLineToken;
              const isConnecting = connectingPlatform === p.key;

              return (
                <button
                  key={p.key}
                  onClick={() => !connected && handleConnect(p.key)}
                  disabled={(connected && p.key !== "line") || isConnecting}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all text-left ${
                    connected || lineReady
                      ? "border-emerald-200 bg-emerald-50/60"
                      : "border-slate-200 hover:border-primary-300 hover:bg-primary-50/40 active:scale-[0.98]"
                  }`}
                >
                  {isConnecting ? (
                    <Loader2
                      className="w-6 h-6 animate-spin"
                      style={{ color: p.color }}
                    />
                  ) : (
                    <Icon className="w-6 h-6" style={{ color: p.color }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-700 text-sm">
                      {p.label}
                    </div>
                    {connected || lineReady ? (
                      <div className="text-xs text-emerald-600 font-medium">
                        {p.key === "line" ? "พร้อมใช้งานแล้ว" : "เชื่อมต่อแล้ว"}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400">
                        {p.key === "line"
                          ? "กดเพื่อดูวิธีหา Token"
                          : isConnecting
                            ? "กำลังเชื่อมต่อ..."
                            : "กดเพื่อเชื่อมต่อ"}
                      </div>
                    )}
                  </div>
                  {(connected || lineReady) && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {accounts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 mb-2">
                บัญชีที่เชื่อมต่อแล้ว:
              </p>
              <div className="flex flex-wrap gap-2">
                {accounts.map((a) => {
                  const Icon = platformIcon(a.platform);
                  return (
                    <span
                      key={a._id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600"
                    >
                      <Icon
                        className="w-3.5 h-3.5"
                        style={{ color: platformColor(a.platform) }}
                      />
                      {a.displayName || a.username}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <LineIcon className="w-4 h-4 text-[#00B900]" /> LINE Official Account (Broadcast)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                กดปุ่มด้านขวาเพื่อดูวิธีหา LINE Channel Access Token และบันทึกใช้งาน
              </p>
              {hasLineToken && (
                <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> บันทึก Token แล้ว พร้อมใช้งาน
                </p>
              )}
            </div>
            <button
              onClick={() => setShowLineGuide(true)}
              className="px-4 py-2.5 bg-[#00B900] text-white text-sm font-medium rounded-xl hover:bg-[#009f00] transition flex items-center justify-center gap-2"
            >
              <LineIcon className="w-4 h-4" />
              เชื่อมต่อ LINE
            </button>
          </div>
        </section>

        {/* Compose Section — only show if accounts connected */}
        {accounts.length > 0 && (
          <section className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-200/50 border border-white/60 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-1">
              เขียนโพสต์ของคุณ
            </h2>
            <p className="text-sm text-slate-400 mb-5">
              พิมพ์ข้อความ เลือกแพลตฟอร์ม แล้วกดโพสต์เลย!
            </p>

            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              <button
                onClick={() => handleAiGenerate("fix_grammar")}
                disabled={aiLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition whitespace-nowrap"
              >
                {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                แก้คำผิด/ทางการ
              </button>
              <button
                onClick={() => handleAiGenerate("make_shorter")}
                disabled={aiLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition whitespace-nowrap"
              >
                {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                สรุปสั้นๆ
              </button>
              <button
                onClick={() => handleAiGenerate("make_exciting")}
                disabled={aiLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition whitespace-nowrap"
              >
                {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                ให้น่าตื่นเต้น 🔥
              </button>
              <button
                onClick={() => handleAiGenerate("sell_hard")}
                disabled={aiLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition whitespace-nowrap"
              >
                {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                เน้นขายของ 💰
              </button>
            </div>

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              className="w-full px-4 py-3.5 text-base leading-relaxed rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition resize-none mb-3"
              placeholder="🔥 โปรโมชั่นพิเศษ! น้ำพริกกากหมูสูตรโบราณ ทำสดใหม่ทุกวัน กรอบอร่อย คลุกข้าวร้อนๆ ฟินสุดๆ สนใจสั่งเลยวันนี้พร้อมส่งจ้า..."
            />

            <div className="mb-4">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {mediaItems.map((item, index) => (
                  <div key={index} className="relative group flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                    {item.type === "image" ? (
                      <img src={item.url} alt="upload" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Video className="w-8 h-8" />
                      </div>
                    )}
                    {item.type === "image" && (
                      <button
                        onClick={() => handleCropClick(index)}
                        className="absolute top-1 left-1 p-1 bg-white/90 text-slate-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                        title="ปรับขนาด/ตัดรูป"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => removeMedia(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                <label className={`flex-shrink-0 w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  {uploading ? (
                    <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                  ) : (
                    <>
                      <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-[10px] text-slate-500 font-medium">เพิ่มรูป/วิดีโอ</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="flex justify-end mt-1 mb-4">
              <span
                className={`text-xs ${
                  caption.length > 280
                    ? "text-amber-500"
                    : "text-slate-300"
                }`}
              >
                {caption.length} ตัวอักษร
              </span>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-slate-600 mb-3">
                เลือกแพลตฟอร์มที่จะโพสต์:
              </p>
              <div className="space-y-2">
                {accounts.map((a) => {
                  const Icon = platformIcon(a.platform);
                  const checked = !!selectedAccounts[a._id];
                  return (
                    <label
                      key={a._id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                        checked
                          ? "border-primary-300 bg-primary-50/50"
                          : "border-slate-100 hover:border-slate-200 bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAccount(a._id)}
                        className="sr-only"
                      />
                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          checked
                            ? "bg-primary-500 border-primary-500"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {checked && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <Icon
                        className="w-5 h-5"
                        style={{ color: platformColor(a.platform) }}
                      />
                      <span className="font-medium text-slate-700">
                        {a.displayName || a.username}
                      </span>
                      <span className="text-xs text-slate-400 ml-auto">
                        {platformLabel(a.platform)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(true)}
                disabled={!caption && mediaItems.length === 0}
                className="flex-1 py-4 text-lg font-semibold rounded-2xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5" />
                ดูตัวอย่าง
              </button>
              
              <button
                onClick={handlePost}
                disabled={posting || selectedCount === 0 || (!caption.trim() && mediaItems.length === 0)}
                className={`flex-[2] py-4 text-xl font-bold rounded-2xl transition-all flex items-center justify-center gap-3 ${
                  posting || selectedCount === 0 || (!caption.trim() && mediaItems.length === 0)
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-200 hover:shadow-primary-300 active:scale-[0.98]"
                }`}
              >
                {posting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    กำลังโพสต์...
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    โพสต์เลย
                    {selectedCount > 0 && (
                      <span className="text-base font-normal opacity-80">
                        ({selectedCount} แพลตฟอร์ม)
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {/* History Section */}
        {user && history.length > 0 && (
          <section className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-200/50 border border-white/60 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-500" />
              ประวัติการโพสต์
            </h2>
            
            <div className="space-y-4">
              {history.map((post) => (
                <div key={post.id} className="bg-white border border-slate-100 rounded-xl p-4 flex gap-4 transition hover:shadow-md">
                  {/* Media Thumbnail */}
                  <div className="flex-shrink-0 w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {post.media_urls && post.media_urls.length > 0 ? (
                      <img src={post.media_urls[0]} alt="Post media" className="w-full h-full object-cover" />
                    ) : (
                      <MessageCircle className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex gap-1.5 flex-wrap">
                        {post.platforms.map((p) => {
                          const Icon = platformIcon(p);
                          return (
                            <div key={p} className="p-1 rounded-full bg-slate-50 border border-slate-100" title={platformLabel(p)}>
                              <Icon className="w-3 h-3" style={{ color: platformColor(p) }} />
                            </div>
                          );
                        })}
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        post.status === 'success' ? 'bg-emerald-100 text-emerald-700' :
                        post.status === 'partial' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {post.status === 'success' ? 'สำเร็จ' : post.status === 'partial' ? 'บางส่วน' : 'ล้มเหลว'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                      {post.content || <span className="italic text-slate-400">ไม่มีข้อความ</span>}
                    </p>
                    
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      {new Date(post.created_at).toLocaleString('th-TH')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Analytics Section */}
        {user && (
          <section className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-200/50 border border-white/60 p-6">
            <AnalyticsDashboard />
          </section>
        )}

        {/* Empty state if no accounts */}
        {accounts.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
              <Link2 className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              เริ่มต้นใช้งาน
            </h3>
            <p className="text-slate-400 max-w-sm mx-auto">
              เชื่อมต่อบัญชีโซเชียลด้านบนก่อน จากนั้นจะสามารถเขียนโพสต์และส่งไปทุกแพลตฟอร์มพร้อมกันได้เลย
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-slate-300">
        SyncSocial &mdash; โพสต์โซเชียลง่ายๆ ในที่เดียว
      </footer>

      {/* --- Modals --- */}

      {/* Image Cropper Modal */}
      <ImageCropper
        imageSrc={cropperState.imageSrc}
        isOpen={cropperState.isOpen}
        onClose={() => setCropperState({ isOpen: false, imageSrc: "", index: -1 })}
        onCropComplete={handleCropSave}
      />

      {/* Post Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-50 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-4 py-3 bg-white border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary-500" /> ตัวอย่างโพสต์
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex bg-white border-b border-slate-200 overflow-x-auto">
              {(["facebook", "twitter", "instagram", "tiktok", "line"] as const).map((p) => {
                const Icon = platformIcon(p);
                return (
                  <button
                    key={p}
                    onClick={() => setPreviewPlatform(p)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition ${
                      previewPlatform === p
                        ? "border-primary-500 text-primary-600 bg-primary-50/30"
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline capitalize">{p}</span>
                  </button>
                );
              })}
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100">
              <div className="flex justify-center">
                <PostPreview
                  content={caption}
                  mediaItems={mediaItems}
                  platform={previewPlatform}
                  user={{
                    name: "User Name", // TODO: Get actual name
                    username: user?.email?.split("@")[0] || "username",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LINE Guide Modal */}
      {showLineGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-50 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="px-4 py-3 bg-white border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <LineIcon className="w-5 h-5 text-[#00B900]" /> วิธีหา LINE Channel Access Token
              </h3>
              <button
                onClick={() => setShowLineGuide(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-100 space-y-5">
              <div className="bg-[#00B900]/5 border border-[#00B900]/15 rounded-xl p-4">
                <p className="text-sm text-slate-700 leading-relaxed">
                  ใช้ Token นี้สำหรับส่งข้อความแบบ Broadcast ไปยังผู้ติดตามใน LINE Official Account ของคุณ
                  ถ้ายังไม่เคยสร้าง ให้ทำตามขั้นตอนง่าย ๆ ด้านล่างนี้ได้เลย
                </p>
              </div>

              <div className="grid gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-800 mb-1">1. เข้า LINE Developers Console</p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    ไปที่
                    <a
                      href="https://developers.line.biz/console/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-primary-600 hover:underline"
                    >
                      developers.line.biz/console
                    </a>
                    และล็อกอินด้วยบัญชีที่เป็นเจ้าของ LINE OA
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-800 mb-1">2. เลือก Provider และ Channel</p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    เลือก Provider ของคุณ แล้วเข้าไปที่ Channel ประเภท
                    <span className="font-medium text-slate-700"> Messaging API</span>
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-800 mb-1">3. เปิดแท็บ Messaging API</p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    เลื่อนลงมาหาส่วน
                    <span className="font-medium text-slate-700"> Channel access token</span>
                    แล้วกดสร้างหรือออก Token
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-800 mb-1">4. คัดลอก Token แบบ Long-lived</p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    แนะนำให้ใช้ Token แบบ Long-lived เพื่อไม่ต้องกลับมาตั้งค่าบ่อย
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-800 mb-1">5. วาง Token ลงด้านล่างแล้วกดบันทึก</p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    หลังบันทึกแล้ว ระบบจะพร้อมส่ง LINE Broadcast จากหน้าโพสต์ทันที
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-800 mb-3">ตัวอย่างขั้นตอนจาก GIF</p>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img
                    src="/download.gif"
                    alt="ตัวอย่างวิธีหา LINE Channel Access Token"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                  ดูตามภาพเคลื่อนไหวนี้ประกอบได้เลย แล้วค่อยคัดลอก token มาวางในช่องด้านล่าง
                </p>
              </div>

              <div className="border-t border-slate-200 pt-5">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">กรอก LINE Channel Access Token</h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="password"
                    value={lineToken}
                    onChange={(e) => setLineToken(e.target.value)}
                    placeholder="วาง LINE Channel Access Token ที่นี่..."
                    className="flex-1 px-4 py-3 text-sm rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                  />
                  <button
                    onClick={handleSaveLineToken}
                    disabled={savingLine || !lineToken.trim()}
                    className="px-4 py-3 bg-slate-800 text-white text-sm font-medium rounded-xl hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  >
                    {savingLine ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    บันทึก Token
                  </button>
                </div>
                {hasLineToken && (
                  <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> บันทึก Token แล้ว พร้อมใช้งาน
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  ใช้เฉพาะ LINE Channel Access Token ของ Official Account เท่านั้น
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
