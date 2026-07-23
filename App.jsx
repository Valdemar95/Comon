import React, { useState, useMemo } from "react";
import {
  Shield, ShieldCheck, Award, Star, Sparkles, CheckCircle2, Clock,
  Wrench, Gift, User, Phone, MapPin, Calendar, CreditCard, ChevronRight,
  ChevronDown, Search, TrendingUp, Users, FileText, ThumbsUp, ThumbsDown,
  Upload, X, RefreshCw, Camera, Instagram, Video, UserPlus, Bell,
  BadgeCheck, Home, Wifi, BatteryFull, SignalHigh, LayoutGrid, PartyPopper,
  Lock, ArrowRight, AlertTriangle, Flame, Settings, LogOut, Globe,
  Smartphone, LayoutDashboard, Plus, MessageCircle, Send, ShoppingCart,
  ShoppingBag, Minus, ChevronLeft, Package, Headset,
} from "lucide-react";

/* ============================================================
   ГЛОБАЛЬНЫЕ СТИЛИ (шрифты + скрытие скроллбара под мобильный вид)
   ============================================================ */
const display = { fontFamily: "'Playfair Display', Georgia, serif" };
const body = { fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" };

const GLOBAL_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');
.no-scrollbar::-webkit-scrollbar{display:none}
.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
`;

/* ============================================================
   ДАННЫЕ (адаптировано под VIPCOMPANY.KZ — электроконденсатные
   обогреватели ElectroCondensat, Петропавловск, Казахстан)
   ============================================================ */
const STATUS_STEPS = ["Зарегистрировано", "На рассмотрении", "Диагностика", "В работе", "Готово"];

const EQUIPMENT = [
  {
    id: 1,
    model: "ElectroCondensat Premium 2.0",
    serial: "SN-998822",
    purchaseDate: "14.03.2025",
    address: "г. Петропавловск, 1 проезд Я. Гашека, 8",
  },
  {
    id: 2,
    model: "ElectroCondensat Standard 1.5",
    serial: "SN-441207",
    purchaseDate: "02.06.2025",
    address: "г. Петропавловск, 1 проезд Я. Гашека, 8",
  },
];

const TARIFFS = [
  {
    id: "standard",
    name: "Стандарт",
    price: 39900,
    period: "год",
    features: [
      "Диагностика оборудования — 2 раза в год",
      "Приоритетная линия поддержки 9:00–18:00",
      "Скидка 10% на запчасти",
      "Реагирование в течение 48 часов",
    ],
  },
  {
    id: "premium",
    name: "Премиум",
    price: 69900,
    period: "год",
    highlighted: true,
    features: [
      "Диагностика оборудования — 4 раза в год",
      "Поддержка 24/7 без выходных",
      "Скидка 25% на запчасти и работы",
      "Реагирование в течение 4 часов",
      "Подменный обогреватель на время ремонта",
      "Личный сервис-менеджер",
    ],
  },
];

const PRODUCTS = [
  { id: 1, name: "ElectroCondensat Standard 1.5", category: "Обогреватели", price: 89900, badge: null },
  { id: 2, name: "ElectroCondensat Premium 2.0", category: "Обогреватели", price: 129900, badge: "Хит" },
  { id: 3, name: "ElectroCondensat Pro 3.0", category: "Обогреватели", price: 159900, badge: "Новинка" },
  { id: 4, name: "Напольная стойка для обогревателя", category: "Аксессуары", price: 12900, badge: null },
  { id: 5, name: "Комплект настенного крепления", category: "Аксессуары", price: 6900, badge: null },
  { id: 6, name: "Wi-Fi хаб управления", category: "Аксессуары", price: 24900, badge: null },
];

const SUPPORT_CHAT_INITIAL = [
  { id: 1, from: "support", text: "Здравствуйте, Данияр! Это служба поддержки VIPCOMPANY. Чем можем помочь?", time: "10:02" },
];

const BONUS_TASKS_INITIAL = [
  { id: 1, title: "Подписаться на Instagram-аккаунт", reward: 500, icon: "instagram", status: "available" },
  { id: 2, title: "Оставить видео-отзыв о сервисе", reward: 1000, icon: "video", status: "available" },
  { id: 3, title: "Привести друга по программе", reward: 3000, icon: "friend", status: "available" },
];

const SERVICE_REQUESTS_INITIAL = [
  {
    id: 1001,
    client: "Ахметов Данияр Серикович",
    equipment: "ElectroCondensat Premium 2.0",
    description: "Обогреватель не выходит на полную мощность, срабатывает через раз.",
    status: "Диагностика",
    date: "15.07.2026",
    hasPhoto: true,
  },
  {
    id: 1002,
    client: "Смагулова Айгерим Болатовна",
    equipment: "ElectroCondensat Standard 1.5",
    description: "Появился посторонний гул при работе на максимуме.",
    status: "На рассмотрении",
    date: "18.07.2026",
    hasPhoto: false,
  },
  {
    id: 1003,
    client: "Ковалёв Дмитрий Сергеевич",
    equipment: "ElectroCondensat Premium 2.0",
    description: "Плановое ТО по регламенту VIP Гарантии.",
    status: "Готово",
    date: "10.07.2026",
    hasPhoto: false,
  },
];

const BONUS_REQUESTS_INITIAL = [
  { id: 501, client: "Смагулова Айгерим Болатовна", task: "Видео-отзыв о сервисе", reward: 1000 },
  { id: 502, client: "Ковалёв Дмитрий Сергеевич", task: "Приведи друга", reward: 3000 },
];

const MOCK_CLIENTS = [
  { id: 1, name: "Ахметов Данияр Серикович", phone: "+7 707 123 45 67", equipment: "ElectroCondensat Premium 2.0", status: "VIP активна" },
  { id: 2, name: "Смагулова Айгерим Болатовна", phone: "+7 701 552 11 90", equipment: "ElectroCondensat Standard 1.5", status: "VIP активна" },
  { id: 3, name: "Ковалёв Дмитрий Сергеевич", phone: "+7 776 780 23 44", equipment: "ElectroCondensat Premium 2.0", status: "Истекает через 12 дн." },
  { id: 4, name: "Никитина Елена Романовна", phone: "+7 747 340 91 05", equipment: "ElectroCondensat Standard 1.5", status: "Истекла" },
];

function formatKZT(n) {
  return n.toLocaleString("ru-RU") + " ₸";
}
function formatDate(d) {
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });
}
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function daysUntil(date) {
  const now = new Date(2026, 6, 22); // "сегодня" в демо — 22 июля 2026
  return Math.max(0, Math.ceil((date - now) / 86400000));
}

/* ============================================================
   МЕЛКИЕ UI-ЭЛЕМЕНТЫ
   ============================================================ */
function GoldSeal({ size = "md" }) {
  const dims = size === "lg" ? "w-32 h-32" : size === "sm" ? "w-12 h-12" : "w-20 h-20";
  const textSize = size === "lg" ? "text-xl" : size === "sm" ? "text-[8px]" : "text-sm";
  const numSize = size === "lg" ? "text-3xl" : size === "sm" ? "text-sm" : "text-xl";
  return (
    <div className={`relative ${dims} shrink-0`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 via-amber-500 to-yellow-700 shadow-2xl shadow-amber-500/40" />
      <div className="absolute inset-[6%] rounded-full border-2 border-amber-100/40" />
      <div className="absolute inset-[14%] rounded-full bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col items-center justify-center">
        <span className={`text-amber-300 font-bold ${numSize}`} style={display}>365</span>
        <span className={`text-amber-200/70 tracking-[0.2em] uppercase ${textSize}`} style={body}>VIP</span>
      </div>
    </div>
  );
}

function GlassCard({ children, className = "" }) {
  return (
    <div className={`rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20 ${className}`}>
      {children}
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    "Зарегистрировано": "bg-slate-500/20 text-slate-300 border-slate-400/30",
    "На рассмотрении": "bg-blue-500/20 text-blue-300 border-blue-400/30",
    "Диагностика": "bg-amber-500/20 text-amber-300 border-amber-400/30",
    "В работе": "bg-orange-500/20 text-orange-300 border-orange-400/30",
    "Готово": "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${map[status] || map["Зарегистрировано"]}`} style={body}>
      {status}
    </span>
  );
}

