import { DiagnosticQuestion, PracticeQuestion, StudentProfile, PeerUser, RealWorldExample, PracticalVideo } from './types';

export const initialStudent: StudentProfile = {
  id: 'offline-demo-student',
  name: 'Aarav Sharma',
  nameHi: 'आरव शर्मा',
  rollNo: '14',
  className: 'Class 7B',
  samagraId: '99401284',
  udiseCode: '07010204501',
  schoolName: 'Govt Boys Sr. Sec. School, Sector 4',
  schoolZone: 'Zone 07, Directorate of Education',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAH-Hut6IpQ2wCPfzTl4xexhSels66AsRhGbHwWiZ0Q5YiE7x5oVj_kK14FMhAlTKJ_KCFpIq_XYPKJFAzFzmFIta8X2FT_5n6YZKAB8vwvJ44TNxAR0PrXoy42LtHHPUDX2xH3PkE7QCxs64mDbp4-_3MYdwLjmIiUqV6p6E8RECfmcA_UUG4IN6E7JJ1sHpI5FCFUkPZcvSw8WBRE8Umt5yoAzMcsHKYvTThTNsrXvAN9fjMTyqFirg',
  level: 8,
  currentXp: 680,
  targetXp: 800,
  streakDays: 5,
};

export const mockStudentProfile = initialStudent;

export const robotMascotUrl =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBwP_8lwIHQwl7kZrq3Q-zT4exON4RRxyxZOLunuM08SBy4QGDhj_Ylk9NDjeoS6Y5TCxT6qNN0tV5h83Ak-_9cwsPmXeP5jE1U588AsRXzokIggc1P7BKxNm5ty9ScaPubtkjpcVMNN83OwuKT-2W9BQLcV0NF8xfqYyqP8qDAxWm8JoW-_lY3GxonWDg2TLnMcotJXoz4aHCKgFfSVy9Yq-1LBt9QqHe12jNcH8BJ_v9EZvLLy0DJqw';

export const brandLogoUrl = '/logo.svg';

