// Everything on the site comes from this file. Edit freely.

export const content = {
  name: 'Ananya Pandey',
  first: 'Ananya',
  role: 'Associate AI Engineer · neuro & BCI',
  location: 'Hyderabad, India',
  email: 'pandeyananya321@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/ananya-pandey-782962250',
    github: 'https://github.com/cation21',
    cv: `${import.meta.env.BASE_URL}cv.pdf`, // drop your CV at public/cv.pdf
    substack: 'https://annexplorer.substack.com', // the Blog page lists its latest posts
  },
  photo: `${import.meta.env.BASE_URL}me.jpg`, // drop a photo at public/me.jpg; it gets the duotone treatment automatically

  about: [
    "I'm Ananya, and I'm intrigued by attention: the mechanism in the brain, and the one in computers. I'm a computer science graduate working as an Associate AI Engineer on weekdays, and doing independent neuroscience research when my nocturnal side takes over. I'm pivoting to brain–computer interfaces.",
    'At Quadratyx I work on contrastive learning models and an AI guardrails API. Before that I was a Data Scientist Trainee, where I built mutual fund recommendation and credit card fraud detection models.',
    'I have always been keen about Neuroscience and have used my technical skills in analyzing EEG and fMRI datasets. I re-analysed recordings from 94 meditators to pull apart periodic and aperiodic gamma activity, and presented it as a poster at Cutting Gardens 2026, IIT Mandi.',
    'I am now working on understanding attention mechanism in the brain and its applications in BCI. I am also interested in trustworthy AI, and have worked on sovereign intelligence architectures and decentralised systems.',
  ],

  education: [
    {
      when: '2022 ♪ 2026',
      title: 'B.Tech, Computer Science & Engineering (AI/ML)',
      org: 'Amity University Rajasthan, Jaipur',
      points: [
        'CGPA 9.0 / 10.',
        'Coursework: Machine Learning, Artificial Intelligence, Statistics and Probability, Data Mining, Data Structures and Algorithms.',
        'Dr Ashok K Chauhan Scholarship (merit award).',
      ],
    },
    {
      when: '2023 ♪ 2025',
      title: 'Minor in English Literature',
      org: 'Amity University Rajasthan, alongside the B.Tech',
      points: [
        'Courses: Indian Short Fiction, Postcolonial Literature, African-American Writing, Women’s Writing in the Nineteenth and Twentieth Centuries, and American Literature.',
      ],
    },
    {
      when: '2019 ♪ 2021',
      title: 'Intermediate (Class XII): Maths, Physics, Chemistry',
      org: 'NRI Junior College · Board of Intermediate Education, Andhra Pradesh',
      points: ['967 / 1000 (96.7%), Grade A. Full marks in Mathematics A and B, and in the Physics and Chemistry practicals.'],
    },
    {
      when: '2019',
      title: 'Secondary School Certificate (Class X)',
      org: 'Siddartha High School, Srikakulam · Board of Secondary Education, Andhra Pradesh',
      points: ['GPA 10.0 / 10, with the top grade (A1) in every subject.'],
    },
  ],

  // The first is Ananya's pick and is shown large; the rest are a starter set to replace with your own.
  // `highlight` (optional) is a phrase inside `text` to light up.
  quotes: [
    {
      text: 'You, old woman, blessed with blindness, can speak the language that tells us what only language can: how to see without pictures. Language alone protects us from the scariness of things with no names. Language alone is meditation.',
      highlight: 'Language alone protects us from the scariness of things with no names.',
      who: 'Toni Morrison',
      source: 'Nobel Lecture, 1993',
    },
    { text: 'Everyone knows what attention is.', who: 'William James', source: 'The Principles of Psychology, 1890' },
    { text: 'The brain is wider than the sky.', who: 'Emily Dickinson', source: 'poem 632' },
    { text: 'We can only see a short distance ahead, but we can see plenty there that needs to be done.', who: 'Alan Turing', source: 'Computing Machinery and Intelligence, 1950' },
    { text: 'The question of whether a computer can think is no more interesting than the question of whether a submarine can swim.', who: 'Edsger W. Dijkstra', source: '1984' },
    { text: 'There is no greater agony than bearing an untold story inside you.', who: 'Maya Angelou', source: 'I Know Why the Caged Bird Sings, 1969' },
    { text: 'So we beat on, boats against the current, borne back ceaselessly into the past.', who: 'F. Scott Fitzgerald', source: 'The Great Gatsby, 1925' },
  ],

  research: [
    {
      when: 'Dec 2025 ♪ May 2026',
      title: 'Research Assistant',
      org: 'Autonomous Systems and AI Lab, Amity University Rajasthan',
      points: [
        'AI-driven point cloud processing pipeline for SLAM in dynamic environments, with thermal–LiDAR sensor fusion in ROS2 and Gazebo.',
        'Led to a first-author paper at ICNWC 2026 (IEEE Xplore, 12.5% acceptance). Supervisor: Dr Sunil Pathak.',
      ],
    },
    {
      when: 'Mar ♪ Apr 2026',
      title: 'Research Intern, AI Product',
      org: 'Niramaya Soul · remote',
      points: [
        'Worked on the ML model architecture for a mental health chatbot.',
        'Benchmarked ten Indian digital mental health platforms for the AI product team; received a letter of recommendation.',
      ],
    },
  ],

  work: [
    {
      when: 'Nov 2026 ♪ now',
      title: 'Associate AI Engineer',
      org: 'Quadratyx, Hyderabad',
      points: [
        'Contrastive learning models and an AI guardrails API.',
        'Contributed to a multi-LLM gateway (model routing, fallback, streaming, per-tenant cost tracking) and RAG ingestion (structure-aware chunking, pgvector / Azure AI Search with tenant isolation).',
        'Working on a no-code Agent Studio: RAG agents with cited answers, and an NL-to-SQL agent that generates read-only queries for business users.',
      ],
    },
    {
      when: 'Jul ♪ Oct 2026',
      title: 'Data Scientist Trainee',
      org: 'Quadratyx, Hyderabad',
      points: [
        "Mutual fund recommendation: regularised regression and reranking models that recommend funds outperforming an investor's existing holding in 95% of cases, deployed on AWS SageMaker.",
        'Credit card fraud detection: logistic regression, random forest and XGBoost on 20,000 transactions with a 1.7% positive rate, evaluated on PR-AUC with SMOTE, class weighting and threshold tuning.',
      ],
    },
    {
      when: 'Oct ♪ Nov 2025',
      title: 'Chief Research Officer',
      org: 'Aligned Sovereign Intelligence Institute (Aligned Institute)',
      points: [
        "Led the Institute's research and technical strategy, overseeing interdisciplinary teams on sovereign intelligence architectures and decentralised systems.",
        'Designed the governance frameworks for the Aligned Sovereign Intelligence Protocol (ASIP).',
        'Modelled the ASIP tokenomics architecture, deployed across agent-to-agent (A2A) network stacks including Circle Arc and Bridge Tempo.',
      ],
    },
    {
      when: 'Jun ♪ Jul 2025',
      title: 'AI/ML Intern',
      org: 'Edunet Foundation · remote',
      points: ['Salary prediction model with feature engineering and ensemble methods, evaluated with RMSE and R².'],
    },
  ],

  service: [
    {
      when: '2024 ♪ 2026',
      title: 'General Secretary',
      org: 'Avasa Foundation (registered NGO)',
      points: ["Recognised by the Founder-President for work that was instrumental in building Avasa's projects."],
    },
    {
      when: '2023 ♪ 2024',
      title: 'Vice-President',
      org: 'Avasa Foundation',
      points: ['Helped build the foundations of the NGO in its first year.'],
    },
    {
      when: '2023 ♪ 2026',
      title: 'NSS Volunteer',
      org: 'National Service Scheme, Amity University Rajasthan',
      points: [
        'Represented the university at the NSS National Integration Camp, Mullana, Haryana (14 to 20 February 2023).',
        'First place in the NSS speech competition on Rajasthan Mission 2030.',
        'Took part in the NSS Special Camp (January 2026), the 27th National Youth Festival (2024) and the 17th Tribal Youth Exchange, MY Bharat, Jaipur (2026).',
      ],
    },
  ],

  publications: [
    {
      tag: 'IEEE ICNWC 2026',
      title: 'Robust Robot Localization and Mapping in Challenging Spaces via Thermal-LiDAR Fusion',
      note: 'First author · oral presentation · 12.5% acceptance',
      link: 'https://ieeexplore.ieee.org/document/11517933',
    },
    {
      tag: 'Poster · Cutting Gardens 2026, IIT Mandi',
      title: 'Periodic and aperiodic components of meditation gamma',
      note: '64-channel EEG, 94 participants, 341 recordings',
      link: 'https://github.com/cation21/Gamma',
    },
  ],

  projects: [
    {
      title: 'Meditation gamma',
      motif: 'waves',
      color: 'wine',
      blurb: 'Open, unit-tested Python pipeline (MNE, ICA with ICLabel, specparam, IRASA) re-analysing EEG from 94 meditators, with mixed-effects models and a 48-specification multiverse analysis.',
      tags: ['EEG', 'MNE', 'Statistics'],
      link: 'https://github.com/cation21/Gamma',
    },
    {
      title: 'Thermal-LiDAR SLAM',
      motif: 'lidar',
      color: 'pink',
      blurb: 'Point cloud processing for localisation and mapping in dynamic environments, fusing thermal and LiDAR sensors. First-author paper at ICNWC 2026.',
      tags: ['ROS2', 'Gazebo', 'LiDAR'],
      link: 'https://ieeexplore.ieee.org/document/11517933',
    },
    {
      title: 'Brain MRI CNN',
      motif: 'grid',
      color: 'blush',
      blurb: 'Convolutional network that detects brain tumours in MRI scans, with a custom Dataset/DataLoader pipeline for normalisation, augmentation and batching.',
      tags: ['PyTorch', 'CNN', 'OpenCV'],
    },
    {
      title: 'The Property Doctors',
      freelance: true,
      motif: 'sun',
      color: 'blush',
      blurb: 'A 24-page site for a 24/7 property damage restoration firm in Southern California, built on a new brand, with a chatbot limited to 332 approved answers and two taps from panic to phone call.',
      tags: ['Web design', 'Chatbot', 'Local SEO'],
      link: 'https://mypdrs.com',
    },
    {
      title: 'Tread Global',
      freelance: true,
      motif: 'nodes',
      color: 'wine',
      blurb: 'A WordPress brochure rebuilt as one clear system: a 3D hero, a six-stage scroll story of the product journey, and a project-start flow. 31 routes redirected, built in 8 days.',
      tags: ['3D & motion', 'Web build'],
      link: 'https://tread-global.vercel.app',
    },
    {
      title: 'mnemoIQ',
      freelance: true,
      motif: 'jelly',
      color: 'peach',
      blurb: 'Four clashing page styles and a stock-video hero turned into one calm brand system for an AI product for engineering teams, with a 7-scene narrated demo. In progress.',
      tags: ['Brand system', 'Art direction', 'Motion'],
    },
  ],


  languages: [
    { name: 'Hindi', level: 'Native', value: 1 },
    { name: 'Telugu', level: 'Native', value: 1 },
    { name: 'English', level: 'Full professional', value: 0.95 },
  ],

  interests: ['EEG and brain signals', 'Computational neuroscience', 'Robot perception', 'Trustworthy AI', 'Debate'],

  // images live in public/gallery/
  gallery: [
    { src: 'icnwc-2026.jpg', title: 'ICNWC 2026', note: 'Paper presentation · SRM Institute, with IEEE Madras Section', kind: 'Research' },
    { src: 'isdd-2026-bits-pilani.jpg', title: 'ISDD 2026', note: 'Delegate · International Seminar on Digital Dreamscapes, BITS Pilani', kind: 'Research' },
    { src: 'wstem-2022-paper.jpg', title: 'WSTEM 2022', note: 'Paper presentation · Women and Careers in STEM', kind: 'Research' },
    { src: 'wstem-2022.jpg', title: 'WSTEM 2022', note: 'Certificate of appreciation · DST-PURSE', kind: 'Research' },
    { src: 'scholarship-2022.jpg', title: 'Ashok K Chauhan Scholarship', note: '100% merit scholarship · 2022–23', kind: 'Honours' },
    { src: 'scholarship-2023.jpg', title: 'Ashok K Chauhan Scholarship', note: '100% merit scholarship · 2023–24', kind: 'Honours' },
    { src: 'scinovation-2023-debate.jpg', title: 'Scinovation 2023', note: 'First place · debate competition', kind: 'Honours' },
    { src: 'ecell-esummit-2022.jpg', title: 'E-Summit 2022', note: 'First place, World Café · Amity Innovation Incubator', kind: 'Honours' },
    { src: 'nss-speech-2023.jpg', title: 'Rajasthan Mission 2030', note: 'First place · NSS speech competition', kind: 'Honours' },
    { src: 'renaissance-2024-adaa.jpg', title: 'Renaissance 2024', note: 'Prize winner, Adaa · JECRC', kind: 'Honours' },
    { src: 'avasa-general-secretary.jpg', title: 'Avasa Foundation', note: 'General Secretary · 2024–2026', kind: 'Leadership' },
    { src: 'avasa-vice-president.jpg', title: 'Avasa Foundation', note: 'Vice-President · 2023–2024', kind: 'Leadership' },
    { src: 'nss-national-integration-camp-2023.jpg', title: 'NSS National Integration Camp', note: 'Mullana, Haryana · February 2023', kind: 'Leadership' },
    { src: 'nss-special-camp-2026.jpg', title: 'NSS Special Camp', note: 'Amity University Rajasthan · January 2026', kind: 'Leadership' },
    { src: 'tribal-youth-exchange-2026.jpg', title: '17th Tribal Youth Exchange', note: 'MY Bharat, Jaipur · January 2026', kind: 'Leadership' },
    { src: 'national-youth-festival-2024.jpg', title: '27th National Youth Festival', note: 'Youth Convention · 2024', kind: 'Leadership' },
    { src: 'military-training-camp-2025.jpg', title: 'Green Horns Military Training Camp', note: 'Amity · March 2025', kind: 'Leadership' },
    { src: 'scinovation-2023-volunteer.jpg', title: 'Scinovation 2023', note: 'Volunteer', kind: 'Leadership' },
    { src: 'odyssey-2023.jpg', title: 'Odyssey 2023', note: 'Certificate of appreciation · techno-cultural fest', kind: 'Leadership' },
  ],

  facts: [
    'Your brain is about 2% of your body weight but uses roughly 20% of its energy at rest.',
    'There are around 86 billion neurons in the human brain.',
    "The cerebellum is small, yet it holds roughly 80% of the brain's neurons.",
    'Brain tissue has no pain receptors, which is why some brain surgery is done with the patient awake.',
    'Each time you recall a memory it becomes briefly editable again. This is called reconsolidation.',
    'London taxi drivers, who memorise thousands of streets, were found to have a larger posterior hippocampus.',
    "Jellyfish have no brain at all, just a diffuse nerve net. They've managed fine for over 500 million years.",
  ],
};
