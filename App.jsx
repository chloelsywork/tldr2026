import { useState, useEffect } from "react";

// ─── SCENARIOS ───────────────────────────────────────────────────────────────
const SCENARIOS = [
  { id:"S1",  day:1, age:"Age 22", emoji:"🛡️", tag:"Scenario 1",  title:"Protect Yourself First",
    story:"You just landed your first job! Getting insured while young costs $10,000 now — but could save you much more later.",
    type:"choice",
    choices:[
      {label:"Buy Insurance", sub:"HSGM + PA + CI · -$10,000",      cost:-10000, value:"insured",    emoji:"✅"},
      {label:"Skip It",       sub:"I'm young, I'll be fine",         cost:0,      value:"uninsured",  emoji:"❌"}
    ], payoffNote:"⏳ This choice will matter on Day 3..." },

  { id:"S2",  day:1, age:"Age 24", emoji:"🏠", tag:"Scenario 2",  title:"Buy Your First Home",
    story:"The BTO ballot comes through! Your choice determines how much you gain when you sell later.",
    type:"choice",
    choices:[
      {label:"Buy HDB BTO", sub:"Affordable & stable · -$40,000",       cost:-40000, value:"hdb",   emoji:"🏠"},
      {label:"Buy a Condo", sub:"Higher cost, higher upside · -$80,000", cost:-80000, value:"condo", emoji:"🏙️"}
    ], payoffNote:"⏳ Property profits revealed on Day 3!" },

  { id:"S3",  day:1, age:"Age 25", emoji:"📈", tag:"Scenario 3",  title:"Small Cap Tech Bet",
    story:"A hot small cap tech stock — high risk, high reward, or total loss. $10,000 on the line.",
    type:"choice",
    choices:[
      {label:"Buy Small Cap Tech", sub:"Swing for the fences · -$10,000", cost:-10000, value:"smallcap",    emoji:"🎲"},
      {label:"Keep Cash Safe",     sub:"Too risky for me",                 cost:0,      value:"no_smallcap", emoji:"💵"}
    ], payoffNote:"⏳ Find out what happens on Day 2..." },

  { id:"S4",  day:1, age:"Age 25", emoji:"📉", tag:"Scenario 4",  title:"Markets Are Volatile!",
    story:"The market tanks overnight. T-Bills at 3% — safe & guaranteed, or ride it out?",
    type:"choice",
    choices:[
      {label:"Buy T-Bills @ 3%", sub:"Safe & steady · -$10,000", cost:-10000, value:"tbills",    emoji:"🏦"},
      {label:"Do Nothing",       sub:"Ride the volatility",       cost:0,      value:"no_tbills", emoji:"🎢"}
    ], payoffNote:"⏳ T-Bills mature and pay out on Day 3!" },

  { id:"S5",  day:1, age:"Age 26", emoji:"💹", tag:"Scenario 5",  title:"Tech ETF Opportunity",
    story:"Your friend made 30% on a Tech ETF. Diversified, lower risk — want in for $10,000?",
    type:"choice",
    choices:[
      {label:"Buy Tech ETF", sub:"Diversified growth · -$10,000", cost:-10000, value:"etf",    emoji:"🚀"},
      {label:"Not Ready",    sub:"Maybe next time",                cost:0,      value:"no_etf", emoji:"🙈"}
    ], payoffNote:"⏳ ETF performance revealed on Day 2 & 3!" },

  { id:"SVB", day:2, age:"Age 28", emoji:"🌟", tag:"Vision Board", title:"Career Check-In",
    story:"Promoted! Income from the last 3 years is added. Those who submitted a Vision Board set clearer goals and earned more.",
    type:"choice",
    choices:[
      {label:"Yes — Vision Board Submitted!", sub:"Clear goals = higher income · +$180,000", gain:180000, value:"vb_yes", emoji:"🎯"},
      {label:"No — No Vision Board",          sub:"Still growing, but slower · +$120,000",   gain:120000, value:"vb_no",  emoji:"😬"}
    ] },

  { id:"S6",  day:2, age:"Age 29", emoji:"📜", tag:"Scenario 6",  title:"Will & LPA Time",
    story:"What happens to your assets if something happens to you? Will & LPA costs $1,000 but protects your family.",
    type:"choice",
    choices:[
      {label:"Do Up Will & LPA", sub:"Protect the family · -$1,000", cost:-1000, value:"will_lpa", emoji:"📋"},
      {label:"Not Now",          sub:"Too young to worry",            cost:0,     value:"no_will",  emoji:"🙈"}
    ], payoffNote:"⏳ Will & LPA = faster inheritance on Day 3!" },

  { id:"S7",  day:2, age:"Age 29", emoji:"🔄", tag:"Scenario 7",  title:"Continue Insurance Premiums?",
    story:"Insurance premiums are due again. $10,000 to keep coverage — is it worth continuing?",
    type:"choice",
    choices:[
      {label:"Keep Paying",   sub:"Stay protected · -$10,000", cost:-10000, value:"cont_insurance",   emoji:"🛡️"},
      {label:"Cancel Policy", sub:"Save the money now",         cost:0,      value:"cancel_insurance", emoji:"✂️"}
    ], payoffNote:"⏳ Critical if CI strikes on Day 3..." },

  { id:"S8",  day:2, age:"Age 30", emoji:"💍", tag:"Scenario 8",  title:"Your Dream Wedding",
    story:"Getting married! Angpaos from guests will NOT fully cover the cost.",
    type:"choice",
    choices:[
      {label:"Luxury Wedding", sub:"Grand celebration · -$50,000",    cost:-50000, value:"luxury_wedding", emoji:"👑"},
      {label:"Simple Wedding", sub:"Intimate & meaningful · -$25,000", cost:-25000, value:"simple_wedding", emoji:"🌸"}
    ] },

  { id:"S9",  day:2, age:"Age 31", emoji:"🚀", tag:"Scenario 9",  title:"Tech ETF Is Pumping!",
    story:"Your ETF has grown! Buy more for -$15,000? Those who bought in Scenario 5 also get a +$10,000 bonus.",
    type:"choice",
    choices:[
      {label:"Buy More ETF",     sub:"Double down · -$15,000", cost:-15000, value:"etf_more",    emoji:"💰"},
      {label:"Hold What I Have", sub:"Don't get greedy",        cost:0,      value:"no_etf_more", emoji:"🧘"}
    ], payoffNote:"⏳ ETF boom profits locked in on Day 3!" },

  { id:"S10", day:2, age:"Age 31", emoji:"🚗", tag:"Scenario 10", title:"Buy a Car?",
    story:"COE is available! A car means convenience — but it's a depreciating asset at $90,000 all in.",
    type:"choice",
    choices:[
      {label:"Buy a Car",        sub:"Convenience & status · -$90,000", cost:-90000, value:"car",    emoji:"🚗"},
      {label:"Public Transport", sub:"Save the money",                   cost:0,      value:"no_car", emoji:"🚌"}
    ], payoffNote:"⏳ Car resale value revealed on Day 3..." },

  { id:"S11", day:2, age:"Age 32", emoji:"💥", tag:"Scenario 11", title:"Small Cap DELISTED!",
    story:"BREAKING: The small cap tech company has been delisted. All shareholders lose everything.",
    type:"reveal",
    compute:(d)=> d.S3==="smallcap"
      ? {gain:-10000, msg:"💸 Your $10,000 is completely wiped out — company delisted.",  color:"#f87171"}
      : {gain:0,      msg:"✅ You stayed away from it. That was the right call!",          color:"#4ade80"} },

  { id:"S10b",day:2, age:"Age 33", emoji:"👴", tag:"Everyone",    title:"Parents' Rising Premiums",
    story:"Your parents retired and their insurance premiums are rising. The responsibility falls on you — this affects everyone.",
    type:"automatic", gain:-20000,
    note:"Everyone pays $20,000 ($10,000 per parent). This is the sandwich generation reality." },

  { id:"SD3", day:3, age:"Age 35", emoji:"🎉", tag:"Day 3 Bonus", title:"Career Milestone!",
    story:"You've been promoted! Everyone receives +$200,000 from years of career growth and compounding.",
    type:"automatic", gain:200000,
    note:"This reflects years of income, savings & compound growth. Everyone gets this!" },

  { id:"S14", day:3, age:"Age 35", emoji:"🏥", tag:"Scenario 14", title:"1 in 4: Critical Illness",
    story:"1 in 4 people face CI in their lifetime. Facilitator will announce if you're affected — then tap your answer below.",
    type:"ci",
    choices:[
      {label:"Yes — I was affected by CI", value:"ci_yes", emoji:"😰"},
      {label:"No — All clear for me",      value:"ci_no",  emoji:"✅"}
    ],
    compute:(d, ciChoice)=>{
      const insured = d.S1==="insured" || d.S7==="cont_insurance";
      if (ciChoice==="ci_yes" && !insured) return {gain:-100000, msg:"😰 CI hit & no insurance — -$100,000.",             color:"#f87171"};
      if (ciChoice==="ci_yes" &&  insured) return {gain:0,       msg:"🛡️ CI hit but you're insured — fully covered!",     color:"#4ade80"};
      return                                      {gain:0,       msg:"✅ No CI this time — insurance remains your safety net.", color:"#4ade80"};
    } },

  { id:"S15", day:3, age:"Age 36", emoji:"🔑", tag:"Scenario 15", title:"Sell Your Car",
    story:"Time to let go of the car. Depreciation and maintenance costs over the years really add up.",
    type:"reveal",
    compute:(d)=> d.S10==="car"
      ? {gain:10000, msg:"🚗 Car sold +$10,000 — but net loss ~$80,000 overall including maintenance.", color:"#facc15"}
      : {gain:0,     msg:"✅ No car, no loss! Public transport saved you tens of thousands.",            color:"#4ade80"} },

  { id:"S16", day:3, age:"Age 37", emoji:"🏡", tag:"Scenario 16", title:"Sell Your Property!",
    story:"The property market has grown. Time to cash out — your Day 1 choice determines your profit.",
    type:"reveal",
    compute:(d)=>{
      if (d.S2==="hdb")   return {gain:100000, msg:"🏠 HDB sold! Property gains: +$100,000!", color:"#4ade80"};
      if (d.S2==="condo") return {gain:200000, msg:"🏙️ Condo sold! Gains: +$200,000!",        color:"#4ade80"};
      return                     {gain:0,      msg:"😅 No property — no gains.",               color:"#94a3b8"};
    } },

  { id:"S17", day:3, age:"Age 38", emoji:"👴", tag:"Scenario 17", title:"Inheritance",
    story:"Your grandparents have passed. Those with a Will & LPA receive their inheritance faster.",
    type:"reveal",
    compute:(d)=> d.S6==="will_lpa"
      ? {gain:100000, msg:"📜 Will & LPA done! Inheritance received: +$100,000!", color:"#4ade80"}
      : {gain:0,      msg:"😔 No Will & LPA — process delayed, no inheritance.",   color:"#f87171"} },

  { id:"S4p", day:3, age:"Age 39", emoji:"💰", tag:"S4 Payoff",   title:"T-Bills Mature!",
    story:"Your T-Bills have matured with 3% compounded returns. Boring wins the long game.",
    type:"reveal",
    compute:(d)=> d.S4==="tbills"
      ? {gain:12000, msg:"💰 T-Bills paid out: +$12,000!", color:"#4ade80"}
      : {gain:0,     msg:"📉 No T-Bills — missed safe guaranteed returns.", color:"#94a3b8"} },

  { id:"S18", day:3, age:"Age 40", emoji:"🌟", tag:"Scenario 18", title:"Tech ETF Booms!",
    story:"The tech ETF has absolutely skyrocketed. Lock in your profits!",
    type:"reveal",
    compute:(d)=> (d.S5==="etf" || d.S9==="etf_more")
      ? {gain:100000, msg:"🚀 ETF boom! Profits locked in: +$100,000!", color:"#4ade80"}
      : {gain:0,      msg:"📉 No ETF — missed the boom. Lesson learned!", color:"#94a3b8"} },
];

