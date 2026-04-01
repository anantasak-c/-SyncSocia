import { useState } from "react";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Music2, 
  Heart, 
  MessageCircle, 
  Share2, 
  Repeat, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

interface MediaItem {
  type: "image" | "video";
  url: string;
}

interface PostPreviewProps {
  content: string;
  mediaItems: MediaItem[];
  platform: "facebook" | "twitter" | "instagram" | "tiktok" | "line";
  user: {
    name: string;
    username: string;
    avatar?: string;
  };
}

// --- Helper Components ---

function MediaDisplay({ item, className = "" }: { item: MediaItem; className?: string }) {
  if (item.type === "video") {
    return <video src={item.url} className={`w-full h-full object-cover ${className}`} controls />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={item.url} alt="preview" className={`w-full h-full object-cover ${className}`} />
  );
}

function MediaGrid({ mediaItems, rounded = false }: { mediaItems: MediaItem[]; rounded?: boolean }) {
  const count = mediaItems.length;
  const radiusClass = rounded ? "rounded-2xl overflow-hidden" : "";

  if (count === 0) return null;

  if (count === 1) {
    return (
      <div className={`w-full h-full ${radiusClass}`}>
        <MediaDisplay item={mediaItems[0]} />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className={`grid grid-cols-2 gap-0.5 w-full h-full ${radiusClass}`}>
        <MediaDisplay item={mediaItems[0]} />
        <MediaDisplay item={mediaItems[1]} />
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className={`grid grid-cols-2 gap-0.5 w-full h-full ${radiusClass}`}>
        <div className="row-span-2 relative">
           <MediaDisplay item={mediaItems[0]} className="absolute inset-0 h-full" />
        </div>
        <div className="relative h-full"><MediaDisplay item={mediaItems[1]} className="absolute inset-0" /></div>
        <div className="relative h-full"><MediaDisplay item={mediaItems[2]} className="absolute inset-0" /></div>
      </div>
    );
  }

  // 4 or more
  return (
    <div className={`grid grid-cols-2 grid-rows-2 gap-0.5 w-full h-full ${radiusClass}`}>
      <div className="relative h-full"><MediaDisplay item={mediaItems[0]} className="absolute inset-0" /></div>
      <div className="relative h-full"><MediaDisplay item={mediaItems[1]} className="absolute inset-0" /></div>
      <div className="relative h-full"><MediaDisplay item={mediaItems[2]} className="absolute inset-0" /></div>
      <div className="relative h-full">
        <MediaDisplay item={mediaItems[3]} className="absolute inset-0" />
        {count > 4 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm">
            +{count - 4}
          </div>
        )}
      </div>
    </div>
  );
}

