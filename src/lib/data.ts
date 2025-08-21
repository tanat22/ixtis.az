import type { User, Asset, Ticket, AuditLog } from './types';

export const mockUsers: User[] = [
  { id: 'user-1', name: 'Ali Valiyev', email: 'ali.v@example.com', role: 'Super Admin', region: 'All', avatar: '/avatars/01.png' },
  { id: 'user-2', name: 'Sara Qasimli', email: 'sara.q@example.com', role: 'Admin', region: 'Baku', avatar: '/avatars/02.png' },
  { id: 'user-3', name: 'Tural Memmedov', email: 'tural.m@example.com', role: 'Field User', region: 'Baku', avatar: '/avatars/03.png' },
  { id: 'user-4', name: 'Leyla Huseynova', email: 'leyla.h@example.com', role: 'Field User', region: 'Ganja', avatar: '/avatars/04.png' },
  { id: 'user-5', name: 'Farid Ismayilov', email: 'farid.i@example.com', role: 'Field User', region: 'Sumqayit', avatar: '/avatars/05.png' },
];

export const mockAssets: Asset[] = [
  { id: 'asset-1', name: 'Nizami St. Pole 1', type: 'Direk', region: 'Baku', location: { lat: 40.3792, lng: 49.8492 }, status: 'Active', addedBy: 'user-3', addedDate: '2023-10-01' },
  { id: 'asset-2', name: '28 May Junction Box', type: 'Qutu', region: 'Baku', location: { lat: 40.3798, lng: 49.8499 }, status: 'Active', addedBy: 'user-3', addedDate: '2023-10-02' },
  { id: 'asset-3', name: 'Icherisheher Cam 01', type: 'Kamera', region: 'Baku', location: { lat: 40.3582, lng: 49.8336 }, status: 'Maintenance', addedBy: 'user-2', addedDate: '2023-09-15' },
  { id: 'asset-4', name: 'Heydar Aliyev Center Switch', type: 'Switch', region: 'Ganja', location: { lat: 40.6828, lng: 46.3606 }, status: 'Active', addedBy: 'user-4', addedDate: '2023-11-05' },
  { id: 'asset-5', name: 'Bulvar Park Router', type: 'Router', region: 'Sumqayit', location: { lat: 40.5897, lng: 49.6686 }, status: 'Inactive', addedBy: 'user-5', addedDate: '2023-08-20' },
  { id: 'asset-6', name: 'Fountain Square Cam 05', type: 'Kamera', region: 'Baku', location: { lat: 40.3703, lng: 49.8344 }, status: 'Active', addedBy: 'user-3', addedDate: '2023-11-10' },
];

export const mockTickets: Ticket[] = [
  { id: 'ticket-1', assetId: 'asset-3', issue: 'Camera is offline', status: 'In Progress', assignedTo: 'user-3', createdDate: '2023-11-20' },
  { id: 'ticket-2', assetId: 'asset-5', issue: 'Router not providing IP', status: 'Open', createdDate: '2023-11-21' },
  { id: 'ticket-3', assetId: 'asset-1', issue: 'Power outage on pole', status: 'Closed', assignedTo: 'user-3', createdDate: '2023-11-18' },
  { id: 'ticket-4', assetId: 'asset-4', issue: 'High latency on switch ports', status: 'Open', assignedTo: 'user-4', createdDate: '2023-11-22' },
];

export const mockAuditLogs: AuditLog[] = [
  { id: 'log-1', userId: 'user-1', action: 'User Created', timestamp: '2023-11-22 09:05:12', details: 'Created user Farid Ismayilov (user-5)' },
  { id: 'log-2', userId: 'user-3', action: 'Asset Added', timestamp: '2023-11-22 09:01:45', details: 'Added asset Fountain Square Cam 05 (asset-6)' },
  { id: 'log-3', userId: 'user-2', action: 'Ticket Assigned', timestamp: '2023-11-22 08:55:30', details: 'Assigned ticket-1 to Tural Memmedov' },
  { id: 'log-4', userId: 'user-4', action: 'Asset Status Changed', timestamp: '2023-11-21 15:30:00', details: 'Changed status of asset-4 to Active' },
  { id: 'log-5', userId: 'user-1', action: 'User Login', timestamp: '2023-11-21 15:25:10', details: 'User Ali Valiyev logged in' },
];
