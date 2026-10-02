// SANTRIVEST educational content data
// Carefully written, simple, accurate, suitable for santri (teenagers).

export type ViewId =
  | "home"
  | "learn"
  | "finance"
  | "sharia"
  | "investment"
  | "simulation"
  | "quiz"
  | "progress"
  | "research"
  | "certificate";

export const NAV_ITEMS: { id: ViewId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "learn", label: "Learn" },
  { id: "finance", label: "Finance" },
  { id: "sharia", label: "Sharia" },
  { id: "investment", label: "Investment" },
  { id: "simulation", label: "Simulation" },
  { id: "quiz", label: "Quiz" },
  { id: "progress", label: "Progress" },
];

// ---------- LEARNING MODULES ----------
export interface LearnModule {
  id: string;
  number: string;
  title: string;
  summary: string;
  topics: string[];
  content: { heading: string; body: string; tip?: string }[];
}

export const LEARN_MODULES: LearnModule[] = [
  {
    id: "money-basics",
    number: "01",
    title: "Money Basics",
    summary: "Understand what money is and how it moves in your life.",
    topics: ["Income", "Expenses", "Needs", "Wants", "Saving", "Budgeting"],
    content: [
      {
        heading: "What is money?",
        body: "Money is a tool we use to exchange value. You earn it through work, and you spend it on the things you need and want. Understanding money is the first step toward financial independence.",
      },
      {
        heading: "Income vs Expenses",
        body: "Income is money that comes in — your monthly allowance, gifts, or money from small jobs. Expenses are money that goes out — food, transport, school needs. If income is more than expenses, you can save.",
        tip: "Track both for one week. You will be surprised what you find.",
      },
      {
        heading: "Needs vs Wants",
        body: "A need is something necessary to live and learn well — food, shelter, school supplies. A want is something nice to have — a new gadget, snacks, upgrades. Context matters: shoes can be a need or a want depending on the situation.",
      },
      {
        heading: "Saving",
        body: "Saving means keeping part of your income for the future instead of spending it now. Even saving a small amount regularly builds a powerful habit.",
        tip: "Try the 50/30/20 idea: 50% needs, 30% wants, 20% savings.",
      },
      {
        heading: "Budgeting",
        body: "A budget is a simple plan for your money. It tells every rupiah where to go before it disappears. A good budget turns income into intention.",
      },
    ],
  },
  {
    id: "personal-finance",
    number: "02",
    title: "Personal Finance",
    summary: "Plan your money like a thoughtful adult, not a child.",
    topics: ["Budgeting", "Emergency funds", "Financial goals", "Spending habits", "Financial planning"],
    content: [
      {
        heading: "Budgeting for santri",
        body: "With a monthly allowance of Rp1,000,000, you can choose where each part goes. Budgeting is not about restricting yourself — it is about making your money work for what truly matters to you.",
      },
      {
        heading: "Emergency fund",
        body: "An emergency fund is money saved for unexpected events — illness, a broken phone, an urgent need. Start small: aim for one month of expenses, then build toward three.",
        tip: "Even Rp50,000 set aside monthly becomes real protection over time.",
      },
      {
        heading: "Financial goals",
        body: "A goal gives your saving a purpose. Short-term (a book next month), medium-term (a course next year), long-term (education, a small business). Write goals down — they become far more likely to happen.",
      },
      {
        heading: "Spending habits",
        body: "Habits quietly shape your finances. Small daily expenses add up. Rp10,000 snacks daily become Rp300,000 monthly. Awareness is the beginning of change.",
      },
      {
        heading: "Financial planning",
        body: "Planning is simply deciding in advance. Review your budget monthly. Adjust. Improve. Financial independence is built decision by decision, not in one dramatic move.",
      },
    ],
  },
  {
    id: "islamic-finance",
    number: "03",
    title: "Islamic Finance",
    summary: "Money managed with ethics, justice, and Sharia principles.",
    topics: ["Halal income", "Halal transactions", "Islamic banking", "Islamic contracts", "Financial ethics"],
    content: [
      {
        heading: "Halal income",
        body: "Halal income is earned through permissible work and permissible goods or services. The Prophet ﷺ said the best wealth is a righteous servant's honestly earned money. How you earn matters as much as how much you earn.",
        tip: "Ask: Is what I am doing, selling, or promoting permitted and honest?",
      },
      {
        heading: "Halal transactions",
        body: "A transaction is halal when both parties clearly agree, the item is known and deliverable, and the price is certain. No deception, no hidden terms, no harm.",
      },
      {
        heading: "Islamic banking",
        body: "Islamic banks offer Sharia-compliant products — profit-sharing, cost-plus sale, leasing — instead of interest-based lending. They are built on contracts that share risk and reward more fairly.",
      },
      {
        heading: "Islamic contracts (Akad)",
        body: "An akad is a binding agreement. Common types include Murabahah (cost-plus sale), Mudharabah (profit-sharing), Musyarakah (partnership), Wakalah (agency), and Ijarah (lease). Each is designed to keep trade fair and transparent.",
      },
      {
        heading: "Financial ethics",
        body: "Islamic finance is not only about avoiding riba. It is about justice, transparency, mutual benefit, and responsibility toward society. Money is a trust (amanah).",
      },
    ],
  },
  {
    id: "forbidden-elements",
    number: "04",
    title: "Forbidden Elements",
    summary: "Recognize what Islam prohibits in financial dealings.",
    topics: ["Riba", "Gharar", "Maysir", "Tadlis", "Zalim", "Batil transactions"],
    content: [
      {
        heading: "Riba",
        body: "Riba is an unlawful increase generated through interest-based lending or borrowing — money creating money without real economic activity. Not all profit is riba: profit from legitimate trade is permitted.",
        tip: "Riba is prohibited because it transfers risk to one party and reward to another, creating injustice.",
      },
      {
        heading: "Gharar",
        body: "Gharar is excessive uncertainty or ambiguity in a transaction — selling something unknown, undefined, or undeliverable. It causes disputes and exploitation.",
      },
      {
        heading: "Maysir",
        body: "Maysir is gambling — games of chance where gain depends primarily on luck rather than legitimate economic activity. It destroys wealth and creates addiction.",
      },
      {
        heading: "Tadlis",
        body: "Tadlis is concealment or deception in trade — hiding a defect, misrepresenting quality. Honesty is the foundation of halal trade.",
      },
      {
        heading: "Zalim & Batil",
        body: "Zalim means oppression or injustice in dealings; Batil means a void, invalid transaction. Both harm others and are forbidden. Always ask: is this fair to everyone involved?",
      },
    ],
  },
  {
    id: "sharia-investment",
    number: "05",
    title: "Sharia Investment",
    summary: "Grow wealth responsibly through Sharia-compliant assets.",
    topics: ["Stocks", "Sukuk", "Islamic mutual funds", "Gold", "Sharia securities", "Islamic capital market"],
    content: [
      {
        heading: "What is Sharia investment?",
        body: "Sharia investment means putting money into permissible assets to grow wealth responsibly — through real economic activity, shared risk, and ethical businesses. Not for quick speculation, but for long-term growth.",
      },
      {
        heading: "Sharia stocks",
        body: "Shares in companies whose business is halal and that pass Sharia screening (income from prohibited activities below certain thresholds, low debt ratios). You share in real profit and risk.",
      },
      {
        heading: "Sukuk",
        body: "Sukuk are Sharia-compliant investment certificates backed by real assets — the Islamic alternative to interest-based bonds. Returns come from the underlying asset's performance, not from interest.",
        tip: "Sukuk = ownership of a real asset's cash flow, not a loan with interest.",
      },
      {
        heading: "Islamic mutual funds",
        body: "Funds that pool investor money and invest only in Sharia-screened assets. Good for beginners — managed, diversified, and accessible with small amounts.",
      },
      {
        heading: "Gold",
        body: "Gold is a traditional store of value. In Islam, gold transactions have specific rules (hand-to-hand exchange). It can protect purchasing power over the long term.",
      },
      {
        heading: "Islamic capital market",
        body: "The Sharia capital market offers stocks, sukuk, and funds under Sharia supervision. It supports real businesses and productive economic growth — aligned with SDG 8.",
      },
    ],
  },
  {
    id: "risk-return",
    number: "06",
    title: "Risk & Return",
    summary: "Understand the balance between potential gain and possible loss.",
    topics: ["Risk", "Return", "Diversification", "Volatility", "Long-term investing"],
    content: [
      {
        heading: "Risk and return",
        body: "Return is what you earn from an investment. Risk is the chance that the return is lower than expected — or that you lose money. Higher potential return usually involves higher risk.",
        tip: "If an investment promises high return with no risk, something is wrong.",
      },
      {
        heading: "Diversification",
        body: "Diversification means spreading money across different assets so that a loss in one can be balanced by others. It is the oldest and most reliable risk-management tool.",
      },
      {
        heading: "Volatility",
        body: "Volatility is how much prices move up and down. High volatility means bigger swings — more uncertainty in the short term, even if the long-term trend is positive.",
      },
      {
        heading: "Long-term investing",
        body: "Time is the investor's friend. Short-term movements are noisy; long-term trends reflect real value. Responsible investing means patience, not panic.",
      },
    ],
  },
];

