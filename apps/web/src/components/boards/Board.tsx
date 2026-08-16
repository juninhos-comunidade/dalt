'use client';
import React, { useState, useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import BoardControls, { ViewType } from './BoardControls';
import ListView from './ListView';
import CalendarView from './CalendarView';
import { BoardItem, BoardItemType } from '../../mocks/boardData';

interface BoardProps {
  title: string;
  type: BoardItemType;
  items: BoardItem[];
  isAuthenticated: boolean;
  onRequireLogin: () => void;
  onAdd: () => void;
}

export default function Board({ title, type, items, isAuthenticated, onRequireLogin, onAdd }: BoardProps) {
  const [view, setView] = useState<ViewType>('list');
  const [filterText, setFilterText] = useState('');

  // Force list view for mentorship, ignoring the local state if it ever changes
  const activeView = type === 'mentorship' ? 'list' : view;

  const filteredItems = useMemo(() => {
    if (!filterText.trim()) return items;
    const lowerFilter = filterText.toLowerCase();
    return items.filter(item => {
      if (type === 'event') {
        // Simple mock filtering for events (date text or title)
        return item.title.toLowerCase().includes(lowerFilter) || 
               (item.date && item.date.includes(lowerFilter));
      } else {
        // Mentorship: search by subject or user
        return item.subject?.toLowerCase().includes(lowerFilter) ||
               item.author.toLowerCase().includes(lowerFilter) ||
               item.title.toLowerCase().includes(lowerFilter);
      }
    });
  }, [items, filterText, type]);

  const placeholder = type === 'event' ? 'Filtrar por data (ex: 2026-08) ou nome...' : 'Buscar por assunto ou usuário...';

  return (
    <Paper sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
        {title}
      </Typography>
      
      <BoardControls 
        view={activeView} 
        onChangeView={setView} 
        filterText={filterText} 
        onChangeFilter={setFilterText}
        filterPlaceholder={placeholder}
        hideCalendarToggle={type === 'mentorship'}
        onAddClick={onAdd}
      />

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {activeView === 'list' ? (
          <ListView 
            items={filteredItems} 
            isAuthenticated={isAuthenticated} 
            onRequireLogin={onRequireLogin} 
          />
        ) : (
          <CalendarView 
            items={filteredItems} 
            isAuthenticated={isAuthenticated} 
            onRequireLogin={onRequireLogin} 
          />
        )}
      </Box>
    </Paper>
  );
}
