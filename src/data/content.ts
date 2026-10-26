export const siteInfo = {
  name: 'DNYANIT BHUSARI',
  statement:
    "Hi There, I am an aspiring Full-Stack developer",
  email: 'dnyanitbhusari21@gmail.com',
  github: 'https://github.com/cosKord',
  githubHandle: 'github.com/cosKord',
};

export const education = {
  degree: 'B.Tech, Information Technology',
  school: 'KJ Somaiya School of Engineering',
  location: 'Mumbai',
  period: '2025 — Present',
};

export const experience = [
  {
    company: 'PCE Consulting & Engineers LLP',
    role: 'Web Dev Intern',
    period: 'Jul — Aug 2026',
    points: [
      'Improved frontend responsiveness and smoothness across the company HR dashboard',
      'Tested the HR dashboard for security vulnerabilities',
      'Worked directly with employee data',
      'Worked on company database connectivity',
    ],
  },
];

export const projects = [
  {
    name: 'ProStock-CRM',
    status: 'In progress',
    description: 'A CRM built to act as a digital ledger for invoices — tracking transactions between sellers and buyers and turning that data into insight, built for MSMEs.',
    tags: ['Next.js', 'React', 'MySQL'],
    repoUrl: 'https://github.com/cosKord/ProStock-CRM',
    liveUrl: '#',
  },
  {
    name: 'Intelligent-Escrow',
    status: 'In progress',
    description: 'An escrow system for financial transactions that pairs automated risk scoring with milestone and document/invoice verification, instead of leaving every step to manual sign-off.',
    tags: ['Next.js', 'Python', 'React'],
    repoUrl: '#',
    liveUrl: '#',
  },
  {
    name: 'Schedulr',
    status: 'In progress',
    description: 'A scheduling application which scrapes date and time data from emails and creates events in calender accordingly',
    tags: ['Next.js', 'JavaScript', 'Google-API'],
    repoUrl: 'https://github.com/AyushAnasane/Projekt',
    liveUrl: '#',
  },
];

export const stack = {
  Languages: ['C', 'C++', 'TypeScript', 'JavaScript', 'Python', 'Java', 'MySQL'],
  'Full Stack': ['React', 'Next.js', 'Tailwind CSS', 'Supabase'],
  Tools: ['Git', 'GitHub', 'Vercel', 'Vite'],
  Libraries: ['Pandas', 'NumPy', 'Scikit-learn'],
};

export type Interest = {
  title: string;
  description: string;
  images?: string[];
};

export const interests: Interest[] = [
  {
    title: 'Art',
    description: 'Sketching and painting when I need to think with my hands instead of a keyboard.',
    images: ['/interests/art-1.jpg', '/interests/art-2.jpg', '/interests/art-3.jpeg'],
  },
  {
    title: 'Photography',
    description: 'Street, film even pro  — it forces you to slow down and actually observe.',
    images: ['/interests/photography-1.jpg', '/interests/photography-2.jpg', '/interests/photography-3.jpg'],
  },
  {
    title: 'Astronomy',
    description: 'Amateur stargazing. Nothing much, just a telescope and clear skies make me happy.',
    images: ['/interests/astronomy-1.jpeg', '/interests/astronomy-2.jpeg'],
  },
  {
    title: 'Gaming',
    description: 'Story-driven and strategy games mostly — good for switching my brain off.',
    images: ['/interests/gaming-1.jpg', '/interests/gaming-2.jpg'],
  },
  {
    title: 'AI',
    description: 'Following the space closely and building small experiments on the side.',
  },
];

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Resume', href: '/resume.pdf' },
];

export const cpStats = {
  summary: {
    totalSolved: '90+',
    contests: '7',
    primaryLanguage: 'C++',
    focusTopic: 'Arrays & Math',
  },
  leetcode: {
    username: 'Dnyanit',
    profileUrl: 'https://leetcode.com/u/Dnyanit/',
    rating: 'Unrated',
    ranking: '3.8M',
    totalSolved: 29,
    breakdown: {
      easy: 21,
      medium: 8,
      hard: 0,
    },
  },
  codeforces: {
    username: 'Rahul.Gandhi',
    profileUrl: 'https://codeforces.com/profile/Rahul.Gandhi',
    rating: '900',
    maxRating: '930',
    rank: 'Newbie',
    maxRank: 'Newbie',
    contests: 7,
    totalSolved: 61,
  },
};