function ProgressTracker({ status }) {
  const idx = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center w-full">
      {STATUS_STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center gap-1 min-w-[46px]">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                i < idx ? "bg-emerald-500 border-emerald-400" : i === idx ? "bg-amber-500 border-amber-300 animate-pulse" : "bg-slate-800 border-slate-700"
              }`}
            >
              {i < idx ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <span className={`text-[9px] font-bold ${i === idx ? "text-slate-900" : "text-slate-500"}`}>{i + 1}</span>}
            </div>
            <span className={`text-[8px] text-center leading-tight ${i <= idx ? "text-slate-200" : "text-slate-500"}`} style={body}>{step}</span>
          </div>
          {i < STATUS_STEPS.length - 1 && <div className={`flex-1 h-0.5 mb-4 ${i < idx ? "bg-emerald-500" : "bg-slate-700"}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function ModalSheet({ title, onClose, children }) {
  return (
    <div className="absolute inset-0 z-50 flex items-end bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-h-[88%] overflow-y-auto no-scrollbar rounded-t-3xl bg-slate-900 border-t border-white/10 shadow-2xl">
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mt-3 mb-1" />
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 sticky top-0 bg-slate-900 z-10">
          <h3 className="text-base font-bold text-white" style={display}>{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* Статус-бар в духе экрана смартфона */
function StatusBar() {
  const [time] = useState("9:41");
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between px-6 pt-3 pb-2 bg-slate-950/70 backdrop-blur-md text-white text-xs font-semibold">
      <span style={body}>{time}</span>
      <div className="flex items-center gap-1.5 text-white/90">
        <SignalHigh className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <BatteryFull className="w-4 h-4" />
      </div>
    </div>
  );
}

/* Нижняя навигация — общий компонент для всех экранов приложения */
function BottomTabBar({ items, active, onChange }) {
  return (
    <div className="sticky bottom-0 z-30 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 px-2 pt-2 pb-7 flex items-center justify-around">
      {items.map((it) => {
        const Icon = it.icon;
        const isActive = active === it.id;
        return (
          <button key={it.id} onClick={() => onChange(it.id)} className="relative flex flex-col items-center gap-1 px-3 py-1 min-w-[60px]">
            {it.badge > 0 && <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-slate-900" />}
            <Icon className={`w-5 h-5 ${isActive ? "text-amber-400" : "text-slate-500"}`} />
            <span className={`text-[10px] font-medium ${isActive ? "text-amber-400" : "text-slate-500"}`} style={body}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* Мокап корпуса телефона, внутри которого рендерится всё приложение */
function PhoneFrame({ children }) {
  return (
    <div className="relative w-full max-w-[400px] mx-auto">
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-2xl z-40" />
      <div
        className="relative rounded-[2.75rem] border-[7px] border-slate-800 bg-slate-950 shadow-2xl shadow-black/60 overflow-hidden"
        style={{ height: "min(860px, 85vh)" }}
      >
        <div className="h-full overflow-y-auto no-scrollbar bg-slate-950">{children}</div>
      </div>
      <div className="absolute -right-[9px] top-28 w-[3px] h-14 bg-slate-800 rounded-r" />
      <div className="absolute -left-[9px] top-24 w-[3px] h-8 bg-slate-800 rounded-l" />
      <div className="absolute -left-[9px] top-36 w-[3px] h-12 bg-slate-800 rounded-l" />
    </div>
  );
}

function DemoSwitcher({ mode, setMode }) {
  const items = [
    { id: "landing", label: "Сайт", icon: Globe },
    { id: "client", label: "Приложение", icon: Smartphone },
    { id: "admin", label: "Админка", icon: LayoutDashboard },
  ];
  return (
    <div className="w-full max-w-[400px] mx-auto mb-5 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <GoldSeal size="sm" />
        <div>
          <div className="text-white font-bold leading-tight text-sm" style={display}>VIP Гарантия 365</div>
          <div className="text-[10px] text-amber-400/70 tracking-wide" style={body}>демо для VIPCOMPANY.KZ</div>
        </div>
      </div>
      <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = mode === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setMode(it.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive ? "bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/30" : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
              style={body}
            >
              <Icon className="w-3.5 h-3.5" /> {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   ПУБЛИЧНЫЙ САЙТ (мобильная версия, кнопки закреплены снизу)
   ============================================================ */
function Landing({ setMode, tariff, setTariff, toast, setToast }) {
  const [serial, setSerial] = useState("");
  const [checkResult, setCheckResult] = useState(null);
  const [faqOpen, setFaqOpen] = useState(null);

  const handleCheck = () => {
    const found = EQUIPMENT.find((e) => e.serial.toLowerCase() === serial.trim().toLowerCase());
    setCheckResult(found ? { ok: true, equipment: found } : { ok: false });
  };

  const faqs = [
    { q: "Что покрывает «VIP Гарантия 365»?", a: "Полное сервисное обслуживание обогревателей ElectroCondensat: диагностика, ремонт, запчасти и приоритетная поддержка в течение всего срока подписки." },
    { q: "Как быстро приедет мастер?", a: "От 4 до 48 часов с момента регистрации обращения в личном кабинете — в зависимости от тарифа." },
    { q: "Что будет, если подписка истечёт?", a: "Сервисное обслуживание приостанавливается. Продлить можно в один клик в приложении — со скидкой за бонусные баллы." },
  ];

  return (
    <div className="min-h-full flex flex-col text-white" style={body}>
      <StatusBar />
      <div className="flex items-center justify-between px-5 pt-2 pb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-base" style={display}>VIPCOMPANY</span>
        </div>
        <BadgeCheck className="w-5 h-5 text-blue-400" />
      </div>

      <div className="flex-1 px-5 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold mb-5">
          <Star className="w-3 h-3" /> Программа премиального сервиса
        </div>
        <h1 className="text-3xl leading-[1.15] font-bold mb-4" style={display}>365 дней спокойствия для вашего ElectroCondensat</h1>
        <p className="text-slate-400 text-sm mb-6">Полная сервисная защита, приоритетная поддержка и мастера на связи — год без забот об отоплении.</p>

        <div className="flex justify-center mb-6">
          <GoldSeal size="lg" />
        </div>

        <div className="flex items-center gap-4 mb-8 text-xs text-slate-400 justify-center">
          <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 11 370+ клиентов</div>
          <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-400" /> Поддержка 24/7</div>
        </div>

        <h2 className="text-lg font-bold mb-3" style={display}>Тарифы защиты</h2>
        <div className="space-y-4 mb-8">
          {TARIFFS.map((t) => (
            <GlassCard key={t.id} className={`p-5 relative ${t.highlighted ? "border-amber-400/50 ring-1 ring-amber-400/30" : ""}`}>
              {t.highlighted && <div className="absolute -top-2.5 left-5 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-900 text-[10px] font-bold">Рекомендуем</div>}
              <h3 className="text-lg font-bold mb-1" style={display}>{t.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold text-amber-400">{formatKZT(t.price)}</span>
                <span className="text-slate-500 text-xs">/ {t.period}</span>
              </div>
              <ul className="space-y-2 mb-5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  setTariff(t.id);
                  setToast(`Тариф «${t.name}» выбран. Свяжемся с вами для оформления.`);
                  setTimeout(() => setToast(null), 3000);
                }}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition ${
                  tariff === t.id ? "bg-amber-500 text-slate-900" : "bg-white/5 border border-white/15 text-white hover:bg-white/10"
                }`}
              >
                {tariff === t.id ? "Тариф выбран ✓" : "Выбрать"}
              </button>
            </GlassCard>
          ))}
        </div>

        <GlassCard className="p-5 mb-8">
          <h3 className="text-sm font-bold mb-1.5 flex items-center gap-2" style={display}><Search className="w-4 h-4 text-amber-400" /> Проверка гарантии</h3>
          <p className="text-slate-400 text-xs mb-4">Введите серийный номер, например SN-998822</p>
          <div className="flex gap-2 mb-3">
            <input
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              placeholder="SN-998822"
              className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            />
            <button onClick={handleCheck} className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-900 font-semibold text-sm hover:bg-amber-400 transition shrink-0">
              Проверить
            </button>
          </div>
          {checkResult && (
            <div className={`p-3.5 rounded-xl border ${checkResult.ok ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"}`}>
              {checkResult.ok ? (
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <div className="font-semibold text-emerald-300">Гарантия активна</div>
                    <div className="text-slate-300 mt-0.5">{checkResult.equipment.model}</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <div className="font-semibold text-red-300">Оборудование не найдено</div>
                    <div className="text-slate-400 mt-0.5">Проверьте серийный номер.</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </GlassCard>

        <h3 className="text-lg font-bold mb-3" style={display}>Частые вопросы</h3>
        <div className="space-y-2.5 mb-8">
          {faqs.map((f, i) => (
            <GlassCard key={i} className="overflow-hidden">
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                <span className="font-medium text-sm pr-3">{f.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${faqOpen === i ? "rotate-180" : ""}`} />
              </button>
              {faqOpen === i && <div className="px-4 pb-4 text-xs text-slate-400">{f.a}</div>}
            </GlassCard>
          ))}
        </div>

        <div className="text-center text-[11px] text-slate-500 space-y-1 pb-2">
          <div className="flex items-center justify-center gap-1.5"><MapPin className="w-3 h-3" /> Петропавловск, 1 проезд Я. Гашека, 8</div>
          <div>+7 (777) 777 76 49 · info@vipcompany.kz</div>
          <div>© 2026 VIPCOMPANY.KZ</div>
        </div>
      </div>

      {toast && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-xl bg-slate-800 border border-amber-400/30 text-xs text-white shadow-2xl whitespace-nowrap">
          {toast}
        </div>
      )}

      <div className="sticky bottom-0 z-20 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 px-5 pt-3 pb-7 flex gap-3">
        <button
          onClick={() => document.getElementById("nothing")}
          className="flex-1 py-3 rounded-xl border border-white/15 text-white text-sm font-semibold hover:bg-white/5 transition"
        >
          Проверить гарантию
        </button>
        <button onClick={() => setMode("client")} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 text-sm font-bold hover:brightness-105 transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5">
          Войти в кабинет <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   КАБИНЕТ КЛИЕНТА — навигация снизу (Главная / Чат / Каталог / Профиль)
   ============================================================ */
function ClientApp({ client, subscription, isExpiredDemo, setIsExpiredDemo, requests, addRequest, tasks, submitTask, renewalOpen, setRenewalOpen, onRenewConfirm }) {
  const [tab, setTab] = useState("home");
  const [chatView, setChatView] = useState("menu"); // menu | requests | bonus | support
  const [requestsSubTab, setRequestsSubTab] = useState("new");
  const [reqForm, setReqForm] = useState({ equipment: EQUIPMENT[0].model, description: "", photo: false });
  const [reqSent, setReqSent] = useState(false);
  const [taskModal, setTaskModal] = useState(null);

  const [supportMessages, setSupportMessages] = useState(SUPPORT_CHAT_INITIAL);
  const [supportInput, setSupportInput] = useState("");

  const [cart, setCart] = useState({}); // { productId: qty }
  const [cartOpen, setCartOpen] = useState(false);
  const [catalogCategory, setCatalogCategory] = useState("Все");

  const expired = isExpiredDemo || !subscription.active;
  const daysLeft = daysUntil(subscription.endDate);
  const myRequests = requests.filter((r) => r.client === client.name);
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => sum + (PRODUCTS.find((p) => p.id === Number(id))?.price || 0) * qty, 0);

  const handleSubmitRequest = () => {
    if (!reqForm.description.trim()) return;
    addRequest({ equipment: reqForm.equipment, description: reqForm.description, hasPhoto: reqForm.photo });
    setReqSent(true);
    setReqForm({ equipment: EQUIPMENT[0].model, description: "", photo: false });
    setTimeout(() => { setReqSent(false); setRequestsSubTab("tracker"); }, 1400);
  };

  const openChatSection = (view) => {
    setTab("chat");
    setChatView(view);
  };

  const addToCart = (id) => setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const decFromCart = (id) => setCart((prev) => {
    const next = { ...prev };
    if (!next[id]) return next;
    next[id] -= 1;
    if (next[id] <= 0) delete next[id];
    return next;
  });

  const sendSupportMessage = () => {
    if (!supportInput.trim()) return;
    const text = supportInput.trim();
    setSupportMessages((prev) => [...prev, { id: Date.now(), from: "client", text, time: "сейчас" }]);
    setSupportInput("");
    setTimeout(() => {
      setSupportMessages((prev) => [...prev, {
        id: Date.now() + 1,
        from: "support",
        text: "Приняли ваше сообщение! Специалист поддержки ответит в течение нескольких минут.",
        time: "сейчас",
      }]);
    }, 1200);
  };

  const tabItems = [
    { id: "home", label: "Главная", icon: Home },
    { id: "chat", label: "Чат", icon: MessageCircle, badge: pendingTasks },
    { id: "catalog", label: "Каталог", icon: ShoppingBag, badge: cartCount },
    { id: "profile", label: "Профиль", icon: User },
  ];

  return (
    <div className="min-h-full flex flex-col text-white relative" style={body}>
      <StatusBar />

      {/* Демо-тумблер истечения подписки */}
      <div className="mx-4 mt-2 flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-dashed border-white/15 text-[10px] text-slate-400">
        <span>🎬 Демо: истёкшая подписка</span>
        <button onClick={() => setIsExpiredDemo(!isExpiredDemo)} className={`relative w-9 h-5 rounded-full transition ${isExpiredDemo ? "bg-red-500" : "bg-slate-700"}`}>
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isExpiredDemo ? "translate-x-4" : "translate-x-0.5"}`} />
        </button>
      </div>

      <div className="flex-1 px-4 pt-4 pb-4">
        {tab === "home" && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate" style={display}>{client.name}</div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" /> {client.phone}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] text-slate-500">Бонусы</div>
                <div className="text-base font-bold text-amber-400 flex items-center gap-1 justify-end"><Sparkles className="w-3.5 h-3.5" /> {client.bonusBalance.toLocaleString("ru-RU")}</div>
              </div>
            </div>

            <GlassCard className={`p-5 mb-4 border ${expired ? "border-red-500/40" : "border-amber-400/30"}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {expired ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <ShieldCheck className="w-4 h-4 text-amber-400" />}
                  <span className={`font-bold text-sm ${expired ? "text-red-300" : "text-amber-300"}`} style={display}>
                    {expired ? "VIP Гарантия истекла" : "VIP Гарантия активна"}
                  </span>
                </div>
                <GoldSeal size="sm" />
              </div>
              {expired ? (
                <>
                  <p className="text-xs text-slate-400 mb-3">Обслуживание приостановлено. Продлите подписку, чтобы восстановить доступ.</p>
                  <button onClick={() => setRenewalOpen(true)} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 font-bold text-sm hover:brightness-105 transition flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Продлить на 1 год
                  </button>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                    <div><div className="text-slate-500 mb-0.5">До окончания</div><div className="font-bold text-base">{daysLeft} дней</div></div>
                    <div><div className="text-slate-500 mb-0.5">Дата окончания</div><div className="font-bold text-sm">{formatDate(subscription.endDate)}</div></div>
                  </div>
                  <button onClick={() => setRenewalOpen(true)} className="w-full py-2 rounded-xl border border-amber-400/30 text-amber-300 text-xs font-medium hover:bg-amber-500/10 transition">
                    Продлить заранее
                  </button>
                </>
              )}
            </GlassCard>

            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2.5">Ваше оборудование</h3>
            <div className="space-y-2.5 mb-4">
              {EQUIPMENT.map((eq) => (
                <GlassCard key={eq.id} className="p-3.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Flame className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="font-medium text-xs">{eq.model}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-400 pl-5">
                    <div>№ {eq.serial}</div>
                    <div className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5" /> {eq.purchaseDate}</div>
                  </div>
                </GlassCard>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button onClick={() => { openChatSection("requests"); setRequestsSubTab("new"); }} className="py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-medium flex flex-col items-center justify-center gap-1.5 hover:bg-white/10 transition">
                <Plus className="w-4 h-4 text-amber-400" /> Новое обращение
              </button>
              <button onClick={() => setTab("catalog")} className="py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-medium flex flex-col items-center justify-center gap-1.5 hover:bg-white/10 transition">
                <ShoppingBag className="w-4 h-4 text-amber-400" /> Каталог продукции
              </button>
            </div>
          </>
        )}

        {tab === "chat" && chatView === "menu" && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Чат и заявки</h3>
            {[
              { id: "requests", label: "Сервисные заявки", desc: "Создать обращение и отследить статус", icon: Wrench, badge: 0 },
              { id: "bonus", label: "Бонусная программа", desc: "Задания и начисления баллов", icon: Gift, badge: pendingTasks },
              { id: "support", label: "Связаться с поддержкой", desc: "Прямой чат с оператором VIPCOMPANY", icon: Headset, badge: 0 },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => setChatView(item.id)} className="w-full">
                  <GlassCard className="p-4 flex items-center gap-3 hover:bg-white/[0.06] transition">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0 relative">
                      <Icon className="w-5 h-5 text-blue-400" />
                      {item.badge > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center">{item.badge}</span>}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                  </GlassCard>
                </button>
              );
            })}
          </div>
        )}

        {tab === "chat" && chatView === "requests" && (
          <>
            <button onClick={() => setChatView("menu")} className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 hover:text-white transition">
              <ChevronLeft className="w-4 h-4" /> Назад в чат
            </button>
            <div className="flex gap-2 mb-4">
              {[{ id: "new", label: "Новое обращение" }, { id: "tracker", label: "Мои заявки" }].map((s) => (
                <button key={s.id} onClick={() => setRequestsSubTab(s.id)} className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${requestsSubTab === s.id ? "bg-amber-500 text-slate-900" : "bg-white/5 text-slate-400 border border-white/10"}`}>
                  {s.label}
                </button>
              ))}
            </div>

            {requestsSubTab === "new" && (
              <GlassCard className="p-4">
                {expired ? (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5">
                    <Lock className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="text-red-300 font-medium mb-1">Требуется активная подписка</div>
                      <div className="text-slate-400 mb-3">Система проверила статус — гарантия истекла.</div>
                      <button onClick={() => setRenewalOpen(true)} className="px-3.5 py-2 rounded-lg bg-amber-500 text-slate-900 text-xs font-semibold hover:bg-amber-400 transition">Продлить сейчас</button>
                    </div>
                  </div>
                ) : reqSent ? (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-300 text-xs">
                    <CheckCircle2 className="w-4 h-4" /> Обращение зарегистрировано!
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    <div>
                      <label className="text-[11px] text-slate-500 mb-1.5 block">Оборудование</label>
                      <select value={reqForm.equipment} onChange={(e) => setReqForm({ ...reqForm, equipment: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-400/50">
                        {EQUIPMENT.map((eq) => <option key={eq.id} value={eq.model} className="bg-slate-900">{eq.model}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 mb-1.5 block">Описание неисправности</label>
                      <textarea value={reqForm.description} onChange={(e) => setReqForm({ ...reqForm, description: e.target.value })} rows={3} placeholder="Опишите, что произошло..." className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none" />
                    </div>
                    <button onClick={() => setReqForm({ ...reqForm, photo: !reqForm.photo })} className={`w-full py-2.5 rounded-xl border border-dashed text-xs flex items-center justify-center gap-2 transition ${reqForm.photo ? "border-emerald-400/50 text-emerald-300 bg-emerald-500/10" : "border-white/20 text-slate-400"}`}>
                      <Camera className="w-3.5 h-3.5" /> {reqForm.photo ? "Фото/видео прикреплено ✓" : "Прикрепить фото или видео"}
                    </button>
                    <button onClick={handleSubmitRequest} disabled={!reqForm.description.trim()} className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-900 font-bold text-sm hover:bg-amber-400 transition disabled:opacity-40">
                      Отправить обращение
                    </button>
                  </div>
                )}
              </GlassCard>
            )}

            {requestsSubTab === "tracker" && (
              <div className="space-y-3">
                {myRequests.length === 0 && <GlassCard className="p-6 text-center text-slate-500 text-xs">У вас пока нет обращений.</GlassCard>}
                {myRequests.map((r) => (
                  <GlassCard key={r.id} className="p-4">
                    <div className="flex items-center justify-between mb-2.5 gap-2">
                      <span className="font-medium text-xs truncate">{r.equipment}</span>
                      <StatusPill status={r.status} />
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">{r.description}</p>
                    <ProgressTracker status={r.status} />
                  </GlassCard>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "chat" && chatView === "bonus" && (
          <>
            <button onClick={() => setChatView("menu")} className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 hover:text-white transition">
              <ChevronLeft className="w-4 h-4" /> Назад в чат
            </button>
            <div className="space-y-2.5">
              {tasks.map((t) => {
                const Icon = t.icon === "instagram" ? Instagram : t.icon === "video" ? Video : UserPlus;
                return (
                  <GlassCard key={t.id} className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{t.title}</div>
                      <div className="text-[11px] text-amber-400 flex items-center gap-1 mt-0.5"><Sparkles className="w-3 h-3" /> +{t.reward} бонусов</div>
                    </div>
                    {t.status === "available" && (
                      <button onClick={() => setTaskModal(t)} className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-900 text-[11px] font-semibold hover:bg-amber-400 transition shrink-0">Выполнить</button>
                    )}
                    {t.status === "pending" && <span className="px-2.5 py-1.5 rounded-lg bg-blue-500/15 text-blue-300 text-[11px] font-medium shrink-0">На проверке</span>}
                    {t.status === "approved" && <span className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 text-[11px] font-medium flex items-center gap-1 shrink-0"><CheckCircle2 className="w-3 h-3" /> Начислено</span>}
                  </GlassCard>
                );
              })}
            </div>
          </>
        )}

        {tab === "chat" && chatView === "support" && (
          <div className="flex flex-col">
            <button onClick={() => setChatView("menu")} className="flex items-center gap-1.5 text-xs text-slate-400 mb-3 hover:text-white transition shrink-0">
              <ChevronLeft className="w-4 h-4" /> Назад в чат
            </button>
            <GlassCard className="p-3 mb-3 flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center relative">
                <Headset className="w-4 h-4 text-emerald-400" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium">Поддержка VIPCOMPANY</div>
                <div className="text-[10px] text-emerald-400">онлайн, отвечает быстро</div>
              </div>
            </GlassCard>

            <div className="h-[420px] overflow-y-auto no-scrollbar space-y-2.5 pr-1">
              {supportMessages.map((m) => (
                <div key={m.id} className={`flex ${m.from === "client" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs ${m.from === "client" ? "bg-amber-500 text-slate-900 rounded-br-sm" : "bg-white/10 text-white rounded-bl-sm"}`}>
                    {m.text}
                    <div className={`text-[9px] mt-1 ${m.from === "client" ? "text-slate-800/60" : "text-slate-400"}`}>{m.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-3 shrink-0">
              <input
                value={supportInput}
                onChange={(e) => setSupportInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendSupportMessage()}
                placeholder="Написать сообщение..."
                className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              />
              <button onClick={sendSupportMessage} className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 transition flex items-center justify-center shrink-0">
                <Send className="w-4 h-4 text-slate-900" />
              </button>
            </div>
          </div>
        )}

        {tab === "catalog" && (
          <>
            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
              {["Все", "Обогреватели", "Аксессуары"].map((c) => (
                <button key={c} onClick={() => setCatalogCategory(c)} className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${catalogCategory === c ? "bg-amber-500 text-slate-900" : "bg-white/5 text-slate-400 border border-white/10"}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {PRODUCTS.filter((p) => catalogCategory === "Все" || p.category === catalogCategory).map((p) => (
                <GlassCard key={p.id} className="p-3 flex flex-col">
                  <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center mb-2.5 relative">
                    {p.category === "Обогреватели" ? <Flame className="w-8 h-8 text-amber-400/70" /> : <Package className="w-8 h-8 text-blue-400/70" />}
                    {p.badge && <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-amber-500 text-slate-900 text-[9px] font-bold">{p.badge}</span>}
                  </div>
                  <div className="text-[11px] font-medium leading-tight mb-1.5 min-h-[28px]">{p.name}</div>
                  <div className="text-sm font-bold text-amber-400 mb-2.5">{formatKZT(p.price)}</div>
                  {cart[p.id] ? (
                    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-2 py-1.5">
                      <button onClick={() => decFromCart(p.id)} className="w-5 h-5 flex items-center justify-center text-slate-300"><Minus className="w-3 h-3" /></button>
                      <span className="text-xs font-semibold">{cart[p.id]}</span>
                      <button onClick={() => addToCart(p.id)} className="w-5 h-5 flex items-center justify-center text-slate-300"><Plus className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(p.id)} className="py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-medium hover:bg-white/10 transition">
                      В корзину
                    </button>
                  )}
                </GlassCard>
              ))}
            </div>
          </>
        )}

        {tab === "profile" && (
          <div className="space-y-3">
            <GlassCard className="p-5 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-3">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="font-bold text-sm" style={display}>{client.name}</div>
              <div className="text-xs text-slate-400 mt-1">{client.phone}</div>
              <div className="mt-3 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {client.bonusBalance.toLocaleString("ru-RU")} бонусов
              </div>
            </GlassCard>
            <GlassCard className="divide-y divide-white/5">
              {[
                { icon: MapPin, label: "Адрес установки", value: EQUIPMENT[0].address },
                { icon: Bell, label: "Уведомления", value: "Включены" },
                { icon: Settings, label: "Настройки аккаунта", value: "" },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.label} className="flex items-center gap-3 p-4">
                    <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium">{row.label}</div>
                      {row.value && <div className="text-[11px] text-slate-500 truncate">{row.value}</div>}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                  </div>
                );
              })}
            </GlassCard>
            <button className="w-full py-3 rounded-xl border border-red-500/20 text-red-400 text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-500/5 transition">
              <LogOut className="w-4 h-4" /> Выйти из аккаунта
            </button>
          </div>
        )}
      </div>

      {tab === "catalog" && cartCount > 0 && (
        <button onClick={() => setCartOpen(true)} className="absolute left-4 right-4 bottom-[92px] z-20 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 shadow-xl shadow-amber-500/30 px-4 py-3 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-bold"><ShoppingCart className="w-4 h-4" /> Корзина · {cartCount}</span>
          <span className="text-sm font-bold">{formatKZT(cartTotal)}</span>
        </button>
      )}

      <BottomTabBar items={tabItems} active={tab} onChange={setTab} />

      {cartOpen && (
        <CartModal
          cart={cart}
          addToCart={addToCart}
          decFromCart={decFromCart}
          total={cartTotal}
          onClose={() => setCartOpen(false)}
          onOrdered={() => setCart({})}
        />
      )}

      {taskModal && (
        <ModalSheet title={taskModal.title} onClose={() => setTaskModal(null)}>
          <p className="text-xs text-slate-400 mb-4">Прикрепите скриншот выполнения. Бонусы начислятся после проверки модератором.</p>
          <div className="border-2 border-dashed border-white/15 rounded-xl p-6 flex flex-col items-center justify-center gap-2 mb-4 text-slate-500">
            <Upload className="w-7 h-7" />
            <span className="text-[11px]">Нажмите, чтобы загрузить скриншот (демо)</span>
          </div>
          <button onClick={() => { submitTask(taskModal.id); setTaskModal(null); }} className="w-full py-3 rounded-xl bg-amber-500 text-slate-900 font-bold text-sm hover:bg-amber-400 transition">
            Отправить на проверку
          </button>
        </ModalSheet>
      )}

      {renewalOpen && (
        <RenewalModal client={client} onClose={() => setRenewalOpen(false)} onConfirm={onRenewConfirm} />
      )}
    </div>
  );
}

/* ============================================================
   МОДАЛКА ПРОДЛЕНИЯ ПОДПИСКИ (нижняя шторка)
   ============================================================ */
function RenewalModal({ client, onClose, onConfirm }) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState("premium");
  const [useBonuses, setUseBonuses] = useState(false);
  const [paying, setPaying] = useState(false);

  const tariffObj = TARIFFS.find((t) => t.id === selected);
  const bonusDiscount = useBonuses ? Math.min(15000, client.bonusBalance) : 0;
  const finalPrice = Math.max(0, tariffObj.price - bonusDiscount);

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setStep(3);
      onConfirm({ bonusesSpent: bonusDiscount });
    }, 1400);
  };

  return (
    <ModalSheet title={step === 3 ? "Готово!" : "Продление подписки"} onClose={onClose}>
      {step === 1 && (
        <div className="space-y-3">
          {TARIFFS.map((t) => (
            <button key={t.id} onClick={() => setSelected(t.id)} className={`w-full text-left p-3.5 rounded-xl border transition ${selected === t.id ? "border-amber-400/60 bg-amber-500/10" : "border-white/10 bg-white/5"}`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{t.name}</span>
                <span className="text-amber-400 font-bold text-sm">{formatKZT(t.price)}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{t.features[0]}</div>
            </button>
          ))}
          <button onClick={() => setStep(2)} className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-900 font-bold text-sm hover:bg-amber-400 transition mt-1">Продолжить</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
            <div className="flex justify-between mb-2"><span className="text-slate-400">Тариф</span><span>{tariffObj.name}</span></div>
            <div className="flex justify-between mb-2"><span className="text-slate-400">Стоимость</span><span>{formatKZT(tariffObj.price)}</span></div>
            {useBonuses && <div className="flex justify-between mb-2 text-emerald-400"><span>Скидка бонусами</span><span>−{formatKZT(bonusDiscount)}</span></div>}
            <div className="flex justify-between font-bold pt-2 border-t border-white/10 mt-2 text-sm"><span>Итого</span><span className="text-amber-400">{formatKZT(finalPrice)}</span></div>
          </div>
          <button onClick={() => setUseBonuses(!useBonuses)} className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition ${useBonuses ? "border-amber-400/50 bg-amber-500/10" : "border-white/10 bg-white/5"}`}>
            <span className="text-xs flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> Списать бонусы ({client.bonusBalance.toLocaleString("ru-RU")})</span>
            <div className={`relative w-9 h-5 rounded-full transition ${useBonuses ? "bg-amber-500" : "bg-slate-700"}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${useBonuses ? "translate-x-4" : "translate-x-0.5"}`} />
            </div>
          </button>
          <button onClick={handlePay} disabled={paying} className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 font-bold text-sm hover:brightness-105 transition flex items-center justify-center gap-2 disabled:opacity-60">
            {paying ? <><RefreshCw className="w-4 h-4 animate-spin" /> Обработка платежа...</> : <><CreditCard className="w-4 h-4" /> Оплатить {formatKZT(finalPrice)}</>}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-3">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <PartyPopper className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <h4 className="text-lg font-bold mb-2" style={display}>Подписка продлена!</h4>
          <p className="text-xs text-slate-400 mb-5">Гарантия активирована ещё на +365 дней.</p>
          <button onClick={onClose} className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 transition font-medium text-sm">Закрыть</button>
        </div>
      )}
    </ModalSheet>
  );
}

/* ============================================================
   МОДАЛКА КОРЗИНЫ / ОФОРМЛЕНИЯ ЗАКАЗА ИЗ КАТАЛОГА
   ============================================================ */
function CartModal({ cart, addToCart, decFromCart, total, onClose, onOrdered }) {
  const [step, setStep] = useState("cart"); // cart | paying | success
  const items = Object.entries(cart).map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === Number(id)), qty }));

  const handlePay = () => {
    setStep("paying");
    setTimeout(() => {
      setStep("success");
      onOrdered();
    }, 1400);
  };

  return (
    <ModalSheet title={step === "success" ? "Заказ оформлен!" : "Ваша корзина"} onClose={onClose}>
      {step === "cart" && (
        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">Корзина пуста.</p>
          ) : (
            <>
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shrink-0">
                    {product.category === "Обогреватели" ? <Flame className="w-5 h-5 text-amber-400/70" /> : <Package className="w-5 h-5 text-blue-400/70" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{product.name}</div>
                    <div className="text-[11px] text-amber-400">{formatKZT(product.price)}</div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-2 py-1 shrink-0">
                    <button onClick={() => decFromCart(product.id)} className="w-5 h-5 flex items-center justify-center text-slate-300"><Minus className="w-3 h-3" /></button>
                    <span className="text-xs font-semibold w-3 text-center">{qty}</span>
                    <button onClick={() => addToCart(product.id)} className="w-5 h-5 flex items-center justify-center text-slate-300"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 border-t border-white/10 text-sm font-bold">
                <span>Итого</span>
                <span className="text-amber-400">{formatKZT(total)}</span>
              </div>
              <button onClick={handlePay} className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 font-bold text-sm hover:brightness-105 transition flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4" /> Оформить заказ
              </button>
            </>
          )}
        </div>
      )}

      {step === "paying" && (
        <div className="py-10 flex flex-col items-center gap-3 text-slate-400 text-sm">
          <RefreshCw className="w-6 h-6 animate-spin text-amber-400" /> Обработка платежа...
        </div>
      )}

      {step === "success" && (
        <div className="text-center py-3">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <PartyPopper className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <h4 className="text-lg font-bold mb-2" style={display}>Спасибо за заказ!</h4>
          <p className="text-xs text-slate-400 mb-5">Наш менеджер свяжется с вами для подтверждения доставки в Петропавловске.</p>
          <button onClick={onClose} className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 transition font-medium text-sm">Закрыть</button>
        </div>
      )}
    </ModalSheet>
  );
}

/* ============================================================
   ПАНЕЛЬ СОТРУДНИКА — тоже в мобильном формате, навигация снизу
   ============================================================ */
function AdminPanel({ requests, advanceStatus, bonusRequests, approveBonus, rejectBonus }) {
  const [tab, setTab] = useState("dashboard");

  const stats = useMemo(() => ({
    totalClients: 428,
    activeSubs: 391,
    openRequests: requests.filter((r) => r.status !== "Готово").length,
    bonusPending: bonusRequests.length,
  }), [requests, bonusRequests]);

  const nextStatus = (status) => {
    const idx = STATUS_STEPS.indexOf(status);
    return STATUS_STEPS[Math.min(idx + 1, STATUS_STEPS.length - 1)];
  };

  const tabItems = [
    { id: "dashboard", label: "Дашборд", icon: LayoutGrid },
    { id: "requests", label: "Заявки", icon: Wrench },
    { id: "bonuses", label: "Бонусы", icon: Gift, badge: stats.bonusPending },
    { id: "clients", label: "Клиенты", icon: Users },
  ];

  return (
    <div className="min-h-full flex flex-col text-white" style={body}>
      <StatusBar />
      <div className="flex items-center gap-2.5 px-4 pt-2 pb-3">
        <GoldSeal size="sm" />
        <div>
          <h1 className="text-sm font-bold" style={display}>Панель сотрудника</h1>
          <p className="text-[10px] text-slate-500">VIPCOMPANY.KZ · Сервис-центр</p>
        </div>
      </div>

      <div className="flex-1 px-4 pb-4">
        {tab === "dashboard" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Всего клиентов", value: stats.totalClients, icon: Users, color: "text-blue-400" },
                { label: "Активные подписки", value: stats.activeSubs, icon: ShieldCheck, color: "text-emerald-400" },
                { label: "Открытые заявки", value: stats.openRequests, icon: Wrench, color: "text-amber-400" },
                { label: "Заявки на бонусы", value: stats.bonusPending, icon: Gift, color: "text-orange-400" },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <GlassCard key={s.label} className="p-4">
                    <Icon className={`w-4 h-4 ${s.color} mb-2`} />
                    <div className="text-2xl font-bold" style={display}>{s.value}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
                  </GlassCard>
                );
              })}
            </div>
            <GlassCard className="p-4">
              <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-300"><TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Последние обращения</div>
              <div className="space-y-2">
                {requests.slice(0, 3).map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-xs py-2 border-b border-white/5 last:border-0 gap-2">
                    <span className="text-slate-400 truncate">{r.client}</span>
                    <StatusPill status={r.status} />
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {tab === "requests" && (
          <div className="space-y-3">
            {requests.map((r) => (
              <GlassCard key={r.id} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-medium text-xs">{r.client}</span>
                  <StatusPill status={r.status} />
                </div>
                <div className="text-[11px] text-slate-400 mb-2">{r.equipment} · {r.date}</div>
                <p className="text-[11px] text-slate-500 mb-3">{r.description}</p>
                {r.status !== "Готово" ? (
                  <button onClick={() => advanceStatus(r.id)} className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 transition text-[11px] font-medium flex items-center gap-1">
                    {nextStatus(r.status)} <ChevronRight className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="text-emerald-400 text-[11px] flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Завершено</span>
                )}
              </GlassCard>
            ))}
          </div>
        )}

        {tab === "bonuses" && (
          <div className="space-y-3">
            {bonusRequests.length === 0 && <GlassCard className="p-6 text-center text-slate-500 text-xs">Нет заявок на рассмотрении.</GlassCard>}
            {bonusRequests.map((b) => (
              <GlassCard key={b.id} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-9 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
                    <Camera className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{b.client}</div>
                    <div className="text-[11px] text-slate-400">{b.task} · <span className="text-amber-400">+{b.reward}</span></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approveBonus(b.id)} className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition text-[11px] font-medium flex items-center justify-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5" /> Одобрить
                  </button>
                  <button onClick={() => rejectBonus(b.id)} className="flex-1 py-2 rounded-lg bg-red-600/80 hover:bg-red-500 transition text-[11px] font-medium flex items-center justify-center gap-1">
                    <ThumbsDown className="w-3.5 h-3.5" /> Отклонить
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {tab === "clients" && (
          <div className="space-y-2.5">
            {[...MOCK_CLIENTS, { id: 5, name: "Ахметов Данияр Серикович", phone: "+7 707 123 45 67", equipment: "ElectroCondensat Premium 2.0", status: "VIP активна", demo: true }].map((c) => (
              <GlassCard key={c.id} className="p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-500/15 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{c.name} {c.demo && <span className="text-[9px] text-blue-400">(демо)</span>}</div>
                  <div className="text-[10px] text-slate-500 truncate">{c.phone} · {c.equipment}</div>
                </div>
                <span className={`text-[10px] font-medium shrink-0 ${c.status.includes("активна") ? "text-emerald-400" : c.status.includes("Истекла") ? "text-red-400" : "text-amber-400"}`}>{c.status}</span>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      <BottomTabBar items={tabItems} active={tab} onChange={setTab} />
    </div>
  );
}

/* ============================================================
   ГЛАВНЫЙ КОМПОНЕНТ
   ============================================================ */
export default function App() {
  const [mode, setMode] = useState("landing");
  const [tariff, setTariff] = useState("premium");
  const [toast, setToast] = useState(null);

  const client = { name: "Ахметов Данияр Серикович", phone: "+7 707 123 45 67" };
  const [bonusBalance, setBonusBalance] = useState(5500);

  const [subscription, setSubscription] = useState({ active: true, endDate: new Date(2027, 6, 20) });
  const [isExpiredDemo, setIsExpiredDemo] = useState(false);
  const [renewalOpen, setRenewalOpen] = useState(false);

  const [requests, setRequests] = useState(SERVICE_REQUESTS_INITIAL);
  const [bonusTasks, setBonusTasks] = useState(BONUS_TASKS_INITIAL);
  const [bonusRequests, setBonusRequests] = useState(BONUS_REQUESTS_INITIAL);

  const addRequest = (data) => {
    setRequests((prev) => [{ id: Date.now(), client: client.name, date: "22.07.2026", status: "Зарегистрировано", ...data }, ...prev]);
  };

  const advanceStatus = (id) => {
    setRequests((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      const idx = STATUS_STEPS.indexOf(r.status);
      return { ...r, status: STATUS_STEPS[Math.min(idx + 1, STATUS_STEPS.length - 1)] };
    }));
  };

  const submitTask = (taskId) => {
    const task = bonusTasks.find((t) => t.id === taskId);
    setBonusTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: "pending" } : t)));
    setBonusRequests((prev) => [...prev, { id: Date.now(), client: client.name, task: task.title, reward: task.reward, taskId }]);
  };

  const approveBonus = (id) => {
    const req = bonusRequests.find((b) => b.id === id);
    if (req && req.client === client.name) {
      setBonusBalance((b) => b + req.reward);
      setBonusTasks((prev) => prev.map((t) => (t.id === req.taskId ? { ...t, status: "approved" } : t)));
    }
    setBonusRequests((prev) => prev.filter((b) => b.id !== id));
  };

  const rejectBonus = (id) => {
    const req = bonusRequests.find((b) => b.id === id);
    if (req && req.client === client.name) {
      setBonusTasks((prev) => prev.map((t) => (t.id === req.taskId ? { ...t, status: "available" } : t)));
    }
    setBonusRequests((prev) => prev.filter((b) => b.id !== id));
  };

  const handleRenewalConfirm = ({ bonusesSpent }) => {
    setSubscription({ active: true, endDate: addDays(new Date(2026, 6, 22), 365) });
    setIsExpiredDemo(false);
    if (bonusesSpent) setBonusBalance((b) => Math.max(0, b - bonusesSpent));
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center py-8 px-4">
      <style>{GLOBAL_STYLE}</style>
      <DemoSwitcher mode={mode} setMode={setMode} />

      <PhoneFrame>
        {mode === "landing" && <Landing setMode={setMode} tariff={tariff} setTariff={setTariff} toast={toast} setToast={setToast} />}
        {mode === "client" && (
          <ClientApp
            client={{ ...client, bonusBalance }}
            subscription={subscription}
            isExpiredDemo={isExpiredDemo}
            setIsExpiredDemo={setIsExpiredDemo}
            requests={requests}
            addRequest={addRequest}
            tasks={bonusTasks}
            submitTask={submitTask}
            renewalOpen={renewalOpen}
            setRenewalOpen={setRenewalOpen}
            onRenewConfirm={handleRenewalConfirm}
          />
        )}
        {mode === "admin" && (
          <AdminPanel requests={requests} advanceStatus={advanceStatus} bonusRequests={bonusRequests} approveBonus={approveBonus} rejectBonus={rejectBonus} />
        )}
      </PhoneFrame>

      <p className="text-center text-[11px] text-slate-600 mt-5 max-w-[400px]">
        Демо-прототип для презентации VIPCOMPANY.KZ · переключайте режимы сверху, навигация внутри приложения — снизу, как в нативном мобильном приложении
      </p>
    </div>
  );
}
