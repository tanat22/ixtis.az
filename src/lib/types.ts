export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Səhra istifadəçisi';
  region: string;
  avatar: string;
};

export type Asset = {
  id: string;
  name: string;
  type: 'Dirək' | 'Qutu' | 'Kamera' | 'Switch' | 'Router';
  region: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'Aktiv' | 'Qeyri-aktiv' | 'Təmir';
  addedBy: string;
  addedDate: string;
};

export type Ticket = {
  id: string;
  assetId: string;
  issue: string;
  status: 'Açıq' | 'İcra olunur' | 'Bağlı';
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