const DAY_INFO = {
  1:{label:"Day 1", sub:"Early Career · Ages 22–26",    color:"#4ade80"},
  2:{label:"Day 2", sub:"Building Life · Ages 28–33",   color:"#facc15"},
  3:{label:"Day 3", sub:"Reaping Results · Ages 35–40", color:"#f97316"},
};

const PLAYER_NAMES = [
  "Winnie","Matthew","Hana","Zong Xian","Damian","Klavier","Mervell",
  "Arianna","Geremia","Cara","Sonakshi","Yugavaani","Marcus",
  "Player 14","Player 15","Player 16","Player 17","Player 18","Player 19","Player 20"
];


// ─── SCENE ILLUSTRATIONS (SVG per scenario) ──────────────────────────────────
const SCENE_SVGS = {
  S1: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
    <!-- sky -->
    <rect width="380" height="130" fill="#1e3a5f"/>
    <!-- building -->
    <rect x="30" y="30" width="60" height="90" rx="3" fill="#2d5186"/>
    <rect x="35" y="38" width="12" height="10" rx="1" fill="#facc15" opacity=".9"/>
    <rect x="53" y="38" width="12" height="10" rx="1" fill="#facc15" opacity=".6"/>
    <rect x="71" y="38" width="12" height="10" rx="1" fill="#94a3b8" opacity=".4"/>
    <rect x="35" y="56" width="12" height="10" rx="1" fill="#facc15" opacity=".7"/>
    <rect x="53" y="56" width="12" height="10" rx="1" fill="#facc15" opacity=".9"/>
    <rect x="71" y="56" width="12" height="10" rx="1" fill="#94a3b8" opacity=".4"/>
    <rect x="35" y="74" width="12" height="10" rx="1" fill="#94a3b8" opacity=".4"/>
    <rect x="53" y="74" width="12" height="10" rx="1" fill="#facc15" opacity=".6"/>
    <rect x="71" y="74" width="12" height="10" rx="1" fill="#facc15" opacity=".8"/>
    <rect x="45" y="98" width="18" height="22" rx="2" fill="#3b6cb7"/>
    <!-- person -->
    <circle cx="160" cy="55" r="14" fill="#fbbf24"/>
    <rect x="148" y="70" width="24" height="30" rx="4" fill="#3b82f6"/>
    <rect x="138" y="74" width="12" height="4" rx="2" fill="#3b82f6"/>
    <rect x="172" y="74" width="12" height="4" rx="2" fill="#3b82f6"/>
    <rect x="152" y="100" width="8" height="20" rx="3" fill="#1e40af"/>
    <rect x="162" y="100" width="8" height="20" rx="3" fill="#1e40af"/>
    <!-- shield -->
    <path d="M230 40 L270 40 L270 80 Q270 100 250 110 Q230 100 230 80 Z" fill="#4ade80" opacity=".9"/>
    <path d="M243 65 L250 72 L262 55" stroke="white" stroke-width="4" fill="none" stroke-linecap="round"/>
    <!-- sparkles -->
    <circle cx="300" cy="35" r="3" fill="#facc15" opacity=".8"/>
    <circle cx="320" cy="55" r="2" fill="#facc15" opacity=".6"/>
    <circle cx="340" cy="30" r="4" fill="#facc15" opacity=".5"/>
    <circle cx="355" cy="60" r="2" fill="#a5b4fc" opacity=".7"/>
  </svg>`,

  S2: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
    <!-- sky -->
    <rect width="380" height="130" fill="#0f2744"/>
    <!-- ground -->
    <rect y="105" width="380" height="25" fill="#1e3a2f"/>
    <!-- HDB block -->
    <rect x="20" y="20" width="120" height="90" rx="3" fill="#2563eb" opacity=".8"/>
    <rect x="28" y="28" width="14" height="12" rx="1" fill="#facc15" opacity=".9"/>
    <rect x="48" y="28" width="14" height="12" rx="1" fill="#facc15" opacity=".7"/>
    <rect x="68" y="28" width="14" height="12" rx="1" fill="#94a3b8" opacity=".4"/>
    <rect x="88" y="28" width="14" height="12" rx="1" fill="#facc15" opacity=".8"/>
    <rect x="108" y="28" width="14" height="12" rx="1" fill="#facc15" opacity=".6"/>
    <rect x="28" y="48" width="14" height="12" rx="1" fill="#94a3b8" opacity=".4"/>
    <rect x="48" y="48" width="14" height="12" rx="1" fill="#facc15" opacity=".9"/>
    <rect x="68" y="48" width="14" height="12" rx="1" fill="#facc15" opacity=".7"/>
    <rect x="88" y="48" width="14" height="12" rx="1" fill="#94a3b8" opacity=".4"/>
    <rect x="108" y="48" width="14" height="12" rx="1" fill="#facc15" opacity=".8"/>
    <rect x="28" y="68" width="14" height="12" rx="1" fill="#facc15" opacity=".6"/>
    <rect x="48" y="68" width="14" height="12" rx="1" fill="#94a3b8" opacity=".4"/>
    <rect x="68" y="68" width="14" height="12" rx="1" fill="#facc15" opacity=".9"/>
    <rect x="88" y="68" width="14" height="12" rx="1" fill="#facc15" opacity=".7"/>
    <rect x="55" y="88" width="22" height="22" rx="2" fill="#1e40af"/>
    <!-- condo -->
    <rect x="200" y="5" width="70" height="105" rx="4" fill="#7c3aed" opacity=".85"/>
    <rect x="208" y="12" width="12" height="10" rx="1" fill="#facc15" opacity=".8"/>
    <rect x="226" y="12" width="12" height="10" rx="1" fill="#facc15" opacity=".6"/>
    <rect x="244" y="12" width="12" height="10" rx="1" fill="#94a3b8" opacity=".4"/>
    <rect x="208" y="28" width="12" height="10" rx="1" fill="#facc15" opacity=".9"/>
    <rect x="226" y="28" width="12" height="10" rx="1" fill="#94a3b8" opacity=".4"/>
    <rect x="244" y="28" width="12" height="10" rx="1" fill="#facc15" opacity=".7"/>
    <rect x="208" y="44" width="12" height="10" rx="1" fill="#94a3b8" opacity=".4"/>
    <rect x="226" y="44" width="12" height="10" rx="1" fill="#facc15" opacity=".8"/>
    <rect x="244" y="44" width="12" height="10" rx="1" fill="#facc15" opacity=".9"/>
    <rect x="208" y="60" width="12" height="10" rx="1" fill="#facc15" opacity=".6"/>
    <rect x="226" y="60" width="12" height="10" rx="1" fill="#facc15" opacity=".7"/>
    <rect x="244" y="60" width="12" height="10" rx="1" fill="#94a3b8" opacity=".4"/>
    <rect x="208" y="76" width="12" height="10" rx="1" fill="#facc15" opacity=".9"/>
    <rect x="226" y="76" width="12" height="10" rx="1" fill="#94a3b8" opacity=".4"/>
    <rect x="244" y="76" width="12" height="10" rx="1" fill="#facc15" opacity=".8"/>
    <rect x="220" y="88" width="22" height="22" rx="2" fill="#5b21b6"/>
    <!-- vs badge -->
    <circle cx="185" cy="65" r="16" fill="#f97316"/>
    <text x="185" y="70" text-anchor="middle" fill="white" font-size="13" font-weight="700" font-family="sans-serif">VS</text>
    <!-- price tags -->
    <rect x="310" y="38" width="60" height="22" rx="4" fill="#4ade80" opacity=".9"/>
    <text x="340" y="53" text-anchor="middle" fill="#14532d" font-size="11" font-weight="700" font-family="sans-serif">$40K</text>
    <rect x="310" y="66" width="60" height="22" rx="4" fill="#f87171" opacity=".9"/>
    <text x="340" y="81" text-anchor="middle" fill="#7f1d1d" font-size="11" font-weight="700" font-family="sans-serif">$80K</text>
  </svg>`,

  S3: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="380" height="130" fill="#0f1e35"/>
    <!-- chart grid lines -->
    <line x1="40" y1="100" x2="300" y2="100" stroke="#1e3a5f" stroke-width="1"/>
    <line x1="40" y1="75" x2="300" y2="75" stroke="#1e3a5f" stroke-width="1"/>
    <line x1="40" y1="50" x2="300" y2="50" stroke="#1e3a5f" stroke-width="1"/>
    <line x1="40" y1="25" x2="300" y2="25" stroke="#1e3a5f" stroke-width="1"/>
    <!-- rising line -->
    <polyline points="40,95 80,80 120,60 160,45 200,30" stroke="#4ade80" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- crash line -->
    <polyline points="200,30 240,55 280,95 300,115" stroke="#f87171" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-dasharray="6,3"/>
    <!-- up arrow -->
    <polygon points="200,20 196,30 204,30" fill="#4ade80"/>
    <!-- down crash -->
    <polygon points="300,120 296,110 304,110" fill="#f87171"/>
    <!-- dice -->
    <rect x="320" y="30" width="44" height="44" rx="8" fill="#6366f1"/>
    <circle cx="334" cy="44" r="4" fill="white"/>
    <circle cx="352" cy="44" r="4" fill="white"/>
    <circle cx="334" cy="58" r="4" fill="white"/>
    <circle cx="352" cy="58" r="4" fill="white"/>
    <!-- label -->
    <rect x="50" y="18" width="80" height="20" rx="4" fill="#4ade80" opacity=".15"/>
    <text x="90" y="32" text-anchor="middle" fill="#4ade80" font-size="11" font-weight="700" font-family="sans-serif">SMALL CAP</text>
  </svg>`,

  S4: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="380" height="130" fill="#0f1e35"/>
    <!-- stormy sky effect -->
    <rect x="0" y="0" width="380" height="60" fill="#1a2744" opacity=".7"/>
    <!-- volatile chart -->
    <polyline points="20,80 50,40 70,90 100,20 130,70 160,45 190,85 220,30 250,75 280,50 310,90 340,35 370,70" stroke="#f87171" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- T-bill safe line -->
    <line x1="20" y1="95" x2="370" y2="85" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="8,4"/>
    <!-- 3% badge -->
    <rect x="290" y="55" width="70" height="24" rx="6" fill="#4ade80"/>
    <text x="325" y="71" text-anchor="middle" fill="#14532d" font-size="12" font-weight="700" font-family="sans-serif">T-Bill 3%</text>
    <!-- lightning bolts -->
    <polygon points="165,10 158,28 165,25 158,42" fill="#facc15" opacity=".8"/>
    <polygon points="200,5 192,24 200,21 192,38" fill="#facc15" opacity=".6"/>
  </svg>`,

  S5: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="380" height="130" fill="#0a1628"/>
    <!-- ETF pie slices -->
    <circle cx="100" cy="68" r="48" fill="#1e3a5f"/>
    <path d="M100,68 L100,20 A48,48 0 0,1 141,92 Z" fill="#6366f1" opacity=".9"/>
    <path d="M100,68 L141,92 A48,48 0 0,1 62,112 Z" fill="#4ade80" opacity=".9"/>
    <path d="M100,68 L62,112 A48,48 0 0,1 54,42 Z" fill="#facc15" opacity=".9"/>
    <path d="M100,68 L54,42 A48,48 0 0,1 100,20 Z" fill="#f97316" opacity=".9"/>
    <circle cx="100" cy="68" r="22" fill="#0a1628"/>
    <text x="100" y="73" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="700" font-family="sans-serif">ETF</text>
    <!-- rocket -->
    <path d="M260,90 L275,50 L290,90 Z" fill="#6366f1"/>
    <ellipse cx="275" cy="48" rx="10" ry="16" fill="#a5b4fc"/>
    <rect x="263" y="82" width="8" height="12" rx="2" fill="#f97316"/>
    <rect x="279" y="82" width="8" height="12" rx="2" fill="#f97316"/>
    <circle cx="275" cy="48" r="5" fill="#e0e7ff"/>
    <!-- stars -->
    <circle cx="220" cy="20" r="2" fill="#facc15" opacity=".8"/>
    <circle cx="240" cy="40" r="1.5" fill="#a5b4fc" opacity=".7"/>
    <circle cx="340" cy="25" r="2.5" fill="#facc15" opacity=".6"/>
    <circle cx="360" cy="50" r="1.5" fill="#a5b4fc" opacity=".8"/>
    <circle cx="320" cy="60" r="2" fill="#facc15" opacity=".5"/>
    <!-- +30% badge -->
    <rect x="300" y="75" width="68" height="26" rx="6" fill="#4ade80"/>
    <text x="334" y="92" text-anchor="middle" fill="#14532d" font-size="13" font-weight="700" font-family="sans-serif">+30%</text>
  </svg>`,

  SVB: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="380" height="130" fill="#0f1e35"/>
    <!-- vision board frame -->
    <rect x="30" y="15" width="150" height="100" rx="6" fill="#1e2d45" stroke="#6366f1" stroke-width="1.5"/>
    <text x="105" y="38" text-anchor="middle" fill="#a5b4fc" font-size="10" font-weight="700" font-family="sans-serif">VISION BOARD</text>
    <!-- photos on board -->
    <rect x="40" y="44" width="40" height="28" rx="3" fill="#4ade80" opacity=".7"/>
    <rect x="86" y="44" width="40" height="28" rx="3" fill="#6366f1" opacity=".7"/>
    <rect x="40" y="78" width="40" height="28" rx="3" fill="#f97316" opacity=".7"/>
    <rect x="86" y="78" width="40" height="28" rx="3" fill="#facc15" opacity=".7"/>
    <text x="60" y="61" text-anchor="middle" fill="white" font-size="9" font-family="sans-serif">home</text>
    <text x="106" y="61" text-anchor="middle" fill="white" font-size="9" font-family="sans-serif">travel</text>
    <text x="60" y="95" text-anchor="middle" fill="white" font-size="9" font-family="sans-serif">career</text>
    <text x="106" y="95" text-anchor="middle" fill="white" font-size="9" font-family="sans-serif">family</text>
    <!-- vs no vision -->
    <rect x="210" y="15" width="150" height="100" rx="6" fill="#1a1a2e" stroke="#334155" stroke-width="1.5" stroke-dasharray="6,3"/>
    <text x="285" y="65" text-anchor="middle" fill="#475569" font-size="11" font-family="sans-serif">No board</text>
    <text x="285" y="80" text-anchor="middle" fill="#334155" font-size="9" font-family="sans-serif">No direction</text>
    <!-- income diff -->
    <rect x="148" y="48" width="64" height="20" rx="4" fill="#4ade80"/>
    <text x="180" y="62" text-anchor="middle" fill="#14532d" font-size="10" font-weight="700" font-family="sans-serif">+$60K more</text>
  </svg>`,

  S6: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="380" height="130" fill="#0f1a2e"/>
    <!-- document -->
    <rect x="50" y="10" width="110" height="110" rx="6" fill="#1e2d45" stroke="#6366f1" stroke-width="1.5"/>
    <rect x="62" y="25" width="86" height="8" rx="2" fill="#6366f1" opacity=".6"/>
    <rect x="62" y="40" width="70" height="5" rx="2" fill="#475569" opacity=".6"/>
    <rect x="62" y="52" width="78" height="5" rx="2" fill="#475569" opacity=".6"/>
    <rect x="62" y="64" width="60" height="5" rx="2" fill="#475569" opacity=".6"/>
    <rect x="62" y="76" width="74" height="5" rx="2" fill="#475569" opacity=".6"/>
    <!-- signature -->
    <path d="M62,95 Q75,85 88,95 Q101,105 114,95" stroke="#4ade80" stroke-width="2" fill="none" stroke-linecap="round"/>
    <text x="105" y="20" text-anchor="middle" fill="#a5b4fc" font-size="10" font-weight="700" font-family="sans-serif">WILL &amp; LPA</text>
    <!-- family silhouettes -->
    <circle cx="240" cy="45" r="12" fill="#fbbf24"/>
    <rect x="228" y="58" width="24" height="22" rx="3" fill="#3b82f6"/>
    <circle cx="270" cy="50" r="10" fill="#f9a8d4"/>
    <rect x="260" y="61" width="20" height="18" rx="3" fill="#ec4899"/>
    <circle cx="255" cy="72" r="7" fill="#fbbf24"/>
    <rect x="249" y="79" width="14" height="14" rx="2" fill="#6366f1"/>
    <!-- inheritance arrow -->
    <line x1="175" y1="65" x2="215" y2="65" stroke="#4ade80" stroke-width="2" stroke-dasharray="5,3"/>
    <polygon points="215,61 215,69 223,65" fill="#4ade80"/>
    <text x="195" y="58" text-anchor="middle" fill="#4ade80" font-size="9" font-family="sans-serif">protected</text>
    <!-- heart -->
    <path d="M308,30 Q308,20 318,20 Q328,20 328,30 Q328,40 308,50 Q288,40 288,30 Q288,20 298,20 Q308,20 308,30 Z" fill="#f87171" opacity=".8"/>
  </svg>`,

  S7: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="380" height="130" fill="#0f1e35"/>
    <!-- shield icon -->
    <path d="M80,15 L140,15 L140,70 Q140,100 110,115 Q80,100 80,70 Z" fill="#1e3a5f" stroke="#4ade80" stroke-width="1.5"/>
    <path d="M88,20 L132,20 L132,70 Q132,96 110,108 Q88,96 88,70 Z" fill="#164e63" opacity=".5"/>
    <path d="M98,62 L107,72 L124,50" stroke="#4ade80" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- scissors (cancel) -->
    <line x1="220" y1="40" x2="290" y2="100" stroke="#f87171" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="290" y1="40" x2="220" y2="100" stroke="#f87171" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="220" cy="40" r="8" fill="#f87171" opacity=".3" stroke="#f87171" stroke-width="1.5"/>
    <circle cx="290" cy="40" r="8" fill="#f87171" opacity=".3" stroke="#f87171" stroke-width="1.5"/>
    <!-- premium bill -->
    <rect x="175" y="50" width="50" height="32" rx="4" fill="#1e2d45" stroke="#475569" stroke-width="1"/>
    <text x="200" y="65" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="sans-serif">PREMIUM</text>
    <text x="200" y="77" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700" font-family="sans-serif">$10K</text>
    <!-- warning badge -->
    <polygon points="330,20 345,48 315,48" fill="#facc15" opacity=".9"/>
    <text x="330" y="42" text-anchor="middle" fill="#78350f" font-size="16" font-weight="700" font-family="sans-serif">!</text>
    <text x="330" y="70" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="sans-serif">CI risk</text>
  </svg>`,

  S8: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="380" height="130" fill="#1a0a2e"/>
    <!-- wedding arch -->
    <path d="M130,120 L130,50 Q130,10 170,10 Q210,10 210,50 L210,120" stroke="#f9a8d4" stroke-width="3" fill="none"/>
    <!-- flowers -->
    <circle cx="130" cy="50" r="8" fill="#f472b6" opacity=".8"/>
    <circle cx="210" cy="50" r="8" fill="#f472b6" opacity=".8"/>
    <circle cx="170" cy="10" r="8" fill="#f472b6" opacity=".8"/>
    <!-- couple silhouettes -->
    <circle cx="155" cy="72" r="11" fill="#fbbf24"/>
    <rect x="144" y="84" width="22" height="28" rx="3" fill="#1e40af"/>
    <circle cx="188" cy="72" r="11" fill="#f9a8d4"/>
    <path d="M177,84 Q188,96 199,84 L199,112 L177,112 Z" fill="#ec4899"/>
    <!-- price tags -->
    <rect x="20" y="40" width="80" height="26" rx="5" fill="#4ade80" opacity=".15" stroke="#4ade80" stroke-width="1"/>
    <text x="60" y="57" text-anchor="middle" fill="#4ade80" font-size="12" font-weight="700" font-family="sans-serif">Simple $25K</text>
    <rect x="280" y="40" width="84" height="26" rx="5" fill="#f87171" opacity=".15" stroke="#f87171" stroke-width="1"/>
    <text x="322" y="57" text-anchor="middle" fill="#f87171" font-size="12" font-weight="700" font-family="sans-serif">Luxury $50K</text>
    <!-- angpao envelopes -->
    <rect x="30" y="80" width="24" height="16" rx="2" fill="#f87171"/>
    <path d="M30,80 L42,90 L54,80" stroke="#fbbf24" stroke-width="1.5" fill="none"/>
    <rect x="60" y="80" width="24" height="16" rx="2" fill="#f87171"/>
    <path d="M60,80 L72,90 L84,80" stroke="#fbbf24" stroke-width="1.5" fill="none"/>
    <text x="60" y="108" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="sans-serif">angpaos won&apos;t cover it!</text>
  </svg>`,

  S9: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="380" height="130" fill="#0a1628"/>
    <!-- rocket boost -->
    <path d="M180,110 L195,50 L210,110 Z" fill="#6366f1"/>
    <ellipse cx="195" cy="46" rx="14" ry="22" fill="#a5b4fc"/>
    <rect x="181" y="100" width="10" height="18" rx="2" fill="#f97316"/>
    <rect x="199" y="100" width="10" height="18" rx="2" fill="#f97316"/>
    <circle cx="195" cy="46" r="7" fill="#e0e7ff"/>
    <!-- chart zoom up -->
    <polyline points="20,100 60,90 100,70 140,45 180,25" stroke="#4ade80" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <polygon points="180,15 175,28 185,28" fill="#4ade80"/>
    <!-- double down -->
    <rect x="250" y="30" width="100" height="36" rx="6" fill="#1e3a5f" stroke="#6366f1" stroke-width="1"/>
    <text x="300" y="47" text-anchor="middle" fill="#a5b4fc" font-size="11" font-weight="700" font-family="sans-serif">Buy More</text>
    <text x="300" y="60" text-anchor="middle" fill="#f87171" font-size="10" font-family="sans-serif">-$15,000</text>
    <!-- bonus badge -->
    <rect x="250" y="78" width="100" height="28" rx="6" fill="#4ade80"/>
    <text x="300" y="96" text-anchor="middle" fill="#14532d" font-size="11" font-weight="700" font-family="sans-serif">S5 Bonus +$10K</text>
  </svg>`,

  S10: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="380" height="130" fill="#0a1628"/>
    <!-- road -->
    <rect y="90" width="380" height="40" fill="#1e293b"/>
    <line x1="0" y1="110" x2="380" y2="110" stroke="#facc15" stroke-width="1.5" stroke-dasharray="20,15"/>
    <!-- car -->
    <rect x="100" y="60" width="100" height="40" rx="6" fill="#3b82f6"/>
    <rect x="115" y="48" width="70" height="24" rx="5" fill="#2563eb"/>
    <rect x="118" y="50" width="28" height="18" rx="3" fill="#7dd3fc" opacity=".7"/>
    <rect x="152" y="50" width="28" height="18" rx="3" fill="#7dd3fc" opacity=".7"/>
    <circle cx="120" cy="100" r="13" fill="#1e293b" stroke="#94a3b8" stroke-width="3"/>
    <circle cx="120" cy="100" r="5" fill="#475569"/>
    <circle cx="180" cy="100" r="13" fill="#1e293b" stroke="#94a3b8" stroke-width="3"/>
    <circle cx="180" cy="100" r="5" fill="#475569"/>
    <rect x="195" y="68" width="8" height="6" rx="1" fill="#facc15"/>
    <rect x="97" y="68" width="8" height="6" rx="1" fill="#f87171"/>
    <!-- depreciation arrow -->
    <text x="300" y="40" text-anchor="middle" fill="#f87171" font-size="24" font-weight="700" font-family="sans-serif">↓</text>
    <text x="300" y="58" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700" font-family="sans-serif">depreciates</text>
    <rect x="248" y="64" width="104" height="22" rx="5" fill="#f87171" opacity=".15" stroke="#f87171" stroke-width="1"/>
    <text x="300" y="79" text-anchor="middle" fill="#f87171" font-size="11" font-family="sans-serif">-$90,000</text>
    <!-- bus -->
    <rect x="28" y="56" width="50" height="36" rx="4" fill="#4ade80" opacity=".8"/>
    <rect x="33" y="60" width="14" height="12" rx="2" fill="#a7f3d0" opacity=".7"/>
    <rect x="52" y="60" width="14" height="12" rx="2" fill="#a7f3d0" opacity=".7"/>
    <rect x="28" y="82" width="50" height="8" rx="2" fill="#166534"/>
    <circle cx="38" cy="94" r="6" fill="#1e293b" stroke="#4ade80" stroke-width="2"/>
    <circle cx="68" cy="94" r="6" fill="#1e293b" stroke="#4ade80" stroke-width="2"/>
    <text x="53" y="75" text-anchor="middle" fill="white" font-size="9" font-family="sans-serif">BUS</text>
  </svg>`,

  S11: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="380" height="130" fill="#1a0505"/>
    <!-- crashing chart -->
    <polyline points="20,20 80,18 140,22 200,40 260,80 310,110 360,125" stroke="#f87171" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <polygon points="355,118 358,108 365,115" fill="#f87171"/>
    <!-- newspaper -->
    <rect x="40" y="40" width="130" height="70" rx="5" fill="#1e2d45" stroke="#475569" stroke-width="1"/>
    <rect x="48" y="48" width="114" height="12" rx="2" fill="#f87171" opacity=".8"/>
    <text x="105" y="58" text-anchor="middle" fill="white" font-size="9" font-weight="700" font-family="sans-serif">BREAKING NEWS</text>
    <rect x="48" y="66" width="80" height="5" rx="1" fill="#475569" opacity=".6"/>
    <rect x="48" y="76" width="95" height="5" rx="1" fill="#475569" opacity=".6"/>
    <rect x="48" y="86" width="60" height="5" rx="1" fill="#475569" opacity=".6"/>
    <text x="105" y="103" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700" font-family="sans-serif">DELISTED</text>
    <!-- explosion -->
    <circle cx="300" cy="55" r="35" fill="#f97316" opacity=".2"/>
    <circle cx="300" cy="55" r="22" fill="#f97316" opacity=".3"/>
    <circle cx="300" cy="55" r="12" fill="#f87171"/>
    <text x="300" y="60" text-anchor="middle" fill="white" font-size="16" font-weight="700" font-family="sans-serif">💥</text>
    <text x="300" y="100" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700" font-family="sans-serif">-$10,000</text>
  </svg>`,

  S10b: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="380" height="130" fill="#0f1e35"/>
    <!-- parent figures -->
    <circle cx="130" cy="40" r="16" fill="#fbbf24" opacity=".7"/>
    <rect x="115" y="57" width="30" height="35" rx="4" fill="#6366f1" opacity=".7"/>
    <circle cx="180" cy="42" r="15" fill="#f9a8d4" opacity=".7"/>
    <rect x="166" y="58" width="28" height="33" rx="4" fill="#ec4899" opacity=".7"/>
    <!-- you (centre) -->
    <circle cx="255" cy="35" r="18" fill="#fbbf24"/>
    <rect x="239" y="54" width="32" height="40" rx="5" fill="#3b82f6"/>
    <!-- arrows from parents to you -->
    <line x1="157" y1="58" x2="232" y2="55" stroke="#f87171" stroke-width="2" stroke-dasharray="5,3"/>
    <polygon points="232,51 232,59 240,55" fill="#f87171"/>
    <!-- insurance pill -->
    <rect x="50" y="95" width="90" height="24" rx="6" fill="#1e3a5f" stroke="#6366f1" stroke-width="1"/>
    <text x="95" y="111" text-anchor="middle" fill="#a5b4fc" font-size="11" font-family="sans-serif">Their premiums</text>
    <!-- bill total -->
    <rect x="280" y="80" width="84" height="38" rx="6" fill="#f87171" opacity=".15" stroke="#f87171" stroke-width="1.5"/>
    <text x="322" y="97" text-anchor="middle" fill="#f87171" font-size="11" font-weight="700" font-family="sans-serif">-$20,000</text>
    <text x="322" y="111" text-anchor="middle" fill="#f87171" font-size="9" font-family="sans-serif">for both parents</text>
  </svg>`,

  SD3: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="380" height="130" fill="#0a1628"/>
    <!-- trophy -->
    <rect x="155" y="80" width="30" height="12" rx="2" fill="#b45309"/>
    <rect x="145" y="92" width="50" height="8" rx="2" fill="#b45309"/>
    <path d="M155,30 L155,80 L205,80 L205,30 Q205,10 180,10 Q155,10 155,30 Z" fill="#facc15"/>
    <path d="M155,35 Q140,35 140,55 Q140,72 155,72" stroke="#facc15" stroke-width="6" fill="none"/>
    <path d="M205,35 Q220,35 220,55 Q220,72 205,72" stroke="#facc15" stroke-width="6" fill="none"/>
    <path d="M167,48 L175,56 L193,40" stroke="white" stroke-width="3" fill="none" stroke-linecap="round"/>
    <!-- confetti -->
    <rect x="50" y="15" width="8" height="8" rx="1" fill="#f472b6" transform="rotate(20,54,19)"/>
    <rect x="80" y="30" width="6" height="6" rx="1" fill="#4ade80" transform="rotate(-15,83,33)"/>
    <rect x="280" y="20" width="8" height="8" rx="1" fill="#facc15" transform="rotate(35,284,24)"/>
    <rect x="310" y="40" width="6" height="6" rx="1" fill="#f97316" transform="rotate(-20,313,43)"/>
    <rect x="60" y="60" width="6" height="6" rx="1" fill="#6366f1" transform="rotate(45,63,63)"/>
    <rect x="300" y="70" width="8" height="8" rx="1" fill="#f472b6" transform="rotate(30,304,74)"/>
    <circle cx="100" cy="25" r="4" fill="#facc15" opacity=".8"/>
    <circle cx="270" cy="30" r="3" fill="#4ade80" opacity=".8"/>
    <circle cx="340" cy="15" r="4" fill="#f97316" opacity=".8"/>
    <!-- +200K badge -->
    <rect x="240" y="75" width="116" height="32" rx="8" fill="#4ade80"/>
    <text x="298" y="95" text-anchor="middle" fill="#14532d" font-size="14" font-weight="700" font-family="sans-serif">+$200,000!</text>
  </svg>`,

  S14: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="380" height="130" fill="#1a0f1a"/>
    <!-- hospital cross -->
    <rect x="30" y="25" width="80" height="80" rx="8" fill="#1e2d45" stroke="#f87171" stroke-width="1.5"/>
    <rect x="55" y="38" width="30" height="54" rx="3" fill="#f87171" opacity=".8"/>
    <rect x="42" y="51" width="56" height="28" rx="3" fill="#f87171" opacity=".8"/>
    <!-- 4 people -->
    <circle cx="180" cy="38" r="11" fill="#fbbf24"/>
    <rect x="170" y="50" width="20" height="25" rx="3" fill="#3b82f6"/>
    <circle cx="215" cy="38" r="11" fill="#f9a8d4"/>
    <rect x="205" y="50" width="20" height="25" rx="3" fill="#ec4899"/>
    <circle cx="250" cy="38" r="11" fill="#86efac"/>
    <rect x="240" y="50" width="20" height="25" rx="3" fill="#4ade80"/>
    <!-- 1 in 4 highlighted -->
    <circle cx="285" cy="38" r="11" fill="#f87171"/>
    <rect x="275" y="50" width="20" height="25" rx="3" fill="#dc2626"/>
    <text x="285" y="86" text-anchor="middle" fill="#f87171" font-size="9" font-weight="700" font-family="sans-serif">CI!</text>
    <!-- 1 in 4 label -->
    <rect x="150" y="90" width="180" height="28" rx="6" fill="#f87171" opacity=".15" stroke="#f87171" stroke-width="1"/>
    <text x="240" y="108" text-anchor="middle" fill="#f87171" font-size="12" font-weight="700" font-family="sans-serif">1 in 4 — is it you?</text>
  </svg>`,

  S15: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="380" height="130" fill="#0a1628"/>
    <!-- road -->
    <rect y="95" width="380" height="35" fill="#1e293b"/>
    <line x1="0" y1="112" x2="380" y2="112" stroke="#facc15" stroke-width="1.5" stroke-dasharray="20,15"/>
    <!-- car fading away -->
    <rect x="100" y="62" width="90" height="38" rx="6" fill="#3b82f6" opacity=".5"/>
    <rect x="112" y="50" width="62" height="22" rx="5" fill="#2563eb" opacity=".5"/>
    <circle cx="116" cy="100" r="11" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>
    <circle cx="174" cy="100" r="11" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>
    <!-- depreciation calc -->
    <rect x="230" y="20" width="130" height="76" rx="8" fill="#1e2d45" stroke="#334155" stroke-width="1"/>
    <text x="295" y="40" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="sans-serif">Paid: $90,000</text>
    <line x1="242" y1="48" x2="348" y2="48" stroke="#334155" stroke-width="0.5"/>
    <text x="295" y="62" text-anchor="middle" fill="#4ade80" font-size="10" font-family="sans-serif">Sold: +$10,000</text>
    <line x1="242" y1="70" x2="348" y2="70" stroke="#334155" stroke-width="0.5"/>
    <text x="295" y="85" text-anchor="middle" fill="#f87171" font-size="12" font-weight="700" font-family="sans-serif">Net: -$80K</text>
  </svg>`,

  S16: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="380" height="130" fill="#0a1e14"/>
    <!-- HDB -->
    <rect x="20" y="25" width="90" height="90" rx="3" fill="#1e3a5f"/>
    <rect x="30" y="34" width="12" height="10" rx="1" fill="#facc15" opacity=".8"/>
    <rect x="48" y="34" width="12" height="10" rx="1" fill="#facc15" opacity=".6"/>
    <rect x="66" y="34" width="12" height="10" rx="1" fill="#94a3b8" opacity=".4"/>
    <rect x="30" y="52" width="12" height="10" rx="1" fill="#facc15" opacity=".9"/>
    <rect x="48" y="52" width="12" height="10" rx="1" fill="#94a3b8" opacity=".4"/>
    <rect x="40" y="88" width="20" height="27" rx="2" fill="#164e63"/>
    <rect x="130" y="40" width="60" height="22" rx="5" fill="#4ade80"/>
    <text x="160" y="55" text-anchor="middle" fill="#14532d" font-size="12" font-weight="700" font-family="sans-serif">+$100K</text>
    <!-- condo -->
    <rect x="210" y="5" width="70" height="110" rx="4" fill="#5b21b6"/>
    <rect x="218" y="12" width="10" height="8" rx="1" fill="#facc15" opacity=".8"/>
    <rect x="234" y="12" width="10" height="8" rx="1" fill="#facc15" opacity=".6"/>
    <rect x="250" y="12" width="10" height="8" rx="1" fill="#94a3b8" opacity=".4"/>
    <rect x="218" y="26" width="10" height="8" rx="1" fill="#facc15" opacity=".9"/>
    <rect x="234" y="26" width="10" height="8" rx="1" fill="#94a3b8" opacity=".4"/>
    <rect x="250" y="26" width="10" height="8" rx="1" fill="#facc15" opacity=".7"/>
    <rect x="222" y="98" width="18" height="17" rx="2" fill="#3b0764"/>
    <rect x="295" y="40" width="70" height="22" rx="5" fill="#4ade80"/>
    <text x="330" y="55" text-anchor="middle" fill="#14532d" font-size="12" font-weight="700" font-family="sans-serif">+$200K</text>
    <!-- upward arrows -->
    <text x="160" y="30" text-anchor="middle" fill="#4ade80" font-size="20" font-weight="900" font-family="sans-serif">↑</text>
    <text x="330" y="30" text-anchor="middle" fill="#4ade80" font-size="20" font-weight="900" font-family="sans-serif">↑</text>
  </svg>`,

  S17: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="380" height="130" fill="#0f1e35"/>
    <!-- grandparent -->
    <circle cx="70" cy="38" r="18" fill="#d4a574" opacity=".7"/>
    <rect x="54" y="57" width="32" height="35" rx="5" fill="#6b7280" opacity=".7"/>
    <!-- will doc -->
    <rect x="130" y="20" width="90" height="100" rx="6" fill="#1e2d45" stroke="#4ade80" stroke-width="1.5"/>
    <rect x="140" y="32" width="70" height="8" rx="2" fill="#4ade80" opacity=".6"/>
    <rect x="140" y="46" width="55" height="4" rx="1" fill="#475569" opacity=".6"/>
    <rect x="140" y="56" width="62" height="4" rx="1" fill="#475569" opacity=".6"/>
    <rect x="140" y="66" width="48" height="4" rx="1" fill="#475569" opacity=".6"/>
    <path d="M140,84 Q153,74 166,84 Q179,94 192,84" stroke="#4ade80" stroke-width="2" fill="none" stroke-linecap="round"/>
    <text x="175" y="26" text-anchor="middle" fill="#a5b4fc" font-size="9" font-weight="700" font-family="sans-serif">WILL</text>
    <!-- transfer to you -->
    <line x1="222" y1="65" x2="268" y2="65" stroke="#4ade80" stroke-width="2" stroke-dasharray="5,3"/>
    <polygon points="268,61 268,69 276,65" fill="#4ade80"/>
    <!-- you -->
    <circle cx="290" cy="45" r="16" fill="#fbbf24"/>
    <rect x="276" y="62" width="28" height="32" rx="4" fill="#3b82f6"/>
    <!-- money bag -->
    <circle cx="290" cy="105" r="16" fill="#facc15"/>
    <text x="290" y="111" text-anchor="middle" fill="#78350f" font-size="13" font-weight="700" font-family="sans-serif">$</text>
    <rect x="283" y="89" width="14" height="6" rx="2" fill="#b45309"/>
  </svg>`,

  S4p: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="380" height="130" fill="#0a1628"/>
    <!-- steady growth line -->
    <polyline points="20,100 80,92 140,83 200,74 260,65 320,55 370,47" stroke="#4ade80" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- dots -->
    <circle cx="80" cy="92" r="4" fill="#4ade80"/>
    <circle cx="140" cy="83" r="4" fill="#4ade80"/>
    <circle cx="200" cy="74" r="4" fill="#4ade80"/>
    <circle cx="260" cy="65" r="4" fill="#4ade80"/>
    <circle cx="320" cy="55" r="4" fill="#4ade80"/>
    <!-- bill note -->
    <rect x="30" y="18" width="110" height="56" rx="6" fill="#1e3a2f" stroke="#4ade80" stroke-width="1"/>
    <rect x="38" y="26" width="94" height="18" rx="3" fill="#166534" opacity=".5"/>
    <text x="85" y="39" text-anchor="middle" fill="#4ade80" font-size="11" font-weight="700" font-family="sans-serif">T-BILL</text>
    <text x="85" y="53" text-anchor="middle" fill="#4ade80" font-size="22" font-weight="900" font-family="sans-serif">3%</text>
    <text x="85" y="67" text-anchor="middle" fill="#86efac" font-size="9" font-family="sans-serif">guaranteed</text>
    <!-- payout badge -->
    <rect x="250" y="18" width="110" height="36" rx="8" fill="#4ade80"/>
    <text x="305" y="32" text-anchor="middle" fill="#14532d" font-size="11" font-weight="700" font-family="sans-serif">MATURED!</text>
    <text x="305" y="47" text-anchor="middle" fill="#14532d" font-size="13" font-weight="900" font-family="sans-serif">+$12,000</text>
  </svg>`,

  S18: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="380" height="130" fill="#0a1020"/>
    <!-- massive chart spike -->
    <polyline points="20,110 70,100 120,90 170,75 200,60 230,35 255,15" stroke="#4ade80" stroke-width="3" fill="none" stroke-linecap="round"/>
    <polyline points="255,15 280,45 310,80 350,110" stroke="#94a3b8" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-dasharray="6,4"/>
    <polygon points="255,5 249,18 261,18" fill="#4ade80"/>
    <!-- ETF label -->
    <rect x="20" y="15" width="80" height="22" rx="4" fill="#4ade80" opacity=".15" stroke="#4ade80" stroke-width="1"/>
    <text x="60" y="30" text-anchor="middle" fill="#4ade80" font-size="11" font-weight="700" font-family="sans-serif">TECH ETF</text>
    <!-- boom circle -->
    <circle cx="300" cy="55" r="44" fill="#facc15" opacity=".08"/>
    <circle cx="300" cy="55" r="30" fill="#facc15" opacity=".12"/>
    <circle cx="300" cy="55" r="18" fill="#facc15" opacity=".2"/>
    <!-- profit badge -->
    <rect x="240" y="90" width="120" height="30" rx="8" fill="#4ade80"/>
    <text x="300" y="109" text-anchor="middle" fill="#14532d" font-size="14" font-weight="900" font-family="sans-serif">+$100,000!</text>
    <!-- stars -->
    <circle cx="50" cy="30" r="2.5" fill="#facc15" opacity=".7"/>
    <circle cx="150" cy="20" r="2" fill="#facc15" opacity=".6"/>
    <circle cx="340" cy="25" r="3" fill="#facc15" opacity=".8"/>
    <circle cx="360" cy="50" r="2" fill="#a5b4fc" opacity=".7"/>
  </svg>`,
};


