import { useState, useEffect } from "react";

const C = {
  bg: "#0e0c0a", border: "#3a3028", accent: "#d4aa6e",
  accentSoft: "#e8d5b0", text: "#f5f0e8", muted: "#a89880",
  dimmed: "#6a5e54", green: "#7ab87a", red: "#c47a6a",
  purple: "#9b7ab8", pink: "#c47a9b", blue: "#7a9bc4",
  serif: "Georgia, 'Times New Roman', serif",
  sans: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
};

// ── CYCLE ──────────────────────────────────────────────
const CYCLE_START = new Date("2026-04-20");
const CYCLE_LENGTH = 28;
const PHASES = [
  { name: "Menstrual", days: [1,5], color: C.red, emoji: "🌑", energy: "Low — honor the rest", training: "Go gentle. Mobility, stretching, walking. Light lower body. Skip heavy loading.", core: "Gentle TVA breathing only. Skip crunches, planks, and anything that domes.", nutrition: "Iron-rich foods. Warm meals. Anti-inflammatory focus — turmeric, ginger, omega-3s.", intensity: 2 },
  { name: "Follicular", days: [6,13], color: C.green, emoji: "🌒", energy: "Rising — build momentum", training: "Best phase for strength gains. Push harder. Progressive overload. New PRs possible.", core: "Great time for DR-safe core work — dead bugs, heel slides, bird dogs, pallof press.", nutrition: "Complex carbs for fuel. Lean protein. Energy is up — eat to support output.", intensity: 4 },
  { name: "Ovulation", days: [14,16], color: C.accent, emoji: "🌕", energy: "Peak — your power window", training: "Maximum strength, power, and endurance. HIIT, heavy lifts, cycle class — all of it.", core: "Full DR-safe core circuit. Add resistance. Focus on glute-core connection.", nutrition: "Higher protein. Zinc and magnesium. Hydrate well — joints are looser.", intensity: 5 },
  { name: "Luteal", days: [17,28], color: C.purple, emoji: "🌗", energy: "Declining — conserve and recover", training: "Moderate intensity. Prioritize form over load. Great for mind-muscle connection.", core: "Focus on breath-first core activation. TVA + pelvic floor before any movement.", nutrition: "Magnesium, B6, complex carbs. Cravings are real — fuel don't restrict.", intensity: 3 },
];

const WORKOUTS = {
  1: { day: "Monday", label: "Legs · Quads · Glute Activation", duration: "60–80 min", icon: "🦵", focus: "Quad-dominant lower body with hip mobility warm-up and glute wake-up sequence", exercises: [{ name: "Hip 90/90 Mobility", sets: "3 min", note: "Glute med + external rotators" }, { name: "Banded Clamshells", sets: "3×20 each", note: "Wake up sleepy glutes before loading" }, { name: "Glute Bridge Pulse", sets: "3×30", note: "Squeeze hard at top, TVA braced" }, { name: "Goblet Squat", sets: "4×12", note: "Knees track toes, chest tall" }, { name: "Leg Press", sets: "4×15", note: "Feet hip-width, control the eccentric" }, { name: "Walking Lunges", sets: "3×12 each", note: "Glute focus — lean slightly forward" }, { name: "Leg Extension", sets: "3×15", note: "Quad isolation" }, { name: "Stairmaster / Incline Walk", sets: "15–20 min", note: "Finish strong" }], drNote: "Brace TVA before every rep. No breath-holding. Exhale on effort." },
  2: { day: "Tuesday", label: "Arms · Back", duration: "60 min", icon: "💪", focus: "Upper body pull + push, lat width, bicep/tricep definition", exercises: [{ name: "Lat Pulldown", sets: "4×12", note: "Wide grip, full stretch at top" }, { name: "Seated Cable Row", sets: "4×12", note: "Squeeze shoulder blades" }, { name: "Dumbbell Row", sets: "3×12 each", note: "Elbow to hip, not ceiling" }, { name: "Face Pulls", sets: "3×15", note: "Rear delt + rotator cuff health" }, { name: "Bicep Curl", sets: "3×12", note: "Supinate at top" }, { name: "Hammer Curl", sets: "3×12", note: "Brachialis focus" }, { name: "Overhead Tricep Extension", sets: "3×12", note: "Long head emphasis" }, { name: "Tricep Pushdown", sets: "3×15", note: "Elbows locked at sides" }], drNote: "Keep core gently braced throughout. Avoid breath-holding on pulls." },
  3: { day: "Wednesday", label: "Hamstrings · Posterior Chain", duration: "60–80 min", icon: "🍑", focus: "Hip hinge pattern, hamstring length + strength, glute-ham tie-in", exercises: [{ name: "Romanian Deadlift", sets: "4×10", note: "Hip hinge — feel hamstring stretch" }, { name: "Lying Leg Curl", sets: "4×12", note: "Control the negative" }, { name: "Hip Thrust", sets: "4×15", note: "Drive through heel, squeeze at top" }, { name: "Sumo Deadlift", sets: "3×8", note: "Wide stance, inner thigh + glute" }, { name: "Cable Kickback", sets: "3×15 each", note: "Hip dip sculptor" }, { name: "Single Leg RDL", sets: "3×10 each", note: "Balance + glute-ham connection" }, { name: "Seated Leg Curl", sets: "3×12", note: "Full range of motion" }], drNote: "Hip thrusts are DR-safe when braced properly. Exhale as you drive up." },
  4: { day: "Thursday", label: "Arms · Active Recovery Option", duration: "45–60 min", icon: "🏋️‍♀️", focus: "Upper body pump or full rest — listen to your body", exercises: [{ name: "Cable Bicep Curl", sets: "3×15", note: "Constant tension" }, { name: "Incline Dumbbell Curl", sets: "3×12", note: "Full stretch at bottom" }, { name: "Skull Crushers", sets: "3×12", note: "Elbows stay still" }, { name: "Cable Tricep Kickback", sets: "3×15", note: "Squeeze at full extension" }, { name: "Lateral Raise", sets: "3×15", note: "Shoulder width + medial delt" }, { name: "Arnold Press", sets: "3×10", note: "Full shoulder development" }], drNote: "Rest day is valid. Especially late Luteal — honor that." },
  5: { day: "Friday", label: "Cycle Class · Light Arms", duration: "60 min", icon: "🚴‍♀️", focus: "Cardio conditioning + arm finisher", exercises: [{ name: "Spin / Cycle Class", sets: "45 min", note: "Push on climbs, recover on flats" }, { name: "Dumbbell Bicep Curl", sets: "2×15", note: "Light weight, high rep" }, { name: "Tricep Dip or Pushdown", sets: "2×15", note: "Arm finisher post-cardio" }, { name: "Shoulder Press", sets: "2×12", note: "Moderate weight" }], drNote: "Core brace on the bike. Avoid forward hunch — keep ribs lifted." },
  6: { day: "Saturday", label: "Full Body", duration: "60–80 min", icon: "🔥", focus: "Compound movements, total body stimulus, shelf + hip dip sculpt", exercises: [{ name: "Barbell or DB Squat", sets: "4×10", note: "Full depth, glutes loaded" }, { name: "Hip Thrust", sets: "4×15", note: "Weighted — go heavier today" }, { name: "Bent Over Row", sets: "3×12", note: "Back thickness" }, { name: "Push Press", sets: "3×10", note: "Shoulder power" }, { name: "Lateral Band Walk", sets: "3×15 each", note: "Hip dip target — glute med" }, { name: "Cable Pull-Through", sets: "3×15", note: "Glute-ham hinge" }, { name: "Plank + DR Breathing", sets: "3×30 sec", note: "Modified — no doming" }], drNote: "Full body day — brace before every compound. This is your shelf day. Own it." },
  0: { day: "Sunday", label: "Reset · Core · Stretch", duration: "30–45 min", icon: "🧘‍♀️", focus: "Active recovery, diastasis core sequence, mobility, optional light cardio", exercises: [{ name: "Deep TVA Breathing", sets: "5 min", note: "360 breathing — ribs expand all ways" }, { name: "Dead Bug", sets: "3×10 each", note: "Core + contra-lateral control" }, { name: "Bird Dog", sets: "3×10 each", note: "Stable spine, no hip rotation" }, { name: "Heel Slide", sets: "3×12 each", note: "Lower TVA activation" }, { name: "Glute Bridge", sets: "3×15", note: "Gentle glute activation" }, { name: "Hip Flexor Stretch", sets: "90 sec each", note: "Full release" }, { name: "Pigeon Pose", sets: "90 sec each", note: "Glute + piriformis" }, { name: "Optional Sprints or Walk", sets: "15 min", note: "Based on cycle + mood" }], drNote: "This is your DR healing day. Every movement is intentional. No doming — if you dome, regress." },
};

