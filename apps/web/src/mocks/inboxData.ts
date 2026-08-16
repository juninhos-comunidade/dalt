export type MessageThread = {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  date: string; // ISO String
  read: boolean;
  isArchived?: boolean;
  isBlocked?: boolean;
  tags?: string[];
  messages: InboxMessage[];
};

export type InboxMessage = {
  id: string;
  author: string;
  content: string;
  createdAt: string; // ISO String
};

export const MOCK_INBOX: MessageThread[] = [
  {
    id: 't1',
    sender: 'Pedro',
    senderEmail: 'pedro@email.com',
    subject: 'Dúvida sobre a Mentoria de Node.js',
    snippet: 'Olá, gostaria de saber se você tem disponibilidade para amanhã...',
    date: '2026-08-16T10:00:00Z',
    read: false,
    tags: ['mentoria', 'duvida'],
    messages: [
      {
        id: 'm1',
        author: 'Pedro',
        content: 'Olá! Vi sua oferta de mentoria de Node.js no mural. Gostaria de saber se você tem disponibilidade para amanhã no período da tarde, ou se prefere no final de semana.',
        createdAt: '2026-08-16T10:00:00Z'
      }
    ]
  },
  {
    id: 't2',
    sender: 'Ana',
    senderEmail: 'ana@email.com',
    subject: 'Time para o Hackathon',
    snippet: 'Oi, vi que você também está inscrito no Hackathon. Quer entrar no meu time?',
    date: '2026-08-15T15:30:00Z',
    read: true,
    tags: ['hackathon', 'convite'],
    messages: [
      {
        id: 'm2',
        author: 'Ana',
        content: 'Oi, vi que você também está inscrito no Hackathon DALT. Estamos precisando de um desenvolvedor Backend para fechar a equipe. Topa entrar no nosso time?',
        createdAt: '2026-08-15T15:30:00Z'
      },
      {
        id: 'm3',
        author: 'Você',
        content: 'Oi Ana, topo sim! Que horas vocês vão se reunir para o brainstorm?',
        createdAt: '2026-08-15T16:00:00Z'
      }
    ]
  },
  {
    id: 't3',
    sender: 'Lucas',
    senderEmail: 'lucas@email.com',
    subject: 'Ajuda com UX/UI',
    snippet: 'Vi seu post procurando mentor de UX/UI. Sou Designer Pleno e posso te ajudar!',
    date: '2026-08-10T09:15:00Z',
    read: true,
    isArchived: true,
    tags: ['design'],
    messages: [
      {
        id: 'm4',
        author: 'Lucas',
        content: 'Vi seu post procurando mentor de UX/UI. Sou Designer Pleno numa grande empresa e tenho um tempo livre nas terças. Posso te ajudar a organizar seu portfólio. Me avisa se tiver interesse!',
        createdAt: '2026-08-10T09:15:00Z'
      }
    ]
  }
];