export const diagnosticQuestionsData: DiagnosticQuestion[] = [
  {
    id: 1, topic: 'Integers', topicHi: 'पूर्णांक', badge: 'Application • अनुप्रयोग',
    question: 'A temperature is -6°C in the morning. It rises by 11°C and then falls by 4°C. What is the final temperature?',
    questionHi: 'सुबह तापमान -6°C है। यह 11°C बढ़ता है और फिर 4°C घटता है। अंतिम तापमान क्या होगा?',
    options: ['1°C', '3°C', '-1°C', '9°C'], correctIndex: 0,
    explanation: '-6 + 11 - 4 = 1°C.', explanationHi: '-6 + 11 - 4 = 1°C।',
  },
  {
    id: 2, topic: 'Integers', topicHi: 'पूर्णांक', badge: 'Reasoning • तर्क',
    question: 'Which expression has the greatest value?',
    questionHi: 'निम्न में से किस व्यंजक का मान सबसे बड़ा है?',
    options: ['-3 × 4', '-18 + 5', '7 - 15', '-2 × (-5)'], correctIndex: 3,
    explanation: 'The values are -12, -13, -8 and 10. So -2 × (-5) is greatest.', explanationHi: 'मान -12, -13, -8 और 10 हैं। इसलिए -2 × (-5) सबसे बड़ा है।',
  },
  {
    id: 3, topic: 'Fractions', topicHi: 'भिन्न', badge: 'Multi-step • बहु-चरण',
    question: 'Riya drinks 3/8 L of water in the morning and 1/4 L in the afternoon. How much more is needed to reach 1 L?',
    questionHi: 'रिया सुबह 3/8 L और दोपहर में 1/4 L पानी पीती है। 1 L पूरा करने के लिए कितना और चाहिए?',
    options: ['1/8 L', '3/8 L', '5/8 L', '1/2 L'], correctIndex: 1,
    explanation: '1/4 = 2/8, so she drank 5/8 L. 1 - 5/8 = 3/8 L.', explanationHi: '1/4 = 2/8, इसलिए कुल 5/8 L। 1 - 5/8 = 3/8 L।',
  },
  {
    id: 4, topic: 'Fractions', topicHi: 'भिन्न', badge: 'Comparison • तुलना',
    question: 'Which is greater, 5/6 or 7/9, and by how much?',
    questionHi: '5/6 और 7/9 में कौन बड़ा है और कितना बड़ा है?',
    options: ['5/6 by 1/18', '7/9 by 1/18', '5/6 by 1/9', 'They are equal'], correctIndex: 0,
    explanation: '5/6 = 15/18 and 7/9 = 14/18, so the difference is 1/18.', explanationHi: '5/6 = 15/18 और 7/9 = 14/18, इसलिए अंतर 1/18 है।',
  },
  {
    id: 5, topic: 'LCM & Factors', topicHi: 'ल.स.प. और गुणनखंड', badge: 'Problem Solving • समस्या समाधान',
    question: 'Two bells ring every 6 minutes and 8 minutes. If they ring together at 10:00, when will they next ring together?',
    questionHi: 'दो घंटियां हर 6 और 8 मिनट में बजती हैं। 10:00 बजे साथ बजने के बाद अगली बार कब साथ बजेंगी?',
    options: ['10:14', '10:24', '10:36', '10:48'], correctIndex: 1,
    explanation: 'LCM(6, 8) = 24 minutes, so the next time is 10:24.', explanationHi: '6 और 8 का LCM 24 है, इसलिए अगली बार 10:24 बजे।',
  },
  {
    id: 6, topic: 'LCM & Factors', topicHi: 'ल.स.प. और गुणनखंड', badge: 'Reasoning • तर्क',
    question: 'A number is divisible by both 12 and 18. What is the smallest possible positive number?',
    questionHi: 'एक संख्या 12 और 18 दोनों से विभाज्य है। सबसे छोटी धनात्मक संख्या कौन-सी है?',
    options: ['24', '30', '36', '54'], correctIndex: 2,
    explanation: 'The smallest common multiple of 12 and 18 is 36.', explanationHi: '12 और 18 का सबसे छोटा उभयनिष्ठ गुणज 36 है।',
  },
  {
    id: 7, topic: 'Percentages', topicHi: 'प्रतिशत', badge: 'Real-world • वास्तविक जीवन',
    question: 'A school bag costs ₹800. It is discounted by 15%. What is the sale price?',
    questionHi: 'एक स्कूल बैग की कीमत ₹800 है। उस पर 15% छूट है। बिक्री मूल्य क्या होगा?',
    options: ['₹680', '₹700', '₹720', '₹760'], correctIndex: 0,
    explanation: '15% of 800 = 120. Sale price = 800 - 120 = ₹680.', explanationHi: '800 का 15% = 120। बिक्री मूल्य = 800 - 120 = ₹680।',
  },
  {
    id: 8, topic: 'Percentages', topicHi: 'प्रतिशत', badge: 'Reverse Percentage • उल्टा प्रतिशत',
    question: 'After a 20% discount, a notebook costs ₹240. What was its original price?',
    questionHi: '20% छूट के बाद एक नोटबुक ₹240 की है। उसकी मूल कीमत क्या थी?',
    options: ['₹288', '₹300', '₹320', '₹360'], correctIndex: 1,
    explanation: '₹240 is 80% of the original price. 240 ÷ 0.8 = ₹300.', explanationHi: '₹240 मूल कीमत का 80% है। 240 ÷ 0.8 = ₹300।',
  },
  {
    id: 9, topic: 'Ratio & Proportion', topicHi: 'अनुपात व समानुपात', badge: 'Scaling • अनुपात बढ़ाना',
    question: 'The ratio of boys to girls is 3:5. If there are 24 boys, how many girls are there?',
    questionHi: 'लड़कों और लड़कियों का अनुपात 3:5 है। यदि 24 लड़के हैं, तो कितनी लड़कियां हैं?',
    options: ['32', '36', '40', '45'], correctIndex: 2,
    explanation: '24 ÷ 3 = 8. Multiply the girls part: 5 × 8 = 40.', explanationHi: '24 ÷ 3 = 8। लड़कियों का भाग 5 × 8 = 40।',
  },
  {
    id: 10, topic: 'Ratio & Proportion', topicHi: 'अनुपात व समानुपात', badge: 'Application • अनुप्रयोग',
    question: 'A recipe uses flour and sugar in the ratio 4:1. If 600 g of flour is used, how much sugar is needed?',
    questionHi: 'एक रेसिपी में आटे और चीनी का अनुपात 4:1 है। 600 g आटा हो तो कितनी चीनी चाहिए?',
    options: ['100 g', '120 g', '150 g', '240 g'], correctIndex: 1,
    explanation: '600 ÷ 4 = 150 g per ratio part; sugar is 1 part, so 150 g.', explanationHi: '600 ÷ 4 = 150 g प्रति भाग; चीनी 1 भाग है, इसलिए 150 g।',
  },
  {
    id: 11, topic: 'Geometry', topicHi: 'ज्यामिति', badge: 'Multi-step • बहु-चरण',
    question: 'A rectangle is 12 m long and 7 m wide. A 2 m wide gate is left unfenced. How much fencing is needed?',
    questionHi: 'एक आयत 12 m लंबा और 7 m चौड़ा है। 2 m चौड़ा गेट खुला छोड़ा गया है। कितनी बाड़ चाहिए?',
    options: ['36 m', '38 m', '40 m', '42 m'], correctIndex: 0,
    explanation: 'Perimeter = 2(12+7) = 38 m. Subtract 2 m for the gate: 36 m.', explanationHi: 'परिमाप = 2(12+7) = 38 m। 2 m गेट घटाने पर 36 m।',
  },
  {
    id: 12, topic: 'Geometry', topicHi: 'ज्यामिति', badge: 'Area & Reasoning • क्षेत्रफल',
    question: 'A square has area 144 cm². What is its perimeter?',
    questionHi: 'एक वर्ग का क्षेत्रफल 144 cm² है। उसका परिमाप क्या होगा?',
    options: ['24 cm', '36 cm', '48 cm', '72 cm'], correctIndex: 2,
    explanation: 'Side = √144 = 12 cm. Perimeter = 4 × 12 = 48 cm.', explanationHi: 'भुजा = √144 = 12 cm। परिमाप = 4 × 12 = 48 cm।',
  },
];

