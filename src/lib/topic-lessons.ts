export type TopicLesson = {
  title: string
  description: string
  durationMinutes?: number
  videoUrl?: string
  keyConcepts: string[]
}

const topicLessons: Record<string, TopicLesson> = {
  'accounting:analysis-and-interpretation-of-financial-statements': {
    title: 'Financial Statement Analysis',
    description: 'Learn how to calculate and interpret financial indicators before starting the missions.',
    durationMinutes: 12,
    // Add the published FAM YouTube lesson URL here when it is ready.
    videoUrl: 'https://youtu.be/j9EuCsNIMDo',
    keyConcepts: [
      'Calculate key financial indicators',
      'Interpret liquidity, profitability and solvency',
      'Use evidence to evaluate company performance'
    ]
  },
  'accounting:budgeting': {
    title: 'Budgeting',
    description: 'Learn how to prepare and interpret cash budgets and projected income statements.',
    durationMinutes: 15,
    videoUrl: 'https://youtu.be/MafIzj75Lh8',
    keyConcepts: ['Prepare cash budgets', 'Calculate projected receipts and payments', 'Interpret projected income and budget variances']
  },
  'accounting:cash-flow-statements': {
    title: 'Cash Flow Statements',
    description: 'Understand company cash flow statements through clear explanations and worked calculations.',
    durationMinutes: 15,
    videoUrl: 'https://youtu.be/x-SP2TpmvgE',
    keyConcepts: ['Classify operating, investing and financing activities', 'Calculate cash-flow amounts', 'Interpret changes in cash position']
  },
  'accounting:close-corporations': {
    title: 'Close Corporations',
    description: 'Review the key concepts, transactions and exam preparation required for close corporations.',
    durationMinutes: 15,
    videoUrl: 'https://youtu.be/InMPgYXHjJI',
    keyConcepts: ['Understand members and ownership', 'Record close-corporation transactions', 'Apply concepts to exam questions']
  },
  'accounting:companies-concepts-and-unique-transactions': {
    title: 'Companies: Concepts and Unique Transactions',
    description: 'Learn company concepts and the unique transactions required in Grade 12 Accounting.',
    durationMinutes: 15,
    videoUrl: 'https://youtu.be/i_Gf_ggurOE',
    keyConcepts: ['Understand company terminology', 'Record share and dividend transactions', 'Apply company concepts accurately']
  },
  'accounting:companies-final-accounts-and-financial-statements': {
    title: 'Companies: Final Accounts and Financial Statements',
    description: 'Prepare company final accounts and financial statements using accurate formats and calculations.',
    durationMinutes: 15,
    videoUrl: 'https://youtu.be/-cPMlKfpkdk',
    keyConcepts: ['Complete year-end adjustments', 'Prepare company financial statements', 'Apply correct presentation and calculations']
  },
  'accounting:cost-accounting-and-manufacturing': {
    title: 'Cost Accounting and Manufacturing',
    description: 'Understand manufacturing costs, cost accounts and the calculations used in exam questions.',
    durationMinutes: 15,
    videoUrl: 'https://youtu.be/WLwyrDxB0Sg',
    keyConcepts: ['Classify manufacturing costs', 'Calculate unit costs and break-even', 'Interpret manufacturing information']
  },
  'accounting:ethics': {
    title: 'Ethics',
    description: 'Apply ethical principles and internal-control thinking to realistic Accounting scenarios.',
    durationMinutes: 15,
    videoUrl: 'https://youtu.be/RvMMeykCa7g',
    keyConcepts: ['Identify ethical concerns', 'Explain consequences for stakeholders', 'Recommend appropriate corrective action']
  },
  'accounting:fixed-assets': {
    title: 'Fixed Assets',
    description: 'Master fixed-asset records, depreciation calculations and asset-disposal entries.',
    durationMinutes: 15,
    videoUrl: 'https://youtu.be/MoevJ1lvKlk',
    keyConcepts: ['Calculate depreciation', 'Record asset purchases and disposals', 'Complete fixed-asset notes and accounts']
  },
  'accounting:internal-control': {
    title: 'Internal Control',
    description: 'Understand internal-control principles and apply them to Grade 12 Accounting questions.',
    durationMinutes: 15,
    videoUrl: 'https://youtu.be/OM54AufRINI',
    keyConcepts: ['Identify control weaknesses', 'Explain internal-control principles', 'Recommend practical control measures']
  },
  'accounting:inventory-systems': {
    title: 'Inventory Systems',
    description: 'Understand inventory records, controls and calculations used in Grade 12 Accounting.',
    durationMinutes: 15,
    videoUrl: 'https://youtu.be/UferBAciSoc',
    keyConcepts: ['Understand inventory systems', 'Calculate and interpret inventory values', 'Apply stock-control procedures']
  },
  'accounting:published-financial-statements-and-audit-reports': {
    title: 'Published Financial Statements and Audit Reports',
    description: 'Interpret published financial statements and understand the purpose and wording of audit reports.',
    durationMinutes: 15,
    videoUrl: 'https://youtu.be/D7v-LjGmX9c',
    keyConcepts: ['Read published financial statements', 'Understand audit opinions', 'Evaluate governance and reporting information']
  },
  'accounting:reconciliations': {
    title: 'Reconciliations',
    description: 'Learn how to identify differences, update records and complete Accounting reconciliations.',
    durationMinutes: 15,
    videoUrl: 'https://youtu.be/4M8p3l6r-1o',
    keyConcepts: ['Compare internal and external records', 'Process outstanding items and corrections', 'Prepare accurate reconciliations']
  },
  'accounting:value-added-tax': {
    title: 'Value-Added Tax',
    description: 'Master VAT concepts, calculations and the accounting treatment of input and output tax.',
    durationMinutes: 15,
    videoUrl: 'https://youtu.be/7JnnecRArFY',
    keyConcepts: ['Distinguish input and output VAT', 'Calculate VAT-inclusive and VAT-exclusive amounts', 'Determine the VAT payable or refundable']
  },
  'agricultural-sciences:agricultural-marketing': {
    title: 'Agricultural Marketing',
    description: 'Understand agricultural markets, price formation and how farm products move from producers to consumers.',
    durationMinutes: 15,
    videoUrl: 'https://youtu.be/ucwzpLCJA0A',
    keyConcepts: ['Understand agricultural markets', 'Explain supply, demand and price formation', 'Evaluate marketing channels and cooperatives']
  },
  'agricultural-sciences:animal-nutrition': {
    title: 'Animal Nutrition',
    description: 'Learn how farm animals digest feed, absorb nutrients and use balanced rations before starting the missions.',
    durationMinutes: 15,
    videoUrl: 'https://youtu.be/o2tpgdkttfA',
    keyConcepts: [
      'Compare ruminant, monogastric and fowl digestion',
      'Understand nutrients, feeds and nutrient absorption',
      'Calculate digestibility, nutritive ratio and balanced rations'
    ]
  },
  'agricultural-sciences:animal-production-protection-and-control': {
    title: 'Animal Production, Protection and Control',
    description: 'Learn how production systems, animal health and preventative management support successful livestock farming.',
    durationMinutes: 15,
    videoUrl: 'https://youtu.be/5WehWvOkCVA',
    keyConcepts: ['Compare animal-production systems', 'Understand health, disease and immunity', 'Apply biosecurity and control measures']
  },
  'agricultural-sciences:animal-reproduction': {
    title: 'Animal Reproduction',
    description: 'Understand reproductive systems, hormones, fertilisation and reproductive technologies in farm animals.',
    durationMinutes: 15,
    videoUrl: 'https://youtu.be/iHwRXDsMzeY',
    keyConcepts: ['Understand reproductive anatomy and hormones', 'Explain the oestrus cycle and fertilisation', 'Evaluate reproductive technologies and fertility']
  },
  'agricultural-sciences:basic-agricultural-genetics': {
    title: 'Basic Agricultural Genetics',
    description: 'Learn the genetic principles used to understand inheritance and improve plants and farm animals.',
    durationMinutes: 15,
    videoUrl: 'https://youtu.be/m62R9iUTbIs',
    keyConcepts: ['Understand genes, alleles and inheritance', 'Complete genetic crosses', 'Apply selection and breeding principles']
  },
  'agricultural-sciences:production-factors': {
    title: 'Production Factors',
    description: 'Understand how land, labour, capital and management influence agricultural production and profitability.',
    durationMinutes: 15,
    videoUrl: 'https://youtu.be/uQEbjp5m3U4',
    keyConcepts: ['Explain the four production factors', 'Calculate costs, income and profit', 'Evaluate resource productivity and efficiency']
  },
  'business-studies:business-sectors-and-environments': {
    title: 'Business Environments',
    description: 'Understand the micro, market and macro business environments and how businesses respond to challenges.',
    durationMinutes: 30,
    videoUrl: 'https://youtu.be/uGiPkiMu-X4',
    keyConcepts: ['Compare the three business environments', 'Identify challenges in each environment', 'Apply business strategies to scenarios']
  },
  'computer-applications-technology:systems-technologies': {
    title: 'Systems Technologies',
    description: 'Review computer hardware, software, processing, storage and system performance before starting the missions.',
    durationMinutes: 30,
    videoUrl: 'https://youtu.be/IG0GyC8cQUo',
    keyConcepts: ['Understand hardware and software components', 'Compare storage and processing technologies', 'Evaluate system performance and user needs']
  },
  'consumer-studies:the-consumer': {
    title: 'The Consumer',
    description: 'Learn about consumer rights, responsibilities, decision-making and protection in the marketplace.',
    durationMinutes: 30,
    videoUrl: 'https://youtu.be/dDzmhbc4kLs',
    keyConcepts: ['Understand consumer rights and responsibilities', 'Make informed purchasing decisions', 'Apply consumer-protection principles']
  },
  'economics:circular-flow': {
    title: 'Circular Flow',
    description: 'Understand how households, businesses, government and the foreign sector interact in the economy.',
    durationMinutes: 30,
    videoUrl: 'https://youtu.be/nRnJW7jh9xo',
    keyConcepts: ['Identify participants in the circular flow', 'Explain real and money flows', 'Interpret injections, leakages and economic activity']
  },
  'english-home-language:reading-comprehension': {
    title: 'Reading Comprehension',
    description: 'Develop strategies for analysing texts, interpreting meaning and answering comprehension questions effectively.',
    durationMinutes: 30,
    videoUrl: 'https://youtu.be/OcsV3XSGE00',
    keyConcepts: ['Identify purpose, audience and tone', 'Distinguish literal and implied meaning', 'Support answers with textual evidence']
  },
  'english-first-additional-language:reading-comprehension': {
    title: 'Reading Comprehension',
    description: 'Build the reading and answering skills needed for English First Additional Language comprehension questions.',
    durationMinutes: 30,
    videoUrl: 'https://youtu.be/JMbbo2zg504',
    keyConcepts: ['Identify main ideas and supporting details', 'Answer literal and inferential questions', 'Use evidence and mark allocation effectively']
  },
  'geography:mid-latitude-cyclones': {
    title: 'Mid-Latitude Cyclones',
    description: 'Learn how mid-latitude cyclones form, develop and affect weather in South Africa.',
    durationMinutes: 30,
    videoUrl: 'https://youtu.be/orjaw2RgNEU',
    keyConcepts: ['Explain cyclone formation and development', 'Interpret fronts and associated weather', 'Analyse synoptic maps and satellite images']
  },
  'history:cold-war': {
    title: 'The Cold War',
    description: 'Explore the origins, major events and consequences of the Cold War while developing exam-answering skills.',
    durationMinutes: 30,
    videoUrl: 'https://youtu.be/VsMxce2y-iI',
    keyConcepts: ['Compare capitalism and communism', 'Explain major Cold War events', 'Analyse sources and structure historical arguments']
  },
  'information-technology:software-development': {
    title: 'Software Development',
    description: 'Review problem-solving, programming structures, object-oriented concepts, testing and debugging.',
    durationMinutes: 30,
    videoUrl: 'https://youtu.be/fXtXoH9-Dmc',
    keyConcepts: ['Design algorithms and trace solutions', 'Apply programming and object-oriented concepts', 'Test, debug and improve code']
  },
  'life-orientation:development-of-the-self': {
    title: 'Development of the Self in Society',
    description: 'Develop practical skills for self-awareness, healthy relationships, decision-making and managing challenges.',
    durationMinutes: 30,
    videoUrl: 'https://youtu.be/xfUY0RxPXhE',
    keyConcepts: ['Strengthen self-awareness and resilience', 'Manage stress and relationships responsibly', 'Apply decision-making and goal-setting skills']
  },
  'life-sciences:dna-structure': {
    title: 'DNA Structure',
    description: 'Understand the structure, location and functions of DNA and the process of DNA replication.',
    durationMinutes: 30,
    videoUrl: 'https://youtu.be/CV8c4Ou0x1o',
    keyConcepts: ['Describe nucleotides and the DNA double helix', 'Explain complementary base pairing', 'Understand DNA replication and its importance']
  },
  'mathematical-literacy:finance': {
    title: 'Finance',
    description: 'Apply financial concepts and calculations to budgets, banking, interest, inflation and real-world scenarios.',
    durationMinutes: 30,
    videoUrl: 'https://youtu.be/1m0xVOE7Zzc',
    keyConcepts: ['Work with income, expenses and budgets', 'Calculate interest, tariffs and percentage change', 'Interpret financial tables and statements']
  },
  'mathematics:patterns-and-sequences': {
    title: 'Patterns and Sequences',
    description: 'Learn how to recognise and solve arithmetic, geometric and quadratic number patterns and series.',
    durationMinutes: 30,
    videoUrl: 'https://youtu.be/use16fvPr0g',
    keyConcepts: ['Solve arithmetic and geometric sequences', 'Calculate finite and infinite series', 'Analyse quadratic number patterns']
  },
  'physical-sciences:momentum-and-impulse': {
    title: 'Momentum and Impulse',
    description: 'Master momentum, impulse, collisions and conservation calculations through worked exam-style examples.',
    durationMinutes: 30,
    videoUrl: 'https://youtu.be/YQZIt2q4GMo',
    keyConcepts: ['Calculate momentum and impulse', 'Apply conservation of linear momentum', 'Interpret collisions and force-time graphs']
  },
  'tourism:tourist-attractions': {
    title: 'Tourist Attractions',
    description: 'Identify important tourist attractions and understand the factors that make attractions successful and sustainable.',
    durationMinutes: 30,
    videoUrl: 'https://youtu.be/gWKgSUsBpMg',
    keyConcepts: ['Identify and locate major attractions', 'Explain visitor appeal and success factors', 'Apply responsible tourism principles']
  }
}

export function getTopicLesson(subjectId: string, topicId: string, topicName: string): TopicLesson
export function getTopicLesson(subjectId: string, topicId: string): TopicLesson | undefined
export function getTopicLesson(subjectId: string, topicId: string, topicName?: string): TopicLesson | undefined {
  const canonicalTopic = subjectId === 'accounting' && topicId === 'vat' ? 'value-added-tax' : topicId
  const publishedLesson = topicLessons[`${subjectId}:${canonicalTopic}`]
  if (publishedLesson) return publishedLesson
  if (!topicName) return undefined

  return {
    title: topicName,
    description: `Review worked examples for ${topicName}, then practise with the missions.`,
    keyConcepts: [
      `Understand the key concepts in ${topicName}`,
      'Apply your knowledge to Grade 12 questions',
      'Prepare for Foundation, Application and Exam Practice missions'
    ]
  }
}

export function getYouTubeEmbedUrl(videoUrl?: string): string | undefined {
  if (!videoUrl) return undefined

  try {
    const url = new URL(videoUrl)
    const videoId = url.hostname.includes('youtu.be')
      ? url.pathname.slice(1)
      : url.searchParams.get('v') || url.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1]

    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : undefined
  } catch {
    return undefined
  }
}