// ---------- GLOSSARY ----------
export interface GlossaryTerm {
  term: string;
  arabic?: string;
  category: string;
  short: string;
  long: string;
  example: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "Riba",
    arabic: "ربا",
    category: "Forbidden",
    short: "Unlawful increase through interest-based lending.",
    long: "Riba is an increase generated through interest on a loan or an unequal exchange of certain goods. It is prohibited because it creates injustice by transferring risk to the borrower while guaranteeing return to the lender.",
    example: "You borrow Rp1,000,000 and must repay Rp1,200,000 because of interest. The Rp200,000 added purely for lending time is riba.",
  },
  {
    term: "Gharar",
    arabic: "غرر",
    category: "Forbidden",
    short: "Excessive uncertainty or ambiguity in a transaction.",
    long: "Gharar occurs when the subject, price, or terms of a transaction are unclear, unknown, or uncertain. It leads to disputes and exploitation and is therefore prohibited.",
    example: "Paying for a 'mystery box' whose contents are completely unknown involves gharar.",
  },
  {
    term: "Maysir",
    arabic: "ميسر",
    category: "Forbidden",
    short: "Gambling — gain depending on chance, not productive activity.",
    long: "Maysir is any transaction where gain depends primarily on chance rather than legitimate economic activity. It includes lotteries, betting, and games of chance.",
    example: "Paying Rp20,000 for a random chance to win Rp200,000 or nothing is maysir.",
  },
  {
    term: "Tadlis",
    arabic: "تدليس",
    category: "Forbidden",
    short: "Concealment or deception in trade.",
    long: "Tadlis is hiding a product's defect or misrepresenting it to make a sale. It breaks trust and is forbidden.",
    example: "Selling a used phone described as new is tadlis.",
  },
  {
    term: "Akad",
    arabic: "عقد",
    category: "Contract",
    short: "A binding Islamic contract or agreement.",
    long: "An akad is a clear, mutual agreement between parties defining the terms of a transaction. It is the foundation of every Islamic financial contract.",
    example: "A murabahah akad defines a cost-plus sale with agreed profit.",
  },
  {
    term: "Murabahah",
    arabic: "مرابحة",
    category: "Contract",
    short: "Cost-plus sale — buyer knows cost and agreed profit.",
    long: "Murabahah is a sale where the seller discloses the cost and adds an openly agreed profit margin. Transparency makes it halal, unlike interest where cost is hidden as time-value.",
    example: "A bank buys a laptop for Rp10,000,000 and sells it to you for Rp11,000,000, disclosed clearly.",
  },
  {
    term: "Mudharabah",
    arabic: "مضاربة",
    category: "Contract",
    short: "Profit-sharing partnership between capital provider and worker.",
    long: "Mudharabah is a partnership where one party provides capital (rabbul mal) and the other provides effort and management (mudharib). Profits are shared by an agreed ratio; losses are borne by the capital provider unless negligence occurred.",
    example: "You provide Rp5,000,000; a friend runs a small business; profits split 60/40.",
  },
  {
    term: "Musyarakah",
    arabic: "مشاركة",
    category: "Contract",
    short: "Joint partnership with shared capital, profit, and loss.",
    long: "Musyarakah is a partnership where all parties contribute capital and share in profit and loss proportionally. It is the most equitable form of Islamic business partnership.",
    example: "Two partners each invest Rp5,000,000 and share profits and losses equally.",
  },
  {
    term: "Wakalah",
    arabic: "وكالة",
    category: "Contract",
    short: "Agency — one party acts on behalf of another.",
    long: "Wakalah is a contract where one party (principal) appoints another (agent) to perform a task on their behalf, often for a fee.",
    example: "Appointing an agent to buy goods on your behalf for a fixed fee.",
  },
  {
    term: "Ijarah",
    arabic: "إجارة",
    category: "Contract",
    short: "Leasing arrangement — rent for use of an asset.",
    long: "Ijarah is a lease contract where the owner rents an asset to another for an agreed period and rent. It is the Islamic equivalent of leasing.",
    example: "Leasing equipment for a workshop in exchange for monthly rent.",
  },
  {
    term: "Sukuk",
    arabic: "صكوك",
    category: "Investment",
    short: "Sharia-compliant investment certificates backed by real assets.",
    long: "Sukuk represent ownership in a tangible asset or its usufruct, with returns derived from the asset's performance — not from interest. They are the Islamic alternative to conventional bonds.",
    example: "A sukuk backed by a toll road pays returns from the road's revenue.",
  },
  {
    term: "Halal",
    arabic: "حلال",
    category: "Principle",
    short: "Permissible under Islamic law.",
    long: "Halal means lawful. In finance, it refers to income, transactions, and investments that comply with Sharia principles.",
    example: "Income from a permitted, honest business is halal.",
  },
  {
    term: "Sharia Screening",
    category: "Investment",
    short: "Process of assessing whether an investment meets Sharia principles.",
    long: "Sharia screening checks a company's business activities (must be permissible) and financial ratios (debt, interest-bearing assets, and impermissible income below thresholds) before it is deemed investable.",
    example: "A stock fails screening if the company's main income is from alcohol or gambling.",
  },
  {
    term: "Halal Income",
    category: "Principle",
    short: "Income earned through permissible work and goods.",
    long: "Halal income is earned through lawful work, selling permissible goods or services, with honesty and transparency. The Prophet ﷺ praised honest earnings.",
    example: "A teacher's salary or a farmer's lawful crop sale.",
  },
];