export const practiceQuestionsData: PracticeQuestion[] = [
  { step: 1, topic: 'Fractions', title: 'QUESTION 1 • TWO-STEP FRACTION', titleHi: 'चरण 1 • दो-चरणीय भिन्न', question: 'Solve: 3/4 - 2/3 + 1/6 = ?', questionHi: 'हल करें: 3/4 - 2/3 + 1/6 = ?', options: ['1/4', '5/12', '1/3', '7/12'], correctIndex: 0, hint: 'Use denominator 12: 9/12 - 8/12 + 2/12 = 3/12 = 1/4.', hintHi: 'हर 12 लें: 9/12 - 8/12 + 2/12 = 3/12 = 1/4।' },
  { step: 2, topic: 'Fractions', title: 'QUESTION 2 • FRACTION OF A QUANTITY', titleHi: 'चरण 2 • मात्रा का भिन्न', question: 'A tank is 3/5 full. If 1/4 of the water currently in it is used, what fraction of the tank remains filled?', questionHi: 'एक टंकी 3/5 भरी है। यदि उसमें मौजूद पानी का 1/4 उपयोग हो जाए, तो टंकी का कितना भाग भरा रहेगा?', options: ['9/20', '1/2', '7/20', '3/10'], correctIndex: 0, hint: 'Used = 1/4 × 3/5 = 3/20. Remaining = 12/20 - 3/20 = 9/20.', hintHi: 'उपयोग = 1/4 × 3/5 = 3/20। शेष = 12/20 - 3/20 = 9/20।' },
  { step: 3, topic: 'Fractions', title: 'QUESTION 3 • COMPARE AND REASON', titleHi: 'चरण 3 • तुलना और तर्क', question: 'Which is closest to 1: 7/8, 5/6, 11/12, or 3/4?', questionHi: 'इनमें से 1 के सबसे करीब कौन है: 7/8, 5/6, 11/12 या 3/4?', options: ['7/8', '5/6', '11/12', '3/4'], correctIndex: 2, hint: 'Compare the gaps from 1: 1/8, 1/6, 1/12 and 1/4. The smallest gap is 1/12.', hintHi: '1 से अंतर देखें: 1/8, 1/6, 1/12 और 1/4। सबसे छोटा अंतर 1/12 है।' },
  { step: 4, topic: 'Fractions', title: 'QUESTION 4 • REAL-LIFE MIX', titleHi: 'चरण 4 • वास्तविक जीवन', question: 'A recipe needs 2/3 cup oil for one batch. How much oil is needed for 1 1/2 batches?', questionHi: 'एक रेसिपी के लिए 2/3 कप तेल चाहिए। 1 1/2 बैच के लिए कितना तेल चाहिए?', options: ['1 cup', '1 1/6 cups', '1 1/3 cups', '1 1/2 cups'], correctIndex: 0, hint: '2/3 × 3/2 = 1 cup.', hintHi: '2/3 × 3/2 = 1 कप।' },
  { step: 5, topic: 'Fractions', title: 'QUESTION 5 • CHALLENGE', titleHi: 'चरण 5 • चुनौती', question: 'A student solves 3/5 of a worksheet on Monday and 1/4 of the whole worksheet on Tuesday. What fraction is left?', questionHi: 'एक छात्र सोमवार को वर्कशीट का 3/5 और मंगलवार को पूरी वर्कशीट का 1/4 हल करता है। कितना भाग बाकी है?', options: ['3/20', '7/20', '9/20', '1/5'], correctIndex: 0, hint: '3/5 = 12/20 and 1/4 = 5/20. Solved = 17/20, so 3/20 remains.', hintHi: '3/5 = 12/20 और 1/4 = 5/20। हल = 17/20, इसलिए 3/20 बाकी।' },
  { step: 6, topic: 'Fractions', title: 'QUESTION 6 • MASTERY CHECK', titleHi: 'चरण 6 • निपुणता जांच', question: 'Which expression equals 5/6?', questionHi: 'निम्न में से कौन-सा व्यंजक 5/6 के बराबर है?', options: ['1/2 + 1/3', '3/4 + 1/12', 'Both A and B', '2/3 + 1/4'], correctIndex: 2, hint: '1/2 + 1/3 = 5/6 and 3/4 + 1/12 = 9/12 + 1/12 = 10/12 = 5/6.', hintHi: '1/2 + 1/3 = 5/6 और 3/4 + 1/12 = 10/12 = 5/6। इसलिए A और B दोनों।' },
];

