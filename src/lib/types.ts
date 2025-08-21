export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Səhra istifadəçisi';
  region: string;
  avatar: string;
};

type BaseAsset = {
  id: string;
  name:string;
  region: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'Aktiv' | 'Qeyri-aktiv' | 'Təmir';
  addedBy: string;
  addedDate: string;
};

export type DirekAsset = BaseAsset & {
    type: 'Dirək';
    istehsalci?: 'İDEA' | 'OZON' | 'FRANSIZ' | 'BCG' | 'Digər';
    hundurluk?: number;
    reng?: string;
    nov?: 'T' | 'I';
    hendesiForma?: 'Kvadrat' | 'Dairəvi' | 'Dairəvi Xonçalı';
    material?: 'Qara metal' | 'Qalvanizasiya olunmuş qara metal' | 'Aluminium';
    qurasdirilmaTarixi?: string;
    ilkinRestovrasiyaTarixi?: string;
    tekrarRestovrasiyaTarixi?: string;
    sonIstismarTarixi?: string;
    istismarVeziyyeti?: 'Yararlı' | 'Yararsız' | 'Restovrasiya olunmalıdır';
    qol?: 'Yararlı' | 'Yararsız' | 'Restovrasiya olunmalıdır';
    etek?: 'Yararlı' | 'Yararsız' | 'Restovrasiya olunmalıdır';
    sapka?: 'Yararlı' | 'Yararsız' | 'Restovrasiya olunmalıdır';
    qapaq?: 'Yararlı' | 'Yararsız' | 'Restovrasiya olunmalıdır';
    direyinTemizliyi?: 'Təmiz' | 'Çirkli';
    torpaqlanma?: 'Var' | 'Yoxdur';
    bunovreNovu?: 'Stasionar' | 'Səyyar basdırılmış' | 'Səyyar yer üstü';
    bunovreVeziyyeti?: 'Yararlı' | 'Aşınmış' | 'Əlçə qüsurlu';
    ankerVeziyyeti?: 'Yararlı' | 'Yararsız';
    qeyd?: string;
};

export type GenericAsset = BaseAsset & {
    type: 'Qutu' | 'Kamera' | 'Switch' | 'Router';
};

export type Asset = DirekAsset | GenericAsset;

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