// ---------- QURAN & HADITH ----------
export interface Scripture {
  reference: string;
  surahName: string;
  arabic: string;
  translation: string;
  theme: string;
  explanation: string;
  reflection?: string;
}

export const SCRIPTURES: Scripture[] = [
  {
    reference: "Al-Hasyr 59:18",
    surahName: "Surah Al-Hasyr",
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَلْتَنظُرْ نَفْسٌ مَّا قَدَّمَتْ لِغَدٍ",
    translation:
      "O you who believe! Fear Allah, and let every soul look to what it has sent forth for tomorrow.",
    theme: "Planning for the future",
    explanation:
      "This verse calls every soul to reflect on what it has prepared for tomorrow — not only the Hereafter, but also the worldly future. Financial planning, saving, and responsible preparation are acts of heedfulness.",
    reflection: "What are you preparing for your financial future?",
  },
  {
    reference: "An-Nisa 4:9",
    surahName: "Surah An-Nisa",
    arabic: "وَلْيَخْشَ الَّذِينَ لَوْ تَرَكُوا مِنْ خَلْفِهِمْ ذُرِّيَّةً ضِعَافًا خَافُوا عَلَيْهِمْ",
    translation:
      "And let those fear Allah who, if they left behind weak offspring, would be afraid for them.",
    theme: "Responsibility to future generations",
    explanation:
      "We are reminded to think of those who come after us. Sound financial planning, independence, and responsible investment help protect future generations from weakness and dependence.",
  },
  {
    reference: "Al-Jumu'ah 62:10",
    surahName: "Surah Al-Jumu'ah",
    arabic: "وَإِذَا قُضِيَتِ الصَّلَاةُ فَانتَشِرُوا فِي الْأَرْضِ وَابْتَغُوا مِن فَضْلِ اللَّهِ",
    translation:
      "And when the prayer is ended, disperse in the land and seek the bounty of Allah.",
    theme: "Productive work and halal income",
    explanation:
      "After worship, believers are encouraged to seek Allah's bounty through productive, halal work. Earning a lawful living is an act of worship when done with the right intention.",
  },
  {
    reference: "Al-Maidah 5:90",
    surahName: "Surah Al-Maidah",
    arabic: "إِنَّمَا الْخَمْرُ وَالْمَيْسِرُ وَالْأَنصَابُ وَالْأَزْلَامُ رِجْسٌ مِّنْ عَمَلِ الشَّيْطَانِ",
    translation:
      "Intoxicants, gambling (maysir), and divining arrows are an abomination, of Satan's handiwork. So avoid them, that you may succeed.",
    theme: "Avoiding maysir and prohibited practices",
    explanation:
      "Maysir (gambling) is explicitly prohibited. In finance, this includes any transaction where gain depends primarily on chance rather than legitimate economic activity.",
  },
  {
    reference: "Al-Baqarah 2:275",
    surahName: "Surah Al-Baqarah",
    arabic: "وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا",
    translation: "Allah has permitted trade and forbidden riba (interest).",
    theme: "Distinction between trade and riba",
    explanation:
      "This verse draws a clear line: trade — exchanging real goods and services with risk and effort — is lawful. Riba — money generating money through interest without economic activity — is forbidden.",
  },
  {
    reference: "An-Nisa 4:29",
    surahName: "Surah An-Nisa",
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَأْكُلُوا أَمْوَالَكُم بَيْنَكُم بِالْبَاطِلِ إِلَّا أَن تَكُونَ تِجَارَةً عَن تَرَاضٍ",
    translation:
      "O you who believe! Do not consume one another's wealth unjustly, but only through lawful trade by mutual consent.",
    theme: "Trade through mutual consent",
    explanation:
      "Wealth may only change hands through transparent, mutually agreed trade — not through fraud, coercion, or prohibited means.",
  },
];