export const peerUsersData: PeerUser[] = [
  {
    id: 'p1',
    name: 'Pooja K.',
    className: 'Class 7A',
    status: 'Thinking',
    statusHi: 'सोच रही है',
    score: 340,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwI4D69tTzYLkcA9QBlH46RKjlAoVXhtAiyzszBLBqpJxKi8m8EEfhkfZUlHwdMD2hPexJU1t3eycD0lT9_7IRie7ug9pUqyKsG9VhhXwdPXwopbNY48sWARNjcY7aXPa-TRJMPk8TpL3Pk1mizCd1Uq4UEWLFx7cR-UeDNssQ-587mgddgA1R_Lao4NimgoMiOeLOabm74eqAtcUPilgm-UBJFZgUNt-7aRu-uVOV-w4ckPXd3Jm5yA',
    accuracy: '88%',
  },
  {
    id: 'p2',
    name: 'Rohan M.',
    className: 'Class 7B',
    status: 'Idle',
    statusHi: 'उपलब्ध',
    score: 310,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi-sg9c4likLayf6yBl5VfPdlZnHeHqAd6OdxHqtamoW7xTlYALIp26XEn0D9RPbSI6xu1T0RbrDRN6V003jbX-CqNs6CoRPLSFmK7wvkGdxYKqLI2Z97hlRntCLCnXaYsUfGB859zk7APvFfG6vW6SgHkdnW2HC-aAg43yLzj52q9H8dGPmI-nCHTvHkU0bZO6-L9NXOtcznxDD4qqMxnhmakULDWxPwZUudB8hcNHzCqZOylSj4RNw',
    accuracy: '84%',
  },
  {
    id: 'p3',
    name: 'Priya S.',
    className: 'Class 7A',
    status: 'Math 4★',
    statusHi: 'गणित 4★',
    score: 390,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUiQIo4pMFkVI8rSYEtCsSxOyZjE-FgSWrh6JBDQt6URc0Di4cWcG2HAZacGRdSzPZaTmNPa3sosDl9anY7GISJDl1r0LClJqsMUD7TFQmAFElm52FUSFAm993EgTl8Zn-Sj0mp-F0ag_CNS2d6yWGOmX88uPipFRywzsoVHw7o_WAobhQfZvCTrv-w0cConZUkIy7tBaUxsEGKeH-73zPD9UAgbLBXkW8GpYhRiotBSS5Yl3BuXMw0g',
    accuracy: '92%',
  },
  {
    id: 'p4',
    name: 'Vikram D.',
    className: 'Class 8C',
    status: 'Ready',
    statusHi: 'तैयार',
    score: 360,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlZkIXIfqN8AflPNZA3LjastI6E4SO8-ssWw1DL6rg-WK3kPtV0MSSZGvE6L8NL_EOpsXGBslGhx-UT_vRlAR9cdehtDmjNRInEEEFO67DTiga64KEPZFydJFv1VON-hutyokPwzRcV724ABqcSQlrZZsTghbATIggNI0jZTHsSM_jq68b6TsV15n5E9TsG-E6JpuTSGojQEgyg976DGbVZ-YegY4eRL55bU5a07itiOQuq_k5m9ntLQ',
    accuracy: '87%',
  },
];

