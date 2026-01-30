import { CalendarIcon, LayoutDashboardIcon, UsersIcon } from 'lucide-react';

export const manageTournamentRoutes = [
  {
    label: 'Dashboard',
    path: '',
    icon: <LayoutDashboardIcon size={16} />
  },
  {
    label: 'Events',
    path: '/events',
    icon: <CalendarIcon size={16} />
  },
  {
    label: 'Attendees',
    path: '/attendees',
    icon: <UsersIcon size={16} />
  }
];