export interface HadithEntry {
  reference: string;
  arabic: string;
  translation: string;
  theme: string;
  explanation: string;
}

export const HADITHS: HadithEntry[] = [
  {
    reference: "Sahih Bukhari 1471",
    arabic: "لَأَنْ يَأْخُذَ أَحَدُكُمْ حَبْلًا فَيَحْتَطِبَ عَلَى ظَهْرِهِ خَيْرٌ لَهُ مِنْ أَنْ يَسْأَلَ النَّاسَ",
    translation:
      "It is better for one of you to take a rope and gather firewood on his back than to ask others for help.",
    theme: "Earning through one's own effort",
    explanation:
      "The Prophet ﷺ praised honest, self-reliant earning over dependence. Working to support oneself and one's family with lawful income is among the most honored acts.",
  },
  {
    reference: "Sahih Muslim 1718",
    arabic: "الْخَبِيثَاتُ لِلْخَبِيثِينَ وَالْخَبِيثُونَ لِلْخَبِيثَاتِ وَالطَّيِّبَاتُ لِلطَّيِّبِينَ وَالطَّيِّبُونَ لِلطَّيِّبَاتِ",
    translation:
      "The pure and lawful is for the pure, and the pure are for the pure and lawful.",
    theme: "Halal income purifies wealth",
    explanation:
      "Lawful earnings carry barakah (blessing). When we earn and spend in halal ways, our wealth becomes pure — benefiting both us and those around us.",
  },
  {
    reference: "Sunan Ibn Majah 2242",
    arabic: "مَنْ تَرَكَ شَيْئًا لِلَّهِ عَزَّ وَجَلَّ عَوَّضَهُ اللَّهُ خَيْرًا مِنْهُ",
    translation:
      "Whoever abandons something for the sake of Allah, Allah replaces it with something better.",
    theme: "Leaving the prohibited for something better",
    explanation:
      "When we avoid riba, gharar, and maysir — even at apparent cost — Allah provides from avenues we could not have imagined. Trust in His replacement.",
  },
  {
    reference: "Sahih Bukhari 1429",
    arabic: "مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ وَيُنْسَأَ لَهُ فِي أَثَرِهِ فَلْيَصِلْ رَحِمَهُ",
    translation:
      "Whoever wishes to have his provision expanded and his lifespan extended, let him maintain ties of kinship.",
    theme: "Maintaining family ties increases provision",
    explanation:
      "Barakah in provision is not only about earning more — it is also about the relationships we honor. Family ties and good character invite increase in subtle, real ways.",
  },
];

