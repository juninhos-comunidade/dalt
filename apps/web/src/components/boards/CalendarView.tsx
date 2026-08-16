'use client';
import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Typography } from '@mui/material';
import { BoardItem } from '../../mocks/boardData';
import CardDetailsModal from './CardDetailsModal';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarViewProps {
  items: BoardItem[];
  isAuthenticated: boolean;
  onRequireLogin: () => void;
}

export default function CalendarView({ items, isAuthenticated, onRequireLogin }: CalendarViewProps) {
  const [selectedItem, setSelectedItem] = useState<BoardItem | null>(null);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState('month');

  const events = items.filter(item => item.date).map(item => ({
    title: item.title,
    start: new Date(item.date!),
    end: new Date(item.date!),
    allDay: true,
    resource: item
  }));

  const handleSelectEvent = (event: any) => {
    if (!isAuthenticated) {
      onRequireLogin();
      return;
    }
    setSelectedItem(event.resource);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleView = (newView: string) => {
    setView(newView);
  };

  return (
    <Box sx={{ 
      height: '100%', 
      bgcolor: 'background.paper', 
      p: 2, 
      borderRadius: 2, 
      boxShadow: 1,
      display: 'flex',
      flexDirection: 'column',
      '& .rbc-calendar': {
        fontFamily: 'inherit',
        border: 'none',
      },
      '& .rbc-toolbar': {
        mb: 2,
        button: {
          color: 'primary.main',
          borderColor: 'divider',
          '&:hover': {
            bgcolor: 'action.hover',
          },
          '&.rbc-active': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }
        }
      },
      '& .rbc-event': {
        bgcolor: 'primary.main',
        borderRadius: 1,
        p: 0.5,
      },
      '& .rbc-today': {
        bgcolor: 'action.selected',
      }
    }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={date}
        view={view as any}
        onNavigate={handleNavigate}
        onView={handleView}
        style={{ flexGrow: 1 }}
        culture="pt-BR"
        messages={{
          next: 'Próximo',
          previous: 'Anterior',
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          agenda: 'Agenda',
          date: 'Data',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'Não há eventos neste período.',
          showMore: (total) => `+${total} mais`
        }}
        onSelectEvent={handleSelectEvent}
        popup={true}
      />
      <CardDetailsModal 
        open={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        item={selectedItem} 
      />
    </Box>
  );
}