// ── DAILY AFFIRMATIONS + VERSES ─────────────────────────
const DAILY_DEVOTIONALS = [
  { affirmation: "Vision without God at the center is vapor — beautiful, real, and gone. Root it in Him first and it will last.", verse: "Much dreaming and many words are meaningless. Therefore fear God.", ref: "Ecclesiastes 5:7" },
  { affirmation: "You are not behind. You are being prepared. Trust the process that is shaping you.", verse: "For I know the plans I have for you — plans to prosper you and not to harm you, plans to give you hope and a future.", ref: "Jeremiah 29:11" },
  { affirmation: "Your obedience in the quiet seasons is building something you cannot yet see.", verse: "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.", ref: "Galatians 6:9" },
  { affirmation: "You were created on purpose, for a purpose. Walk in that today.", verse: "For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.", ref: "Ephesians 2:10" },
  { affirmation: "Peace is not the absence of chaos. It is the presence of God in the middle of it.", verse: "You will keep in perfect peace those whose minds are steadfast, because they trust in you.", ref: "Isaiah 26:3" },
  { affirmation: "Rest is an act of faith. You don't have to earn your next breath.", verse: "Come to me, all you who are weary and burdened, and I will give you rest.", ref: "Matthew 11:28" },
  { affirmation: "What you steward in secret, God will honor in public. Keep going.", verse: "She is clothed with strength and dignity; she can laugh at the days to come.", ref: "Proverbs 31:25" },
  { affirmation: "Your story — all of it — is being used for something greater than you can imagine.", verse: "And we know that in all things God works for the good of those who love him.", ref: "Romans 8:28" },
];

// ── ANALYTICS-BASED CONTENT CALENDAR ───────────────────
// Based on: Reels 52.5% reach, Posts 33.5%, 74.6% women, top age 25-34 + 35-44
// Top content: real life moments (2.3K), faith (562), aesthetic/quiet luxury (650)
// Audience: NY, Dallas, Frisco, LA — urban millennial women

const CONTENT_TODAY = [
  {
    format: "Reel",
    type: "reach",
    angle: "Real life moment — the version of you that holds everything together",
    hook: "Nobody checks on the woman who checks on everyone else.",
    why: "Your 2.3K top post was a real life moment with your kids. Authenticity is your #1 reach driver.",
    brand: null,
    cta: "Save + share",
    tags: ["#momlife", "#velsehealth", "#reallife", "#womenover35"],
  },
  {
    format: "Post / Carousel",
    type: "engagement",
    angle: "Faith + wellness intersection — involve God in your body too",
    hook: "Girl to girl: your body is a temple and your gut health is spiritual.",
    why: "Your faith content got 562 views — high save rate. Carousel format will drive saves from your 25-34 audience.",
    brand: "Bloom or TRIP",
    cta: "Save this",
    tags: ["#faithandwellness", "#velsehealth", "#christianwomen", "#holistichealth"],
  },
  {
    format: "Story",
    type: "connection",
    angle: "Behind the scenes — show today (Bible study tonight)",
    hook: "This is what a Wednesday actually looks like for me.",
    why: "Stories build intimacy with your 42.4% follower audience. Real day = real connection.",
    brand: null,
    cta: "Reply or poll",
    tags: [],
  },
];