// Backward-compatible single hadith (first entry)
export const HADITH = HADITHS[0];

// ---------- FINANCIAL TIPS ----------
export interface FinancialTip {
  id: string;
  category: "saving" | "spending" | "investing" | "mindset" | "sharia";
  title: string;
  body: string;
  icon: string;
}

export const FINANCIAL_TIPS: FinancialTip[] = [
  {
    id: "tip-pay-yourself-first",
    category: "saving",
    title: "Pay yourself first",
    body: "Before paying for anything else, set aside a portion of your income for savings. Even 10% monthly builds a powerful habit.",
    icon: "PiggyBank",
  },
  {
    id: "tip-24-hour-rule",
    category: "spending",
    title: "The 24-hour rule",
    body: "For any non-essential purchase, wait 24 hours. Most urges fade — and you keep your money for what truly matters.",
    icon: "Clock",
  },
  {
    id: "tip-emergency-fund",
    category: "saving",
    title: "Build an emergency fund",
    body: "Aim for one month of expenses first, then grow to three. This buffer protects you from debt when the unexpected happens.",
    icon: "ShieldAlert",
  },
  {
    id: "tip-diversify",
    category: "investing",
    title: "Don't put all eggs in one basket",
    body: "Spreading your money across different assets reduces risk. If one loses value, others may balance it out.",
    icon: "TrendingUp",
  },
  {
    id: "tip-understand-before-investing",
    category: "investing",
    title: "Understand before investing",
    body: "Never invest in something you cannot explain simply. If you can't, you don't understand the risk — investigate first.",
    icon: "BookOpen",
  },
  {
    id: "tip-riba-free",
    category: "sharia",
    title: "Keep riba out of your life",
    body: "Interest-based loans and accounts may seem convenient, but riba removes barakah. Seek Sharia-compliant alternatives.",
    icon: "Scale",
  },
  {
    id: "tip-track-spending",
    category: "spending",
    title: "Track every rupiah for a week",
    body: "Awareness is the first step. You can't change what you don't measure — and small leaks sink big ships.",
    icon: "Wallet",
  },
  {
    id: "tip-fomo-is-expensive",
    category: "mindset",
    title: "FOMO is expensive",
    body: "When everyone is rushing to buy, pause. Herd behavior is how many lose money. Investigate, then decide calmly.",
    icon: "Users",
  },
  {
    id: "tip-start-small",
    category: "investing",
    title: "Start small, start now",
    body: "Time matters more than amount. Rp50,000 invested monthly for years compounds far more than waiting for a 'big' amount.",
    icon: "Sprout",
  },
  {
    id: "tip-charity-increases",
    category: "mindset",
    title: "Charity does not decrease wealth",
    body: "Giving sadaqah regularly purifies your wealth and shifts your mindset from scarcity to abundance. Give, and watch it return.",
    icon: "Heart",
  },
  {
    id: "tip-needs-before-wants",
    category: "spending",
    title: "Needs before wants, always",
    body: "A simple hierarchy: cover needs, save for the future, then enjoy wants. Reversing this order leads to stress.",
    icon: "ListChecks",
  },
  {
    id: "tip-avoid-debt",
    category: "mindset",
    title: "Avoid debt for consumption",
    body: "Borrowing for things that lose value (gadgets, lifestyle) traps you. Borrow only for productive assets that grow.",
    icon: "AlertTriangle",
  },
];