function MediaCarousel({ mediaItems }: { mediaItems: MediaItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (mediaItems.length === 0) return null;

  const next = () => setCurrentIndex((p) => (p + 1) % mediaItems.length);
  const prev = () => setCurrentIndex((p) => (p - 1 + mediaItems.length) % mediaItems.length);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center group overflow-hidden">
       <div className="w-full h-full">
         <MediaDisplay item={mediaItems[currentIndex]} />
       </div>
       
       {mediaItems.length > 1 && (
         <>
           <button 
            onClick={(e) => { e.stopPropagation(); prev(); }} 
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/70 text-black rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-white z-10"
           >
             <ChevronLeft className="w-4 h-4" />
           </button>
           <button 
            onClick={(e) => { e.stopPropagation(); next(); }} 
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/70 text-black rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-white z-10"
           >
             <ChevronRight className="w-4 h-4" />
           </button>
           
           <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium z-10">
             {currentIndex + 1}/{mediaItems.length}
           </div>

           <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
             {mediaItems.map((_, i) => (
               <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? "bg-white scale-125" : "bg-white/40"}`} 
               />
             ))}
           </div>
         </>
       )}
    </div>
  );
}

// --- Main Component ---

export function PostPreview({ content, mediaItems, platform, user }: PostPreviewProps) {
  // --- Facebook Preview ---
  if (platform === "facebook") {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm max-w-md w-full mx-auto overflow-hidden font-sans">
        {/* Header */}
        <div className="p-3 flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
          <div>
            <div className="font-semibold text-sm text-slate-900">{user.name}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              Just now · <div className="w-3 h-3 rounded-full bg-slate-400" />
            </div>
          </div>
          <MoreHorizontal className="w-5 h-5 text-slate-500 ml-auto" />
        </div>
        
        {/* Content */}
        <div className="px-3 pb-3 text-sm text-slate-900 whitespace-pre-wrap">
          {content || "Your post content..."}
        </div>

        {/* Media */}
        {mediaItems.length > 0 && (
          <div className={`bg-slate-100 w-full ${mediaItems.length === 1 ? 'aspect-auto' : 'aspect-square sm:aspect-[4/3]'}`}>
            <MediaGrid mediaItems={mediaItems} />
          </div>
        )}

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-slate-500 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-[8px]">👍</span>
            </div>
            <span>Like</span>
          </div>
          <div className="flex gap-4">
            <span>Comment</span>
            <span>Share</span>
          </div>
        </div>
      </div>
    );
  }

  // --- Twitter (X) Preview ---
  if (platform === "twitter") {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm max-w-md w-full mx-auto p-4 font-sans">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-sm">
              <span className="font-bold text-slate-900">{user.name}</span>
              <span className="text-slate-500">@{user.username} · 1m</span>
            </div>
            
            <div className="text-sm text-slate-900 mt-1 whitespace-pre-wrap mb-3">
              {content || "What's happening?"}
            </div>

            {mediaItems.length > 0 && (
              <div className={`w-full border border-slate-200 rounded-2xl overflow-hidden ${mediaItems.length === 1 ? '' : 'aspect-square sm:aspect-video'}`}>
                <MediaGrid mediaItems={mediaItems} rounded />
              </div>
            )}

            <div className="flex justify-between mt-3 text-slate-500 max-w-xs">
              <MessageCircle className="w-4 h-4" />
              <Repeat className="w-4 h-4" />
              <Heart className="w-4 h-4" />
              <Share2 className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Instagram Preview ---
  if (platform === "instagram") {
    return (
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm max-w-sm w-full mx-auto overflow-hidden font-sans">
        {/* Header */}
        <div className="p-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
          <span className="text-sm font-semibold text-slate-900">{user.username}</span>
          <MoreHorizontal className="w-5 h-5 text-slate-900 ml-auto" />
        </div>

        {/* Media (Carousel) */}
        <div className="bg-slate-100 aspect-square w-full relative">
          {mediaItems.length > 0 ? (
            <MediaCarousel mediaItems={mediaItems} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">No media</div>
          )}
        </div>

        {/* Actions */}
        <div className="p-3 pb-1 flex justify-between">
          <div className="flex gap-4">
            <Heart className="w-6 h-6 text-slate-900" />
            <MessageCircle className="w-6 h-6 text-slate-900" />
            <Share2 className="w-6 h-6 text-slate-900" />
          </div>
          <div className="w-6 h-6 bg-slate-900/10 rounded" />
        </div>

        {/* Caption */}
        <div className="px-3 pb-3 text-sm">
          <div className="font-semibold text-slate-900 mb-1">1,234 likes</div>
          <div>
            <span className="font-semibold text-slate-900 mr-2">{user.username}</span>
            <span className="text-slate-900 whitespace-pre-wrap">{content}</span>
          </div>
          <div className="text-xs text-slate-400 mt-1 uppercase">Just now</div>
        </div>
      </div>
    );
  }

  // --- TikTok Preview ---
  if (platform === "tiktok") {
    return (
      <div className="bg-black rounded-2xl border border-slate-800 shadow-sm max-w-[300px] w-full mx-auto overflow-hidden font-sans relative aspect-[9/16] text-white">
        {/* Content Area */}
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
          {mediaItems.length > 0 ? (
            <MediaCarousel mediaItems={mediaItems} />
          ) : (
             <div className="text-slate-500">No media</div>
          )}
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none">
          <div className="mb-4 pointer-events-auto">
            <div className="font-semibold text-shadow">@{user.username}</div>
            <div className="text-sm opacity-90 text-shadow whitespace-pre-wrap line-clamp-3">
              {content}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs opacity-80">
              <Music2 className="w-3 h-3" />
              <span>Original Sound - {user.name}</span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="absolute right-2 bottom-20 flex flex-col gap-4 items-center pointer-events-auto">
           <div className="w-10 h-10 rounded-full bg-slate-200 border border-white" />
           <div className="flex flex-col items-center gap-1">
             <Heart className="w-8 h-8 text-white drop-shadow-md" fill="rgba(255,255,255,0.2)" />
             <span className="text-xs font-semibold shadow-black">1.2M</span>
           </div>
           <div className="flex flex-col items-center gap-1">
             <MessageCircle className="w-8 h-8 text-white drop-shadow-md" fill="rgba(255,255,255,0.2)" />
             <span className="text-xs font-semibold shadow-black">23K</span>
           </div>
           <div className="flex flex-col items-center gap-1">
             <Share2 className="w-8 h-8 text-white drop-shadow-md" fill="rgba(255,255,255,0.2)" />
             <span className="text-xs font-semibold shadow-black">45K</span>
           </div>
        </div>
      </div>
    );
  }

  // --- LINE OA Preview ---
  if (platform === "line") {
    return (
      <div className="bg-[#8cabd9] rounded-lg border border-slate-200 shadow-sm max-w-sm w-full mx-auto overflow-hidden font-sans h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-[#242d4a]/90 text-white p-3 flex items-center gap-3 backdrop-blur-md sticky top-0 z-10">
          <ChevronLeft className="w-6 h-6" />
          <div className="flex-1 font-semibold text-lg">{user.name}</div>
          <div className="flex gap-4">
            <span className="text-xl">🔍</span>
            <span className="text-xl">≡</span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-3 overflow-y-auto space-y-4">
          {/* Date separator */}
          <div className="flex justify-center mb-4">
            <span className="bg-black/20 text-white text-[10px] px-2 py-0.5 rounded-full">
              Today
            </span>
          </div>

          {/* Message Bubble */}
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-white flex-shrink-0 overflow-hidden border border-slate-100">
               {/* Avatar */}
               <div className="w-full h-full bg-slate-200" />
            </div>
            <div className="flex flex-col gap-2 max-w-[80%]">
              <span className="text-xs text-slate-700 font-medium">{user.name}</span>
              
              {/* Text Bubble */}
              {content && (
                <div className="bg-white p-3 rounded-2xl rounded-tl-none text-slate-900 text-sm shadow-sm whitespace-pre-wrap relative">
                  {content}
                  <div className="absolute bottom-0 right-[-45px] text-[10px] text-slate-500 w-10">
                    Read<br/>10:30 AM
                  </div>
                </div>
              )}

              {/* Media Bubble(s) */}
              {mediaItems.map((item, idx) => (
                <div key={idx} className="bg-white p-1 rounded-2xl rounded-tl-none overflow-hidden shadow-sm relative w-48">
                  <MediaDisplay item={item} className="rounded-xl w-full h-auto" />
                  {idx === mediaItems.length - 1 && !content && (
                     <div className="absolute bottom-0 right-[-45px] text-[10px] text-white w-10 drop-shadow-md">
                      Read<br/>10:30 AM
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer (Input Mockup) */}
        <div className="bg-white p-2 flex items-center gap-2 border-t border-slate-200">
           <div className="w-8 h-8 text-slate-400 text-2xl flex items-center justify-center">+</div>
           <div className="w-6 h-6 text-slate-400 text-xl flex items-center justify-center">📷</div>
           <div className="w-6 h-6 text-slate-400 text-xl flex items-center justify-center">🖼️</div>
           <div className="flex-1 bg-slate-100 rounded-full h-9 flex items-center px-3 text-slate-400 text-sm">
             Aa
           </div>
           <div className="w-6 h-6 text-slate-400 text-xl flex items-center justify-center">🎤</div>
        </div>
      </div>
    );
  }

  return null;
}