// Real-life applications linked to study topics, shown on the "Real Life" screen
// and inline inside Practice questions. Add more entries here as new topics/
// subjects are introduced — just reuse a matching `topic` string to link them.
export const realWorldExamplesData: RealWorldExample[] = [
  {
    id: 'rw1',
    videoId: 'v1',
    topic: 'Fractions',
    topicHi: 'भिन्न',
    category: 'Cooking & Kitchen',
    categoryHi: 'रसोई व खाना पकाना',
    icon: 'skillet',
    title: 'Halving a Roti Recipe',
    titleHi: 'रोटी की विधि आधी करना',
    scenario:
      'Amma\'s recipe makes 3/4 cup of atta dough for 4 rotis, but you only need 2 rotis today.',
    scenarioHi:
      'अम्मा की विधि में 4 रोटियों के लिए 3/4 कप आटा लगता है, पर आज सिर्फ 2 रोटियां बनानी हैं।',
    howItWorks:
      'You divide the fraction of flour by 2, the same way you divide fractions during Practice — find a common base, then split the parts evenly.',
    howItWorksHi:
      'आप आटे की भिन्न को 2 से भाग देते हैं — ठीक वैसे ही जैसे अभ्यास में भिन्नों को बांटा जाता है: पहले उभयनिष्ठ आधार लें, फिर भागों को बराबर बांटें।',
    example: '3/4 ÷ 2 = 3/8 cup of atta needed for 2 rotis.',
    exampleHi: '3/4 ÷ 2 = 2 रोटियों के लिए 3/8 कप आटा चाहिए।',
    xp: 15,
  },
  {
    id: 'rw2',
    videoId: 'v2',
    topic: 'Fractions',
    topicHi: 'भिन्न',
    category: 'Sharing & Fairness',
    categoryHi: 'बांटना व निष्पक्षता',
    icon: 'local_pizza',
    title: 'Splitting a Pizza Fairly',
    titleHi: 'पिज्जा को निष्पक्ष रूप से बांटना',
    scenario:
      'You and 2 friends want to share one pizza. Then a 4th friend joins — how does each share change?',
    scenarioHi:
      'आप और 2 दोस्त एक पिज्जा बांटना चाहते हैं। फिर एक चौथा दोस्त आ जाता है — अब हिस्सा कैसे बदलेगा?',
    howItWorks:
      'Each person\'s share is a fraction of the whole (1 ÷ number of people). Comparing 1/3 and 1/4 tells you who gets the bigger slice — exactly like comparing unlike fractions in Practice.',
    howItWorksHi:
      'हर व्यक्ति का हिस्सा पूरे का एक भिन्न भाग होता है (1 ÷ लोगों की संख्या)। 1/3 और 1/4 की तुलना करने से पता चलता है किसका हिस्सा बड़ा है — बिल्कुल जैसे अभ्यास में असमान भिन्नों की तुलना होती है।',
    example: '1/3 slice (3 people) is bigger than 1/4 slice (4 people).',
    exampleHi: '1/3 हिस्सा (3 लोग), 1/4 हिस्से (4 लोग) से बड़ा होता है।',
    xp: 15,
  },
  {
    id: 'rw3',
    videoId: 'v3',
    topic: 'Integers',
    topicHi: 'पूर्णांक',
    category: 'Money & Savings',
    categoryHi: 'पैसा व बचत',
    icon: 'savings',
    title: 'Tracking Pocket Money',
    titleHi: 'जेब खर्च का हिसाब रखना',
    scenario:
      'You had ₹50. You spent ₹80 on a gift (borrowing the rest), then earned ₹35 doing a chore.',
    scenarioHi:
      'आपके पास ₹50 थे। आपने एक उपहार पर ₹80 खर्च किए (बाकी उधार लिया), फिर एक काम करके ₹35 कमाए।',
    howItWorks:
      'Spending more than you have creates a negative balance — just like negative integers. Adding money later moves you back up the number line.',
    howItWorksHi:
      'जितना आपके पास है उससे ज्यादा खर्च करने पर ऋणात्मक शेष बनता है — ठीक ऋणात्मक पूर्णांकों की तरह। बाद में पैसे जुड़ने पर आप संख्या रेखा पर ऊपर बढ़ते हैं।',
    example: '50 − 80 = −30 (you owe ₹30), then −30 + 35 = +5 left.',
    exampleHi: '50 − 80 = −30 (₹30 उधार), फिर −30 + 35 = +5 बचे।',
    xp: 15,
  },
  {
    id: 'rw4',
    videoId: 'v4',
    topic: 'Integers',
    topicHi: 'पूर्णांक',
    category: 'Weather & Science',
    categoryHi: 'मौसम व विज्ञान',
    icon: 'device_thermostat',
    title: 'Reading Winter Temperatures',
    titleHi: 'सर्दियों का तापमान समझना',
    scenario:
      'A hill-station news report says the temperature was −4°C at night and rose by 9°C by noon.',
    scenarioHi:
      'एक पहाड़ी क्षेत्र की खबर में बताया गया कि रात में तापमान −4°C था और दोपहर तक 9°C बढ़ गया।',
    howItWorks:
      'Temperatures below zero are negative integers. "Rising" means adding a positive integer to a negative one — the same move you practice in integer addition.',
    howItWorksHi:
      'शून्य से नीचे तापमान ऋणात्मक पूर्णांक होता है। "बढ़ना" यानी ऋणात्मक संख्या में धनात्मक संख्या जोड़ना — ठीक जैसे पूर्णांक जोड़ के अभ्यास में करते हैं।',
    example: '−4 + 9 = +5°C by noon.',
    exampleHi: '−4 + 9 = दोपहर तक +5°C.',
    xp: 15,
  },
  {
    id: 'rw5',
    videoId: 'v5',
    topic: 'Percentages',
    topicHi: 'प्रतिशत',
    category: 'Shopping & Markets',
    categoryHi: 'खरीदारी व बाज़ार',
    icon: 'sell',
    title: 'Spotting the Best Diwali Discount',
    titleHi: 'दिवाली की सबसे अच्छी छूट पहचानना',
    scenario:
      'One shop offers 20% off a ₹500 kurta. Another offers "Buy 1 Get 1 at half price" on the same item.',
    scenarioHi:
      'एक दुकान ₹500 के कुर्ते पर 20% छूट देती है। दूसरी दुकान "एक खरीदें, दूसरा आधी कीमत पर पाएं" ऑफर देती है।',
    howItWorks:
      'Percentage off means subtracting a fraction (out of 100) of the price. Converting both offers into rupees saved lets you compare them fairly.',
    howItWorksHi:
      'छूट का मतलब है कीमत के 100 में से एक भाग घटाना। दोनों ऑफरों को बचत की रुपये राशि में बदलकर आप निष्पक्ष तुलना कर सकते हैं।',
    example: '20% of ₹500 = ₹100 saved on one kurta.',
    exampleHi: '₹500 का 20% = एक कुर्ते पर ₹100 की बचत।',
    xp: 20,
  },
  {
    id: 'rw6',
    videoId: 'v6',
    topic: 'Ratio & Proportion',
    topicHi: 'अनुपात व समानुपात',
    category: 'Travel & Speed',
    categoryHi: 'यात्रा व गति',
    icon: 'directions_bus',
    title: 'Planning a Bus Journey Home',
    titleHi: 'बस से घर जाने की योजना बनाना',
    scenario:
      'A bus covers 60 km in 1.5 hours. Your village is 90 km away — how long will the ride take?',
    scenarioHi:
      'एक बस 1.5 घंटे में 60 किमी की दूरी तय करती है। आपका गांव 90 किमी दूर है — यात्रा में कितना समय लगेगा?',
    howItWorks:
      'Speed is a ratio of distance to time. Keeping that ratio the same (proportion) lets you scale it up to find the time for a longer distance.',
    howItWorksHi:
      'गति, दूरी और समय का अनुपात है। इस अनुपात को समान रखते हुए (समानुपात) आप लंबी दूरी के लिए समय निकाल सकते हैं।',
    example: '60 km : 1.5 hr = 90 km : x → x = 2.25 hours.',
    exampleHi: '60 किमी : 1.5 घं॰ = 90 किमी : x → x = 2.25 घंटे।',
    xp: 20,
  },
  {
    id: 'rw7',
    topic: 'Geometry',
    topicHi: 'ज्यामिति',
    category: 'Home & Construction',
    categoryHi: 'घर व निर्माण',
    icon: 'square_foot',
    title: 'Buying Tiles for a Room Floor',
    titleHi: 'कमरे के फर्श के लिए टाइल खरीदना',
    scenario:
      'Your room is 4 m long and 3 m wide. The shopkeeper needs to know the floor area to sell you enough tiles.',
    scenarioHi:
      'आपका कमरा 4 मीटर लंबा और 3 मीटर चौड़ा है। दुकानदार को पर्याप्त टाइलें बेचने के लिए फर्श का क्षेत्रफल जानना होगा।',
    howItWorks:
      'Area of a rectangle (length × width) tells you exactly how much surface needs covering — the same formula used in Geometry practice questions.',
    howItWorksHi:
      'आयत का क्षेत्रफल (लंबाई × चौड़ाई) बताता है कि कितनी सतह ढकनी है — यही सूत्र ज्यामिति के अभ्यास प्रश्नों में उपयोग होता है।',
    example: '4 m × 3 m = 12 sq. m of tiles needed.',
    exampleHi: '4 मीटर × 3 मीटर = 12 वर्ग मीटर टाइलें चाहिए।',
    xp: 20,
    videoId: 'v7',
  },
  {
    id: 'rw8',
    topic: 'Percentages',
    topicHi: 'प्रतिशत',
    category: 'School & Exams',
    categoryHi: 'स्कूल व परीक्षा',
    icon: 'grade',
    title: 'Checking Your Exam Score',
    titleHi: 'परीक्षा का स्कोर जांचना',
    scenario:
      'You scored 18 out of 25 marks in a class test. Your friend wants to know your percentage.',
    scenarioHi:
      'कक्षा परीक्षा में आपको 25 में से 18 अंक मिले। आपका दोस्त प्रतिशत जानना चाहता है।',
    howItWorks:
      'Marks out of a total are a fraction — multiplying that fraction by 100 converts it into a percentage, the same conversion used in Percentages practice.',
    howItWorksHi:
      'कुल में से मिले अंक एक भिन्न होते हैं — उस भिन्न को 100 से गुणा करने पर प्रतिशत मिलता है, यही रूपांतरण प्रतिशत के अभ्यास में उपयोग होता है।',
    example: '(18 ÷ 25) × 100 = 72%.',
    exampleHi: '(18 ÷ 25) × 100 = 72%.',
    xp: 15,
    videoId: 'v8',
  },
  {
    id: 'rw9',
    topic: 'Geometry',
    topicHi: 'ज्यामिति',
    category: 'Home & Construction',
    categoryHi: 'घर व निर्माण',
    icon: 'fence',
    title: 'Fencing a Garden Patch',
    titleHi: 'बगीचे की बाड़ लगाना',
    scenario:
      'Papa wants to put a wire fence around a rectangular garden that is 5 m long and 3 m wide.',
    scenarioHi:
      'पापा एक आयताकार बगीचे के चारों ओर तार की बाड़ लगाना चाहते हैं, जो 5 मीटर लंबा और 3 मीटर चौड़ा है।',
    howItWorks:
      'The fence runs along all four sides, so you add up the perimeter (2 × length + 2 × width) — the same idea used for perimeter questions in Geometry practice.',
    howItWorksHi:
      'बाड़ चारों तरफ लगती है, इसलिए परिमाप जोड़ा जाता है (2 × लंबाई + 2 × चौड़ाई) — यही तरीका ज्यामिति अभ्यास के परिमाप प्रश्नों में उपयोग होता है।',
    example: '2 × (5 + 3) = 16 m of fencing needed.',
    exampleHi: '2 × (5 + 3) = 16 मीटर बाड़ चाहिए।',
    xp: 15,
    videoId: 'v9',
  },
  {
    id: 'rw10',
    topic: 'Ratio & Proportion',
    topicHi: 'अनुपात व समानुपात',
    category: 'Home & Construction',
    categoryHi: 'घर व निर्माण',
    icon: 'format_paint',
    title: 'Mixing Paint Colours',
    titleHi: 'पेंट के रंग मिलाना',
    scenario:
      'A shade of blue needs blue and white paint in the ratio 2:3. For a bigger wall, you need much more paint.',
    scenarioHi:
      'एक नीले रंग के शेड के लिए नीला और सफेद पेंट 2:3 के अनुपात में चाहिए। बड़ी दीवार के लिए ज्यादा पेंट चाहिए।',
    howItWorks:
      'To keep the same shade, both quantities must scale up by the same factor — this keeps the ratio equivalent, just like scaling ratios in Practice.',
    howItWorksHi:
      'वही शेड बनाए रखने के लिए दोनों मात्राओं को समान गुणक से बढ़ाना होता है — इससे अनुपात बराबर रहता है, ठीक जैसे अभ्यास में अनुपात बढ़ाया जाता है।',
    example: '2:3 scaled ×4 → 8 L blue : 12 L white.',
    exampleHi: '2:3 को ×4 से बढ़ाने पर → 8 लीटर नीला : 12 लीटर सफेद।',
    xp: 15,
    videoId: 'v10',
  },
];