const CONTENT_WEEK = [
  {
    day: "Wed", date: "May 6", format: "Reel", priority: "high",
    angle: "Real moment + faith — your Wednesday as a mom, creator, believer",
    hook: "This is what a full life actually looks like.",
    audience: "25-34 women · faith audience",
    brand: null,
    note: "Post between 6–9pm. Bible study tonight = authentic content opportunity.",
    tags: ["#reallife", "#faithandwellness", "#velsehealth"],
  },
  {
    day: "Thu", date: "May 7", format: "Reel",  priority: "high",
    angle: "Hamstring + glute workout — cycle syncing your training at 42",
    hook: "I'm 42, I track my cycle, and I train around it. Here's why.",
    audience: "35-44 women · fitness audience",
    brand: "Bloom / Sauft",
    note: "Reels are 52.5% of your reach. Fitness + age angle performs with your 35-44 demo.",
    tags: ["#cyclesyncing", "#over40fitness", "#velsehealth", "#glutetraining"],
  },
  {
    day: "Fri", date: "May 8", format: "Post / Carousel", priority: "medium",
    angle: "5 things I stopped doing for my gut health — honest list",
    hook: "I stopped doing all 5 of these and my bloating disappeared.",
    audience: "25-34 women · wellness audience",
    brand: "Bloom",
    note: "Carousel posts are 33.5% of reach but drive higher saves. Lists = saves.",
    tags: ["#guthealth", "#womenshealth", "#velsehealth", "#bloating"],
  },
  {
    day: "Sat", date: "May 9", format: "Reel", priority: "high",
    angle: "Saturday full body workout — aesthetic gym content",
    hook: "Saturday is for the shelf. Here's my full body day.",
    audience: "25-44 women · fitness / aesthetic",
    brand: "Aroma360 (post-gym ritual angle)",
    note: "Quiet luxury gym aesthetic + results content. Your LA + NY audience loves this.",
    tags: ["#fullbodyworkout", "#quietluxury", "#velsehealth", "#gymlife"],
  },
  {
    day: "Sun", date: "May 10", format: "Post", priority: "medium",
    angle: "Sunday reset + faith — what rest looks like for you",
    hook: "Rest is not laziness. It's obedience.",
    audience: "Faith audience · all ages",
    brand: "Sauft weighted blanket",
    note: "Faith + rest content = high save rate. Post Sunday morning for best reach.",
    tags: ["#sundayreset", "#faithandwellness", "#velsehealth", "#sabbath"],
  },
  {
    day: "Mon", date: "May 11", format: "Reel", priority: "high",
    angle: "Leg day + glute activation — show the actual warm-up",
    hook: "You're not building a shelf without waking up your glutes first.",
    audience: "25-44 women · fitness",
    brand: null,
    note: "Monday motivation content performs. Show the banded warm-up — educational + aesthetic.",
    tags: ["#legday", "#gluteactivation", "#velsehealth", "#lifetimefitness"],
  },
  {
    day: "Tue", date: "May 12", format: "Reel", priority: "medium",
    angle: "Home fragrance morning ritual — the invisible part of a quiet luxury life",
    hook: "The one thing I do every morning before I talk to anyone.",
    audience: "25-34 women · lifestyle / home",
    brand: "Aroma360 VanGogh360",
    note: "Aesthetic B-roll performs with your NY + LA audience. Morning ritual = saves + shares.",
    tags: ["#morningroutine", "#homefragrance", "#quietluxury", "#aroma360", "#velsehealth"],
  },
];

// ── TIKTOK DATA ─────────────────────────────────────────
const TIKTOK_SAMPLES = [
  { product: "HECI BEAUTY Cream Blush Stick", type: "Beauty", due: "May 19", daysLeft: 13, status: "reminder", color: C.pink },
  { product: "Legendairy Milk Inositol — Hormone Balance", type: "Wellness", due: "May 4", daysLeft: 0, status: "past_due", color: C.red },
  { product: "TikTok Shop Sample Batch (4 items)", type: "Mixed", due: "May 18", daysLeft: 12, status: "arrived", color: C.accent },
  { product: "Order #577359 — Shipping Delayed", type: "Incoming", due: "TBD", daysLeft: null, status: "delayed", color: C.muted },
];

const TIKTOK_TASKS = [
  { task: "Post 20 shoppable videos + 1 more requirement", reward: "$65", due: "May 7", urgent: true },
  { task: "Go LIVE 1 time + 2 more requirements", reward: "$30", due: "May 8", urgent: true },
];

const COLLAB_EMAILS = [
  { from: "Make Beauty", subject: "Collab Opportunity — TikTok", snippet: "Reached out for future TikTok collabs.", date: "May 4", status: "sent" },
  { from: "Luna Bean", subject: "Mother's Day Collab 💛", snippet: "Confirmed! $75 for 5 videos. Creative brief sent.", date: "Apr 15", status: "active" },
  { from: "DR.EVE", subject: "Korean Wellness Tea Brand 🌿", snippet: "K-wellness brand following up. Awaiting your reply.", date: "Apr 20", status: "pending" },
  { from: "Jooiee", subject: "EasyBlue — Free Sample + 20% Commission", snippet: "Blue spirulina detox drink. Follow-up sent Apr 27.", date: "Apr 27", status: "pending" },
  { from: "BioGaia", subject: "Fresh Breath Probiotic — Growi Campaign", snippet: "Accepted into creator blitz. Post consistently + unlock bonus.", date: "May 5", status: "active" },
];

