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
  qurasdirilmaTarixi?: string;
  ilkinRestovrasiyaTarixi?: string;
  tekrarRestovrasiyaTarixi?: string;
  sonIstismarTarixi?: string;
  qeyd?: string;
};

export type DirekAsset = BaseAsset & {
    type: 'Dirək';
    istehsalci?: 'İDEA' | 'OZON' | 'FRANSIZ' | 'BCG' | 'Digər';
    hundurluk?: number;
    reng?: string;
    nov?: 'T' | 'I';
    hendesiForma?: 'Kvadrat' | 'Dairəvi' | 'Dairəvi Xonçalı';
    material?: 'Qara metal' | 'Qalvanizasiya olunmuş qara metal' | 'Aluminium';
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
};

export type DataKabelAsset = BaseAsset & {
    type: 'Data Kabeli';
    ethernetTipi?: string;
    ethernetUzunluq?: number;
    patchcordTipi?: string;
    patchcordUzunluq?: number;
    optikYerlesme?: 'Aşağıda' | 'Yuxarıda';
};

export type ElektrikKabelAsset = BaseAsset & {
    type: 'Elektrik Kabeli';
    kabelTipi?: string;
    kabelUzunluq?: number;
    uzaticiYuvaSayi?: number;
    uzaticiUzunluq?: number;
    birlesmeUsulu?: 'Vilka' | 'Birbaşa';
};

export type KameraAsset = BaseAsset & {
  type: 'Kamera';
  marka?: string;
  model?: string;
  funksiya?: string;
  seriaNomresi?: string;
  kameraNovu?: 'Daxili' | 'Xarici';
  adapter?: string;
  istehsalIli?: string;
  reng?: string;
  kameraQolu?: 'Var' | 'Yox';
  qolIstismarVeziyyeti?: 'Yararlı' | 'Yararsız' | 'Restovrasiya olunmalıdır';
  montajAksesuari?: 'Təkli' | 'Üçlü' | 'Düz' | 'Dairəvi' | 'Yoxdur';
  montajAksesuariIstismarVeziyyeti?: 'Yararlı' | 'Yararsız' | 'Restovrasiya olunmalıdır';
  kameraTemizliyi?: 'Təmiz' | 'Çirkli';
};


export type GenericAsset = BaseAsset & {
    type: 'Qutu' | 'Switch' | 'Router';
};

export type Asset = DirekAsset | GenericAsset | DataKabelAsset | ElektrikKabelAsset | KameraAsset;

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