// ---------- QUIZ ----------
export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty?: "easy" | "medium" | "hard";
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    category: "Financial literacy",
    question:
      "You receive Rp1,000,000 monthly allowance. After food (Rp400,000), transport (Rp100,000), and snacks (Rp200,000), how much can you save if you want to keep Rp100,000 for charity?",
    options: ["Rp300,000", "Rp200,000", "Rp100,000", "Rp500,000"],
    correct: 1,
    explanation:
      "Total expenses = 400,000 + 100,000 + 200,000 + 100,000 (charity) = 800,000. Saving = 1,000,000 − 800,000 = Rp200,000.",
  },
  {
    id: "q2",
    category: "Riba",
    question:
      "A friend lends you Rp500,000 and demands you repay Rp600,000 after one month, purely for the time the money was lent. What is the Rp100,000 extra?",
    options: ["A fair profit", "Riba (interest)", "A gift", "A service fee"],
    correct: 1,
    explanation:
      "An increase charged purely for lending time is riba — prohibited because it guarantees return to the lender while transferring all risk to the borrower.",
  },
  {
    id: "q3",
    category: "Islamic finance",
    question:
      "Which is a key difference between trade (permitted) and riba (prohibited)?",
    options: [
      "Trade involves real goods and shared risk; riba is money generating money without economic activity",
      "Trade is always more profitable",
      "There is no difference",
      "Riba is faster",
    ],
    correct: 0,
    explanation:
      "Trade exchanges real goods and services with effort and risk. Riba is interest on a loan where money 'grows' without productive economic activity.",
  },
  {
    id: "q4",
    category: "Gharar",
    question:
      "You pay Rp50,000 for a sealed box whose contents are completely unknown. What problem does this involve?",
    options: ["Maysir", "Gharar", "Murabahah", "Wakalah"],
    correct: 1,
    explanation:
      "Buying something completely unknown involves gharar — excessive uncertainty that can lead to dispute and exploitation.",
  },
  {
    id: "q5",
    category: "Maysir",
    question:
      "You pay Rp20,000 for a 1-in-100 chance to win Rp200,000, otherwise nothing. This is closest to:",
    options: ["Investment", "Sukuk", "Maysir (gambling)", "Halal trade"],
    correct: 2,
    explanation:
      "Where gain depends primarily on chance rather than legitimate economic activity, it is maysir — gambling.",
  },
  {
    id: "q6",
    category: "Sharia investment",
    question:
      "Which of these is a Sharia-compliant investment backed by a real asset?",
    options: ["Conventional bond", "Sukuk", "Lottery ticket", "Interest-based savings"],
    correct: 1,
    explanation:
      "Sukuk represent ownership in a real asset and returns come from its performance — the Sharia alternative to interest-based bonds.",
  },
  {
    id: "q7",
    category: "Risk",
    question:
      "An investment promises 30% guaranteed monthly return with zero risk. What should you think?",
    options: [
      "Invest immediately",
      "Borrow money to invest",
      "Be very cautious — high return with no risk is a red flag",
      "It is definitely halal",
    ],
    correct: 2,
    explanation:
      "Higher potential return always involves higher risk. Promises of high, guaranteed, risk-free returns are classic warning signs of fraud or speculation.",
  },
  {
    id: "q8",
    category: "Budgeting",
    question:
      "Which allocation is generally considered a healthy budgeting habit?",
    options: [
      "Spend all income on wants",
      "Save a portion first, then cover needs and wants",
      "Borrow to fund entertainment",
      "Ignore expenses and hope for the best",
    ],
    correct: 1,
    explanation:
      "Paying yourself first — setting aside savings before spending — is the foundation of a healthy financial habit.",
  },
  {
    id: "q9",
    category: "Islamic finance",
    question:
      "In a Mudharabah contract, who bears the financial loss if the business fails without negligence?",
    options: [
      "The worker (mudharib)",
      "The capital provider (rabbul mal)",
      "Both equally regardless",
      "The bank",
    ],
    correct: 1,
    explanation:
      "In Mudharabah, the capital provider bears financial loss (unless the worker was negligent), while profit is shared by an agreed ratio. Risk and reward are aligned.",
  },
  {
    id: "q10",
    category: "Sharia investment",
    question:
      "Before investing in a company's stock, you should check whether the company passes Sharia screening. This includes:",
    options: [
      "Its business is permissible and financial ratios are within limits",
      "Its logo is green",
      "It is trending on social media",
      "It has the cheapest share price",
    ],
    correct: 0,
    explanation:
      "Sharia screening verifies the core business is permissible and that debt, interest-bearing assets, and impermissible income remain below established thresholds.",
  },
];

// ---------- INVESTMENT SIM ASSETS ----------
export interface SimAsset {
  id: string;
  name: string;
  type: string;
  shariaStatus: "Halal" | "Screened";
  expectedReturn: number; // annual %
  risk: number; // 1-5
  volatility: number; // monthly std dev %
  color: string;
  description: string;
}