const KID_EMAILS = [
  { kid: "Aya", emoji: "⭐", subject: "Recognized for Honor Commitments", from: "Prosper High School", snippet: "Aya recognized for upholding Core Values — Honor Commitments.", date: "May 5", tag: "school", tagColor: C.green },
  { kid: "Aya", emoji: "📋", subject: "Attendance Letter Generated", from: "Prosper ISD", snippet: "Aya has been absent 3+ times in Semester 2. Missing 10%+ may result in credit denial.", date: "May 5", tag: "attendance", tagColor: C.red },
  { kid: "Jacoby", emoji: "⚾", subject: "Texas Summer ID Showcase Invite", from: "Prep Baseball", snippet: "Invited to Texas Summer ID Showcase — get in front of scouting staff.", date: "May 5", tag: "baseball", tagColor: C.accent },
  { kid: "Aliya", emoji: "🎂", subject: "Birthday Party — Urban Air Frisco", from: "Urban Air Frisco", snippet: "Party confirmed May 2, 12:30–2:30pm. Pepperoni pizza. 3 kids + big sis.", date: "Apr 25", tag: "event", tagColor: C.purple },
];

const BRIEFS = [
  { affirmation: "You were made for this season. Walk into today knowing every step you take in faith is already covered.", contentAngle: "The quiet power of a morning routine — showing the rituals that ground you before the world gets loud.", hook: "My morning routine changed everything — and it only takes 10 minutes.", caption: "There's something sacred about the hour before everything starts. I protect it fiercely.", brandSuggestion: "Aroma360 — pair with your scent diffuser routine.", cta: "Save this if you're building a morning that actually feels like yours.", hashtags: ["#morningroutine", "#wellnesslifestyle", "#intentionalliving", "#velsehealth", "#quietluxury"] },
  { affirmation: "Rest is not a reward. It is part of the work. Give yourself permission to receive today.", contentAngle: "Gut health as self-respect — reframing healthy habits as an act of love for your body.", hook: "Your gut is talking. Here's what mine was trying to tell me.", caption: "I spent years pushing through the bloat, the fatigue, the fog. Turns out my body wasn't broken — it was asking for something different.", brandSuggestion: "Bloom — gut health supplements pair perfectly here.", cta: "Drop a 🌿 if your body has been trying to get your attention.", hashtags: ["#guthealth", "#womenshealth", "#holisticwellness", "#velsehealth", "#inflammation"] },
  { affirmation: "You are not behind. You are exactly where you need to be, growing at exactly the right pace.", contentAngle: "Home as sanctuary — how your environment shapes your nervous system and mood.", hook: "I stopped decorating for guests and started decorating for my peace.", caption: "When your space feels like you — not curated, not performative, just yours — something in you exhales.", brandSuggestion: "Hotel Collection — home fragrance as the invisible layer of intentional space.", cta: "What does your space smell like? Tell me below 👇", hashtags: ["#homeaesthetic", "#quietluxury", "#homefragrance", "#velsehealth", "#sanctuaryvibes"] },
  { affirmation: "Strength is built in the small choices no one sees. Keep choosing yourself in the quiet.", contentAngle: "Fitness as a spiritual practice — connecting workouts to mental and emotional wellbeing.", hook: "I don't work out to look different. I do it to feel like myself.", caption: "There was a shift when I stopped going to the gym for my body and started going for my mind. Now it's non-negotiable.", brandSuggestion: "Sauft — recovery and rest products pair well here.", cta: "Save this if you needed a reminder that showing up for yourself counts.", hashtags: ["#fitnessmindset", "#womenwholift", "#velsehealth", "#strengthtraining", "#faithfitness"] },
  { affirmation: "What you're building matters. Keep going with the same faith that started it.", contentAngle: "The invisible labor of being a woman who holds everything.", hook: "Nobody talks about the version of you that holds everything together.", caption: "The one who texts back, shows up, remembers everything, and still makes dinner. I see her. I am her.", brandSuggestion: "TRIP — calm and stress support.", cta: "Share this with a woman who needs to hear it today.", hashtags: ["#momlife", "#womensupportingwomen", "#velsehealth", "#emotionalwellness", "#selfcompassion"] },
];

const WEATHER_CODES = { 0: { label: "Clear", icon: "☀️" }, 1: { label: "Mostly Clear", icon: "🌤️" }, 2: { label: "Partly Cloudy", icon: "⛅" }, 3: { label: "Overcast", icon: "☁️" }, 45: { label: "Foggy", icon: "🌫️" }, 51: { label: "Drizzle", icon: "🌦️" }, 61: { label: "Rain", icon: "🌧️" }, 80: { label: "Showers", icon: "🌦️" }, 95: { label: "Thunderstorm", icon: "⛈️" } };

function getCycleDay() { return (Math.floor((new Date() - CYCLE_START) / 86400000) % CYCLE_LENGTH) + 1; }
function getPhase(d) { for (const p of PHASES) if (d >= p.days[0] && d <= p.days[1]) return p; return PHASES[3]; }
function getDailyDevotional() { return DAILY_DEVOTIONALS[new Date().getDay() % DAILY_DEVOTIONALS.length]; }
const statusColor = s => s === "active" ? C.green : s === "pending" ? C.accent : C.muted;
const statusLabel = s => s === "active" ? "Active" : s === "pending" ? "Awaiting Reply" : "Sent";
const priorityColor = p => p === "high" ? C.green : C.accent;