// Short practical/explainer videos, downloadable for offline kiosk playback.
// videoUrl points at /public/videos — add real recorded clips there later
// using the same filenames, or add new entries with new files.
export const practicalVideosData: PracticalVideo[] = [
  {
    id: 'v1',
    topic: 'Fractions',
    topicHi: 'भिन्न',
    title: 'Halving a Roti Recipe',
    titleHi: 'रोटी की विधि आधी करना',
    description: 'A 90-second walkthrough of dividing a fraction of atta dough to cook for fewer people.',
    descriptionHi: 'कम लोगों के लिए आटे की भिन्न को बांटने का 90-सेकंड का वीडियो।',
    durationLabel: '1:30',
    sizeLabel: '4.8 MB',
    videoUrl: '/videos/fractions-roti.mp4',
    thumbIcon: 'skillet',
    thumbColor: '#0B5FA5',
  },
  {
    id: 'v2',
    topic: 'Fractions',
    topicHi: 'भिन्न',
    title: 'Splitting a Pizza Fairly',
    titleHi: 'पिज्जा को निष्पक्ष रूप से बांटना',
    description: 'See why 1/3 of a pizza is a bigger slice than 1/4, using a simple visual model.',
    descriptionHi: 'एक सरल चित्र से देखें कि पिज्जा का 1/3 हिस्सा 1/4 हिस्से से क्यों बड़ा है।',
    durationLabel: '1:45',
    sizeLabel: '5.1 MB',
    videoUrl: '/videos/fractions-pizza.mp4',
    thumbIcon: 'local_pizza',
    thumbColor: '#1877B0',
  },
  {
    id: 'v3',
    topic: 'Integers',
    topicHi: 'पूर्णांक',
    title: 'Tracking Pocket Money',
    titleHi: 'जेब खर्च का हिसाब रखना',
    description: 'How spending more than you have turns your balance negative, and how earning brings it back up.',
    descriptionHi: 'जरूरत से ज्यादा खर्च करने पर शेष ऋणात्मक कैसे होता है, और कमाई से वापस कैसे बढ़ता है।',
    durationLabel: '2:00',
    sizeLabel: '5.6 MB',
    videoUrl: '/videos/integers-money.mp4',
    thumbIcon: 'savings',
    thumbColor: '#0E7C61',
  },
  {
    id: 'v4',
    topic: 'Integers',
    topicHi: 'पूर्णांक',
    title: 'Reading Winter Temperatures',
    titleHi: 'सर्दियों का तापमान समझना',
    description: 'Adding a positive integer to a negative temperature to find the noon reading.',
    descriptionHi: 'ऋणात्मक तापमान में धनात्मक संख्या जोड़कर दोपहर का तापमान निकालना।',
    durationLabel: '1:20',
    sizeLabel: '4.3 MB',
    videoUrl: '/videos/integers-weather.mp4',
    thumbIcon: 'device_thermostat',
    thumbColor: '#0E8C71',
  },
  {
    id: 'v5',
    topic: 'Percentages',
    topicHi: 'प्रतिशत',
    title: 'Spotting the Best Diwali Discount',
    titleHi: 'दिवाली की सबसे अच्छी छूट पहचानना',
    description: 'Comparing a flat percentage-off deal against a "buy 1 get 1 half price" offer.',
    descriptionHi: 'सीधी प्रतिशत छूट की तुलना "एक खरीदें, दूसरा आधी कीमत पर पाएं" ऑफर से करना।',
    durationLabel: '2:10',
    sizeLabel: '6.0 MB',
    videoUrl: '/videos/percentages-shopping.mp4',
    thumbIcon: 'sell',
    thumbColor: '#B0631C',
  },
  {
    id: 'v6',
    topic: 'Ratio & Proportion',
    topicHi: 'अनुपात व समानुपात',
    title: 'Planning a Bus Journey Home',
    titleHi: 'बस से घर जाने की योजना बनाना',
    description: 'Scaling a speed ratio up to work out travel time for a longer distance.',
    descriptionHi: 'लंबी दूरी के लिए गति के अनुपात को बढ़ाकर यात्रा का समय निकालना।',
    durationLabel: '1:55',
    sizeLabel: '5.3 MB',
    videoUrl: '/videos/ratio-travel.mp4',
    thumbIcon: 'directions_bus',
    thumbColor: '#7A4FB5',
  },
  {
    id: 'v7',
    topic: 'Geometry',
    topicHi: 'ज्यामिति',
    title: 'Buying Tiles for a Room Floor',
    titleHi: 'कमरे के फर्श के लिए टाइल खरीदना',
    description: 'Using length × width to find floor area before buying tiles.',
    descriptionHi: 'टाइलें खरीदने से पहले लंबाई × चौड़ाई से फर्श का क्षेत्रफल निकालना।',
    durationLabel: '1:40',
    sizeLabel: '4.7 MB',
    videoUrl: '/videos/geometry-tiles.mp4',
    thumbIcon: 'square_foot',
    thumbColor: '#B0401C',
  },
  {
    id: 'v8',
    topic: 'Percentages',
    topicHi: 'प्रतिशत',
    title: 'Checking Your Exam Score',
    titleHi: 'परीक्षा का स्कोर जांचना',
    description: 'Converting 18 out of 25 marks into a percentage, step by step.',
    descriptionHi: '25 में से 18 अंकों को चरणबद्ध तरीके से प्रतिशत में बदलना।',
    durationLabel: '1:30',
    sizeLabel: '4.6 MB',
    videoUrl: '/videos/percentages-exam-score.mp4',
    thumbIcon: 'grade',
    thumbColor: '#0E7C61',
  },
  {
    id: 'v9',
    topic: 'Geometry',
    topicHi: 'ज्यामिति',
    title: 'Fencing a Garden Patch',
    titleHi: 'बगीचे की बाड़ लगाना',
    description: 'Adding up all 4 sides of a rectangle to find the perimeter for fencing.',
    descriptionHi: 'बाड़ के लिए आयत की चारों भुजाओं को जोड़कर परिमाप निकालना।',
    durationLabel: '1:30',
    sizeLabel: '4.0 MB',
    videoUrl: '/videos/geometry-garden-fence.mp4',
    thumbIcon: 'fence',
    thumbColor: '#0060A8',
  },
  {
    id: 'v10',
    topic: 'Ratio & Proportion',
    topicHi: 'अनुपात व समानुपात',
    title: 'Mixing Paint Colours',
    titleHi: 'पेंट के रंग मिलाना',
    description: 'Scaling a 2:3 paint ratio up to make a much bigger batch, keeping the shade the same.',
    descriptionHi: '2:3 पेंट अनुपात को बढ़ाकर बड़ी मात्रा बनाना, रंग वही रखते हुए।',
    durationLabel: '1:40',
    sizeLabel: '5.4 MB',
    videoUrl: '/videos/ratio-paint-mixing.mp4',
    thumbIcon: 'format_paint',
    thumbColor: '#7A4FB5',
  },
];
