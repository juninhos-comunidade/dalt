'use client';
import React from 'react';
import { Box, ToggleButtonGroup, ToggleButton, TextField, Button } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export type ViewType = 'list' | 'calendar';

interface BoardControlsProps {
  view: ViewType;
  onChangeView: (view: ViewType) => void;
  filterText: string;
  onChangeFilter: (text: string) => void;
  filterPlaceholder: string;
  hideCalendarToggle?: boolean;
  onAddClick?: () => void;
}

export default function BoardControls({ view, onChangeView, filterText, onChangeFilter, filterPlaceholder, hideCalendarToggle, onAddClick }: BoardControlsProps) {
  const handleViewChange = (event: React.MouseEvent<HTMLElement>, nextView: ViewType | null) => {
    if (nextView !== null) {
      onChangeView(nextView);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
      <TextField
        size="small"
        placeholder={filterPlaceholder}
        value={filterText}
        onChange={(e) => onChangeFilter(e.target.value)}
        sx={{ minWidth: 200, flexGrow: 1, maxWidth: 400 }}
      />
      {!hideCalendarToggle && (
        <ToggleButtonGroup
          size="small"
          value={view}
          exclusive
          onChange={handleViewChange}
          aria-label="view toggle"
        >
          <ToggleButton value="list" aria-label="list view">
            <ViewListIcon />
          </ToggleButton>
          <ToggleButton value="calendar" aria-label="calendar view">
            <CalendarMonthIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      )}
      {onAddClick && (
        <Button variant="contained" size="small" onClick={onAddClick} sx={{ ml: 'auto' }}>
          + Novo
        </Button>
      )}
    </Box>
  );
}
