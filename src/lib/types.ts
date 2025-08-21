export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Admin' | 'Regional Menecer' | 'Təmir üzrə Məsul Şəxs';
  region: string;
  avatar: string;
};

export type TasinmazEmlak = {
  id: string;
  type: 
    | 'Təhlükəsizlik Nöqtəsi' 
    | 'Alt Keçid' 
    | 'Üst Keçid' 
    | 'Məscid' 
    | 'Ticarət Mərkəzi' 
    | 'ASAN' 
    | 'İdman və Konsert' 
    | 'POÇT' 
    | 'Metro' 
    | 'Biznes Mərkəzi';
  name: string;
  aktivlesmeTarixi?: string;
  seher?: string;
  rayon?: string;
  koordinatX?: string;
  koordinatY?: string;
  layihe?: string;
  dataMenbeyi?: 'Optik' | 'Anten' | 'Sim nömrə' | 'Digər';
  bagliOlduguNeqte?: string;
  elektrikMenbeyi?: string;
  qeyd?: string;
  mertebe?: string; // Məsələn: Z3, M3
};


type BaseAsset = {
  id: string;
  parentId?: string | null; // Hierarxiyanı qurmaq üçün (məs: Switch-in Qutu-ya bağlanması)
  nodeId: string; // Hansı TŞ-yə aid olduğunu göstərir
  name:string;
  region: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'Aktiv' | 'Qeyri-aktiv' | 'Təmir' | 'Anbarda' | 'İstifadəyə Yararsız';
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
    nov?: 'T' | 'I' | 'Г';
    hendesiForma?: 'Kvadrat' | 'Dairəvi' | 'Dairəvi Xonçalı';
    material?: 'Qara metal' | 'Qalvanizasiya olunmuş qara metal' | 'Aluminium';
    istismarVeziyyeti?: 'Yararlı' | 'Yararsız' | 'Restovrasiya olunmalıdır';
    qol?: 'Yararlı' | 'Yararsız' | 'Restovrasiya olunmalıdır';
    etek?: 'Yararlı' | 'Yararsız' | 'Restovrasiya olunmalıdır';
    sapka?: 'Yararlı' | 'Yararsız' | 'Restovrasiya olunmalıdır';
    qapaq?: 'Yararlı' | 'Yararsız' | 'Restovrasiya olunmalıdır';
    direyinTemizliyi?: 'Təmiz' | 'Çirkli';
    torpaqlanma?: 'Var' | 'Yoxdur';
    bunovreNovu?: 'Stasionar' | 'Səyyar bastırılmış' | 'Səyyar yer üstü';
    bunovreVeziyyeti?: 'Yararlı' | 'Aşınmış' | 'Ölçü qüsurlu';
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

export type QutuAsset = BaseAsset & {
  type: 'Qutu';
  istehsalci?: 'İDEA' | 'Lande AviCOM' | 'Lande' | 'Lande EKİN' | 'Legrant';
  tipi?: 'Yer' | 'Dirək';
  soyutmaSistemi?: 'Yoxdur' | 'FAN' | 'Kuller' | 'Kondisioner';
  termalSensor?: 'Var' | 'Yoxdur';
  reng?: string;
  acarYeri?: 'Plastik' | 'Metal';
  refSayi?: 'Rəfsiz' | '1 rəfli' | '2 rəfli';
  berkidilmeUsulu?: 'Kələpçə' | 'Anker bolt' | 'Probka şurup';
  torpaqlanma?: 'Var' | 'Yoxdur';
  etiket?: 'Var' | 'Yoxdur';
  istismarVeziyyeti?: 'Yararlı' | 'Yararsız' | 'Restovrasiya olunmalıdır';
  elaveKilidMexanizmi?: 'Var' | 'Yoxdur';
  kilidIstismarVeziyyeti?: 'Yararlı' | 'Yararsız' | 'Restovrasiya olunmalıdır';
  qutununXariciTemizliyi?: 'Təmiz' | 'Çirkli';
  qutununDaxiliTemizliyi?: 'Təmiz' | 'Çirkli';
};

export type SwitchAsset = BaseAsset & {
  type: 'Switch';
  marka?: string;
  model?: string;
  adapter?: string;
  seriaNomresi?: string;
  istehsalIli?: string;
  switchTipi?: 'İndustrial tipli' | 'Kommersiya tipli';
  ethernetPortSayi?: number;
  poePortSayi?: number;
  management?: 'idarə olunan' | 'idarə olunmayan';
  switchYeri?: 'Qapı' | 'Rəf' | 'Rack Kabin';
  konfiqurasiya?: 'olunub' | 'olunmayıb';
  sfpModul?: string;
  sfpModulSayi?: number;
  ups?: string;
  upsQurasdirilmaTarixi?: string;
  stabilizator?: string;
  stabilizatorQurasdirilmaTarixi?: string;
};


export type GenericAsset = BaseAsset & {
    type: 'Rack Kabin';
};

export type Asset = DirekAsset | DataKabelAsset | ElektrikKabelAsset | KameraAsset | QutuAsset | SwitchAsset | GenericAsset;

export type Ticket = {
  id: string;
  assetId: string;
  issue: string;
  status: 'Açıq' | 'İcra olunur' | 'Həll edildi' | 'Bağlı' | 'Yenidən açıldı';
  assignedTo?: string;
  createdDate: string;
  priority: 'Yüksək' | 'Orta' | 'Aşağı';
};

export type AuditLog = {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  details: string;
};
