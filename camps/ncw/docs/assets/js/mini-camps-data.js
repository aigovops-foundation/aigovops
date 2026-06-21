/* ============================================================
   NCW Mini-Camps data — Five scenarios × seven voices.
   Source: ncw_mini_camps.md (AiGovOps Foundation × NCW Tech Alliance)
   "Human in the driver's seat. AI does the painful work. Truth-grounded. Always."
   ============================================================ */
window.SCENARIOS = {
  gifted:    { label: "Gifted goes deeper", color: "green",  emoji: "🟢", short: "Gifted",
               blurb: "AI hunts sources, spars, and critiques — the question, the argument, and the voice stay the student's." },
  challenged:{ label: "Challenged keeps up", color: "blue",  emoji: "🔵", short: "Challenged",
               blurb: "A patient tutor that never tires — re-explains as many times as it takes while the student does the learning." },
  teacher:   { label: "Burned-out teacher", color: "yellow", emoji: "🟡", short: "Teacher",
               blurb: "AI does the four hours of paper-pushing so the relationship, judgment, and spark stay human." },
  smb:       { label: "Small business owner", color: "orange", emoji: "🟠", short: "SMB",
               blurb: "AI does the painful invisible work; the owner keeps every customer-facing moment." },
  community: { label: "Community leader", color: "purple", emoji: "🟣", short: "Community",
               blurb: "AI researches, drafts, and visualizes; the leader keeps the listening, the trust, and the room." },
};

window.AUDIENCES = {
  "4th":     "4th grader",
  "8th":     "8th grader",
  "12th":    "12th grader",
  "teacher": "Teacher",
  "admin":   "Administrator",
  "smb":     "SMB owner",
  "gov":     "Local government",
};

