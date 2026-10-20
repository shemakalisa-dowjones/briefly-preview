import { useState, useRef } from 'react';
import {
  HouseSimple,
  ChartLineUp,
  Play,
  DotsThree,
  BookmarkSimple,
  Sparkle,
  X,
  PaperPlaneRight,
  ShareNetwork,
  SpeakerSimpleSlash,
  ArrowRight,
  Bell,
  Check,
  Newspaper,
  UserCircle,
  TrendUp,
  Article,
  CaretRight,
} from '@phosphor-icons/react';

/* ================================================================
   INTERACTIVE CLICKABLE PROTOTYPE
   Priya Menon — 5 moments, connected by hotspot taps.

   Flow:
   M1 Briefing  → tap "Track this storyline" on card 2  → M2
   M2 Sheet     → tap "Done"                             → M3
   M3 Delta     → tap "Open in AI Mode"                  → M4
   M4 AI Mode   → tap X close                            → M5
   M5 Return    → tap "Track this too" on Economy card   → restart
   ================================================================ */

const STEP_META = [
  { label: 'Tuesday Briefing', time: '7:04 a.m.', hint: 'Tap "Track this storyline" on the World card' },
  { label: 'Alert Created', time: '7:11 a.m.', hint: 'Tap "Done" to confirm tracking' },
  { label: 'Delta Alert', time: 'Thu 2:47 p.m.', hint: 'Tap "Open in AI Mode"' },
  { label: 'AI Mode', time: 'Thu 2:53 p.m.', hint: 'Tap X to close when you\'re done reading' },
  { label: 'Friday Briefing', time: 'Fri 7:02 a.m.', hint: 'Tap "Track this too" on the Economy card to restart' },
];

/* ---- Shared ---- */

function BottomNav({ active = 'briefing' }) {
  const items = [
    { id: 'home', label: 'Home', Icon: HouseSimple },
    { id: 'myWSJ', label: 'MyWSJ', Icon: Sparkle },
    { id: 'briefing', label: 'Briefing', Icon: Newspaper },
    { id: 'markets', label: 'Markets', Icon: ChartLineUp },
    { id: 'media', label: 'Media', Icon: Play },
    { id: 'more', label: 'More', Icon: DotsThree },
  ];
  return (
    <nav className="bottomNav">
      {items.map(({ id, label, Icon }) => (
        <button key={id} className="navItem" data-active={id === active ? 'true' : undefined}>
          <Icon size={24} weight={id === active ? 'fill' : 'regular'} />
          <span className="navLabel">{label}</span>
        </button>
      ))}
    </nav>
  );
}

function Masthead() {
  return (
    <div style={{ textAlign: 'center', padding: '12px 0 4px', fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, letterSpacing: 1, color: 'var(--wsj-text)' }}>
      The Wall Street Journal.
    </div>
  );
}

function Hotspot({ children, onClick, label }) {
  return (
    <span onClick={onClick} role="button" aria-label={label} className="hotspot">
      {children}
    </span>
  );
}

