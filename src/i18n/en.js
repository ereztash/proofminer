/**
 * English translation. Hebrew (`he.js`) is the source of truth for register
 * and tone — this file follows it, not the other way round.
 */

export default {
  dir: 'ltr',
  lang: 'en',

  app: { name: 'ProofMiner', tagline: 'You know you are good. Nobody else does.' },

  nav: {
    dashboard: 'Standing',
    mine: 'Sources',
    position: 'Positioning',
    inventory: 'Evidence',
    gaps: 'What is missing',
    studio: 'Draft',
    measure: 'Measure',
    settings: 'Settings',
    skip: 'Skip to content',
  },

  onboarding: {
    painTitle: 'You know you are good. Nobody else does.',
    painBody:
      'This is not a confidence problem and it is not a content problem. You have years of work nobody ever collected as evidence, so it does not count.',
    pledgeLead:
      'Everything stays on your machine — no server, no account. This tool will not invent achievements.',
    pledgeTitle: 'What else to know before you paste',
    pledge: [
      'Everything stays on your machine. No server, no account, nobody reading it but you.',
      'This tool will not invent achievements. It works only with what you wrote.',
      'It will not let your visibility run ahead of your evidence, and it will tell you when that happens. What you type here it takes as given — it cannot verify that for you.',
    ],
    needSituation: 'Pick what is true for you first.',
    situationQuestion: 'Which of these is true for you right now?',
    situationNote:
      'This tool is built for someone who already feels it. If none of these describes you, say so — it saves us both the time.',
    trackJob: 'I keep sending applications, and the silence is getting to me',
    trackJobHint: 'You know you fit these roles. It just never reaches anyone.',
    trackIndependent: 'My clients are happy, and I have no idea where the next ones come from',
    trackIndependentHint:
      'Every new engagement arrives through someone who already knows you, and you can feel the ceiling.',
    notMe: 'None of these. I do not feel I have a problem right now.',
    notMeHint: 'A completely fair answer. Pick it and see what it means.',
    weeksQuestion: 'How long has this been bothering you?',
    weeksNotYet: 'Started recently',
    weeksMonths: 'A few months',
    weeksLong: 'Too long',
    start: 'Show me what I already have',
    firstStepTitle: 'Paste something that already exists',
    firstStepBody:
      'A CV, a thank-you email from a client, a project summary, a recommendation, an old post, a role description you wrote. Nothing needs rewriting.',
    placeholder: 'Paste here. Messy is fine — exactly as you have it.',
    analyze: 'Find my evidence',
    orSample: 'I have nothing ready — show me on a sample',
  },

  notForYou: {
    title: 'Then this is probably not your tool. Not right now, anyway.',
    body:
      'We are not going to argue you into a problem. If work reaches you, and nothing you have done feels like it went missing on the way, there is nothing here that improves your situation and we are not going to pretend otherwise.',
    forWhom:
      'This is built for someone who already knows it hurts: applications that go unanswered, or work that only ever arrives through someone who already knows you. It does not teach you that you have a problem — it measures one you already feel.',
    comeBackTitle: 'When it is worth coming back',
    comeBack: [
      'When someone less experienced than you gets the thing you wanted.',
      'When you have to explain why you are the right choice and have nothing to point at but your own word.',
      'When the stream of work that came through people who know you starts drying up.',
      'When you are about to leave a role and find that everything you did exists only inside the organisation you are leaving.',
    ],
    changedMind: 'If you have changed your mind, the question above is still open.',
  },

  firstLight: {
    title: (n) => `We found ${n} pieces of evidence in what you pasted.`,
    subtitle:
      'These are not content ideas. These are things that already happened, that you hold and nobody sees.',
    demoTitle: (n) => `Our sample holds ${n} pieces of evidence.`,
    demoSubtitle:
      'This is a sample we brought, not anything of yours. It is here only to show how the ' +
      'ranking works — the moment you paste your own material it drops out of the calculation.',
    threeTitle: 'Three you would never have published yourself',
    thinTitle: 'Too little here to tell you anything definite',
    thinBody:
      'What you pasted mostly describes roles rather than what came out of them. These are the ' +
      'closest things to evidence in it, and they are still weak. Paste something with a number, ' +
      'a date or somebody else\'s name in it: a project summary, a client email, a recommendation.',
    why: 'Why this one',
    continue: 'Got it — show me the full picture',
    emptyTitle: 'Not enough to start with',
    emptyBody:
      'The text is too short or too general. Try adding something concrete: what you did, for whom, and what changed.',
  },

  gap: {
    label: 'Visibility gap',
    positive: (f, b) => `Your evidence supports ${f}. The world sees ${b}.`,
    negative: (f, b) => `You appear as ${b}. Your evidence supports ${f}.`,
    zero: 'Your visibility matches your evidence.',
    explainPositive:
      'This gap is not your failure. It is the distance between what you did and what was collected.',
    explainNegative:
      'This is the one direction this tool stops. Before publishing more, bring evidence.',
    estimate: 'Early estimate — not enough data yet',
    index: 'Composite index',
  },

  diagnosis: {
    STALLED: {
      title: 'Not started',
      body: 'Not enough evidence and not enough visibility. This is the easiest state to change, because the first step is only collecting.',
    },
    BURIED: {
      title: 'You hold more than shows',
      body: 'You hold good evidence nobody has seen. This is the state this product was built for.',
    },
    HOLLOW: {
      title: 'Visibility ahead of evidence',
      body: 'You appear larger than your evidence supports. Publishing more makes it worse. Bring evidence.',
    },
    COMPOUNDING: {
      title: 'Compounding',
      body: 'Evidence and visibility are moving together. Now it is cadence and conversion.',
    },
    EARLY: {
      title: 'Both sides moving together',
      body: 'Evidence and visibility are balanced, and both are still small. That is a good position — just an early one. Every step now moves both.',
    },
    DEMO: {
      title: 'This is the sample, not you',
      body: 'Every number on this screen is computed from demo material. It shows how the system works and says nothing about you. Add one source of your own and the picture becomes yours.',
    },
    UNCATALOGUED: {
      title: 'Not enough written down to say',
      body: 'Things are happening for you out there, but too little of your experience has been collected here. That almost always means it was never written down — not that it is absent. Add more material and we can tell you something real.',
    },
  },

  dashboard: {
    urgency: {
      months: 'You have been at this a few months. The move below is chosen to shift something this week, not to build a year-long plan.',
      long: 'You have been at this long enough that the general advice has run out. What follows is the one concrete thing worth doing now.',
    },
  },

  layers: {
    L1: { name: 'Evidence', question: 'What you actually hold' },
    L2: { name: 'Positioning', question: 'What you own' },
    L3: { name: 'Published', question: 'What went out' },
    L4: { name: 'Reception', question: 'How it landed' },
    L5: { name: 'Conversion', question: 'Who moved' },
    L6: { name: 'Recognition', question: 'Who vouches for you' },
    locked: 'Not unlocked yet',
    lockedReason: {
      'no-proofs': 'Unlocks when you add a first source',
      'no-positioning': 'Unlocks when you define who you are talking to',
      'nothing-published': 'Unlocks after your first publication',
      'no-reception': 'Unlocks when you log numbers on a publication',
      'no-conversions': 'Unlocks on your first inbound',
      'no-recognition': 'Unlocks when someone external mentions you',
    },
    confidenceLow: 'Little data',
  },

  dimensions: {
    verification: 'External verification',
    icpFit: 'Audience fit',
    outcome: 'Outcome strength',
    specificity: 'Specificity',
    differentiation: 'Differentiation',
    falsifiability: 'Checkable',
    commercialProximity: 'Commercial proximity',
    recency: 'Recency',
    narrative: 'Story material',
  },

  dimensionHelp: {
    verification: 'Someone else said this about you, not you about yourself.',
    icpFit: 'The evidence speaks to the audience you defined.',
    outcome: 'Something actually changed and you can point at it.',
    specificity: 'A number, a timeframe or a name — not a general description.',
    differentiation: 'Not many people in your field could say this sentence.',
    falsifiability: 'A sceptic could go and check it. This is what separates evidence from a claim.',
    commercialProximity: 'The evidence is close to what you sell or the role you want.',
    recency: 'How fresh it is. Evidence has a shelf life.',
    narrative: 'There is a before and an after — it can be told.',
  },

  missing: {
    verification: 'Add an external source: a client name, a quote, a link.',
    icpFit: 'Connect the evidence explicitly to your audience’s problem.',
    outcome: 'Add what actually changed.',
    specificity: 'Add a number, a timeframe or a name.',
    differentiation: 'Clarify what here is hard to copy.',
    falsifiability: 'Add something checkable: a date, a name, a link.',
    commercialProximity: 'Tie the evidence to what you offer.',
    recency: 'Add a date or current context.',
    narrative: 'Add a before and after.',
  },

  reasons: {
    rareVerification: (v) =>
      v.n === 1
        ? `This is the only one of your ${v.total} pieces where someone external vouches for you. That is the type you have least of and the type that convinces most.`
        : `This is one of only two of your ${v.total} pieces where someone external vouches for you. That is the type you have least of and the type that convinces most.`,
    rareNumbers: (v) =>
      v.n === 1
        ? `This is the only one of your ${v.total} pieces containing a checkable number.`
        : `Only two of your ${v.total} pieces contain a checkable number. This is one of them.`,
    rareLink: (v) =>
      v.n === 1
        ? `This is the only one of your ${v.total} pieces containing a link. It can be opened, not just believed.`
        : `Few of your pieces contain a link. This is one of them — it can be opened, not just believed.`,
    rareBeforeAfter:
      'This is one of the few of yours with both a before and an after. That is what turns a job description into something checkable.',
    onlyFailure:
      'This is your only piece where you analyse something that did not work. Professional judgement shows there more than in any success.',
    onlyMethod:
      'This is your only piece describing a method rather than an event. A written method is the one thing nobody can copy off you.',
    namedThirdParty: 'There is a named external party here. A sceptic can go and check it without you.',
    thirdParty: 'This is not you claiming something about yourself — somebody else put you in the picture.',
    checkable: 'There is a link here. This is evidence someone can open, not a claim they have to accept.',
    datedAndNamed: 'There is both a date and a name here. Together they turn a claim into something checkable.',
    percentDelta: 'There is a percentage change here. That is the hardest thing to argue with.',
    moneyDelta: 'There is a money figure here. Revenue is the outcome fewest people are willing to write down.',
    beforeAfter: 'There is a before and an after here. That is what turns a job description into something checkable.',
    outcome: 'Something actually changed here — this is not a description of what you do.',
    scale: 'There is a counted scale here. Most people never bother to count, which is why it stands out.',
    method: 'This describes how you work, not what happened once. That is the part that stays yours.',
    failure: 'You are writing about something that did not go well. That reads as more professional confidence, not less.',
    peer: 'The confirmation here comes from a peer, not a client. That carries entirely different weight.',
    credentialGraded: 'There is a graded credential here. It closes a gap, even at low weight.',
    hedged: 'The wording here hedges. The evidence is stronger than the way you wrote it.',
    generic: 'This is self-description, not evidence. There is nothing here anyone could check.',
    none: 'There are not enough signals here yet to say anything definite.',
  },

  bands: { strong: 'Strong', usable: 'Usable', weak: 'Weak' },

  archetypes: {
    OUTCOME: 'Outcome',
    VALIDATION: 'External validation',
    SCALE: 'Scale',
    METHOD: 'Method',
    CREDENTIAL: 'Credential',
    PEER: 'Peer recognition',
    FAILURE: 'A failure you learned from',
    ORIGIN: 'Why you',
  },

  plays: {
    'play.outcome': {
      title: 'Pull one measurable result out of a client or project',
      body: 'Pick one finished project. Write three lines: what it was before, what you did, what it was after. If you have no number, ask someone who was there.',
      needs: 'To count: a before number and an after number, the year, and the client or place.',
    },
    'play.validation': {
      title: 'Ask for written confirmation from someone who was there',
      body: 'One message: "We worked together on X. I am collecting what actually happened — could you write me two lines on what changed for you?" Most people answer.',
      needs: 'To count: the quote in quotation marks, the name and role of whoever wrote it, and a link if there is one.',
    },
    'play.scale': {
      title: 'Count how many. Just count.',
      body: 'How many clients, participants, years, projects. The number is already in your head and was never written down.',
      needs: 'To count: the number itself with a unit — clients, employees, sites — and a period.',
    },
    'play.method': {
      title: 'Write your method out in steps',
      body: 'You do it the same way every time. Write the steps down. A written method is evidence nobody can copy off you.',
      needs: 'To count: the steps themselves, when you wrote it, and the link if you published it anywhere.',
    },
    'play.credential': {
      title: 'List your credentials',
      body: 'Degree, course, licence, certificate. Five minutes.',
      needs: 'To count: the institution, the year, and a link if there is one. "I have a degree" on its own does not reach the bar.',
    },
    'play.peer': {
      title: 'Get a mention from a peer, not a client',
      body: 'A happy client is expected. A peer saying you are good is something else. Ask someone in your field to confirm something specific.',
      needs: 'To count: the peer\'s name and role, what exactly they said, and where.',
    },
    'play.failure': {
      title: 'Write about something that did not work',
      body: 'Not to sound modest. A failure you analyse precisely proves professional judgement better than any success.',
      needs: 'To count: what you tried, when, what it cost — time or money — and what you have done differently since.',
    },
    'play.origin': {
      title: 'Write why this, and why you',
      body: 'Not a life story. The specific turn that gave you an angle others do not have.',
      needs: 'To count: the year, the place, and the particular thing you saw. This is a weaker kind of evidence, and its bar is lower to match.',
    },
  },

  moves: {
    label: 'Next move',
    only: 'One move. Not a list.',
    'move.addSource': { title: 'Paste a first source', why: 'Without raw material there is nothing to rank. Five minutes and the base exists.' },
    'move.mine': { title: 'Run evidence extraction', why: 'The sources are already here. One click to see what is in them.' },
    'move.setAudience': { title: 'Define who you are talking to', why: 'Evidence is not strong in the abstract — it is strong for someone specific. Without this the ranking is partial.' },
    'move.acquireProof': { title: 'Get evidence, do not publish', why: 'You already appear larger than your evidence supports. Another post widens the wrong gap.' },
    'move.publishFirst': { title: 'Publish your strongest evidence', why: 'You have good material nobody has seen. That is exactly the gap.' },
    'move.publishStaling': { title: 'Publish before it goes stale', why: (d) => `This piece has roughly ${d} days before it loses a significant part of its value.` },
    'move.logReception': { title: 'Log what happened to your post', why: 'Without these numbers the system cannot learn what works for you — and that is the whole difference.' },
    'move.closeGap': { title: 'Close the highest-value gap', why: 'This is the missing evidence type with the best effort-to-value ratio.' },
    'move.sharpenPositioning': { title: 'Sharpen your positioning', why: 'The current positioning does not yet separate you from others in your field.' },
    'move.resolveDrift': { title: 'Your positioning does not match what actually works', why: 'What generates inbound for you differs from what you declare. Worth resolving.' },
    'move.catalogueMore': {
      title: 'Add more raw material',
      why: 'Things are happening for you out there, but too little of your experience has been collected. Nothing real can be said on the basis of two lines.',
    },
    'move.addRealSource': {
      title: 'Now add something of your own',
      why: 'So far you have seen how this works on a sample. The numbers above are the sample\u2019s, not yours.',
    },
    'move.publishNext': {
      title: 'Publish the next one',
      why: 'This is your strongest piece of evidence that has not gone out yet.',
    },
    'move.logConversion': {
      title: 'Who came to you because of it?',
      why: 'The visible half of the index cannot rise without this, and it is the cheapest action in the product — one dropdown.',
    },
    'move.logRecognition': {
      title: 'Who mentioned you from outside?',
      why: 'External recognition is the one layer you cannot move alone. A small mention counts.',
    },
    'move.deepenEvidence': {
      title: 'Strengthen evidence you already hold',
      why: 'You have something of every type, but none of it is strong enough to carry the weight. A date, a name, a number or a link on an existing piece is worth more than a new one.',
    },
    'move.askPlainly': {
      title: 'The post was read. It asked for nothing.',
      why:
        'People responded to what you published and nobody got in touch. That is not an evidence ' +
        'gap, it is an ending — the text stops without saying what can be done with you. Publish ' +
        'your next strongest piece with one closing line.',
    },
    'move.strongerEvidence': {
      title: 'No response and no inbound. It is the evidence.',
      why:
        'You published, the reach happened, and the response was weak. More of the same will not ' +
        'change that — go through the inventory and pick the piece with the strongest number, ' +
        'name or date you actually hold.',
    },
    'move.attributeConversion': {
      title: 'Mark where the inbound came from',
      why: 'You logged inbound without tying it to the post that produced it. Without that link nobody can tell you which of the things you published actually moves people.',
    },
    do: 'Do it',
    minutes: (n) => `~${n} min`,
  },

  mine: {
    title: 'Sources',
    subtitle: 'Every document is a container. Every line that comes out of it is evidence in its own right.',
    paste: 'Text',
    file: 'File',
    addSource: 'Add source',
    sample: 'Load sample',
    fileHint: 'TXT and MD supported. Files are read in the browser and sent nowhere.',
    sourcesCount: (n) => (n ? `${n} sources` : 'No sources yet'),
    run: 'Extract and rank evidence',
    remove: 'Remove',
    demoBadge: 'Demo',
    demoWarning: 'This is a sample. It is marked as demo, excluded from your score and never used for learning.',
  },

  position: {
    title: 'Positioning',
    subtitle: 'Every piece of evidence is ranked from here. Change this and the whole inventory re-ranks.',
    audience: 'Who you are talking to',
    audienceHint: 'Not "business owners". Who exactly, with what problem.',
    transformation: 'What changes for them',
    transformationHint: 'The state before, the state after.',
    claim: 'What you own',
    claimHint: 'The sentence you want said about you when you are not in the room.',
    offer: 'What you are offering now',
    offerHint: 'A service, a role, a type of project.',
    nonGoals: 'What you are not',
    nonGoalsHint: 'Saying what you do not do is differentiation. One per line.',
    offerCoupling: 'Coupling to the offer',
    nonGenericity: 'How non-generic it is',
    defensibility: 'How far others back this',
    defensibilityHint:
      'The one part of positioning you cannot raise by editing text. It rises when ' +
      'somebody else repeats your claim — a mention, a recommendation, a referral, an invitation.',
    rescore: 'Re-rank against this positioning',
    issues: 'Not sharp yet',
    issue: {
      'audience.missing': 'No audience defined. Ranking is partial without it.',
      'audience.vague': 'The audience is too general. Add who exactly and what hurts.',
      'transformation.missing': 'No change defined.',
      'transformation.vague': 'The change is vague. What is the before and the after.',
      'claim.missing': 'No central claim.',
      'claim.vague': 'The claim is too broad.',
      'offer.missing': 'Unclear what you offer.',
      filler: 'These are words everyone in your field uses. They separate you from nobody.',
      template: 'This is the "I help X do Y" template. It is familiar, so it is invisible.',
      'nonGoals.missing': 'You did not write what you are not. That is cheap differentiation.',
    },
    drift: {
      title: 'What produces inbound is not what you publish',
      body: (a, cShare, pShare) =>
        `${cShare}% of your inbound came from ${a} evidence — and it is only ${pShare}% of what ` +
        `you have published. That is a count over your own records, not an estimate.`,
    },
  },

  channels: {
    post: 'Post',
    comment: 'Comment',
    article: 'Article',
    profile: 'Profile',
    talk: 'Talk',
    casestudy: 'Case study',
  },

  inventory: {
    title: 'Evidence',
    filterAll: 'All',
    empty: 'No evidence here yet.',
    source: 'Source',
    strong: 'Strong',
    missing: 'What would strengthen it',
    detail: 'Detail',
    draft: 'Draft',
    pin: 'Pin',
    hide: 'Hide',
    restore: 'Restore',
    hidden: (n) => `${n} hidden`,
    decayed: 'after decay',
    stale: (d) => `about ${d} days before it loses value`,
    origin: { mined: 'Mined from a source', compounded: 'Created from a post that performed', manual: 'Entered manually' },
  },

  gaps: {
    otherPlays: (n) => `${n} more gaps, if you want to see them all`,
    collect: 'I have it — let me add it',
    bestOf: (best, need) => `Your strongest: ${best} · needs ${need}`,
    shortOfBar: (best, need) =>
      `You already hold evidence of this type, but it reaches ${best} and needs ${need}. Strengthening that one beats fetching another.`,

    title: 'What is missing',
    subtitle: 'A complete evidence case covers eight types. These are the ones you do not cover yet.',
    covered: 'Covered',
    notCovered: 'Missing',
    best: 'Your strongest',
    doThis: 'How to get it',
    effort: (n) => `~${n} min`,
    allCovered: 'All eight types are covered. That is rare.',
  },

  studio: {
    title: 'Draft',
    subtitle:
      'The evidence stays attached to the text. The check blocks numbers that are not in ' +
      'the evidence; it does not verify that the text itself is true.',
    pick: 'Pick evidence',
    angle: 'Angle',
    angles: {
      bare: 'Evidence only',
      context: 'With context',
      method: 'With the steps',
      question: 'With an open question',
    },
    anglesHint: 'The default adds no words of ours. The others add a short scaffold with a blank for you to fill.',
    authorship: (pct) => `${pct}% of this text is yours`,
    authorshipWarn:
      'A large share of this came from the tool. That is exactly what makes posts sound alike. Rewrite it in your own words.',
    blanks: 'There are blanks to fill in (______). Do not publish before you fill them.',
    cta: 'Ending',
    ctas: { none: 'None', discussion: 'Invite discussion', dm: 'Direct message', call: 'Call' },
    copy: 'Copy',
    copied: 'Copied',
    copyWithSources: 'Copy with sources',
    save: 'Save as draft',
    markPublished: 'I published this',
    channelLabel: 'Where this goes',
    channelHint:
      'A body of work that lives entirely in posts reads thin. A talk, an article or a case study counts differently.',
    urlLabel: 'Link to the post (optional)',
    chars: (n) => `${n} characters`,
    fold: 'Visible before "see more"',
    tooShort: 'Too short to carry evidence.',
    tooLong: 'Very long. Consider splitting.',
    grounded: 'Every number in the text appears in the evidence, as does every name we detected.',
    groundedPartial:
      'No numbers in the text are absent from the evidence. Names we cannot fully check here — read the text yourself and confirm every name in it appears in the evidence.',
    groundedCaveat:
      'The check compares numbers and names — it does not read the claim. A sentence with ' +
      'no number and no name passes it even if you invented the whole thing, and so does a ' +
      'correct number attached to the wrong claim. Only you can check that.',
    ungroundedEntities: (list) =>
      `Names we did not find in the evidence: ${list}. If they are correct, add them to the source. If not, remove them. This detection is approximate, so an ordinary word may be flagged.`,
    overreach:
      'There is inflated wording here. That is exactly what makes people stop believing a post. Take it out.',
    ungrounded: (list) =>
      `The text contains numbers absent from the evidence: ${list}. Fix it or add a source — otherwise this is no longer evidence.`,
    demoWarning: 'This evidence is marked as demo. Do not publish it as your own.',
    refine: 'Rewrite with a model',
    refining: 'Rewriting...',
    refineOff: 'Model rewriting is off. You can enable it in Settings.',
    refineFailed: 'The rewrite failed the grounding check and was rejected.',
  },

  measure: {
    title: 'Measure',
    subtitle: 'These numbers are what turn this from a ranker into something that learns. Without them it guesses, like everything else.',
    pending: (n) => (n === 1 ? 'One publication with no data' : `${n} publications with no data`),
    artifact: 'Publication',
    impressions: 'Impressions',
    reactions: 'Reactions',
    comments: 'Comments',
    substantive: 'Of those — real comments',
    substantiveHint: 'A sentence or more, not "agree" or an emoji.',
    saves: 'Saves',
    savesHint: 'LinkedIn does not always show this. If it is missing, skip it.',
    minimum: 'The minimum that works: impressions + reactions. The rest sharpens the picture, it does not gate it.',
    savedPartial: 'Saved. Without impressions this will not count toward reception.',
    shares: 'Shares',
    save: 'Save measurement',
    saved: 'Saved',
    empty: 'No numbers entered. Nothing to save.',
    needDetail: 'Add a note, or pick the post it came from.',
    noInbound: 'Nobody has been in touch yet',
    noInboundHint:
      'That is a legitimate answer and we record it. There is no point asking you the same question every week.',
    noInboundSaved: 'Recorded. We will ask again in about three weeks.',
    needWho: 'Say who, or add a link. Recognition with no source is not recognition.',
    paste: 'Paste the numbers from LinkedIn',
    pasteHint: 'Select the stats block on the post page, copy, and paste. We will pull the numbers out.',
    pasteAction: 'Extract numbers',
    pasteFailed: 'No numbers found in that text.',
    optional: 'Without impressions we cannot score how the post landed — the record counts toward cadence only.',
    conversions: 'What moved because of it',
    addConversion: 'Add inbound',
    fromNothing: 'Not from a specific post',
    attributionHint: 'If it came from a specific post, pick it. That is what lets the system tell you what actually works.',
    conversionTypes: {
      reply: 'Reply to an application',
      dm: 'Direct message',
      call: 'Intro call',
      interview: 'Interview',
      proposal: 'Proposal sent',
      offer: 'Job offer',
      deal: 'Deal closed',
    },
    recognitions: 'External recognition',
    addRecognition: 'Add recognition',
    recognitionTypes: {
      citation: 'Citation / mention',
      invite: 'Invitation to speak or take part',
      referral: 'Referral from someone',
      feature: 'Article or profile',
      endorsement: 'Endorsement',
    },
    by: 'Who',
    link: 'Link',
    note: 'Note',
    calibrationTitle: 'What your audience appears to reward',
    calibrationProvisional:
      'This is a hypothesis, not a finding. At this sample size some of the correlation is noise. It stabilises as you add measurements — until then, do not change strategy because of this row.',
    calibrationNeed: (n) => `${n} more measurements and we can tell you this from your data, not from an average.`,
    calibrationActive: (n) => `Based on ${n} of your own measurements.`,
    calibrationExcluded: 'Checkability and recency do not shift with performance — by design.',
    compounded: (n) => `${n} new pieces of evidence were created from posts that beat your baseline.`,
  },

  settings: {
    title: 'Settings',
    language: 'Language',
    data: 'Your data',
    dataBody: 'Everything is stored in this browser only. No server, no account. Clearing browser data deletes it all.',
    export: 'Export everything to a file',
    import: 'Import from a file',
    reset: 'Delete everything',
    resetConfirm: 'This deletes all evidence and measurements. There is no undo. Continue?',
    storageError: 'The browser cannot save. Storage may be full — export to a file.',
    llm: 'Model rewriting (optional)',
    llmBody:
      'You can connect an API key to rewrite drafts. Two warnings, both important: (1) enabling this sends the draft — and the evidence it is based on — to the external provider — that is text from the sources you pasted. It is the only time your material leaves this device. (2) This app has no server, so the key is stored in this browser and sent directly from it. That is not the security level of a server-side key — use a dedicated key with a low limit you can revoke.',
    refineDisclosure:
      'Rewriting sends the draft and its underlying evidence to the external provider you configured. Continue?',
    llmEnable: 'Enable rewriting',
    llmKey: 'API key',
    llmModel: 'Model',
    llmNever: 'The model never scores anything. Its output passes the same check: a number ' +
      'absent from the evidence is blocked, a name absent from it is only flagged — and in ' +
      'Hebrew the name detection is weakest. The model can add an employer, a client or a ' +
      'publication that was never there. Read what comes back.',
    reduceMotion: 'Reduce motion',
  },

  common: {
    close: 'Close',
    cancel: 'Cancel',
    back: 'Back',
    of: 'of',
    add: 'Add',
    remove: 'Remove',
    edit: 'Edit',
    save: 'Save',
    none: '—',
    optional: 'optional',
    confidence: 'Confidence',
    noData: 'No data',
  },
};