export default function AuraBrief() {
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [time, setTime] = useState("");
  const [greeting, setGreeting] = useState("");
  const [expandedCollab, setExpandedCollab] = useState(null);
  const [expandedKid, setExpandedKid] = useState(null);
  const [expandedSample, setExpandedSample] = useState(null);
  const [expandedContent, setExpandedContent] = useState(null);
  const [showWorkout, setShowWorkout] = useState(false);
  const [contentView, setContentView] = useState("today");
  const [cycleDay] = useState(getCycleDay());
  const [phase] = useState(getPhase(getCycleDay()));
  const [todayWorkout] = useState(() => WORKOUTS[new Date().getDay()]);
  const [devotional] = useState(getDailyDevotional());

  useEffect(() => {
    const now = new Date();
    setTime(now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }));
    const h = now.getHours();
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=33.1507&longitude=-96.8236&current=temperature_2m,weathercode&temperature_unit=fahrenheit");
      const data = await res.json();
      const info = WEATHER_CODES[data.current.weathercode] || { label: "Clear", icon: "☀️" };
      setWeather({ temp: Math.round(data.current.temperature_2m), ...info });
    } catch { setWeather({ temp: "--", label: "Frisco, TX", icon: "🌤️" }); }
  };

  const runBrief = () => {
    setLoading(true); setBrief(null);
    setTimeout(() => { setBrief(BRIEFS[Math.floor(Math.random() * BRIEFS.length)]); setLoading(false); }, 1600);
  };

  const Divider = ({ label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "28px 0" }}>
      <div style={{ flex: 1, height: 1, background: C.border }} />
      {label && <><div style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: 11, color: C.accent, letterSpacing: 2 }}>{label}</div><div style={{ flex: 1, height: 1, background: C.border }} /></>}
    </div>
  );

  const SL = ({ text, color }) => <div style={{ fontFamily: C.sans, fontSize: 9, letterSpacing: 3, color: color || C.accent, textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>{text}</div>;

  const Toggle = ({ options, value, onChange }) => (
    <div style={{ display: "flex", border: `1px solid ${C.border}`, marginBottom: 20 }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{ flex: 1, padding: "10px 0", background: value === o.value ? C.accent : "transparent", border: "none", color: value === o.value ? "#0e0c0a" : C.muted, fontFamily: C.sans, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 600, cursor: "pointer" }}>{o.label}</button>
      ))}
    </div>
  );

  const EmailCard = ({ item, index, expanded, onToggle, statusMode }) => (
    <div onClick={() => onToggle(expanded === index ? null : index)} style={{ marginBottom: 10, padding: "12px 14px", border: `1px solid ${expanded === index ? C.accent : C.border}`, cursor: "pointer", background: expanded === index ? "rgba(201,169,110,0.04)" : "transparent" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {item.emoji && <span style={{ fontSize: 13 }}>{item.emoji}</span>}
          <div style={{ fontFamily: C.sans, fontSize: 12, color: C.text, fontWeight: 500 }}>{statusMode ? item.from : `${item.kid} — ${item.from}`}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {statusMode ? <div style={{ fontFamily: C.sans, fontSize: 9, color: statusColor(item.status), letterSpacing: 1, textTransform: "uppercase" }}>{statusLabel(item.status)}</div>
            : <div style={{ fontFamily: C.sans, fontSize: 9, color: item.tagColor, letterSpacing: 1, textTransform: "uppercase", border: `1px solid ${item.tagColor}`, padding: "2px 7px" }}>{item.tag}</div>}
          <div style={{ fontFamily: C.sans, fontSize: 10, color: C.dimmed }}>{item.date}</div>
        </div>
      </div>
      <div style={{ fontFamily: C.sans, fontSize: 11, color: C.muted }}>{item.subject}</div>
      {expanded === index && <div style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: 13, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 10, marginTop: 8, lineHeight: 1.7 }}>{item.snippet}</div>}
    </div>
  );

  const Btn = ({ outline, label, onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled} style={{ background: outline ? "transparent" : `linear-gradient(135deg, ${C.accent}, ${C.accentSoft})`, border: outline ? `1px solid ${C.border}` : "none", color: outline ? C.accent : "#0e0c0a", fontFamily: C.sans, fontWeight: 600, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", padding: "15px 40px", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}>{label}</button>
  );

  const ContentSection = ({ label, children }) => (
    <div style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: 18, marginBottom: 24 }}>
      <SL text={label} />
      <div style={{ fontFamily: C.serif, fontSize: 15, color: C.text, lineHeight: 1.8 }}>{children}</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", padding: "52px 24px 48px", fontFamily: C.sans }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 10, letterSpacing: 5, color: C.accent, textTransform: "uppercase", marginBottom: 14 }}>@velse.health</div>
        <h1 style={{ fontFamily: C.serif, fontSize: 46, fontWeight: 400, fontStyle: "italic", color: C.text, letterSpacing: 4, lineHeight: 1, marginBottom: 10 }}>AURA</h1>
        <div style={{ fontSize: 10, letterSpacing: 4, color: C.muted, textTransform: "uppercase", marginBottom: 8 }}>Daily Content Intelligence</div>
        <div style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: 13, color: C.muted }}>{time}</div>
      </div>

      {/* ── DEVOTIONAL ── */}
      <div style={{ width: "100%", maxWidth: 540, marginBottom: 8 }}>
        <div style={{ border: `1px solid ${C.border}`, padding: "20px 22px", background: "rgba(201,169,110,0.03)", textAlign: "center" }}>
          <div style={{ fontFamily: C.sans, fontSize: 9, letterSpacing: 4, color: C.accent, textTransform: "uppercase", marginBottom: 14 }}>✦ Daily Word ✦</div>
          <div style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: 16, color: C.text, lineHeight: 1.8, marginBottom: 16 }}>
            "{devotional.affirmation}"
          </div>
          <div style={{ height: 1, background: C.border, margin: "0 auto 16px", width: "40%" }} />
          <div style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: 14, color: C.accentSoft, lineHeight: 1.7, marginBottom: 8 }}>
            "{devotional.verse}"
          </div>
          <div style={{ fontFamily: C.sans, fontSize: 10, color: C.accent, letterSpacing: 2 }}>{devotional.ref}</div>
        </div>
      </div>

      <Divider />

      {/* Greeting + Weather */}
      <div style={{ width: "100%", maxWidth: 540, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: 18, color: C.text }}>{greeting}, V 🤍</div>
        {weather && <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 22 }}>{weather.icon}</span><div style={{ textAlign: "right" }}><div style={{ fontSize: 16, color: C.text, fontWeight: 500 }}>{weather.temp}°F</div><div style={{ fontSize: 10, color: C.muted, letterSpacing: 1 }}>{weather.label} · Frisco</div></div></div>}
      </div>

      {/* TODAY */}
      <div style={{ width: "100%", maxWidth: 540 }}>
        <SL text="Today" />

        {/* Calendar */}
        <div style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: 18, marginBottom: 24 }}>
          <SL text="Calendar" color={C.dimmed} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 14px", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", gap: 10 }}>
              <span style={{ fontSize: 15 }}>✝️</span>
              <div>
                <div style={{ fontFamily: C.sans, fontSize: 12, color: C.text, fontWeight: 500, marginBottom: 3 }}>Bible Study</div>
                <div style={{ fontFamily: C.sans, fontSize: 11, color: C.muted, marginBottom: 2 }}>7:00 – 8:00 PM</div>
                <div style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: 11, color: C.dimmed }}>One Community Church · Plano</div>
              </div>
            </div>
            <div style={{ fontFamily: C.sans, fontSize: 9, color: C.green, letterSpacing: 1, textTransform: "uppercase", border: `1px solid ${C.green}40`, padding: "2px 8px", whiteSpace: "nowrap" }}>Tonight</div>
          </div>
        </div>

        {/* TikTok Shop */}
        <div style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: 18, marginBottom: 24 }}>
          <SL text="TikTok Shop · Samples & Tasks" color={C.dimmed} />
          {TIKTOK_TASKS.map((t, i) => (
            <div key={i} style={{ marginBottom: 8, padding: "10px 14px", border: `1px solid ${C.red}60`, background: `${C.red}08` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ fontFamily: C.sans, fontSize: 11, color: C.text, fontWeight: 500 }}>💰 {t.reward} reward task</div>
                <div style={{ fontFamily: C.sans, fontSize: 9, color: C.red, letterSpacing: 1, textTransform: "uppercase", border: `1px solid ${C.red}60`, padding: "2px 8px" }}>Due {t.due}</div>
              </div>
              <div style={{ fontFamily: C.sans, fontSize: 11, color: C.muted }}>{t.task}</div>
            </div>
          ))}
          {TIKTOK_SAMPLES.map((s, i) => (
            <div key={i} onClick={() => setExpandedSample(expandedSample === i ? null : i)} style={{ marginBottom: 8, padding: "11px 14px", border: `1px solid ${expandedSample === i ? s.color : C.border}`, cursor: "pointer", background: expandedSample === i ? `${s.color}06` : "transparent" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ fontFamily: C.sans, fontSize: 11, color: C.text, fontWeight: 500, flex: 1, marginRight: 8 }}>{s.product}</div>
                <div style={{ fontFamily: C.sans, fontSize: 9, color: s.color, letterSpacing: 1, textTransform: "uppercase", border: `1px solid ${s.color}60`, padding: "2px 8px", whiteSpace: "nowrap" }}>
                  {s.status === "past_due" ? "⚠️ Past Due" : s.status === "delayed" ? "Delayed" : s.daysLeft !== null ? `${s.daysLeft}d left` : "TBD"}
                </div>
              </div>
              <div style={{ fontFamily: C.sans, fontSize: 10, color: C.muted }}>{s.type} · Due {s.due}</div>
            </div>
          ))}
        </div>

        {/* Collab Inbox */}
        <div style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: 18, marginBottom: 24 }}>
          <SL text={`Collab Inbox · ${COLLAB_EMAILS.length} threads`} color={C.dimmed} />
          {COLLAB_EMAILS.map((e, i) => <EmailCard key={i} item={e} index={i} expanded={expandedCollab} onToggle={setExpandedCollab} statusMode />)}
        </div>

        {/* Mom / Kid Stuff */}
        <div style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: 18, marginBottom: 8 }}>
          <SL text={`Mom · Kid Stuff · ${KID_EMAILS.length} threads`} color={C.dimmed} />
          {KID_EMAILS.map((e, i) => <EmailCard key={i} item={e} index={i} expanded={expandedKid} onToggle={setExpandedKid} statusMode={false} />)}
        </div>
      </div>

      <Divider label="body & training" />

      {/* GYM */}
      <div style={{ width: "100%", maxWidth: 540 }}>
        <div style={{ border: `1px solid ${phase.color}`, padding: "16px 18px", marginBottom: 20, background: `${phase.color}10` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{phase.emoji}</span>
              <div>
                <div style={{ fontFamily: C.sans, fontSize: 11, color: phase.color, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>{phase.name} Phase</div>
                <div style={{ fontFamily: C.sans, fontSize: 10, color: C.muted, marginTop: 2 }}>Day {cycleDay} · Period in ~6 days</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>{[1,2,3,4,5].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= phase.intensity ? C.accent : C.dimmed }} />)}</div>
          </div>
          <div style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: 14, color: C.text, lineHeight: 1.6, marginBottom: 8 }}>{phase.energy}</div>
          <div style={{ fontFamily: C.sans, fontSize: 11, color: C.muted, lineHeight: 1.6, marginBottom: 5 }}><span style={{ color: phase.color }}>Training: </span>{phase.training}</div>
          <div style={{ fontFamily: C.sans, fontSize: 11, color: C.muted, lineHeight: 1.6, marginBottom: 5 }}><span style={{ color: phase.color }}>Core / DR: </span>{phase.core}</div>
          <div style={{ fontFamily: C.sans, fontSize: 11, color: C.muted, lineHeight: 1.6 }}><span style={{ color: phase.color }}>Fuel: </span>{phase.nutrition}</div>
        </div>

        <div style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: 18 }}>
          <SL text="Today's Workout" color={C.dimmed} />
          <div onClick={() => setShowWorkout(!showWorkout)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", marginBottom: showWorkout ? 16 : 0 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 18 }}>{todayWorkout.icon}</span>
                <div style={{ fontFamily: C.sans, fontSize: 13, color: C.text, fontWeight: 500 }}>{todayWorkout.label}</div>
              </div>
              <div style={{ fontFamily: C.sans, fontSize: 11, color: C.muted }}>{todayWorkout.duration} · {todayWorkout.focus}</div>
            </div>
            <div style={{ fontFamily: C.sans, fontSize: 11, color: C.accent }}>{showWorkout ? "▲" : "▼"}</div>
          </div>
          {showWorkout && (
            <div>
              <div style={{ background: "rgba(201,169,110,0.06)", border: `1px solid ${C.border}`, padding: "10px 14px", marginBottom: 14 }}>
                <div style={{ fontFamily: C.sans, fontSize: 9, color: C.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>DR / Core Note</div>
                <div style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{todayWorkout.drNote}</div>
              </div>
              {todayWorkout.exercises.map((ex, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: C.sans, fontSize: 12, color: C.text, marginBottom: 2 }}>{ex.name}</div>
                    <div style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: 11, color: C.muted }}>{ex.note}</div>
                  </div>
                  <div style={{ fontFamily: C.sans, fontSize: 11, color: C.accent, marginLeft: 16, whiteSpace: "nowrap" }}>{ex.sets}</div>
                </div>
              ))}
              <div style={{ marginTop: 14, padding: "10px 14px", background: `${phase.color}08`, border: `1px solid ${phase.color}40` }}>
                <div style={{ fontFamily: C.sans, fontSize: 9, color: phase.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Phase Modifier</div>
                <div style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
                  {phase.name === "Luteal" ? "You're in Luteal — keep weights moderate, prioritize mind-muscle connection over max load. Show up, but don't grind." : phase.name === "Menstrual" ? "Menstrual phase — go gentle. Mobility and light movement only." : phase.name === "Follicular" ? "Follicular phase — energy rising. Great time to add weight or reps." : "Ovulation — peak power window. Push hard, lift heavy, go all in."}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Divider label="content strategy" />

      {/* ANALYTICS SNAPSHOT */}
      <div style={{ width: "100%", maxWidth: 540, marginBottom: 24 }}>
        <SL text="Your Instagram · Analytics Snapshot" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[
            { label: "Total Views", value: "14,767", sub: "Apr 6 – May 5" },
            { label: "Accounts Reached", value: "6,586", sub: "+91.2% 🔥" },
            { label: "Non-follower Reach", value: "57.6%", sub: "Discovery is working" },
            { label: "Top Audience", value: "Women 25–34", sub: "74.6% female" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "12px 14px", border: `1px solid ${C.border}` }}>
              <div style={{ fontFamily: C.sans, fontSize: 9, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontFamily: C.serif, fontSize: 18, color: C.text, marginBottom: 3 }}>{s.value}</div>
              <div style={{ fontFamily: C.sans, fontSize: 10, color: C.accent }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ label: "Reels", pct: "52.5%", color: C.purple }, { label: "Posts", pct: "33.5%", color: C.pink }, { label: "Stories", pct: "13.9%", color: C.blue }].map((f, i) => (
            <div key={i} style={{ flex: 1, padding: "10px 12px", border: `1px solid ${f.color}40`, background: `${f.color}08`, textAlign: "center" }}>
              <div style={{ fontFamily: C.sans, fontSize: 16, color: f.color, fontWeight: 600, marginBottom: 3 }}>{f.pct}</div>
              <div style={{ fontFamily: C.sans, fontSize: 9, color: C.muted, letterSpacing: 2, textTransform: "uppercase" }}>{f.label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, padding: "10px 14px", background: "rgba(201,169,110,0.04)", border: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: C.sans, fontSize: 9, color: C.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Key Insight</div>
          <div style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: 13, color: C.muted, lineHeight: 1.7 }}>Your top post (2.3K views) was a real life moment. Your faith content and quiet luxury aesthetic consistently outperform product demos. Lead with person, follow with product.</div>
        </div>
      </div>

      {/* CONTENT IDEAS */}
      <div style={{ width: "100%", maxWidth: 540 }}>
        <SL text="Content Ideas" />
        <Toggle options={[{ value: "today", label: "Today" }, { value: "week", label: "This Week" }]} value={contentView} onChange={setContentView} />

        {contentView === "today" && CONTENT_TODAY.map((t, i) => (
          <div key={i} onClick={() => setExpandedContent(expandedContent === i ? null : i)} style={{ borderLeft: `1px solid ${C.border}`, paddingLeft: 18, marginBottom: 22, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ fontFamily: C.sans, fontSize: 9, color: C.accent, letterSpacing: 3, textTransform: "uppercase", border: `1px solid ${C.border}`, padding: "2px 8px" }}>{t.format}</div>
                <div style={{ fontFamily: C.sans, fontSize: 9, color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>{t.type}</div>
              </div>
              <div style={{ fontFamily: C.sans, fontSize: 11, color: C.accent }}>{expandedContent === i ? "▲" : "▼"}</div>
            </div>
            <div style={{ fontFamily: C.serif, fontSize: 15, color: C.text, lineHeight: 1.7, marginBottom: 6 }}>{t.angle}</div>
            <div style={{ fontFamily: C.serif, fontStyle: "italic", color: C.accentSoft, fontSize: 14, marginBottom: expandedContent === i ? 12 : 0 }}>"{t.hook}"</div>
            {expandedContent === i && (
              <div>
                <div style={{ fontFamily: C.sans, fontSize: 11, color: C.muted, lineHeight: 1.6, marginBottom: 8, padding: "8px 12px", background: "rgba(201,169,110,0.04)", border: `1px solid ${C.border}` }}>
                  📊 {t.why}
                </div>
                {t.brand && <div style={{ fontFamily: C.sans, fontSize: 11, color: C.muted, marginBottom: 8 }}>✦ Pair with: {t.brand}</div>}
                <div style={{ fontFamily: C.sans, fontSize: 11, color: C.muted, marginBottom: 10 }}>CTA: {t.cta}</div>
                {t.tags.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{t.tags.map((tag, j) => <span key={j} style={{ fontFamily: C.sans, fontSize: 10, color: C.accent, border: `1px solid ${C.border}`, padding: "3px 10px" }}>{tag}</span>)}</div>}
              </div>
            )}
          </div>
        ))}

        {contentView === "week" && CONTENT_WEEK.map((t, i) => (
          <div key={i} onClick={() => setExpandedContent(expandedContent === `w${i}` ? null : `w${i}`)} style={{ display: "flex", gap: 16, marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
            <div style={{ minWidth: 32, paddingTop: 2 }}>
              <div style={{ fontFamily: C.sans, fontSize: 10, color: C.accent, letterSpacing: 2, textTransform: "uppercase" }}>{t.day}</div>
              <div style={{ fontFamily: C.sans, fontSize: 9, color: C.dimmed, marginTop: 2 }}>{t.date}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontFamily: C.sans, fontSize: 9, color: priorityColor(t.priority), letterSpacing: 1, textTransform: "uppercase", border: `1px solid ${priorityColor(t.priority)}40`, padding: "2px 7px" }}>{t.priority === "high" ? "🔥 High" : "✦ Medium"}</div>
                <div style={{ fontFamily: C.sans, fontSize: 9, color: C.muted, border: `1px solid ${C.border}`, padding: "2px 7px", letterSpacing: 1, textTransform: "uppercase" }}>{t.format}</div>
              </div>
              <div style={{ fontFamily: C.serif, fontSize: 14, color: C.text, lineHeight: 1.6, marginBottom: 6 }}>{t.angle}</div>
              <div style={{ fontFamily: C.serif, fontStyle: "italic", color: C.accentSoft, fontSize: 13, marginBottom: expandedContent === `w${i}` ? 10 : 0 }}>"{t.hook}"</div>
              {expandedContent === `w${i}` && (
                <div>
                  <div style={{ fontFamily: C.sans, fontSize: 11, color: C.muted, lineHeight: 1.6, marginBottom: 8, padding: "8px 12px", background: "rgba(201,169,110,0.04)", border: `1px solid ${C.border}` }}>
                    📊 {t.note}
                  </div>
                  {t.brand && <div style={{ fontFamily: C.sans, fontSize: 11, color: C.muted, marginBottom: 8 }}>✦ Pair with: {t.brand}</div>}
                  <div style={{ fontFamily: C.sans, fontSize: 10, color: C.purple, marginBottom: 8 }}>👥 {t.audience}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{t.tags.map((tag, j) => <span key={j} style={{ fontFamily: C.sans, fontSize: 10, color: C.accent, border: `1px solid ${C.border}`, padding: "3px 10px" }}>{tag}</span>)}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Divider label="content brief" />

      {!brief && !loading && (
        <div style={{ textAlign: "center", width: "100%", maxWidth: 540 }}>
          <Btn label="Run My Brief" onClick={runBrief} />
          <div style={{ marginTop: 16, fontFamily: C.serif, fontStyle: "italic", fontSize: 13, color: C.muted }}>Generate today's full content direction</div>
        </div>
      )}
      {loading && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>{[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, opacity: 0.5 }} />)}</div>
          <div style={{ fontFamily: C.serif, fontStyle: "italic", fontSize: 14, color: C.muted }}>Channeling today's brief...</div>
        </div>
      )}
      {brief && (
        <div style={{ width: "100%", maxWidth: 540 }}>
          <ContentSection label="Morning Affirmation"><em>{brief.affirmation}</em></ContentSection>
          <ContentSection label="Content Angle">{brief.contentAngle}</ContentSection>
          <ContentSection label="Opening Hook"><span style={{ color: C.accentSoft, fontSize: 18 }}>"{brief.hook}"</span></ContentSection>
          <ContentSection label="Caption">{brief.caption}</ContentSection>
          <ContentSection label="Brand Pairing">{brief.brandSuggestion}</ContentSection>
          <ContentSection label="Call to Action">{brief.cta}</ContentSection>
          <ContentSection label="Hashtags">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
              {brief.hashtags?.map((tag, i) => <span key={i} style={{ fontFamily: C.sans, fontSize: 11, color: C.accent, border: `1px solid ${C.border}`, padding: "4px 12px" }}>{tag}</span>)}
            </div>
          </ContentSection>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Btn outline label="Regenerate" onClick={runBrief} disabled={loading} />
          </div>
        </div>
      )}

      <div style={{ marginTop: 60, fontFamily: C.serif, fontStyle: "italic", fontSize: 11, color: C.border, letterSpacing: 2 }}>AURA · velse.health</div>
    </div>
  );
}