const BASE_NW = 100000;
const FACIL_PASS = "tldr2026";

// ─── STORAGE (Firebase Realtime Database) ────────────────────────────────────
const FB_URL = "https://tldr2026-10dae-default-rtdb.asia-southeast1.firebasedatabase.app";

async function sGet(key) {
  try {
    const res = await fetch(`${FB_URL}/${key}.json`);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function sSet(key, val) {
  try {
    await fetch(`${FB_URL}/${key}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(val)
    });
  } catch {}
}

// ─── COMPUTE NET WORTH ────────────────────────────────────────────────────────
// decisions = { scenarioId: choiceValue }
// completed = Set of scenario IDs the player has submitted
function computeNW(decisions, completed) {
  let nw = BASE_NW;
  for (const s of SCENARIOS) {
    if (!completed.has(s.id)) continue;
    if (s.type === "choice") {
      const c = s.choices?.find(c => c.value === decisions[s.id]);
      if (c) { nw += (c.cost || 0); nw += (c.gain || 0); }
    } else if (s.type === "automatic") {
      nw += s.gain;
    } else if (s.type === "reveal" || s.type === "ci") {
      if (s.compute) {
        const r = s.type === "ci"
          ? s.compute(decisions, decisions[s.id])
          : s.compute(decisions);
        nw += r.gain;
      }
    }
    // S5→S9 bonus: if player bought S5 ETF and has now completed S9
    if (s.id === "S9" && decisions["S5"] === "etf" && completed.has("S9")) nw += 10000;
  }
  return nw;
}


// ─── COMPUTE NAV BREAKDOWN ────────────────────────────────────────────────────
// Returns { cash, property, etf, tbills, car, insurance, nav }
function computeNAV(decisions, completed) {
  const d = decisions;
  const c = completed;

  // Cash: start with base, apply all cash-flow decisions
  const cash = computeNW(decisions, completed);

  // Property asset value (current market, pre-sell)
  let property = 0;
  if (c.has("S2")) {
    if (d.S2 === "hdb")   property = 40000 + 100000; // cost + gain = current value
    if (d.S2 === "condo") property = 80000 + 200000;
  }
  // If sold (S16 completed), property is liquidated into cash already
  if (c.has("S16")) property = 0;

  // ETF asset value
  let etf = 0;
  if (c.has("S5") && d.S5 === "etf")        etf += 10000;
  if (c.has("S9") && d.S9 === "etf_more")   etf += 15000;
  if (c.has("S5") && d.S5 === "etf" && c.has("S9")) etf += 10000; // bonus
  // If cashed out (S18 completed), ETF is liquidated
  if (c.has("S18")) etf = 0;

  // T-Bills
  let tbills = 0;
  if (c.has("S4") && d.S4 === "tbills") tbills = 10000;
  if (c.has("S4p")) tbills = 0; // matured & paid out

  // Car (depreciating asset, current value estimate)
  let car = 0;
  if (c.has("S10") && d.S10 === "car") car = 60000; // estimated current value mid-game
  if (c.has("S15")) car = 0; // sold

  // Insurance (protection value — not a financial asset but shown for awareness)
  let insured = false;
  if ((c.has("S1") && d.S1 === "insured") || (c.has("S7") && d.S7 === "cont_insurance")) {
    insured = true;
  }

  const nav = cash + property + etf + tbills + car;
  return { cash, property, etf, tbills, car, insured, nav };
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode]       = useState(null); // null | facilitator | player
  const [booting, setBooting] = useState(true);

  // ── Facilitator state
  const [facilAuthed, setFacilAuthed]   = useState(false);
  const [facilPass, setFacilPass]       = useState("");
  const [globalIdx, setGlobalIdx]       = useState(0);   // which scenario index is live
  const [allPlayerData, setAllPlayerData] = useState({}); // { 1: {decisions, completed:[]} }

  // ── Player state
  const [playerNum, setPlayerNum]   = useState(null);
  const [numInput, setNumInput]     = useState("");
  const [myDecisions, setMyDecisions] = useState({});
  const [myCompleted, setMyCompleted] = useState(new Set()); // Set of scenario IDs done
  const [liveGlobalIdx, setLiveGlobalIdx] = useState(0);
  const [pendingCiChoice, setPendingCiChoice] = useState(null);
  const [revealResult, setRevealResult] = useState(null); // shown after reveal/ci

  // ── Password state
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [settingPassword, setSettingPassword] = useState(false); // true = new player setting pw
  const [awaitingPassword, setAwaitingPassword] = useState(false); // true = returning player entering pw
  const [pendingPlayerNum, setPendingPlayerNum] = useState(null); // player num waiting for pw check

  // ── Boot ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const gi = await sGet("global_idx");
      if (gi !== null) { setGlobalIdx(gi); setLiveGlobalIdx(gi); }
      setBooting(false);
    })();
  }, []);

  // ── Facilitator: poll all players ────────────────────────────────────────
  useEffect(() => {
    if (mode !== "facilitator") return;
    const load = async () => {
      const all = {};
      for (let i = 1; i <= 20; i++) {
        const pd = await sGet(`player_${i}`);
        if (pd) all[i] = pd;
      }
      setAllPlayerData(all);
    };
    load();
    const iv = setInterval(load, 3500);
    return () => clearInterval(iv);
  }, [mode]);

  // ── Player: poll global index + own data ─────────────────────────────────
  useEffect(() => {
    if (mode !== "player" || playerNum === null) return;
    const poll = async () => {
      const gi = await sGet("global_idx");
      if (gi !== null) setLiveGlobalIdx(gi);
      const pd = await sGet(`player_${playerNum}`);
      if (pd) {
        setMyDecisions(pd.decisions || {});
        setMyCompleted(new Set(pd.completed || []));
      }
    };
    poll();
    const iv = setInterval(poll, 3000);
    return () => clearInterval(iv);
  }, [mode, playerNum]);

  // ── Facilitator actions ───────────────────────────────────────────────────
  async function facilAdvance() {
    const next = Math.min(globalIdx + 1, SCENARIOS.length - 1);
    setGlobalIdx(next); setRevealResult(null);
    await sSet("global_idx", next);
  }
  async function facilBack() {
    const prev = Math.max(globalIdx - 1, 0);
    setGlobalIdx(prev);
    await sSet("global_idx", prev);
  }
  async function facilReset() {
    if (!window.confirm("Reset ALL player data and restart the game?")) return;
    setGlobalIdx(0); setAllPlayerData({});
    await sSet("global_idx", 0);
    for (let i = 1; i <= 20; i++) await sSet(`player_${i}`, {decisions:{}, completed:[]});
  }

  // ── Player: join ──────────────────────────────────────────────────────────
  async function joinGame() {
    const n = parseInt(numInput);
    if (!n || n < 1 || n > 20) return;

    setPendingPlayerNum(n);
    setPasswordInput("");
    setPasswordError("");

    // Check if player already has a password set
    const pd = await sGet(`player_${n}`);
    if (pd && pd.password) {
      // Returning player — ask for password
      setAwaitingPassword(true);
      setSettingPassword(false);
    } else {
      // New player — ask them to set a password
      setSettingPassword(true);
      setAwaitingPassword(false);
    }
  }

  async function confirmPassword() {
    if (!passwordInput || passwordInput.length < 3) {
      setPasswordError("Password must be at least 3 characters.");
      return;
    }
    const n = pendingPlayerNum;

    // Always clear state first
    setMyDecisions({});
    setMyCompleted(new Set());
    setRevealResult(null);
    setPendingCiChoice(null);

    if (settingPassword) {
      // Save new password + empty player data
      await sSet(`player_${n}`, { password: passwordInput, decisions: {}, completed: [] });
      setPlayerNum(n);
    } else {
      // Verify password
      const pd = await sGet(`player_${n}`);
      if (!pd || pd.password !== passwordInput) {
        setPasswordError("Wrong password. Try again!");
        return;
      }
      setMyDecisions(pd.decisions || {});
      setMyCompleted(new Set(pd.completed || []));
      setPlayerNum(n);
    }

    const gi = await sGet("global_idx");
    if (gi !== null) setLiveGlobalIdx(gi);
    setSettingPassword(false);
    setAwaitingPassword(false);
    setPendingPlayerNum(null);
    setPasswordInput("");
    setPasswordError("");
  }

  // ── Player: submit a decision ─────────────────────────────────────────────
  async function submitDecision(scenarioId, choiceValue) {
    const nd = { ...myDecisions, [scenarioId]: choiceValue };
    const nc = new Set([...myCompleted, scenarioId]);
    setMyDecisions(nd);
    setMyCompleted(nc);
    setPendingCiChoice(null);

    // Compute reveal result if applicable
    const s = SCENARIOS.find(s => s.id === scenarioId);
    if (s?.type === "reveal") {
      setRevealResult(s.compute(nd));
    } else if (s?.type === "ci") {
      setRevealResult(s.compute(nd, choiceValue));
    } else {
      setRevealResult(null);
    }

    await sSet(`player_${playerNum}`, { decisions: nd, completed: [...nc] });
  }

  // ── Player: acknowledge automatic scenario ───────────────────────────────
  async function ackAutomatic(scenarioId) {
    const nc = new Set([...myCompleted, scenarioId]);
    setMyCompleted(nc);
    setRevealResult(null);
    await sSet(`player_${playerNum}`, { decisions: myDecisions, completed: [...nc] });
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const currentS    = SCENARIOS[liveGlobalIdx];
  const di          = DAY_INFO[currentS?.day] || DAY_INFO[1];
  const myNW        = computeNW(myDecisions, myCompleted);
  const nwDelta     = myNW - BASE_NW;
  // Has THIS player already submitted THIS scenario?
  const thisDone    = myCompleted.has(currentS?.id);
  const pct         = Math.round((liveGlobalIdx / SCENARIOS.length) * 100);

  // ── LOADING ───────────────────────────────────────────────────────────────
  if (booting) return (
    <div style={{...pg, gap:12, flexDirection:"column"}}>
      <div style={{fontSize:30}}>⏳</div>
      <div style={{color:"#64748b", fontSize:14}}>Loading...</div>
    </div>
  );

  // ── MODE SELECT ───────────────────────────────────────────────────────────
  if (!mode) return (
    <div style={pg}>
      <div style={{...card, maxWidth:400, textAlign:"center"}}>
        <div style={chip}>TLDR 6.0 · Finance Game</div>
        <div style={{fontSize:44, margin:"10px 0 6px"}}>🎮</div>
        <h1 style={{fontSize:32, fontWeight:900, color:"#f8fafc", margin:"0 0 4px", letterSpacing:-1}}>Life in 3 Days</h1>
        <p style={{color:"#64748b", fontSize:13, fontStyle:"italic", margin:"0 0 26px"}}>A Financial Life Simulation</p>
        <div style={{display:"flex", flexDirection:"column", gap:10}}>
          <button style={btnPrimary} onClick={()=>setMode("player")}>📱 I'm a Player — Join Game</button>
          <button style={{...btnPrimary, background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.3)", color:"#a5b4fc"}}
            onClick={()=>setMode("facilitator")}>🎛️ Facilitator Panel</button>
        </div>
      </div>
    </div>
  );

  // ── FACILITATOR AUTH ──────────────────────────────────────────────────────
  if (mode === "facilitator" && !facilAuthed) return (
    <div style={pg}>
      <div style={{...card, maxWidth:360, textAlign:"center"}}>
        <div style={{fontSize:30, marginBottom:12}}>🔒</div>
        <h2 style={{color:"#f8fafc", fontSize:20, margin:"0 0 18px"}}>Facilitator Access</h2>
        <input style={inputSt} type="password" placeholder={`Password`}
          value={facilPass} onChange={e=>setFacilPass(e.target.value)}
          onKeyDown={e=>e.key==="Enter" && facilPass===FACIL_PASS && setFacilAuthed(true)} />
        <button style={{...btnPrimary, marginTop:10}}
          onClick={()=>facilPass===FACIL_PASS && setFacilAuthed(true)}>Enter</button>
        <button style={{...btnGhost, marginTop:8}} onClick={()=>setMode(null)}>← Back</button>
      </div>
    </div>
  );

  // ── FACILITATOR PANEL ─────────────────────────────────────────────────────
  if (mode === "facilitator" && facilAuthed) {
    const fs   = SCENARIOS[globalIdx];
    const fdi  = DAY_INFO[fs?.day] || DAY_INFO[1];
    const doneCount = Object.values(allPlayerData)
      .filter(p => (p.completed||[]).includes(fs?.id)).length;

    return (
      <div style={{...pg, alignItems:"flex-start", overflowY:"auto", paddingTop:16}}>
        <div style={{maxWidth:680, width:"100%", display:"flex", flexDirection:"column", gap:10}}>

          {/* Header */}
          <div style={{...card, padding:"14px 18px"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8}}>
              <div>
                <div style={{color:"#a5b4fc", fontWeight:800, fontSize:12, letterSpacing:1}}>🎛️ FACILITATOR PANEL</div>
                <div style={{color:fdi.color, fontSize:12, marginTop:2}}>{fdi.label} · {fs?.age} · {fs?.tag}</div>
              </div>
              <div style={{display:"flex", gap:8}}>
                <button style={{...btnSm, color:"#fca5a5", background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.25)"}}
                  onClick={facilReset}>🔄 Reset</button>
                <button style={btnSm} onClick={()=>setMode(null)}>Exit</button>
              </div>
            </div>
          </div>

          {/* Current scenario control */}
          <div style={{...card, padding:"18px"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10}}>
              <div>
                <div style={{fontSize:10, color:fdi.color, fontWeight:800, letterSpacing:2, textTransform:"uppercase"}}>{fs?.tag}</div>
                <h2 style={{fontSize:18, fontWeight:900, color:"#f8fafc", margin:"4px 0 0"}}>{fs?.emoji} {fs?.title}</h2>
              </div>
              <div style={{textAlign:"right", flexShrink:0, marginLeft:12}}>
                <div style={{fontSize:10, color:"#64748b"}}>Players done</div>
                <div style={{fontSize:28, fontWeight:900, color:doneCount>=20?"#4ade80":doneCount>0?"#facc15":"#64748b"}}>{doneCount}/20</div>
              </div>
            </div>
            <p style={{color:"#64748b", fontSize:13, lineHeight:1.6, margin:"0 0 12px"}}>{fs?.story}</p>

            {/* Choice options preview */}
            {fs?.choices && (
              <div style={{display:"flex", flexWrap:"wrap", gap:6, marginBottom:12}}>
                {fs.choices.map(c=>(
                  <div key={c.value} style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, padding:"6px 12px", fontSize:12, display:"flex", alignItems:"center", gap:6}}>
                    <span>{c.emoji}</span>
                    <span style={{color:"#e2e8f0"}}>{c.label}</span>
                    {(c.cost||c.gain) ? <span style={{color:(c.cost||0)<0?"#f87171":"#4ade80", fontWeight:700}}>
                      {c.cost&&c.cost!==0 ? `-$${Math.abs(c.cost).toLocaleString()}` : c.gain ? `+$${c.gain.toLocaleString()}` : ""}
                    </span> : null}
                  </div>
                ))}
              </div>
            )}
            {fs?.type==="automatic" && (
              <div style={{background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.18)", borderRadius:8, padding:"10px 12px", fontSize:12, color:"#a5b4fc", marginBottom:12}}>
                📢 {fs.note}
              </div>
            )}

            {/* Nav buttons */}
            <div style={{display:"flex", gap:8}}>
              <button style={{...btnSm, flex:1}} onClick={facilBack} disabled={globalIdx===0}>← Prev</button>
              <button style={{...btnPrimary, flex:2, padding:"11px"}} onClick={facilAdvance} disabled={globalIdx===SCENARIOS.length-1}>
                Unlock Next Scenario →
              </button>
            </div>
            <div style={{textAlign:"center", color:"#334155", fontSize:11, marginTop:6}}>
              {globalIdx+1} / {SCENARIOS.length}
            </div>
          </div>

          {/* NAV Table */}
          <div style={{...card, padding:"14px 16px", overflowX:"auto"}}>
            <div style={{color:"#64748b", fontSize:11, fontWeight:700, letterSpacing:1, marginBottom:12}}>NET ASSET VALUE — ALL PLAYERS</div>
            <table style={{width:"100%", borderCollapse:"collapse", fontSize:11}}>
              <thead>
                <tr style={{borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                  {["Player","Cash","🏠 Property","📈 ETF","🏦 T-Bills","🚗 Car","🛡️ Insured","NAV"].map(h=>(
                    <th key={h} style={{padding:"6px 8px", color:"#64748b", fontWeight:700, textAlign:"right", whiteSpace:"nowrap"}}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({length:20},(_,i)=>i+1).map(n=>{
                  const pd = allPlayerData[n];
                  const dec = pd?.decisions||{};
                  const comp = new Set(pd?.completed||[]);
                  const nav = computeNAV(dec, comp);
                  const done = pd && (pd.completed||[]).includes(fs?.id);
                  const isTop = [...Array(20).keys()].map(i=>i+1)
                    .map(x=>({ n:x, nav:computeNAV(allPlayerData[x]?.decisions||{}, new Set(allPlayerData[x]?.completed||[])).nav }))
                    .sort((a,b)=>b.nav-a.nav)[0]?.n === n;
                  return (
                    <tr key={n} style={{borderBottom:"1px solid rgba(255,255,255,0.04)",
                      background:isTop?"rgba(250,204,21,0.05)":done?"rgba(74,222,128,0.03)":"transparent"}}>
                      <td style={{padding:"7px 8px", whiteSpace:"nowrap"}}>
                        <span style={{color:isTop?"#facc15":done?"#4ade80":"#94a3b8", fontWeight:700}}>
                          {isTop?"👑":done?"✓":""} #{n} {PLAYER_NAMES[n-1]?.split(" ")[0]}
                        </span>
                      </td>
                      <td style={{padding:"7px 8px", textAlign:"right", color:"#94a3b8"}}>${nav.cash.toLocaleString()}</td>
                      <td style={{padding:"7px 8px", textAlign:"right", color:nav.property>0?"#4ade80":"#334155"}}>
                        {nav.property>0?`$${nav.property.toLocaleString()}`:"—"}
                      </td>
                      <td style={{padding:"7px 8px", textAlign:"right", color:nav.etf>0?"#a5b4fc":"#334155"}}>
                        {nav.etf>0?`$${nav.etf.toLocaleString()}`:"—"}
                      </td>
                      <td style={{padding:"7px 8px", textAlign:"right", color:nav.tbills>0?"#4ade80":"#334155"}}>
                        {nav.tbills>0?`$${nav.tbills.toLocaleString()}`:"—"}
                      </td>
                      <td style={{padding:"7px 8px", textAlign:"right", color:nav.car>0?"#facc15":"#334155"}}>
                        {nav.car>0?`$${nav.car.toLocaleString()}`:"—"}
                      </td>
                      <td style={{padding:"7px 8px", textAlign:"center", color:nav.insured?"#4ade80":"#f87171"}}>
                        {nav.insured?"✓":"✗"}
                      </td>
                      <td style={{padding:"7px 8px", textAlign:"right", fontWeight:900,
                        color:nav.nav>=BASE_NW?"#4ade80":"#f87171"}}>
                        ${nav.nav.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{borderTop:"1px solid rgba(255,255,255,0.12)"}}>
                  <td colSpan="7" style={{padding:"8px", color:"#64748b", fontSize:10}}>
                    👑 = current leader · ✓ = completed this scenario · Property shown at market value (pre-sell)
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ── PLAYER: PASSWORD SCREEN ──────────────────────────────────────────────
  if (mode === "player" && playerNum === null && (settingPassword || awaitingPassword)) return (
    <div style={pg}>
      <div style={{...card, maxWidth:360, textAlign:"center"}}>
        <div style={{fontSize:36, marginBottom:10}}>{settingPassword ? "🔐" : "🔑"}</div>
        <h2 style={{fontSize:22, fontWeight:900, color:"#f8fafc", margin:"0 0 6px"}}>
          {settingPassword ? "Set Your Password" : "Welcome Back!"}
        </h2>
        <p style={{color:"#64748b", fontSize:13, margin:"0 0 6px"}}>
          {PLAYER_NAMES[pendingPlayerNum-1]}
        </p>
        <p style={{color:"#64748b", fontSize:13, margin:"0 0 18px"}}>
          {settingPassword
            ? "Create a password to protect your account. You'll need this to log back in."
            : "Enter your password to continue your journey."}
        </p>
        <input style={{...inputSt, textAlign:"center", letterSpacing:3, fontSize:18, marginBottom:8}}
          type="password"
          placeholder={settingPassword ? "Create password" : "Enter password"}
          value={passwordInput}
          onChange={e=>{setPasswordInput(e.target.value); setPasswordError("");}}
          onKeyDown={e=>e.key==="Enter"&&confirmPassword()} />
        {passwordError && (
          <div style={{color:"#f87171", fontSize:13, marginBottom:10}}>{passwordError}</div>
        )}
        <button style={{...btnPrimary, marginTop:8}}
          onClick={confirmPassword}>
          {settingPassword ? "Set Password & Enter →" : "Login →"}
        </button>
        <button style={{...btnGhost, marginTop:8}}
          onClick={()=>{setSettingPassword(false);setAwaitingPassword(false);setPendingPlayerNum(null);setPasswordError("");}}>
          ← Back
        </button>
      </div>
    </div>
  );

  // ── PLAYER: NUMBER SELECT ─────────────────────────────────────────────────
  if (mode === "player" && playerNum === null) return (
    <div style={pg}>
      <div style={{...card, maxWidth:380, textAlign:"center"}}>
        <div style={chip}>TLDR 6.0</div>
        <div style={{fontSize:38, margin:"10px 0 4px"}}>👤</div>
        <h2 style={{fontSize:24, fontWeight:900, color:"#f8fafc", margin:"0 0 4px"}}>Join the Game</h2>
        <p style={{color:"#64748b", fontSize:13, margin:"0 0 18px"}}>Tap your player number</p>
        <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:7, marginBottom:16}}>
          {Array.from({length:20},(_,i)=>i+1).map(n=>(
            <button key={n}
              style={{...btnSm, padding:"11px 0", fontSize:15, fontWeight:700,
                background:numInput==n?"rgba(99,102,241,0.28)":"rgba(255,255,255,0.04)",
                border:numInput==n?"1px solid #6366f1":"1px solid rgba(255,255,255,0.08)",
                color:numInput==n?"#c4b5fd":"#94a3b8"}}
              onClick={()=>setNumInput(String(n))}>{n}</button>
          ))}
        </div>
        {numInput && parseInt(numInput)>=1 && parseInt(numInput)<=20 && (
          <div style={{marginBottom:14, color:"#4ade80", fontWeight:700, fontSize:16}}>
            👋 Hi, {PLAYER_NAMES[parseInt(numInput)-1]}!
          </div>
        )}
        <button style={{...btnPrimary, opacity:numInput&&parseInt(numInput)>=1&&parseInt(numInput)<=20?1:0.35}}
          disabled={!numInput||parseInt(numInput)<1||parseInt(numInput)>20}
          onClick={joinGame}>Enter the Game →</button>
        <button style={{...btnGhost, marginTop:8}} onClick={()=>setMode(null)}>← Back</button>
      </div>
    </div>
  );

  // ── PLAYER: IN-GAME ───────────────────────────────────────────────────────
  return (
    <div style={{...pg, alignItems:"flex-start", paddingTop:14}}>
      <div style={{maxWidth:430, width:"100%"}}>

        {/* Header */}
        <div style={{...card, padding:"13px 17px", marginBottom:10}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div>
              <div style={{fontWeight:900, color:"#f8fafc", fontSize:16}}>{PLAYER_NAMES[playerNum-1]}</div>
              <div style={{color:di.color, fontSize:11, marginTop:1, fontWeight:600}}>{di.label} · Player #{playerNum}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:9, color:"#64748b", letterSpacing:1, textTransform:"uppercase"}}>Net Worth</div>
              <div style={{fontSize:26, fontWeight:900, color:myNW>=BASE_NW?"#4ade80":"#f87171"}}>${myNW.toLocaleString()}</div>
              <div style={{fontSize:10, color:nwDelta>=0?"#4ade80":"#f87171"}}>{nwDelta>=0?"+":""}{nwDelta.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{height:4, background:"rgba(255,255,255,0.07)", borderRadius:4, overflow:"hidden", marginBottom:6}}>
          <div style={{height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${di.color},${di.color}77)`, transition:"width .5s"}}/>
        </div>
        <div style={{display:"flex", gap:5, marginBottom:13, alignItems:"center"}}>
          {Object.entries(DAY_INFO).map(([d,info])=>(
            <div key={d} style={{padding:"2px 9px", borderRadius:20,
              background:currentS?.day==d?info.color:"rgba(255,255,255,0.05)",
              color:currentS?.day==d?"#0f172a":"#475569", fontSize:10, fontWeight:700}}>
              {info.label}
            </div>
          ))}
          <div style={{marginLeft:"auto", color:"#334155", fontSize:10}}>{liveGlobalIdx+1}/{SCENARIOS.length}</div>
        </div>

        {/* Scenario card */}
        <div style={{...card, padding:"0 0 22px"}}>
          {/* Scene illustration */}
          {SCENE_SVGS[currentS?.id] && (
            <div style={{borderRadius:"18px 18px 0 0", overflow:"hidden", marginBottom:16}}
              dangerouslySetInnerHTML={{__html: SCENE_SVGS[currentS?.id]}} />
          )}
          <div style={{padding:"0 20px"}}>
          <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:10}}>
            <span style={{fontSize:24}}>{currentS?.emoji}</span>
            <div>
              <div style={{fontSize:9, color:di.color, fontWeight:800, letterSpacing:2, textTransform:"uppercase"}}>{currentS?.tag}</div>
              <h2 style={{fontSize:17, fontWeight:900, color:"#f8fafc", margin:"3px 0 0", lineHeight:1.2}}>{currentS?.title}</h2>
            </div>
          </div>
          <p style={{color:"#94a3b8", fontSize:13, lineHeight:1.7, margin:"0 0 14px"}}>{currentS?.story}</p>
          {currentS?.payoffNote && <div style={payoffBadge}>{currentS.payoffNote}</div>}

          {/* ── ALREADY DONE THIS SCENARIO ── */}
          {thisDone && (
            <div style={{background:"rgba(99,102,241,0.07)", border:"1px solid rgba(99,102,241,0.18)", borderRadius:12, padding:"14px", textAlign:"center"}}>
              <div style={{color:"#a5b4fc", fontWeight:700, fontSize:14, marginBottom: revealResult ? 10 : 0}}>
                ✅ Decision recorded!
              </div>
              {revealResult && (
                <div style={{padding:"12px", background:`${revealResult.color}14`, border:`1px solid ${revealResult.color}30`, borderRadius:9, marginBottom:8}}>
                  <div style={{color:"#f8fafc", fontSize:13, fontWeight:600, marginBottom:revealResult.gain!==0?6:0}}>{revealResult.msg}</div>
                  {revealResult.gain!==0 && (
                    <div style={{color:revealResult.color, fontWeight:900, fontSize:22}}>
                      {revealResult.gain>0?"+":""}{revealResult.gain.toLocaleString()}
                    </div>
                  )}
                </div>
              )}
              <div style={{color:"#475569", fontSize:11, marginTop:6}}>⏳ Waiting for next scenario...</div>
            </div>
          )}

          {/* ── NOT YET DONE ── */}
          {!thisDone && (
            <>
              {/* CHOICE (normal + vision board) */}
              {(currentS?.type==="choice") && (
                <div style={{display:"flex", flexDirection:"column", gap:9}}>
                  {currentS.choices.map(c=>(
                    <button key={c.value} style={choiceBtn}
                      onClick={()=>submitDecision(currentS.id, c.value)}>
                      <span style={{fontSize:20}}>{c.emoji}</span>
                      <div style={{flex:1, textAlign:"left"}}>
                        <div style={{color:"#e2e8f0", fontWeight:700, fontSize:14}}>{c.label}</div>
                        <div style={{color:"#64748b", fontSize:12, marginTop:1}}>{c.sub}</div>
                      </div>
                      <span style={{fontWeight:900, fontSize:13, whiteSpace:"nowrap",
                        color:c.cost<0?"#f87171":c.gain?"#4ade80":"#94a3b8"}}>
                        {c.cost&&c.cost!==0 ? `-$${Math.abs(c.cost).toLocaleString()}`
                          : c.gain        ? `+$${c.gain.toLocaleString()}` : "—"}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* CI — player self-reports */}
              {currentS?.type==="ci" && (
                <>
                  <div style={{...payoffBadge, background:"rgba(248,113,113,0.06)", borderColor:"rgba(248,113,113,0.2)", color:"#fca5a5", marginBottom:12}}>
                    🎲 Facilitator announces who's affected — then tap your answer!
                  </div>
                  <div style={{display:"flex", flexDirection:"column", gap:9, marginBottom:12}}>
                    {currentS.choices.map(c=>(
                      <button key={c.value}
                        style={{...choiceBtn, ...(pendingCiChoice===c.value ? choiceBtnSel : {})}}
                        onClick={()=>setPendingCiChoice(c.value)}>
                        <span style={{fontSize:20}}>{c.emoji}</span>
                        <div style={{color:"#e2e8f0", fontWeight:700, fontSize:14}}>{c.label}</div>
                      </button>
                    ))}
                  </div>
                  {pendingCiChoice && (
                    <button style={btnPrimary} onClick={()=>submitDecision(currentS.id, pendingCiChoice)}>
                      Confirm →
                    </button>
                  )}
                </>
              )}

              {/* AUTOMATIC — just acknowledge */}
              {currentS?.type==="automatic" && (
                <div style={{textAlign:"center"}}>
                  <div style={{background:"rgba(99,102,241,0.07)", border:"1px solid rgba(99,102,241,0.18)", borderRadius:10, padding:"12px", marginBottom:14, fontSize:13, color:"#a5b4fc", lineHeight:1.6}}>
                    📢 {currentS.note}
                  </div>
                  <div style={{fontSize:34, fontWeight:900, marginBottom:14,
                    color:currentS.gain>=0?"#4ade80":"#f87171"}}>
                    {currentS.gain>=0?"+":"-"}${Math.abs(currentS.gain).toLocaleString()}
                  </div>
                  <button style={btnPrimary} onClick={()=>ackAutomatic(currentS.id)}>Got it! ✓</button>
                </div>
              )}

              {/* REVEAL — compute from past decisions */}
              {currentS?.type==="reveal" && (
                <div style={{textAlign:"center"}}>
                  <button style={{...btnPrimary, background:"linear-gradient(135deg,#f59e0b,#ea580c)"}}
                    onClick={()=>submitDecision(currentS.id, "revealed")}>
                    🎲 Reveal My Outcome!
                  </button>
                </div>
              )}
            </>
          )}
        </div>

          </div>{/* end padding div */}
        </div>

        {/* Final summary */}
        {liveGlobalIdx===SCENARIOS.length-1 && thisDone && (
          <div style={{...card, marginTop:10, padding:"18px", textAlign:"center"}}>
            <div style={{fontSize:30, marginBottom:6}}>🏁</div>
            <div style={{color:"#facc15", fontWeight:900, fontSize:18, marginBottom:4}}>Journey Complete!</div>
            <div style={{fontSize:36, fontWeight:900, color:myNW>=BASE_NW?"#4ade80":"#f87171"}}>${myNW.toLocaleString()}</div>
            <div style={{color:"#64748b", fontSize:12, marginTop:4}}>{nwDelta>=0?"+":""}{nwDelta.toLocaleString()} from start</div>
          </div>
        )}


      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const pg={minHeight:"100vh",background:"linear-gradient(135deg,#060c1a 0%,#0d1526 45%,#150822 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"Georgia,serif"};
const card={background:"rgba(6,14,28,0.98)",border:"1px solid rgba(99,102,241,0.16)",borderRadius:18,padding:"26px 22px",boxShadow:"0 0 50px rgba(99,102,241,0.06)"};
const chip={display:"inline-block",background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.28)",borderRadius:20,padding:"3px 13px",fontSize:10,fontFamily:"monospace",color:"#a5b4fc",letterSpacing:2,marginBottom:10};
const btnPrimary={background:"linear-gradient(135deg,#6366f1,#7c3aed)",color:"white",border:"none",borderRadius:11,padding:"13px 22px",fontSize:15,fontWeight:700,cursor:"pointer",width:"100%"};
const btnGhost={background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:11,padding:"10px",fontSize:13,color:"#64748b",cursor:"pointer"};
const btnSm={background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:8,padding:"7px 13px",fontSize:12,color:"#94a3b8",cursor:"pointer"};
const inputSt={background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"12px 14px",color:"#f8fafc",fontSize:15,outline:"none",width:"100%",boxSizing:"border-box"};
const payoffBadge={background:"rgba(99,102,241,0.07)",border:"1px solid rgba(99,102,241,0.18)",borderRadius:8,padding:"7px 11px",fontSize:11,color:"#818cf8",marginBottom:13};
const choiceBtn={display:"flex",alignItems:"center",gap:11,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"13px 14px",cursor:"pointer",width:"100%",transition:"background .15s,border .15s"};
const choiceBtnSel={background:"rgba(99,102,241,0.18)",border:"1px solid #6366f1"};