function SourceStack({ sources }) {
  return (
    <div className="source-stack">
      <div className="source-label">Sources</div>
      <div className="source-list">
        {sources.map((s, i) => (
          <div key={i} className="source-item">
            <span className="source-num">{i + 1}</span>
            <span className="source-title">{s.title}</span>
            <span className="source-pub">{s.pub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeeperSheet({ card, onClose }) {
  if (!card) return null;
  const d = card.deeper;
  return (
    <div className="deeper-overlay" onClick={onClose}>
      <div className="deeper-sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="deeper-header">
          <div className="deeper-eyebrow">{card.eyebrow}</div>
          <button className="ai-close" onClick={onClose}><X size={18} /></button>
        </div>
        <hr className="sheet-rule" />

        <div className="deeper-section">
          <div className="deeper-section-label"><Article size={12} weight="bold" /> Source articles</div>
          <div className="deeper-sources">
            {d.sources.map((s, i) => (
              <div key={i} className="deeper-source">
                <div className="deeper-source-title">{s.title}</div>
                <div className="deeper-source-meta">{s.pub} · {s.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="deeper-section">
          <div className="deeper-section-label"><UserCircle size={12} weight="bold" /> Key people</div>
          <div className="deeper-people">
            {d.people.map((p, i) => (
              <div key={i} className="deeper-person">
                <div className="deeper-person-name">{p.name}</div>
                <div className="deeper-person-role">{p.role}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="deeper-section">
          <div className="deeper-section-label"><TrendUp size={12} weight="bold" /> Key numbers</div>
          <div className="deeper-numbers">
            {d.numbers.map((n, i) => (
              <div key={i} className="deeper-number">
                <div className="deeper-number-value">{n.value}</div>
                <div className="deeper-number-label">{n.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Inline alert card shown on tracked storylines in M5 */
function AlertBadge({ onClick }) {
  return (
    <button className="alert-badge" onClick={onClick}>
      <Bell size={13} weight="fill" />
      <span>1 alert since Tuesday</span>
      <CaretRight size={12} weight="bold" />
    </button>
  );
}

/* ---- MOMENT 1 ---- */

const BRIEFING_CARDS = [
  {
    eyebrow: 'MARKETS',
    lede: 'The AI trade is fracturing along a credit line, separating the builders who borrowed from the giants who didn\'t.',
    body: 'CoreWeave\'s 2030 bonds now yield close to 15% while data-center bonds leased to the same company yield around 8% — investors trust the building more than the tenant. Microsoft pulled out of a U.K. data-center deal over power-grid delays, showing how quickly clients can walk.\n\nVanguard\'s Timothy Casaletto says he has "high conviction the AI trade will roll over — hard." Macquarie warns a rate hike plus funding issues raise risks of an AI capex slowdown by 2027.',
    deeper: {
      sources: [
        { title: 'The Credit Line Splitting the AI Trade in Two', pub: 'WSJ · Heard on the Street', time: '6:30 a.m.' },
        { title: 'Microsoft Walks Away From U.K. Data-Center Deal', pub: 'WSJ', time: 'Mon 2:15 p.m.' },
      ],
      people: [
        { name: 'Timothy Casaletto', role: 'PM, Vanguard Dividend Growth' },
        { name: 'Michael Intrator', role: 'CEO, CoreWeave' },
      ],
      numbers: [
        { value: '~15%', label: 'CoreWeave 2030 bond yield' },
        { value: '~8%', label: 'data-center bond yield' },
        { value: '-1.9%', label: 'S&P 500 last week' },
      ],
    },
  },
  {
    eyebrow: 'WORLD',
    lede: 'France\'s worst riots in years are simultaneously destabilizing its bond market and clearing Marine Le Pen\'s path to the presidency.',
    body: 'Over 3,000 stores damaged, nearly 1,000 police injured, and the 19th-century town hall in Limoges burned on live TV. The OAT–bund spread blew out to 148 basis points — the widest since the eurozone debt crisis — after yields jumped 14bp Monday.\n\nLe Pen released a video styled as a presidential broadcast, casting the chaos as proof of Macron\'s "powerlessness." UBS and AXA say full contagion is unlikely thanks to the ECB\'s safety net, but the risk premium is rising fast.',
    deeper: {
      sources: [
        { title: 'France Riots Push Bond Spread to Crisis-Era Levels', pub: 'WSJ', time: 'Mon 11:45 a.m.' },
        { title: 'Le Pen Seizes on Chaos to Position Presidential Run', pub: 'WSJ', time: 'Mon 4:20 p.m.' },
      ],
      people: [
        { name: 'Marine Le Pen', role: 'National Rally leader' },
        { name: 'Emmanuel Macron', role: 'President of France' },
      ],
      numbers: [
        { value: '148bp', label: 'OAT–bund spread' },
        { value: '3,000+', label: 'stores damaged' },
        { value: '14bp', label: 'yield jump Monday' },
      ],
    },
  },
];

function Moment1({ goNext }) {
  const [deeperCard, setDeeperCard] = useState(null);

  return (
    <div className="briefly-screen">
      <div className="briefly-page-header">
        <Masthead />
        <div className="briefly-date-header">
          <h1 className="page-title">Your Tuesday Briefing</h1>
          <p className="page-date">October 7, 2026</p>
        </div>
      </div>
      <div className="briefly-card-stack">
        {BRIEFING_CARDS.map((c, i) => (
          <article key={i} className="storyline-card">
            <div className="card-eyebrow">{c.eyebrow}</div>
            <p className="card-body-wrap">
              <strong className="card-lede">{c.lede}</strong>{' '}{c.body}
            </p>
            <div className="card-actions">
              <button className="action-primary go-deeper" onClick={() => setDeeperCard(c)}>
                Go deeper <CaretRight size={12} weight="bold" />
              </button>
              {i === 1 ? (
                <Hotspot onClick={goNext} label="Track this storyline">
                  <button className="action-secondary hotspot-target">
                    <BookmarkSimple size={14} /> Track this storyline
                  </button>
                </Hotspot>
              ) : (
                <button className="action-secondary">
                  <BookmarkSimple size={14} /> Track this storyline
                </button>
              )}
              {i === 1 && (
                <button className="action-tertiary">
                  <Sparkle size={14} /> Ask AI
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
      <BottomNav />
      <DeeperSheet card={deeperCard} onClose={() => setDeeperCard(null)} />
    </div>
  );
}

/* ---- MOMENT 2 ---- */

function Moment2({ goNext }) {
  return (
    <div className="briefly-screen" style={{ overflow: 'hidden' }}>
      <div style={{ opacity: 0.3, pointerEvents: 'none' }}>
        <div className="briefly-page-header">
          <Masthead />
          <div className="briefly-date-header">
            <h1 className="page-title">Your Tuesday Briefing</h1>
          </div>
        </div>
        <div className="briefly-card-stack">
          <article className="storyline-card" data-state="tracked">
            <span className="track-indicator"><Bell size={11} weight="fill" /> Tracking</span>
            <div className="card-eyebrow">WORLD</div>
            <p className="card-body-wrap">
              <strong className="card-lede">France's worst riots in years...</strong>
            </p>
          </article>
        </div>
      </div>
      <div className="alert-sheet">
        <div className="sheet-handle" />
        <div className="sheet-check">
          <Check size={22} weight="bold" color="#fff" />
        </div>
        <div className="sheet-title">Now tracking</div>
        <div className="sheet-desc">France crisis &amp; eurozone contagion risk</div>
        <hr className="sheet-rule" />
        <div className="watching-label">Watching for</div>
        <div className="watching-tags">
          {['OAT–bund spread', 'Le Pen', 'ECB response', 'Eurozone contagion', 'French elections', 'Bond markets'].map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <div className="cadence">We'll alert you when something moves.</div>
        <div className="sheet-actions">
          <Hotspot onClick={goNext} label="Done — confirm tracking">
            <button className="btn-primary hotspot-target">Done</button>
          </Hotspot>
          <button className="btn-tertiary"><SpeakerSimpleSlash size={16} /> Mute</button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

/* ---- MOMENT 3 ---- */

function Moment3({ goNext }) {
  return (
    <div className="briefly-screen">
      <div style={{ padding: '16px 20px 0', background: 'var(--wsj-surface)' }}>
        <div className="card-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Bell size={14} weight="fill" color="var(--wsj-red)" /> Briefly Alert
        </div>
      </div>
      <div style={{ padding: '0 20px 20px', background: 'var(--wsj-surface)', flex: 1 }}>
        <div className="delta-timestamp">Thursday, October 9 · 2:47 p.m.</div>
        <div className="delta-eyebrow">STORYLINE UPDATE</div>
        <div className="delta-subject">France crisis &amp; eurozone risk</div>
        <hr className="delta-rule" />
        <div className="delta-sentence">Three developments since Tuesday that change the picture.</div>
        <ul className="delta-details">
          <li className="delta-detail">Le Pen released a video styled as a presidential address, calling the unrest proof of Macron's "powerlessness." Polls show she'd win a runoff handily.</li>
          <li className="delta-detail">Moody's placed France on negative outlook. The OAT–bund spread widened to 152bp. UBS and AXA say the ECB's TPI makes full contagion unlikely.</li>
          <li className="delta-detail">Saudi Arabia postponed its Future Investment Initiative citing Houthi instability — a parallel risk signal for global markets.</li>
        </ul>
        <div className="delta-watch">What to watch: ECB Governing Council statement Friday — first signal on whether TPI activation is under discussion.</div>
        <div className="delta-actions">
          <Hotspot onClick={goNext} label="Open in AI Mode">
            <button className="btn-primary hotspot-target" style={{ width: '100%', textAlign: 'center' }}>
              <Sparkle size={16} weight="fill" style={{ verticalAlign: '-3px', marginRight: 6 }} />
              Open in AI Mode
            </button>
          </Hotspot>
          <button className="btn-tertiary" style={{ justifyContent: 'center', width: '100%' }}>
            <SpeakerSimpleSlash size={16} /> Mute storyline
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

/* ---- MOMENT 4 ---- */

const AI_MESSAGES = [
  {
    q: 'How likely is full eurozone contagion from the France crisis?',
    a: "Low probability, but the tail risk is rising. The ECB's TPI lets the central bank buy sovereign bonds of states facing disorderly spread widening — but it has never been activated, and France's excessive deficit may complicate eligibility.\n\nUBS and AXA say the ECB would likely bend the rules if spreads blow through 200bp. The bigger risk is political: if Le Pen wins and demands fiscal sovereignty, markets would price in redenomination risk — something TPI wasn't designed for.",
    sources: [
      { title: 'France Riots Push Bond Spread to Crisis-Era Levels', pub: 'WSJ' },
      { title: "ECB's Untested Safety Net Faces Its First Real Challenge", pub: "Barron's" },
    ],
  },
];

const SUGGESTIONS = [
  'What would a Le Pen presidency mean for EU markets?',
  'Compare this to the 2012 eurozone crisis — what\'s different?',
];

function Moment4({ goNext }) {
  return (
    <div className="briefly-screen">
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', minHeight: '100%', background: 'var(--wsj-surface)' }}>
        <div className="ai-header">
          <div className="ai-title"><Sparkle size={16} weight="fill" /> AI Mode</div>
          <Hotspot onClick={goNext} label="Close AI Mode">
            <button className="ai-close hotspot-target"><X size={20} /></button>
          </Hotspot>
        </div>
        <div className="context-pill"><Sparkle size={12} /> France crisis &amp; eurozone contagion risk</div>

        {AI_MESSAGES.map((msg, i) => (
          <div key={i} style={{ marginBottom: 24 }}>
            <div className="user-question">{msg.q}</div>
            <div className="ai-answer">{msg.a}</div>
            <SourceStack sources={msg.sources} />
          </div>
        ))}

        <div className="suggestions-label">Keep going</div>
        <div className="suggestions">
          {SUGGESTIONS.map((s, i) => (
            <button key={i} className="suggestion">
              <span>{s}</span>
              <ArrowRight size={14} weight="bold" className="suggestion-arrow" />
            </button>
          ))}
        </div>

        <div className="question-field">
          <input className="question-input" placeholder="Follow up..." readOnly />
          <button className="send-btn"><PaperPlaneRight size={20} weight="fill" /></button>
        </div>

        <div className="elapsed">6 minutes</div>

        <div className="thread-actions">
          <button className="btn-tertiary"><BookmarkSimple size={16} /> Save thread</button>
          <button className="btn-tertiary"><ShareNetwork size={16} /> Share thread</button>
        </div>
      </div>
    </div>
  );
}

/* ---- MOMENT 5 ---- */

const FRIDAY_CARDS = [
  {
    eyebrow: 'WORLD',
    lede: 'Where it stands: France\'s political crisis is accelerating faster than its bond market can price.',
    body: 'Le Pen\'s approval hit 41% — her highest ever — after Moody\'s placed France on negative outlook and the OAT–bund spread widened to 155bp.\n\nLagarde said the ECB\'s safety net remains "available" but stopped short of committing to activation. The gap between rhetoric and action is the risk to watch.',
    state: 'tracked',
    showTrack: false,
    showAlert: true,
    isTracked: true,
    deeper: {
      sources: [
        { title: 'Le Pen Approval Hits Record as Macron Flounders', pub: 'WSJ', time: 'Fri 6:00 a.m.' },
        { title: 'Lagarde Keeps TPI on the Table but Won\'t Commit', pub: 'WSJ', time: 'Thu 4:30 p.m.' },
      ],
      people: [
        { name: 'Christine Lagarde', role: 'President, ECB' },
        { name: 'Marine Le Pen', role: 'National Rally leader' },
      ],
      numbers: [
        { value: '155bp', label: 'OAT–bund spread (from 148)' },
        { value: '41%', label: 'Le Pen approval' },
        { value: 'Aa3→A1', label: 'Moody\'s downgrade' },
      ],
    },
  },
  {
    eyebrow: 'ECONOMY',
    lede: 'High mortgage rates are splitting the U.S. housing market into two economies: a frozen entry level and a cash-fueled luxury tier.',
    body: 'Builder confidence fell to 29 — the lowest since 2012 — with 43% cutting prices. Meanwhile Toll Brothers posted a $996K average selling price in Q3, with a quarter of buyers paying all cash.\n\nThree-quarters of WSJ-surveyed economists expect the 10-year yield at 5%+ through year-end, meaning relief for entry-level buyers isn\'t coming soon.',
    isAdjacent: true,
    deeper: {
      sources: [
        { title: 'The Two-Speed Housing Market Is Here to Stay', pub: 'WSJ', time: 'Fri 6:00 a.m.' },
        { title: 'Builder Confidence Hits Lowest Level Since 2012', pub: 'WSJ', time: 'Fri 10:00 a.m.' },
      ],
      people: [
        { name: 'Douglas Yearley', role: 'CEO, Toll Brothers' },
        { name: 'Tiff Macklem', role: 'Governor, Bank of Canada' },
      ],
      numbers: [
        { value: '29', label: 'builder confidence (lowest since \'12)' },
        { value: '43%', label: 'builders cutting prices' },
        { value: '5%+', label: 'expected 10-yr yield EOY' },
      ],
    },
  },
];

function Moment5({ goNext }) {
  const [deeperCard, setDeeperCard] = useState(null);
  const [showDelta, setShowDelta] = useState(false);

  return (
    <div className="briefly-screen">
      <div className="briefly-page-header">
        <Masthead />
        <div className="briefly-date-header">
          <h1 className="page-title">Your Friday Briefing</h1>
          <p className="page-date">October 10, 2026</p>
        </div>
      </div>
      <div className="briefly-card-stack">
        {FRIDAY_CARDS.map((c, i) => (
          <div key={i}>
            {c.isAdjacent && (
              <div className="adjacent-label">
                <Sparkle size={12} weight="fill" /> Because you track France &amp; eurozone risk
              </div>
            )}
            <article className="storyline-card" data-state={c.state || 'unread'}>
              {c.isTracked && <span className="track-indicator"><Bell size={11} weight="fill" /> Tracking</span>}
              <div className="card-eyebrow">{c.eyebrow}</div>
              {c.showAlert && <AlertBadge onClick={() => setShowDelta(true)} />}
              <p className="card-body-wrap">
                <strong className="card-lede">{c.lede}</strong>{' '}{c.body}
              </p>
              <div className="card-actions">
                <button className="action-primary go-deeper" onClick={() => setDeeperCard(c)}>
                  Go deeper <CaretRight size={12} weight="bold" />
                </button>
                {c.isAdjacent ? (
                  <Hotspot onClick={goNext} label="Track this too">
                    <button className="action-secondary hotspot-target">
                      <BookmarkSimple size={14} /> Track this too
                    </button>
                  </Hotspot>
                ) : (
                  <button className="action-tertiary">
                    <Sparkle size={14} /> Ask AI
                  </button>
                )}
              </div>
            </article>
          </div>
        ))}
      </div>
      <BottomNav />
      <DeeperSheet card={deeperCard} onClose={() => setDeeperCard(null)} />
      {showDelta && (
        <div className="deeper-overlay" onClick={() => setShowDelta(false)}>
          <div className="deeper-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="deeper-header">
              <div className="deeper-eyebrow" style={{ color: 'var(--wsj-red)' }}>ALERT · THU 2:47 P.M.</div>
              <button className="ai-close" onClick={() => setShowDelta(false)}><X size={18} /></button>
            </div>
            <div className="delta-subject" style={{ fontSize: 18, marginBottom: 10 }}>France crisis &amp; eurozone risk</div>
            <hr className="sheet-rule" />
            <ul className="delta-details" style={{ marginBottom: 20 }}>
              <li className="delta-detail">Le Pen released a video styled as a presidential broadcast. Polls show she'd win a runoff handily.</li>
              <li className="delta-detail">Moody's placed France on negative outlook. OAT–bund spread hit 152bp.</li>
              <li className="delta-detail">Saudi Arabia postponed its FII conference — a parallel risk signal.</li>
            </ul>
            <div className="delta-watch" style={{ marginBottom: 16 }}>ECB Governing Council statement Friday — first TPI signal.</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Main App ---- */

const MOMENTS = [Moment1, Moment2, Moment3, Moment4, Moment5];

export default function App() {
  const [step, setStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const screenRef = useRef(null);

  function advance() {
    setTransitioning(true);
    setTimeout(() => {
      setStep(s => (s + 1) % MOMENTS.length);
      setTransitioning(false);
      if (screenRef.current) screenRef.current.scrollTop = 0;
    }, 300);
  }

  const ActiveMoment = MOMENTS[step];
  const meta = STEP_META[step];

  return (
    <div className="proto-shell">
      <div className="proto-header">
        <div className="proto-title">Briefly — Priya Menon</div>
        <div className="proto-subtitle">Director of Corporate Development, Pre-Suite</div>
      </div>

      <div className="proto-progress">
        {STEP_META.map((m, i) => (
          <button
            key={i}
            className={`proto-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
            onClick={() => { setStep(i); if (screenRef.current) screenRef.current.scrollTop = 0; }}
          >
            <span className="dot-num">{i + 1}</span>
            <span className="dot-label">{m.label}</span>
          </button>
        ))}
      </div>

      <div className="proto-hint">
        <ArrowRight size={14} weight="bold" />
        <span>{meta.hint}</span>
      </div>

      <div
        ref={screenRef}
        className={`proto-viewport ${transitioning ? 'fading' : ''}`}
      >
        <ActiveMoment goNext={advance} />
      </div>
    </div>
  );
}