window.MINI_CAMPS = [
  /* ---------- SCENARIO 1 — GIFTED ---------- */
  {
    id: "1a-gifted-4th", scenario: "gifted", audience: "4th", color: "green",
    title: "My Big Project — Going Deeper Camp",
    badge: "4th grade",
    intro: "You're already good at school. This camp is for kids who finish the work and want to know more. Pick something you LOVE that you only kind of talked about in class — like wolves coming back to Washington.",
    steps: [
      { h: "Pick your question", b: "Mine: \"Are wolves coming back to Washington — and is that good or bad?\" Pick the one that makes you most curious." },
      { h: "Ask Gemini to be your research buddy — not your answerer", b: "Type: \"I'm a 4th grader doing a project on wolves in Washington. Ask me 5 questions to help me think harder. Don't tell me the answers.\" Try to answer in your own words first." },
      { h: "Check it out in real life", b: "Ask for 3 places to learn more — a book, a website, a person to talk to. Then GO check one. Visit the library. Email the Washington Wolf Project. Real things, not just chatbot things." },
      { h: "Make something", b: "A poster. A 1-minute video. A model. YOU make it. AI can help you spell-check or suggest a word, but the ideas are YOURS." },
    ],
    oneRule: "AI is allowed to ask me questions. AI is NOT allowed to give me my answer. That's mine.",
    save: "In a Google Doc called \"My Wolf Project,\" save the questions Gemini asked you and your answers in your own words. That's your brain growing.",
  },
  {
    id: "1b-gifted-8th", scenario: "gifted", audience: "8th", color: "green",
    title: "The \"Go Deeper\" Lab — for students who finish early",
    badge: "8th grade",
    intro: "You finish the assignment in 20 minutes when everyone else needs 50. Then you scroll your phone — that's a waste of you. Here's how to spend that extra 30 minutes building something nobody assigned. Pick a real question nobody fully agrees on: Should AI write part of a college essay? Was the bomb on Hiroshima necessary? Is Snake River dam removal a net good for salmon?",
    steps: [
      { h: "Frame it sharper", b: "Ask Gemini Deep Think: \"I want to argue that [position]. What are the 3 strongest arguments against me? What evidence do I need to handle them?\" Answering the other side is your real homework." },
      { h: "Ask three AIs (the Model Council)", b: "Open ChatGPT, Claude, and Gemini in three tabs. Ask each for the most credible source and what it actually says. Where they disagree is interesting — write it down, then read the real source." },
      { h: "Read the actual source", b: "A primary document, a peer-reviewed paper, a long-form article with a real editor. AI suggests; you verify. That's \"truth-grounded.\"" },
      { h: "Write your draft in your voice", b: "AI helps with structure, grammar, what to cut — NOT your sentences. If you can't explain a sentence out loud to your dog, delete it." },
      { h: "Stress test", b: "Paste your draft into Gemini: \"Pretend you're a tough debate judge. Name my 3 weakest points. Don't fix them.\" Then YOU fix them." },
    ],
    oneRule: "AI asks me questions. AI fact-checks my claims. AI argues against me. AI does NOT write my argument — that's mine.",
    save: "Save your prompts AND the AI's answers in \"My research log.\" Attach it when you turn in your project. That's not cheating — that's showing how a smart kid uses AI.",
  },
  {
    id: "1c-gifted-12th", scenario: "gifted", audience: "12th", color: "green",
    title: "Building Original Work in an AI-Saturated World",
    badge: "12th grade",
    intro: "You're about to be in environments where everyone uses AI, often badly. The skill that sets you apart is using AI to think harder, not to think less. This 30-minute protocol produces an original artifact — an opinion piece, research memo, or proposal — with your voice on every line.",
    steps: [
      { h: "Pick a question with no Google-able answer", b: "Bad: \"When did the EU AI Act pass?\" Good: \"Should Washington adopt something like the EU AI Act for K-12 schools? Why or why not?\"" },
      { h: "Run a Model Council", b: "Three frontier AIs, same prompt: \"Give me your strongest version of the OPPOSING case, with citations to specific studies. Be ruthless.\" Note what they agreed on (likely true) and disagreed on (worth investigating)." },
      { h: "Read the primary sources they cited", b: "Trust nothing until you've eyeballed at least 3 actual papers. MIT found students who rely on AI to spot fake news lose the ability — by 15.3% in 4 weeks. Don't be that student." },
      { h: "Outline in your voice", b: "Hand-write or thumb-type a one-page outline. AI is not in this step. This is where your argument gets built." },
      { h: "Draft", b: "AI may help with punchy intros, transitions, fact-checks. AI does not write your thesis or conclusion. Read every sentence aloud; if it sounds like a bot, rewrite it." },
      { h: "Critic loop", b: "Three rounds in Deep Think: \"Where is my logic weakest? What expert would disagree, and why? What did I miss?\" Fix what's worth fixing. You're the editor." },
      { h: "Disclose", b: "Footer: \"I used Gemini, Claude, and ChatGPT for opposition-research, fact-checking, and structural feedback. I wrote every sentence. Prompts available on request.\" That's professional." },
    ],
    oneRule: "The argument is mine. The voice is mine. The accountability is mine. The painful research, the fact-checking, the \"what am I missing\" stress-test — those I share with AI.",
    save: "Cornell surveyed 95,000 college students: 1 in 3 use AI regularly, 9% to cheat outright. The kids who get the great spots can prove they're in the other 91% — with their work. This protocol gives you receipts.",
  },

  /* ---------- SCENARIO 2 — CHALLENGED ---------- */
  {
    id: "2a-challenged-4th", scenario: "challenged", audience: "4th", color: "blue",
    title: "My Helper Camp — for things that feel hard",
    badge: "4th grade",
    intro: "Sometimes the words go too fast. Sometimes the page has too many words. That's OK — smart kids feel stuck sometimes too. Here is your camp.",
    steps: [
      { h: "Pick the hard thing", b: "What's one thing in class that feels too hard? Maybe long division. Maybe reading a chapter. Maybe writing a story." },
      { h: "Ask Gemini to be your slow, kind teacher", b: "Open gemini.google.com. Say: \"I am 9. Reading is hard for me. Please help me with [the hard thing]. Talk slow. Use small words. Use pictures or examples a 9 year old would know.\" You can say \"slower\" or \"show me with cookies\" any time." },
      { h: "Try it yourself", b: "After Gemini explains, YOU try. Out loud. To your mom, your dog, your stuffed animal. If you can teach it to your stuffed animal, you got it." },
      { h: "Earn your sticker", b: "Every time you finish a hard thing, put a sticker on your folder. YOU did the hard thing. The helper just helped." },
    ],
    oneRule: "The helper is patient. The helper is kind. The helper does NOT do my work for me. I do my work. The helper helps me see how.",
    save: "A note for your grown-up: your kid is learning HOW to learn, not just the answer. Sit with them the first 2–3 times. After that they will fly.",
  },
  {
    id: "2b-challenged-8th", scenario: "challenged", audience: "8th", color: "blue",
    title: "The \"Second Chance\" Lab",
    badge: "8th grade",
    intro: "If school has felt hard for a while — you're not dumb. School moves at one speed. You learn at yours. AI can be the patient tutor that never makes you feel small. Here's how to use it without it doing your homework.",
    steps: [
      { h: "Name what's stuck", b: "One sentence. \"I don't get how to factor a quadratic. I've been faking it since October.\" It's OK. Write it down." },
      { h: "Ask for the kid-sized version", b: "\"I'm in 8th grade, stuck on [thing]. Pretend I'm a smart kid who just hasn't been taught it well yet. Explain it three ways: a real-world example a 13-year-old cares about, a drawing-in-words, and a step-by-step recipe.\" One will click." },
      { h: "Earn it", b: "\"Now give me 3 easy, 3 medium, 3 hard problems. Don't give me the answers. After I try each, I'll tell you my answer and you tell me if it's right and why.\" The doing is yours." },
      { h: "Teach it back", b: "After the 9 problems, write \"How I would explain this to a confused friend\" in your own words. The most important step. If you can teach it, you own it." },
      { h: "Tell your teacher", b: "Show them the doc and the prompts. Most teachers — when you show them you're learning harder, not skipping — become your biggest fan." },
    ],
    oneRule: "AI never gives me the answer. AI explains it 5 different ways until ONE works. The answer? I find that. Every time.",
    save: "Safety note: don't paste your full name, your school, or anything personal into a free chatbot. The math problem is enough.",
  },
  {
    id: "2c-challenged-12th", scenario: "challenged", audience: "12th", color: "blue",
    title: "The Catch-Up Protocol — without faking it",
    badge: "12th grade",
    intro: "You might be a few credits behind, or on track but feeling underwater. AI can be your scaffolding — without becoming a crutch that makes things worse.",
    steps: [
      { h: "Take an honest inventory", b: "What are you actually stuck on? Be specific. Not \"math\" — \"logarithms\" or \"5-paragraph essays\" or \"how to read a research paper.\"" },
      { h: "Make a 4-week learning plan with AI", b: "\"I'm a senior behind on [topic]. I have 30 minutes a day, 5 days a week. Build me a 4-week plan to understand this — what to learn, what to practice, how to know I got it, and how to know if I'm faking it.\" Tape it to your wall." },
      { h: "Use Khanmigo every day", b: "Khan Academy's Khanmigo is free for students and built NOT to give you the answer — it asks questions. Khan Academy's own data shows students using it 30+ min/week gained +23% in mastery, and the npj Science of Learning review found consistent K–12 gains. That's the version of AI that helps." },
      { h: "Do the \"explain my confusion\" move", b: "\"I'm trying to learn [X]. Here's what I think it means: [your understanding]. Where am I wrong?\" More powerful than asking for the answer. AI corrects your mental model." },
      { h: "Don't hide it", b: "Tell a teacher: \"I'm using AI to catch up. Here's my plan, here's my work. Will you check in weekly?\" Adults move mountains for a kid who shows up with a plan." },
    ],
    oneRule: "I never paste an assignment into AI and submit what comes out. I use AI to fix my understanding. Then I do the work.",
    save: "Detection is getting easier, not harder. The teacher who watches you go D → C → B with your AI receipts in a Drive folder writes you the best recommendation letter of their life. Catch-up isn't cheating. Hiding is cheating. Show your work.",
  },

  /* ---------- SCENARIO 3 — TEACHER / ADMIN ---------- */
  {
    id: "3-teacher", scenario: "teacher", audience: "teacher", color: "yellow",
    title: "The Sunday Rescue Camp",
    badge: "Teacher",
    intro: "You didn't become a teacher to write parent emails on Sunday at 4pm. AI cannot replace the spark — but it can do the 4 hours of paper-pushing standing between you and the work you love. A 30-minute camp to get back 2–3 hours every weekend, starting this Sunday.",
    steps: [
      { h: "Lesson plan in 4 minutes (Gamma + Gemini)", b: "In Gamma: \"5-slide lesson for [grade] [subject] on [topic]. Include 1 hands-on activity slide. Tone: warm, curious, slightly nerdy.\" 90 seconds → a draft. You spend 3 minutes editing for your kids, your in-jokes." },
      { h: "Differentiate any reading in 2 minutes", b: "Paste a passage: \"Rewrite at 3rd, 6th, and 9th grade level. Keep all key facts. Add 3 comprehension questions per level.\" ELL kids get 3rd, above-grade get 9th — everyone reads the same content." },
      { h: "IEP draft in 10 minutes (de-identified)", b: "\"I'm an SpEd teacher drafting an IEP goal in [domain] for a [grade] student. Strengths/needs/current performance: [...]. Draft 2–3 measurable annual goals. Do not invent data.\" NO names, NO identifiers. FERPA-safe." },
      { h: "The parent-email softener", b: "Type your frustrated draft, then: \"Rewrite for a parent who is also tired and overwhelmed. Keep the boundary. Drop the snark. Keep my voice — warm but firm.\" Send the softened one." },
      { h: "Meeting notes that take themselves (Granola)", b: "Open Granola during your next IEP meeting or conference. It listens through your laptop (doesn't join as a bot). After: clean notes, action items, sharable summary. You stay present." },
      { h: "NotebookLM for unit prep", b: "Drop in your textbook PDF, last year's slides, 3 articles, the standards doc. Ask for a 4-week unit overview, 12 lesson seeds, discussion questions, vocab, and differentiation. Two hours of prep in 8 minutes." },
    ],
    oneRule: "1. No student-identifying info in a free tool — FERPA first. 2. Two-eyes rule: I read every word that goes to a student, parent, or record. AI drafts, I decide. 3. The receipts: my \"AI cookbook\" Drive folder grows every week.",
    save: "Write your 3-sentence classroom AI policy: Students may use AI for ___. Students must disclose ___. I will use AI for ___ and will not use it for ___. Post it. Send it to parents. You just did policy-as-code, teacher edition.",
  },
  {
    id: "3b-admin", scenario: "teacher", audience: "admin", color: "yellow",
    title: "The District Leadership Camp",
    badge: "Administrator",
    intro: "You're caught between burned-out teachers, nervous parents, a school board that wants your policy, a Senate GAO investigation in district inboxes, the AFT calling for screen bans, and an IT budget you don't have. Here's the 30-minute version of the move you need to make: make AI safe enough that your teachers want to use it.",
    steps: [
      { h: "Inventory what's already in your district", b: "Open a Google Sheet \"District AI Inventory\": Tool · Who's using it · For what · Data touched · Approved? · Last reviewed. Most districts find 15–40 AI tools already in use — most never approved. (The Foundation's Beacon tool automates this, free.)" },
      { h: "The traffic-light policy", b: "🔴 RED — Never: grading, placement/discipline, IEPs without human authorship, FERPA records in a free tool. 🟡 YELLOW — With care: student research (with disclosure), teacher drafting (with review). 🟢 GREEN — Encouraged: lesson planning, differentiation, translation, accessibility, meeting summaries." },
      { h: "Build the parent letter", b: "Use Deep Think to draft three paragraphs: what AI we use and why; what we will NEVER use AI for (the red list); how you can opt out, ask questions, or escalate. Sign it personally — the act of writing it builds the policy." },
      { h: "Train the teachers", b: "Free: aiEDU curriculum, NCESD resources, Common Sense Education, NCW AI in Action series, Khanmigo Districts, the Foundation's open-source training packs. Designate one AI lead per building, 2 hours/month + a small stipend." },
      { h: "The board update", b: "Quarterly, three slides: what's in use (the inventory), what changed, and outcomes (test data, hours saved, incidents handled). Show your work and everyone calms down. Governance that runs like engineering, K-12 scale." },
    ],
    oneRule: "1. No tool touches a kid's record without a written policy and a human in the loop. 2. We inventory quarterly, retire what isn't used, escalate what causes harm. 3. We trust our teachers — tools, training, and air cover.",
    save: "Banning won't work. Free-for-all won't work. Governance is your only move — and your competitive advantage. Districts that get this right will recruit teachers from the ones that don't.",
  },

  /* ---------- SCENARIO 4 — SMB ---------- */
  {
    id: "4-smb", scenario: "smb", audience: "smb", color: "orange",
    title: "The 5-Hours-Back Camp",
    badge: "Small business owner",
    intro: "You opened an orchard / bakery / dental office / real-estate practice. You did NOT sign up to be a copywriter, HR director, social media manager, and spreadsheet-cleaner — but here you are at 9pm on a Tuesday doing all five. The deal: AI does the painful invisible work; you do everything customer-facing.",
    steps: [
      { h: "Email drafting (1–2 hrs/week)", b: "Train Gemini once on your voice: \"I run [a bakery] in Wenatchee. My voice is warm, plain, a little dry-funny, never corporate.\" Then: \"Draft a 4-sentence reply to this customer. Acknowledge, explain, close warmly. Keep my voice.\" Read it, edit it, send it." },
      { h: "A week of social posts in 5 minutes (Gemini + Canva)", b: "Friday at 4pm: \"Draft 5 short social posts for next week. Topics: a seasonal hook + a customer story + a behind-the-scenes moment + a product highlight + a community shoutout. Warm voice, no hashtags, max 50 words.\" Paste into Canva, add a photo, schedule." },
      { h: "Meeting notes that write themselves (Granola)", b: "Granola listens to your Zoom/Teams/Meet through your laptop — doesn't join as a bot. After: clean summary + action items. Stop taking notes. Stay present. Look people in the eye." },
      { h: "The spreadsheet whisperer (Gemini in Sheets)", b: "\"Flag any row where the price is 2 std-devs from average.\" \"Summarize sales by month for 12 months.\" \"Find customers who haven't purchased in 90+ days.\" An hour of boring work in 30 seconds." },
      { h: "Rehearse the hard conversation", b: "The firing, the refund, the vendor dispute. \"Role-play as the angry customer. I need to tell them X. Be as tough as the real conversation.\" 10 minutes of rehearsal beats 20 minutes of regret." },
    ],
    oneRule: "1. NEVER paste private data into a free tool — no card numbers, patient info, SSNs, confidential contracts. (If you wouldn't email it to a stranger, don't paste it.) 2. Two-eyes rule on anything to a customer, regulator, the IRS, or the bank. 3. Keep the receipts in an \"AI receipts\" Drive folder.",
    save: "Write your 5-sentence AI policy: At [business] we use AI to ___. We never use AI for ___. The person responsible is ___. We review every ___. If something goes wrong, we ___. You opened the business because you loved the work — every hour AI saves is an hour you get back for the part you loved.",
  },

  /* ---------- SCENARIO 5 — COMMUNITY / GOV ---------- */
  {
    id: "5a-community", scenario: "community", audience: "smb", color: "purple",
    title: "The Civic Action Camp — 30 minutes from concern to first move",
    badge: "Community leader",
    intro: "You care about the thing nobody else has time to care about — affordable housing, addiction, broadband gaps, a school crisis. You've talked about it for two years. Today you move it. AI is your research partner, drafter, and visualizer — while every decision, relationship, and voice line stays yours.",
    steps: [
      { h: "Sharpen the problem (Gemini Deep Think)", b: "\"I'm a community leader in [town]. The problem is [concern]. Sharpen this into 3 specific, actionable questions a small civic group could answer in 90 days. For each: who has the data, who's the natural ally, what's the smallest first step.\" Pick the question that makes your gut tighten." },
      { h: "Triangulate the truth (Model Council)", b: "Ask Gemini, Claude, ChatGPT the same question: \"What does credible evidence say about [problem] in similar communities? What's been tried, what worked, what failed, what's the most surprising finding?\" Then read the actual cited sources — truth-grounded means a human verified." },
      { h: "Draft your \"1-page case for action\"", b: "\"Draft a 1-page case for action for my city council. Topic: [problem]. Tone: clear, urgent but not alarmist, ends with 1 specific ask. Include 3 facts with citations, 1 local story, the cost of doing nothing, and the cost of the ask.\" Add the local story yourself — you know it; AI doesn't." },
      { h: "Build the website / one-pager in 60 minutes (Lovable or Framer)", b: "\"Build a single-page site for a small civic campaign about [problem]. Hero with the ask, 3 facts with sources, a local story, who's behind this, a sign-up form. Warm and trustworthy, not slick. Mobile-first.\" 60 seconds later: a real site. Evidence that ships." },
    ],
    oneRule: "1. No real names, medical info, or anyone-else's-data in a free AI tool without permission. 2. Verify every fact against an actual source — a campaign built on a hallucinated stat dies the day a reporter Googles it. 3. Disclose: \"drafted with AI assistance and human verification.\"",
    save: "AI doesn't make a community. YOU make a community. AI makes you 5x faster at the boring stuff so you have time for the part nobody else can do — being in the room, listening, building trust over years.",
  },
  {
    id: "5b-gov", scenario: "community", audience: "gov", color: "purple",
    title: "The Local Government Camp — practical, accountable, public",
    badge: "Local government",
    intro: "You serve a small city or county. Constituents are watching the news — the Senate GAO investigation, the NYC Council pause letter, the AFT screen-ban calls — and asking your position. You don't have a $5M AI advisor budget. Here's the 30-minute version.",
    steps: [
      { h: "Inventory", b: "Same spreadsheet move as the school administrator. Every department, every tool — clerk, planning, parks, police, library, schools. Most small cities find 8–20 AI tools already in use, most never approved. You can't govern what you can't see." },
      { h: "Adopt a 1-page AI use ordinance", b: "Three sections: what we use AI for (drafting, summarizing public comment, translation, accessibility); what we'll NEVER use it for (decisions affecting rights/benefits without human review, surveillance without a warrant, final hiring, any decision about a child without two-eyes review); and public accountability (quarterly disclosure, public comment before new tools, a named accountable employee)." },
      { h: "The community engagement move", b: "Use Deep Think to draft a 4-question survey: what AI uses would help you most? Where are you most worried? What should AI NEVER do? Who should be accountable? Synthesize responses in NotebookLM, then read the top 5 things residents care about out loud at a council meeting." },
      { h: "Translate everything you publish", b: "NCW has significant Spanish-speaking and Indigenous communities. Use Gemini to translate every public notice, agenda, and key document into Spanish. The most important equity move AI enables for a small city — it costs essentially nothing and changes who gets to participate." },
      { h: "The annual public AI report", b: "Once a year publish every AI tool in use, any incidents, the savings by department, and what's changing. Make it short, readable, and boring — boring annual reports are what trust looks like in local government. (The Foundation's Lantern tool is built for exactly this.)" },
    ],
    oneRule: "1. No AI decision without human review touches a resident's rights or benefits. 2. Every AI use is disclosed publicly, every quarter, by name. 3. We govern with our residents, not above them — AI helps us listen better, not louder.",
    save: "Big cities will spend years and millions arguing. You can lead by example in 30 days. NCW could be the first AI-governed region in America that small cities actually copy from. That's not a small thing — that's leadership.",
  },
];