export const SIM_ASSETS: SimAsset[] = [
  {
    id: "cash",
    name: "Cash Reserve",
    type: "Cash",
    shariaStatus: "Halal",
    expectedReturn: 0,
    risk: 1,
    volatility: 0,
    color: "oklch(0.7 0.005 160)",
    description: "Holds value, no growth. Your safety buffer.",
  },
  {
    id: "sukuk",
    name: "Sukuk A",
    type: "Sukuk",
    shariaStatus: "Halal",
    expectedReturn: 6,
    risk: 2,
    volatility: 1.2,
    color: "oklch(0.55 0.13 162)",
    description: "Asset-backed Sharia certificates. Steady, lower-risk income.",
  },
  {
    id: "gold",
    name: "Gold A",
    type: "Commodity",
    shariaStatus: "Halal",
    expectedReturn: 7,
    risk: 3,
    volatility: 3.5,
    color: "oklch(0.78 0.13 85)",
    description: "A traditional store of value. Moves with global prices.",
  },
  {
    id: "fund",
    name: "Islamic Mutual Fund A",
    type: "Fund",
    shariaStatus: "Screened",
    expectedReturn: 9,
    risk: 3,
    volatility: 4,
    color: "oklch(0.68 0.08 175)",
    description: "Diversified Sharia-screened fund. Balanced growth.",
  },
  {
    id: "stock",
    name: "Sharia Stock A",
    type: "Equity",
    shariaStatus: "Screened",
    expectedReturn: 12,
    risk: 5,
    volatility: 7,
    color: "oklch(0.6 0.16 50)",
    description: "Higher growth potential, higher short-term swings.",
  },
];

// ---------- NEEDS VS WANTS ----------
export interface NeedWantItem {
  id: string;
  label: string;
  icon: string;
  hint: string;
  default: "need" | "want" | "depends";
}

export const NEED_WANT_ITEMS: NeedWantItem[] = [
  { id: "food", label: "Daily food", icon: "🍎", hint: "Necessary to live and learn.", default: "need" },
  { id: "school", label: "School supplies", icon: "📚", hint: "Needed for your education.", default: "need" },
  { id: "phone-upgrade", label: "Smartphone upgrade", icon: "📱", hint: "Often a want unless your current phone is broken.", default: "want" },
  { id: "snacks", label: "Snacks & drinks", icon: "🍬", hint: "Enjoyable but not essential.", default: "want" },
  { id: "shoes", label: "New shoes", icon: "👟", hint: "Depends — needed if old ones are broken; a want if for style.", default: "depends" },
  { id: "books", label: "Books", icon: "📖", hint: "Often a need for learning — context matters.", default: "depends" },
  { id: "gaming", label: "Gaming accessories", icon: "🎮", hint: "Entertainment — typically a want.", default: "want" },
  { id: "transport", label: "Transportation", icon: "🚌", hint: "Needed to reach school/work.", default: "need" },
  { id: "luxury", label: "Luxury item", icon: "💎", hint: "Almost always a want.", default: "want" },
];

// ---------- RESEARCH MODE — Likert statements (spec #31) ----------
// Used for pre-test and post-test. 5-point Likert: 1=Strongly Disagree, 5=Strongly Agree.
// Indirectly built into the learning content so students understand the concepts measured.
export interface ResearchStatement {
  id: string;
  indicator: "Knowledge" | "Skills" | "Beliefs" | "Attitudes" | "Behavior" | "Interest" | "Motivation";
  text: string;
}

export const RESEARCH_STATEMENTS: ResearchStatement[] = [
  // Knowledge
  { id: "k1", indicator: "Knowledge", text: "I can explain the difference between Islamic banking and conventional banking." },
  { id: "k2", indicator: "Knowledge", text: "I understand what sukuk are and how they differ from conventional bonds." },
  { id: "k3", indicator: "Knowledge", text: "I can name at least three Sharia-compliant investment options." },
  { id: "k4", indicator: "Knowledge", text: "I understand the key Sharia principles that guide financial decisions." },
  // Skills
  { id: "s1", indicator: "Skills", text: "I can calculate my monthly income and expenses." },
  { id: "s2", indicator: "Skills", text: "I can build a simple monthly budget for my allowance." },
  { id: "s3", indicator: "Skills", text: "I know how to allocate my allowance across needs, savings, and charity." },
  { id: "s4", indicator: "Skills", text: "I can plan savings toward a financial goal." },
  // Beliefs
  { id: "b1", indicator: "Beliefs", text: "I believe Sharia compliance matters in financial decisions." },
  { id: "b2", indicator: "Beliefs", text: "I believe riba should be avoided in personal finance." },
  { id: "b3", indicator: "Beliefs", text: "I believe financial products should be evaluated before use." },
  // Attitudes
  { id: "a1", indicator: "Attitudes", text: "I think carefully before spending money." },
  { id: "a2", indicator: "Attitudes", text: "I can resist promotional pressure when it is not in my best interest." },
  { id: "a3", indicator: "Attitudes", text: "I avoid impulsive financial decisions." },
  // Behavior
  { id: "be1", indicator: "Behavior", text: "I practice financial planning in my daily life." },
  { id: "be2", indicator: "Behavior", text: "I save a portion of my income regularly." },
  { id: "be3", indicator: "Behavior", text: "I think about my financial future." },
  { id: "be4", indicator: "Behavior", text: "I consider responsible investment before spending on wants." },
  // Interest
  { id: "i1", indicator: "Interest", text: "I am interested in learning more about Sharia investment." },
  { id: "i2", indicator: "Interest", text: "I understand why someone might choose to invest." },
  { id: "i3", indicator: "Interest", text: "I want to explore Islamic investment options available to me." },
  // Motivation
  { id: "m1", indicator: "Motivation", text: "I am motivated to set future financial goals." },
  { id: "m2", indicator: "Motivation", text: "I want to achieve economic independence through responsible means." },
  { id: "m3", indicator: "Motivation", text: "I am motivated to reduce my future financial burden through planning." },
  { id: "m4", indicator: "Motivation", text: "I intend to plan for the long term, not just the present." },
];

