import { analyticsBars, engagementSeries, reachSeries } from "../_data/mock";

export function BarChartCard() {
  const max = Math.max(...analyticsBars, 1);
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">ยอดเห็นโพสต์ 14 วัน</div>
          <div className="text-xs text-slate-500">mock-up data สำหรับการพรีเซนต์</div>
        </div>
        <div className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">Impressions</div>
      </div>
      <div className="flex h-48 items-end gap-2">
        {analyticsBars.map((value, index) => (
          <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div className="w-full rounded-t-2xl bg-gradient-to-t from-indigo-600 to-sky-400" style={{ height: `${Math.max((value / max) * 100, 8)}%` }} />
            <span className="text-[11px] font-medium text-slate-400">{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AreaChartCard() {
  const width = 520;
  const height = 200;
  const pad = 18;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const max = Math.max(...reachSeries, 1);
  const points = reachSeries.map((value, index) => ({
    x: pad + (index / (reachSeries.length - 1)) * innerW,
    y: pad + innerH - (value / max) * innerH,
  }));
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
  const area = `${line} L${points[points.length - 1].x},${height - pad} L${points[0].x},${height - pad} Z`;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">คนเข้าถึงรวม</div>
          <div className="text-xs text-slate-500">เส้นแนวโน้มที่อ่านง่ายสำหรับผู้บริหาร</div>
        </div>
        <div className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-600">Reach</div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
        <defs>
          <linearGradient id="showcase-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#showcase-area)" />
        <path d={line} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />
        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r="4" fill="#fff" stroke="#8b5cf6" strokeWidth="2" />
        ))}
      </svg>
    </div>
  );
}

export function LineChartCard() {
  const width = 520;
  const height = 200;
  const pad = 18;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const max = Math.max(...engagementSeries, 1);
  const points = engagementSeries.map((value, index) => ({
    x: pad + (index / (engagementSeries.length - 1)) * innerW,
    y: pad + innerH - (value / max) * innerH,
  }));
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">Engagement Rate</div>
          <div className="text-xs text-slate-500">เหมาะใช้คุยเรื่องคุณภาพคอนเทนต์</div>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">{engagementSeries.at(-1)}%</div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
        <path d={line} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
        {points.map((point, index) => (
          <g key={index}>
            <circle cx={point.x} cy={point.y} r="4" fill="#fff" stroke="#10b981" strokeWidth="2" />
            <text x={point.x} y={height - 2} textAnchor="middle" className="fill-slate-400 text-[10px]">{index + 1}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
