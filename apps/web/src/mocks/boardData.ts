export type Comment = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
};

export type BoardItemType = 'event' | 'mentorship';

export type BoardItem = {
  id: string;
  type: BoardItemType;
  title: string;
  description: string;
  date?: string; // ISO date string, mainly for events or mentorship availability
  author: string;
  subject?: string;
  comments: Comment[];
};

export const MOCK_EVENTS: BoardItem[] = [
  {
    id: 'e1',
    type: 'event',
    title: 'Hackathon DALT 2026',
    description: 'Participe do maior evento de inovação. Vamos codar juntos!',
    date: '2026-08-20T09:00:00Z',
    author: 'Admin',
    comments: [
      { id: 'c1', author: 'João', content: 'Ansioso para participar!', createdAt: '2026-08-15T10:00:00Z' }
    ]
  },
  {
    id: 'e2',
    type: 'event',
    title: 'Workshop de React',
    description: 'Aprenda os conceitos avançados de React e Next.js.',
    date: '2026-08-25T14:00:00Z',
    author: 'Maria',
    comments: []
  },
  {
    id: 'e3',
    type: 'event',
    title: 'Meetup de Design System',
    description: 'Como construir e escalar Design Systems.',
    date: '2026-08-30T18:30:00Z',
    author: 'Carlos',
    comments: []
  }
];

export const MOCK_MENTORSHIPS: BoardItem[] = [
  {
    id: 'm1',
    type: 'mentorship',
    title: 'Mentoria em Node.js',
    description: 'Posso ajudar iniciantes a entender melhor o ecossistema Node.js e arquitetura de backend.',
    date: '2026-08-22T10:00:00Z', // Data que o mentor tem disponível
    author: 'Ana',
    subject: 'Backend',
    comments: [
      { id: 'c2', author: 'Pedro', content: 'Tenho interesse, como agendamos?', createdAt: '2026-08-15T11:00:00Z' }
    ]
  },
  {
    id: 'm2',
    type: 'mentorship',
    title: 'Procuro mentor de UX/UI',
    description: 'Estou transicionando de carreira e preciso de ajuda com portfólio.',
    date: '2026-08-28T15:00:00Z',
    author: 'Lucas',
    subject: 'Design',
    comments: []
  },
  {
    id: 'm3',
    type: 'mentorship',
    title: 'Disponível para Cloud (AWS)',
    description: 'Ajudo com deploy, CI/CD e infraestrutura como código.',
    date: '2026-09-05T09:00:00Z',
    author: 'Felipe',
    subject: 'DevOps',
    comments: []
  }
];