export const LIKERT_LABELS = [
  "Strongly disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly agree",
];

// ---------- QUIZ: additional questions for variety ----------
export const QUIZ_QUESTIONS_EXTRA: QuizQuestion[] = [
  {
    id: "q11",
    category: "Islamic finance",
    question:
      "A seller openly discloses the cost of an item (Rp1,000,000) and adds an agreed profit (Rp100,000), selling it for Rp1,100,000. What contract is this?",
    options: ["Riba", "Murabahah (cost-plus sale)", "Maysir", "Gharar"],
    correct: 1,
    explanation:
      "Murabahah is a cost-plus sale where the seller transparently discloses cost and profit. Transparency makes it halal, unlike interest where cost is hidden as time-value.",
  },
  {
    id: "q12",
    category: "Budgeting",
    question:
      "You receive Rp1,000,000 and want to build an emergency fund. What is generally considered a sound first target?",
    options: [
      "Rp50,000 — any start counts",
      "One month of expenses, then build toward three",
      "Rp1,000,000 immediately",
      "No emergency fund is needed"
    ],
    correct: 1,
    explanation:
      "A practical first target is one month of expenses, gradually building toward three. Even small regular contributions build real protection over time.",
  },
  {
    id: "q13",
    category: "Sharia investment",
    question:
      "A company's main income comes from selling alcohol. Under Sharia screening, its stock is:",
    options: [
      "Investable — business model doesn't matter",
      "Not investable — core business is impermissible",
      "Investable if the share price is low",
      "Investable during Ramadan only"
    ],
    correct: 1,
    explanation:
      "Sharia screening first checks the core business. If the main activity is impermissible (alcohol, gambling, conventional interest, pork, etc.), the stock is not investable regardless of price.",
  },
  {
    id: "q14",
    category: "Risk",
    question:
      "Why does diversification reduce risk in a portfolio?",
    options: [
      "It guarantees profit",
      "Losses in one asset can be balanced by gains in others",
      "It eliminates all volatility",
      "It increases returns automatically"
    ],
    correct: 1,
    explanation:
      "Diversification spreads risk across different assets so that a loss in one may be balanced by gains in others. It reduces — but does not eliminate — risk.",
  },
  {
    id: "q15",
    category: "Islamic finance",
    question:
      "In an Ijarah (lease) contract, what does the lessee pay for?",
    options: [
      "Ownership of the asset",
      "The use of an asset for an agreed period",
      "Interest on a loan",
      "A share of profits"
    ],
    correct: 1,
    explanation:
      "Ijarah is a lease: the lessee pays rent for the use of a tangible asset for an agreed period. Ownership remains with the lessor unless transfer is agreed.",
  },
];

// Difficulty assignments for quiz questions
export const QUIZ_DIFFICULTY_MAP: Record<string, "easy" | "medium" | "hard"> = {
  q1: "easy", q2: "easy", q3: "easy", q4: "easy", q5: "easy",
  q6: "medium", q7: "medium", q8: "medium", q9: "medium", q10: "medium",
  q11: "hard", q12: "hard", q13: "hard", q14: "hard", q15: "hard",
};

// Helper: get all quiz questions with difficulty applied
export function getAllQuizQuestions(): QuizQuestion[] {
  return [...QUIZ_QUESTIONS, ...QUIZ_QUESTIONS_EXTRA].map((q) => ({
    ...q,
    difficulty: QUIZ_DIFFICULTY_MAP[q.id] || "medium",
  }));
}

export const DIFFICULTY_META = {
  easy: { label: "Easy", description: "Basic concepts · No timer", color: "oklch(0.55 0.13 162)", count: 5 },
  medium: { label: "Medium", description: "Real-world scenarios · 30s/question", color: "oklch(0.72 0.13 85)", count: 5 },
  hard: { label: "Hard", description: "Advanced reasoning · 20s/question", color: "oklch(0.58 0.21 27)", count: 5 },
} as const;
