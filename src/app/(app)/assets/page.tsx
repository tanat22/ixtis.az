'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MoreHorizontal, PlusCircle, ChevronLeft } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { mockAssets, mockUsers, mockNodes } from '@/lib/data';
import type { Asset, DirekAsset, DataKabelAsset, ElektrikKabelAsset, KameraAsset, QutuAsset, SwitchAsset, TasinmazEmlak } from '@/lib/types';

export default function AssetsPage() {
  const [assets, setAssets] = React.useState<Asset[]>(mockAssets);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedAssetType, setSelectedAssetType] = React.useState<Asset['type'] | ''>('');
  const [selectedNode, setSelectedNode] = React.useState<TasinmazEmlak | null>(null);

  const handleAddAsset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedNode) return;

    const formData = new FormData(event.currentTarget);
    const assetType = formData.get('type') as Asset['type'];
    
    const commonData = {
        id: `asset-${Date.now()}`,
        nodeId: selectedNode.id,
        name: formData.get('name') as string,
        region: selectedNode.seherRayon || 'N/A',
        status: 'Aktiv' as const,
        location: { lat: 40.37, lng: 49.84 }, // Mock coordinates
        addedBy: 'user-1', // Mock user
        addedDate: new Date().toISOString().split('T')[0],
        qurasdirilmaTarixi: formData.get('qurasdirilmaTarixi') as string,
        qeyd: formData.get('qeyd') as string,
    };

    let newAsset: Asset;

    if (assetType === 'Dirək') {
        newAsset = {
            ...commonData,
            type: 'Dirək',
            istehsalci: formData.get('istehsalci') as DirekAsset['istehsalci'],
            hundurluk: Number(formData.get('hundurluk')),
            reng: formData.get('reng') as string,
            nov: formData.get('nov') as DirekAsset['nov'],
            hendesiForma: formData.get('hendesiForma') as DirekAsset['hendesiForma'],
            material: formData.get('material') as DirekAsset['material'],
        };
    } else if (assetType === 'Data Kabeli') {
        newAsset = {
            ...commonData,
            type: 'Data Kabeli',
            ethernetTipi: formData.get('ethernetTipi') as string,
            ethernetUzunluq: Number(formData.get('ethernetUzunluq')),
            patchcordTipi: formData.get('patchcordTipi') as string,
            patchcordUzunluq: Number(formData.get('patchcordUzunluq')),
            optikYerlesme: formData.get('optikYerlesme') as DataKabelAsset['optikYerlesme'],
        };
    } else if (assetType === 'Elektrik Kabeli') {
        newAsset = {
            ...commonData,
            type: 'Elektrik Kabeli',
            kabelTipi: formData.get('kabelTipi') as string,
            kabelUzunluq: Number(formData.get('kabelUzunluq')),
            uzaticiYuvaSayi: Number(formData.get('uzaticiYuvaSayi')),
            uzaticiUzunluq: Number(formData.get('uzaticiUzunluq')),
            birlesmeUsulu: formData.get('birlesmeUsulu') as ElektrikKabelAsset['birlesmeUsulu'],
        }
    } else if (assetType === 'Kamera') {
        newAsset = {
            ...commonData,
            type: 'Kamera',
            marka: formData.get('marka') as string,
            model: formData.get('model') as string,
            funksiya: formData.get('funksiya') as string,
            seriaNomresi: formData.get('seriaNomresi') as string,
            kameraNovu: formData.get('kameraNovu') as KameraAsset['kameraNovu'],
            adapter: formData.get('adapter') as string,
            reng: formData.get('reng') as string,
            kameraQolu: formData.get('kameraQolu') as KameraAsset['kameraQolu'],
            qolIstismarVeziyyeti: formData.get('qolIstismarVeziyyeti') as KameraAsset['qolIstismarVeziyyeti'],
            montajAksesuari: formData.get('montajAksesuari') as KameraAsset['montajAksesuari'],
            montajAksesuariIstismarVeziyyeti: formData.get('montajAksesuariIstismarVeziyyeti') as KameraAsset['montajAksesuariIstismarVeziyyeti'],
            kameraTemizliyi: formData.get('kameraTemizliyi') as KameraAsset['kameraTemizliyi'],
        }
    } else if (assetType === 'Qutu') {
        newAsset = {
            ...commonData,
            type: 'Qutu',
            istehsalci: formData.get('istehsalci') as QutuAsset['istehsalci'],
            tipi: formData.get('tipi') as QutuAsset['tipi'],
            soyutmaSistemi: formData.get('soyutmaSistemi') as QutuAsset['soyutmaSistemi'],
            termalSensor: formData.get('termalSensor') as QutuAsset['termalSensor'],
            reng: formData.get('reng') as string,
            acarYeri: formData.get('acarYeri') as QutuAsset['acarYeri'],
            refSayi: formData.get('refSayi') as QutuAsset['refSayi'],
            berkidilmeUsulu: formData.get('berkidilmeUsulu') as QutuAsset['berkidilmeUsulu'],
            torpaqlanma: formData.get('torpaqlanma') as QutuAsset['torpaqlanma'],
            etiket: formData.get('etiket') as QutuAsset['etiket'],
        }
    } else if (assetType === 'Switch') {
        newAsset = {
            ...commonData,
            type: 'Switch',
            marka: formData.get('marka') as string,
            model: formData.get('model') as string,
            adapter: formData.get('adapter') as string,
            seriaNomresi: formData.get('seriaNomresi') as string,
            switchTipi: formData.get('switchTipi') as SwitchAsset['switchTipi'],
            management: formData.get('management') as SwitchAsset['management'],
            switchYeri: formData.get('switchYeri') as SwitchAsset['switchYeri'],
            konfiqurasiya: formData.get('konfiqurasiya') as SwitchAsset['konfiqurasiya'],
            sfpModul: formData.get('sfpModul') as string,
        }
    }
     else {
        // Fallback for any other type that might be passed, though we removed Router
        newAsset = {
            ...commonData,
            type: assetType,
        };
    }
    
    setAssets(prev => [newAsset, ...prev]);
    setIsDialogOpen(false);
    setSelectedAssetType('');
  };
  
  const getStatusVariant = (status: Asset['status']) => {
    switch (status) {
      case 'Aktiv': return 'default';
      case 'Təmir': return 'secondary';
      case 'Qeyri-aktiv': return 'destructive';
      default: return 'outline';
    }
  };

  const renderAssetDetails = (asset: Asset) => {
    switch (asset.type) {
        case 'Dirək':
            return `İstehsalçı: ${asset.istehsalci || 'N/A'}, Hündürlük: ${asset.hundurluk || 'N/A'}m`;
        case 'Data Kabeli':
            return `Ethernet: ${asset.ethernetTipi || 'N/A'}, Optik: ${asset.patchcordTipi || 'N/A'}`;
        case 'Elektrik Kabeli':
            return `Kabel: ${asset.kabelTipi || 'N/A'}, Birləşmə: ${asset.birlesmeUsulu || 'N/A'}`;
        case 'Kamera':
            return `Marka: ${asset.marka || 'N/A'}, Model: ${asset.model || 'N/A'}`;
        case 'Qutu':
            return `İstehsalçı: ${asset.istehsalci || 'N/A'}, Tip: ${asset.tipi || 'N/A'}`;
        case 'Switch':
            return `Marka: ${asset.marka || 'N/A'}, Model: ${asset.model || 'N/A'}`;
        default:
            return asset.type;
    }
  }
  
  const renderAddAssetFormFields = () => {
    if (!selectedAssetType) return null;

    const commonFields = (
        <>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="qurasdirilmaTarixi" className="text-right">Quraşdırılma Tarixi</Label>
                <Input id="qurasdirilmaTarixi" name="qurasdirilmaTarixi" type="date" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="qeyd" className="text-right">Qeyd</Label>
                <Input id="qeyd" name="qeyd" className="col-span-3" />
            </div>
        </>
    );

    if (selectedAssetType === 'Dirək') {
      return (
        <>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="istehsalci" className="text-right">İstehsalçı</Label>
            <Select name="istehsalci">
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="İstehsalçı seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="İDEA">İDEA</SelectItem>
                <SelectItem value="OZON">OZON</SelectItem>
                <SelectItem value="FRANSIZ">FRANSIZ</SelectItem>
                <SelectItem value="BCG">BCG</SelectItem>
                <SelectItem value="Digər">Digər</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hundurluk" className="text-right">Hündürlük (m)</Label>
            <Input id="hundurluk" name="hundurluk" type="number" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reng" className="text-right">Rəng</Label>
            <Input id="reng" name="reng" className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nov" className="text-right">Növ</Label>
             <Select name="nov">
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Dirək növünü seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="T">T</SelectItem>
                <SelectItem value="I">I</SelectItem>
                <SelectItem value="Г">Г</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hendesiForma" className="text-right">Həndəsi Forma</Label>
            <Select name="hendesiForma">
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Formanı seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kvadrat">Kvadrat</SelectItem>
                <SelectItem value="Dairəvi">Dairəvi</SelectItem>
                <SelectItem value="Dairəvi Xonçalı">Dairəvi Xonçalı</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="material" className="text-right">Material</Label>
            <Select name="material">
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Materialı seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Qara metal">Qara metal</SelectItem>
                <SelectItem value="Qalvanizasiya olunmuş qara metal">Qalvanizasiya olunmuş qara metal</SelectItem>
                <SelectItem value="Aluminium">Aluminium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {commonFields}
        </>
      );
    } else if (selectedAssetType === 'Data Kabeli') {
        return (
            <>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ethernetTipi" className="text-right">Ethernet Tipi</Label>
                     <Select name="ethernetTipi">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Ethernet tipini seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Patchcord Ethernet CAT6 1M.">Patchcord Ethernet CAT6 1M.</SelectItem>
                            <SelectItem value="CAT6 Kabel Outdoor (Black)">CAT6 Kabel Outdoor (Black)</SelectItem>
                            <SelectItem value="Cat 6 Ethernet Kabel">Cat 6 Ethernet Kabel</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ethernetUzunluq" className="text-right">Ethernet Uzunluq (m)</Label>
                    <Input id="ethernetUzunluq" name="ethernetUzunluq" type="number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="patchcordTipi" className="text-right">Patchcord Tipi</Label>
                     <Select name="patchcordTipi">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Patchcord tipini seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Patchcord optik 1M">Patchcord optik 1M</SelectItem>
                            <SelectItem value="FO Patchcord 7m">FO Patchcord 7m</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="patchcordUzunluq" className="text-right">Patchcord Uzunluq (m)</Label>
                    <Input id="patchcordUzunluq" name="patchcordUzunluq" type="number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="optikYerlesme" className="text-right">Optik Yerləşmə</Label>
                    <Select name="optikYerlesme">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Yerləşməni seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Aşağıda">Aşağıda</SelectItem>
                            <SelectItem value="Yuxarıda">Yuxarıda</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {commonFields}
            </>
        );
    } else if (selectedAssetType === 'Elektrik Kabeli') {
        return (
            <>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="kabelTipi" className="text-right">Kabel Tipi</Label>
                     <Select name="kabelTipi">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Kabel tipini seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Elektrik kabeli 2x2.25">Elektrik kabeli 2x2.25</SelectItem>
                            <SelectItem value="Elektrik kabeli 2x0.75">Elektrik kabeli 2x0.75</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="kabelUzunluq" className="text-right">Kabel Uzunluğu (m)</Label>
                    <Input id="kabelUzunluq" name="kabelUzunluq" type="number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="uzaticiYuvaSayi" className="text-right">Uzadıcı Yuva Sayı</Label>
                    <Input id="uzaticiYuvaSayi" name="uzaticiYuvaSayi" type="number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="uzaticiUzunluq" className="text-right">Uzadıcı Uzunluğu (m)</Label>
                    <Input id="uzaticiUzunluq" name="uzaticiUzunluq" type="number" className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="birlesmeUsulu" className="text-right">Birləşmə Üsulu</Label>
                    <Select name="birlesmeUsulu">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Üsulu seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Vilka">Vilka</SelectItem>
                            <SelectItem value="Birbaşa">Birbaşa</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {commonFields}
            </>
        );
    } else if (selectedAssetType === 'Kamera') {
      return (
        <>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="marka" className="text-right">Marka</Label>
                 <Select name="marka">
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Marka seçin" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Hikvision">Hikvision</SelectItem>
                        <SelectItem value="AXİS">AXİS</SelectItem>
                        <SelectItem value="Aviglon">Aviglon</SelectItem>
                        <SelectItem value="Dahua">Dahua</SelectItem>
                        <SelectItem value="Sanyo">Sanyo</SelectItem>
                        <SelectItem value="Digər">Digər</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="model" className="text-right">Model</Label>
                <Input id="model" name="model" className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="funksiya" className="text-right">Funksiya</Label>
                <Input id="funksiya" name="funksiya" className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="seriaNomresi" className="text-right">Seria Nömrəsi</Label>
                <Input id="seriaNomresi" name="seriaNomresi" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="kameraNovu" className="text-right">Növ</Label>
                <Select name="kameraNovu">
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Növü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Daxili">Daxili</SelectItem>
                        <SelectItem value="Xarici">Xarici</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="adapter" className="text-right">Adapter</Label>
                <Input id="adapter" name="adapter" className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reng" className="text-right">Rəng</Label>
                <Input id="reng" name="reng" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="kameraQolu" className="text-right">Kamera Qolu</Label>
                <Select name="kameraQolu">
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Var">Var</SelectItem>
                        <SelectItem value="Yox">Yox</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="qolIstismarVeziyyeti" className="text-right">Qol İstismar Vəziyyəti</Label>
                 <Select name="qolIstismarVeziyyeti">
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Vəziyyəti seçin" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Yararlı">Yararlı</SelectItem>
                        <SelectItem value="Yararsız">Yararsız</SelectItem>
                        <SelectItem value="Restovrasiya olunmalıdır">Restovrasiya olunmalıdır</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="montajAksesuari" className="text-right">Montaj Aksesuarı</Label>
                 <Select name="montajAksesuari">
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Aksesuarı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Təkli">Təkli</SelectItem>
                        <SelectItem value="Üçlü">Üçlü</SelectItem>
                        <SelectItem value="Düz">Düz</SelectItem>
                        <SelectItem value="Dairəvi">Dairəvi</SelectItem>
                        <SelectItem value="Yoxdur">Yoxdur</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="montajAksesuariIstismarVeziyyeti" className="text-right">Montaj Aksesuarı Vəziyyəti</Label>
                 <Select name="montajAksesuariIstismarVeziyyeti">
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Vəziyyəti seçin" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Yararlı">Yararlı</SelectItem>
                        <SelectItem value="Yararsız">Yararsız</SelectItem>
                        <SelectItem value="Restovrasiya olunmalıdır">Restovrasiya olunmalıdır</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="kameraTemizliyi" className="text-right">Kamera Təmizliyi</Label>
                 <Select name="kameraTemizliyi">
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Təmizliyi seçin" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Təmiz">Təmiz</SelectItem>
                        <SelectItem value="Çirkli">Çirkli</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {commonFields}
        </>
      );
    } else if (selectedAssetType === 'Qutu') {
        return (
            <>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="istehsalci" className="text-right">İstehsalçı</Label>
                    <Select name="istehsalci">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="İstehsalçını seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="İDEA">İDEA</SelectItem>
                            <SelectItem value="Lande AviCOM">Lande AviCOM</SelectItem>
                            <SelectItem value="Lande">Lande</SelectItem>
                            <SelectItem value="Lande EKİN">Lande EKİN</SelectItem>
                            <SelectItem value="Legrant">Legrant</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tipi" className="text-right">Tipi</Label>
                    <Select name="tipi">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Tipi seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Yer">Yer</SelectItem>
                            <SelectItem value="Dirək">Dirək</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="soyutmaSistemi" className="text-right">Soyutma Sistemi</Label>
                     <Select name="soyutmaSistemi">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Sistemi seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Yoxdur">Yoxdur</SelectItem>
                            <SelectItem value="FAN">FAN</SelectItem>
                            <SelectItem value="Kuller">Kuller</SelectItem>
                            <SelectItem value="Kondisioner">Kondisioner</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="termalSensor" className="text-right">Termal Sensor</Label>
                     <Select name="termalSensor">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Var">Var</SelectItem>
                            <SelectItem value="Yoxdur">Yoxdur</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reng" className="text-right">Rəng</Label>
                    <Input id="reng" name="reng" className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="acarYeri" className="text-right">Açar Yeri</Label>
                    <Select name="acarYeri">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Plastik">Plastik</SelectItem>
                            <SelectItem value="Metal">Metal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="refSayi" className="text-right">Rəf Sayı</Label>
                    <Select name="refSayi">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Rəf sayını seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Rəfsiz">Rəfsiz</SelectItem>
                            <SelectItem value="1 rəfli">1 rəfli</SelectItem>
                             <SelectItem value="2 rəfli">2 rəfli</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="berkidilmeUsulu" className="text-right">Bərkidilmə Üsulu</Label>
                    <Select name="berkidilmeUsulu">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Üsulu seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Kələpçə">Kələpçə</SelectItem>
                            <SelectItem value="Anker bolt">Anker bolt</SelectItem>
                            <SelectItem value="Probka şurup">Probka şurup</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="torpaqlanma" className="text-right">Torpaqlanma</Label>
                     <Select name="torpaqlanma">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Var">Var</SelectItem>
                            <SelectItem value="Yoxdur">Yoxdur</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="etiket" className="text-right">Etiket</Label>
                     <Select name="etiket">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Var">Var</SelectItem>
                            <SelectItem value="Yoxdur">Yoxdur</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {commonFields}
            </>
        );
    } else if (selectedAssetType === 'Switch') {
        return (
            <>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="marka" className="text-right">Marka</Label>
                    <Select name="marka">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Marka seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Huawei">Huawei</SelectItem>
                            <SelectItem value="Hikvision">Hikvision</SelectItem>
                            <SelectItem value="Aruba">Aruba</SelectItem>
                            <SelectItem value="Cisco">Cisco</SelectItem>
                            <SelectItem value="Dahua">Dahua</SelectItem>
                            <SelectItem value="AT">AT</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="model" className="text-right">Model</Label>
                    <Input id="model" name="model" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="adapter" className="text-right">Adapter</Label>
                    <Input id="adapter" name="adapter" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="seriaNomresi" className="text-right">Seria Nömrəsi</Label>
                    <Input id="seriaNomresi" name="seriaNomresi" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="switchTipi" className="text-right">Tipi</Label>
                    <Select name="switchTipi">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Növü seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="İndustrial tipli">İndustrial tipli</SelectItem>
                            <SelectItem value="Kommersiya tipli">Kommersiya tipli</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="management" className="text-right">Management</Label>
                    <Select name="management">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="idarə olunan">İdarə olunan</SelectItem>
                            <SelectItem value="idarə olunmayan">İdarə olunmayan</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="switchYeri" className="text-right">Yeri</Label>
                    <Select name="switchYeri">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Yeri seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Qapı">Qapı</SelectItem>
                            <SelectItem value="Rəf">Rəf</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="konfiqurasiya" className="text-right">Konfiqurasiya</Label>
                    <Select name="konfiqurasiya">
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="olunub">Olunub</SelectItem>
                            <SelectItem value="olunmayıb">Olunmayıb</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sfpModul" className="text-right">SFP Modul</Label>
                    <Input id="sfpModul" name="sfpModul" className="col-span-3" />
                </div>
                {commonFields}
            </>
        )
    }
    
    return commonFields;
  }

  const renderNodeView = () => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Təhlükəsizlik Nöqtələri (Node)</CardTitle>
              <CardDescription>Assetləri görmək üçün bir nöqtə seçin.</CardDescription>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Ad</TableHead>
                        <TableHead>Növ</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Layihə</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockNodes.map((node) => (
                        <TableRow key={node.id} onClick={() => setSelectedNode(node)} className="cursor-pointer">
                            <TableCell className="font-medium">{node.name}</TableCell>
                            <TableCell>{node.type}</TableCell>
                            <TableCell>{node.seherRayon}</TableCell>
                            <TableCell>{node.layihe}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );

  const renderAssetView = () => {
    if (!selectedNode) return null;
    const filteredAssets = assets.filter(asset => asset.nodeId === selectedNode.id);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                <Button variant="ghost" onClick={() => setSelectedNode(null)} className="mb-2">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Geri
                </Button>
                <CardTitle>{selectedNode.name} - Assetlər</CardTitle>
                <CardDescription>Bu nöqtəyə bağlı assetləri idarə edin.</CardDescription>
                </div>
                 <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { setIsDialogOpen(isOpen); if (!isOpen) setSelectedAssetType(''); }}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Asset əlavə et
                        </span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleAddAsset}>
                        <DialogHeader>
                            <DialogTitle>Yeni Asset əlavə et</DialogTitle>
                            <DialogDescription>
                            {selectedNode.name} üçün yeni asset təfərrüatlarını daxil edin.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">Növ</Label>
                            <Select name="type" required onValueChange={(value: Asset['type']) => setSelectedAssetType(value)}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Asset növünü seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Dirək">Dirək</SelectItem>
                                    <SelectItem value="Qutu">Qutu</SelectItem>
                                    <SelectItem value="Kamera">Kamera</SelectItem>
                                    <SelectItem value="Switch">Switch</SelectItem>
                                    <SelectItem value="Data Kabeli">Data Kabeli</SelectItem>
                                    <SelectItem value="Elektrik Kabeli">Elektrik Kabeli</SelectItem>
                                </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Ad</Label>
                            <Input id="name" name="name" className="col-span-3" required />
                            </div>
                            {renderAddAssetFormFields()}
                        </div>
                        <DialogFooter>
                            <Button type="submit">Asseti yadda saxla</Button>
                        </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Ad</TableHead>
                    <TableHead>Növ/Detal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Əlavə etdi</TableHead>
                    <TableHead>
                        <span className="sr-only">Əməliyyatlar</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredAssets.map((asset) => {
                    const user = mockUsers.find(u => u.id === asset.addedBy);
                    return (
                        <TableRow key={asset.id}>
                        <TableCell className="font-medium">{asset.name}</TableCell>
                        <TableCell>{renderAssetDetails(asset)}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge>
                        </TableCell>
                        <TableCell>{asset.region}</TableCell>
                        <TableCell>{user?.name || 'Naməlum'}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Menyunu aç/bağla</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Əməliyyatlar</DropdownMenuLabel>
                                <DropdownMenuItem>Redaktə et</DropdownMenuItem>
                                <DropdownMenuItem>Sil</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    );
                    })}
                </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
  }

  return selectedNode ? renderAssetView() : renderNodeView();
}
