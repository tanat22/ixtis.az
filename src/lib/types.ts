export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Field User';
  region: string;
  avatar: string;
};

export type Asset = {
  id: string;
  name: string;
  type: 'Direk' | 'Qutu' | 'Kamera' | 'Switch' | 'Router';
  region: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'Active' | 'Inactive' | 'Maintenance';
  addedBy: string;
  addedDate: string;
};

export type Ticket = {
  id: string;
  assetId: string;
  issue: string;
  status: 'Open' | 'In Progress' | 'Closed';
  assignedTo?: string;
  createdDate: string;
};

export type AuditLog = {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  details: string;
};
