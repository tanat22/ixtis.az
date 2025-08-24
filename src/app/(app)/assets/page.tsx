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
import { MoreHorizontal, PlusCircle, ChevronLeft, LocateFixed, Camera, FilterX, Pencil, ArrowRightLeft, Trash2, GitCommitHorizontal, GitBranch } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { mockAssets, mockUsers, mockNodes, azerbaijanCities, cityRayons } from '@/lib/data';
import type { Asset, DirekAsset, DataKabelAsset, ElektrikKabelAsset, KameraAsset, QutuAsset, SwitchAsset, TasinmazEmlak } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


type NodeFilterState = {
  region: string | 'all';
  rayon: string | 'all';
  nodeType: TasinmazEmlak['type'] | 'all';
};

type AssetNodeProps = {
  asset: Asset;
  allAssets: Asset[];
  level: number;
  onAssetSelect: (asset: Asset) => void;
};

// Asset Tree Node Component
const AssetNode: React.FC<AssetNodeProps> = ({ asset, allAssets, level, onAssetSelect }) => {
  const children = allAssets.filter(child => child.parentId === asset.id);

  return (
    <div style={{ marginLeft: level > 0 ? `${level * 20}px` : '0px' }}>
      <Card className="mb-2 hover:bg-muted/50 cursor-pointer" onClick={() => onAssetSelect(asset)}>
        <CardContent className="p-3 flex items-center gap-4">
           {level > 0 && <GitCommitHorizontal className="h-6 w-6 text-muted-foreground self-start mt-1" />}
           {level === 0 && <GitBranch className="h-6 w-6 text-muted-foreground self-start mt-1" />}
          <div className='flex-1'>
            <p className="font-semibold">{asset.name}</p>
            <p className="text-sm text-muted-foreground">{asset.type}</p>
          </div>
          <Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge>
        </CardContent>
      </Card>
      {children.length > 0 && (
        <div className="pl-4 border-l-2 border-dashed ml-4">
          {children.map(child => (
            <AssetNode 
                key={child.id} 
                asset={child} 
                allAssets={allAssets} 
                level={level + 1} 
                onAssetSelect={onAssetSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};


const getStatusVariant = (status: Asset['status']) => {
    switch (status) {
      case 'Aktiv': return 'default';
      case 'Təmir': return 'secondary';
      case 'Qeyri-aktiv': return 'destructive';
      case 'Anbarda': return 'outline';
      case 'İstifadəyə Yararsız': return 'destructive';
      default: return 'outline';
    }
};

export default function AssetsPage() {
  const [assets, setAssets] = React.useState<Asset[]>(mockAssets);
  const [nodes, setNodes] = React.useState<TasinmazEmlak[]>(mockNodes);
  const [filteredNodes, setFilteredNodes] = React.useState<TasinmazEmlak[]>(mockNodes);
  
  // Dialog/Sheet states
  const [isAssetDialogOpen, setIsAssetDialogOpen] = React.useState(false);
  const [isNodeDialogOpen, setIsNodeDialogOpen] = React.useState(false);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = React.useState(false);

  // Selection states
  const [selectedNode, setSelectedNode] = React.useState<TasinmazEmlak | null>(null);
  const [selectedAssetForForm, setSelectedAssetForForm] = React.useState<Asset | null>(null);
  const [selectedAssetType, setSelectedAssetType] = React.useState<Asset['type'] | ''>('');
  const [selectedAssetForDetail, setSelectedAssetForDetail] = React.useState<Asset | null>(null);

  // Form states
  const [nodeFormData, setNodeFormData] = React.useState<Partial<TasinmazEmlak>>({});
  const [availableRayons, setAvailableRayons] = React.useState<string[]>([]);
  
  // Filter states
  const [nodeFilters, setNodeFilters] = React.useState<NodeFilterState>({
    region: 'all',
    rayon: 'all',
    nodeType: 'all',
  });
  const [filterRayons, setFilterRayons] = React.useState<string[]>([]);

  // Camera states
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const photoRef = React.useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);

  const { toast } = useToast();

  React.useEffect(() => {
    if (nodeFormData.seher && cityRayons[nodeFormData.seher]) {
        setAvailableRayons(cityRayons[nodeFormData.seher]);
    } else {
        setAvailableRayons([]);
    }
    if (nodeFormData.rayon && !cityRayons[nodeFormData.seher]?.includes(nodeFormData.rayon)) {
      setNodeFormData(prev => ({...prev, rayon: undefined}));
    }
  }, [nodeFormData.seher]);

  React.useEffect(() => {
    const getCameraPermission = async () => {
      if (!isCameraOpen) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Kamera Xətası',
          description: 'Kamera icazələrini brauzer ayarlarından aktiv edin.',
        });
      }
    };
    getCameraPermission();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen, toast]);

  React.useEffect(() => {
    if (nodeFilters.region !== 'all' && cityRayons[nodeFilters.region]) {
        setFilterRayons(cityRayons[nodeFilters.region]);
    } else {
        setFilterRayons([]);
    }
    if (nodeFilters.rayon !== 'all' && !cityRayons[nodeFilters.region]?.includes(nodeFilters.rayon)) {
      handleFilterChange('rayon', 'all');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeFilters.region]);

  const handleFilterChange = (filterName: keyof NodeFilterState, value: string) => {
    setNodeFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const applyNodeFilters = () => {
    let data = [...nodes];
    if (nodeFilters.region !== 'all') data = data.filter(node => node.seher === nodeFilters.region);
    if (nodeFilters.rayon !== 'all') data = data.filter(node => node.rayon === nodeFilters.rayon);
    if (nodeFilters.nodeType !== 'all') data = data.filter(node => node.type === nodeFilters.nodeType);
    setFilteredNodes(data);
  };
  
  const resetNodeFilters = () => {
    setNodeFilters({ region: 'all', rayon: 'all', nodeType: 'all' });
    setFilteredNodes(nodes);
  }

  const handleOpenAssetForm = (assetToEdit: Asset | null = null) => {
    setSelectedAssetForForm(assetToEdit);
    setSelectedAssetType(assetToEdit ? assetToEdit.type : '');
    setIsAssetDialogOpen(true);
  };

  const handleAssetDetailSelect = (asset: Asset) => {
    setSelectedAssetForDetail(asset);
    setIsDetailSheetOpen(true);
  };

  const getCommonData = (formData: FormData, existingAsset: Asset | null) => {
      const assetType = formData.get('type') as Asset['type'];
      const existingAssetsOfType = assets.filter(a => a.nodeId === selectedNode!.id && a.type === assetType);
      let newAssetName = `${assetType}-${existingAssetsOfType.length + 1}`;

      return {
        id: existingAsset?.id || `asset-${Date.now()}`,
        nodeId: selectedNode!.id,
        name: existingAsset?.name || newAssetName,
        region: selectedNode!.seher || 'N/A',
        status: existingAsset?.status || 'Aktiv' as const,
        location: existingAsset?.location || { lat: 40.37, lng: 49.84 },
        addedBy: existingAsset?.addedBy || 'user-1',
        addedDate: existingAsset?.addedDate || new Date().toISOString().split('T')[0],
        qurasdirilmaTarixi: formData.get('qurasdirilmaTarixi') as string,
        qeyd: formData.get('qeyd') as string,
        parentId: formData.get('parentId') as string || null,
      };
  }

  const handleSaveAsset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedNode) return;

    const formData = new FormData(event.currentTarget);
    const assetType = formData.get('type') as Asset['type'];
    const commonData = getCommonData(formData, selectedAssetForForm);

    let newOrUpdatedAsset: Asset;

    if (assetType === 'Dirək') {
        newOrUpdatedAsset = { ...commonData, type: 'Dirək',
            istehsalci: formData.get('istehsalci') as DirekAsset['istehsalci'],
            hundurluk: Number(formData.get('hundurluk')),
            reng: formData.get('reng') as DirekAsset['reng'],
            nov: formData.get('nov') as DirekAsset['nov'],
            hendesiForma: formData.get('hendesiForma') as DirekAsset['hendesiForma'],
            material: formData.get('material') as DirekAsset['material'],
            istismarVeziyyeti: formData.get('istismarVeziyyeti') as DirekAsset['istismarVeziyyeti'],
            qol: formData.get('qol') as DirekAsset['qol'],
            etek: formData.get('etek') as DirekAsset['etek'],
            sapka: formData.get('sapka') as DirekAsset['sapka'],
            qapaq: formData.get('qapaq') as DirekAsset['qapaq'],
            direyinTemizliyi: formData.get('direyinTemizliyi') as DirekAsset['direyinTemizliyi'],
            torpaqlanma: formData.get('torpaqlanma') as DirekAsset['torpaqlanma'],
            bunovreNovu: formData.get('bunovreNovu') as DirekAsset['bunovreNovu'],
            bunovreVeziyyeti: formData.get('bunovreVeziyyeti') as DirekAsset['bunovreVeziyyeti'],
            ankerVeziyyeti: formData.get('ankerVeziyyeti') as DirekAsset['ankerVeziyyeti'],
        };
    } else if (assetType === 'Data Kabeli') {
        newOrUpdatedAsset = { ...commonData, type: 'Data Kabeli',
            ethernetTipi: formData.get('ethernetTipi') as string,
            ethernetUzunluq: Number(formData.get('ethernetUzunluq')),
            patchcordTipi: formData.get('patchcordTipi') as string,
            patchcordUzunluq: Number(formData.get('patchcordUzunluq')),
            optikYerlesme: formData.get('optikYerlesme') as DataKabelAsset['optikYerlesme'],
        };
    } else if (assetType === 'Elektrik Kabeli') {
        newOrUpdatedAsset = { ...commonData, type: 'Elektrik Kabeli',
            kabelTipi: formData.get('kabelTipi') as string,
            kabelUzunluq: Number(formData.get('kabelUzunluq')),
            uzaticiYuvaSayi: Number(formData.get('uzaticiYuvaSayi')),
            uzaticiUzunluq: Number(formData.get('uzaticiUzunluq')),
            birlesmeUsulu: formData.get('birlesmeUsulu') as ElektrikKabelAsset['birlesmeUsulu'],
        }
    } else if (assetType === 'Kamera') {
        const existingCameras = assets.filter(a => a.nodeId === selectedNode.id && a.type === 'Kamera');
        const newAssetName = `CAM-${existingCameras.length + 1}`;
        newOrUpdatedAsset = { ...commonData, name: selectedAssetForForm?.name || newAssetName, type: 'Kamera',
            marka: formData.get('marka') as string,
            model: formData.get('model') as string,
            funksiya: formData.get('funksiya') as KameraAsset['funksiya'],
            seriaNomresi: formData.get('seriaNomresi') as string,
            kameraNovu: formData.get('kameraNovu') as KameraAsset['kameraNovu'],
            adapter: formData.get('adapter') as string,
            reng: formData.get('reng') as KameraAsset['reng'],
            kameraQolu: formData.get('kameraQolu') as KameraAsset['kameraQolu'],
            qolIstismarVeziyyeti: formData.get('qolIstismarVeziyyeti') as KameraAsset['qolIstismarVeziyyeti'],
            montajAksesuari: formData.get('montajAksesuari') as KameraAsset['montajAksesuari'],
            montajAksesuariIstismarVeziyyeti: formData.get('montajAksesuariIstismarVeziyyeti') as KameraAsset['montajAksesuariIstismarVeziyyeti'],
            kameraTemizliyi: formData.get('kameraTemizliyi') as KameraAsset['kameraTemizliyi'],
        }
    } else if (assetType === 'Qutu') {
        const mertebe = formData.get('mertebe') as QutuAsset['mertebe'];
        const existingQutuOnMertebe = assets.filter(a => a.type === 'Qutu' && (a as QutuAsset).mertebe === mertebe && a.nodeId === selectedNode.id);
        const newAssetName = `${mertebe ? mertebe + '-' : ''}Qutu-${existingQutuOnMertebe.length + 1}`;
        newOrUpdatedAsset = { ...commonData, name: selectedAssetForForm?.name || newAssetName, type: 'Qutu',
            istehsalci: formData.get('istehsalci') as QutuAsset['istehsalci'],
            tipi: formData.get('tipi') as QutuAsset['tipi'],
            soyutmaSistemi: formData.get('soyutmaSistemi') as QutuAsset['soyutmaSistemi'],
            termalSensor: formData.get('termalSensor') as QutuAsset['termalSensor'],
            reng: formData.get('reng') as QutuAsset['reng'],
            acarYeri: formData.get('acarYeri') as QutuAsset['acarYeri'],
            refSayi: formData.get('refSayi') as QutuAsset['refSayi'],
            berkidilmeUsulu: formData.get('berkidilmeUsulu') as QutuAsset['berkidilmeUsulu'],
            torpaqlanma: formData.get('torpaqlanma') as QutuAsset['torpaqlanma'],
            etiket: formData.get('etiket') as QutuAsset['etiket'],
            mertebe: mertebe,
            istismarVeziyyeti: formData.get('istismarVeziyyeti') as QutuAsset['istismarVeziyyeti'],
            elaveKilidMexanizmi: formData.get('elaveKilidMexanizmi') as QutuAsset['elaveKilidMexanizmi'],
            kilidIstismarVeziyyeti: formData.get('kilidIstismarVeziyyeti') as QutuAsset['kilidIstismarVeziyyeti'],
            qutununXariciTemizliyi: formData.get('qutununXariciTemizliyi') as QutuAsset['qutununXariciTemizliyi'],
            qutununDaxiliTemizliyi: formData.get('qutununDaxiliTemizliyi') as QutuAsset['qutununDaxiliTemizliyi'],
        }
    } else if (assetType === 'Switch') {
        const existingSwitches = assets.filter(a => a.nodeId === selectedNode.id && a.type === 'Switch');
        const newAssetName = `SW-${existingSwitches.length + 1}`;
        newOrUpdatedAsset = { ...commonData, name: selectedAssetForForm?.name || newAssetName, type: 'Switch',
            marka: formData.get('marka') as string,
            model: formData.get('model') as string,
            adapter: formData.get('adapter') as string,
            seriaNomresi: formData.get('seriaNomresi') as string,
            switchTipi: formData.get('switchTipi') as SwitchAsset['switchTipi'],
            management: formData.get('management') as SwitchAsset['management'],
            switchYeri: formData.get('switchYeri') as SwitchAsset['switchYeri'],
            konfiqurasiya: formData.get('konfiqurasiya') as SwitchAsset['konfiqurasiya'],
            sfpModul: formData.get('sfpModul') as string,
            ups: formData.get('ups') as string,
            stabilizator: formData.get('stabilizator') as string,
        }
    } else {
        newOrUpdatedAsset = { ...commonData, type: assetType };
    }
    
    if (selectedAssetForForm) { // Update existing
        setAssets(prev => prev.map(a => a.id === newOrUpdatedAsset.id ? newOrUpdatedAsset : a));
        toast({ title: "Uğurlu Əməliyyat", description: `${assetType} tipli asset yeniləndi.` });
        if (selectedAssetForDetail?.id === newOrUpdatedAsset.id) {
            setSelectedAssetForDetail(newOrUpdatedAsset);
        }
    } else { // Add new
        setAssets(prev => [newOrUpdatedAsset, ...prev]);
        toast({ title: "Uğurlu Əməliyyat", description: `${assetType} tipli yeni asset yaradıldı.` });
    }

    setIsAssetDialogOpen(false);
    setSelectedAssetType('');
    setSelectedAssetForForm(null);
  };

  const handleAddNode = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newNode: TasinmazEmlak = {
        id: `ts-${Date.now()}`,
        name: formData.get('name') as string,
        type: formData.get('type') as TasinmazEmlak['type'],
        aktivlesmeTarixi: formData.get('aktivlesmeTarixi') as string,
        seher: formData.get('seher') as string,
        rayon: formData.get('rayon') as string,
        koordinatX: formData.get('koordinatX') as string,
        koordinatY: formData.get('koordinatY') as string,
        layihe: formData.get('layihe') as string,
        dataMenbeyi: formData.get('dataMenbeyi') as TasinmazEmlak['dataMenbeyi'],
        bagliOlduguNeqte: formData.get('bagliOlduguNeqte') as string,
        elektrikMenbeyi: formData.get('elektrikMenbeyi') as TasinmazEmlak['elektrikMenbeyi'],
        qeyd: formData.get('qeyd') as string,
        photo: capturedImage, // Save the captured image
    };
    setNodes(prev => [newNode, ...prev]);
    setFilteredNodes(prev => [newNode, ...prev])
    setIsNodeDialogOpen(false);
    setNodeFormData({});
    setCapturedImage(null); // Reset captured image
    toast({
        title: "Uğurlu Əməliyyat",
        description: `"${newNode.name}" adlı yeni nöqtə yaradıldı.`
    })
  };

  const handleStatusChange = (assetId: string, newStatus: Asset['status']) => {
    const updater = (prev: Asset[]) => prev.map(asset => 
        asset.id === assetId ? { ...asset, status: newStatus } : asset
    );
    setAssets(updater);
    if (selectedAssetForDetail && selectedAssetForDetail.id === assetId) {
        setSelectedAssetForDetail(prev => prev ? {...prev, status: newStatus} : null);
    }
    toast({
        title: "Status Dəyişdirildi",
        description: `Asset statusu "${newStatus}" olaraq yeniləndi.`
    })
  };
  
  const getCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setNodeFormData(prev => ({
            ...prev,
            koordinatY: latitude.toFixed(6), // Latitude for Y
            koordinatX: longitude.toFixed(6), // Longitude for X
          }));
          toast({
            title: "Koordinatlar Alındı",
            description: `Enlik: ${latitude.toFixed(6)}, Uzunluq: ${longitude.toFixed(6)}`,
          });
        },
        (error) => {
          toast({
            variant: "destructive",
            title: "GPS Xətası",
            description: "Lokasiya məlumatlarını almaq mümkün olmadı. Brauzer icazələrini yoxlayın.",
          });
          console.error("Error getting location: ", error);
        }
      );
    } else {
       toast({
         variant: "destructive",
         title: "GPS Dəstəklənmir",
         description: "Brauzeriniz geolokasiyanı dəstəkləmir.",
       });
    }
  };
  
  const takePhoto = () => {
    if (videoRef.current && photoRef.current) {
        const video = videoRef.current;
        const photo = photoRef.current;
        const width = video.videoWidth;
        const height = video.videoHeight;
        photo.width = width;
        photo.height = height;
        const ctx = photo.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0, width, height);
            const dataUrl = photo.toDataURL('image/jpeg');
            setCapturedImage(dataUrl);
            setNodeFormData(prev => ({ ...prev, photo: dataUrl }));
            setIsCameraOpen(false); // Close camera view after taking photo
        }
    }
  };

  const handleNodeFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNodeFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNodeFormSelectChange = (name: keyof TasinmazEmlak, value: string) => {
     setNodeFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderAssetDetails = (asset: Asset) => {
    let parentName = '';
    if (asset.parentId) {
        const parentAsset = assets.find(a => a.id === asset.parentId);
        if (parentAsset) {
            parentName = ` (-> ${parentAsset.name})`;
        }
    }
    switch (asset.type) {
        case 'Kamera': return `Marka: ${asset.marka || 'N/A'}, Model: ${asset.model || 'N/A'}${parentName}`;
        case 'Switch': return `Marka: ${asset.marka || 'N/A'}, Model: ${asset.model || 'N/A'}${parentName}`;
        default: return <span className="text-muted-foreground">Tip: {asset.type}</span>;
    }
  }

  const renderAddAssetFormFields = () => {
    if (!selectedAssetType) return null;
    if(!selectedNode) return null;

    const availableSwitches = assets.filter(a => a.nodeId === selectedNode.id && a.type === 'Switch');
    const availableQutus = assets.filter(a => a.nodeId === selectedNode.id && a.type === 'Qutu');
    const showMertebe = selectedNode && !['Təhlükəsizlik Nöqtəsi', 'Alt Keçid', 'Üst Keçid', 'Metro'].includes(selectedNode.type);

    const cameraModels = ["Dahua DH-SD8A3440GA-HNV", "Dom kamera Tandem VU Hikvision DS-2SF8C442MXG-EIW/26 FO", "Telefunken", "Dom Kamera Hikvision DS-2DF8A442IXS-AEL T5", "Dome kamera AXİS Q6135-LE", "Dome kamera AXİS Q61145-E", "Dome Kamera Telefunken VSC-03561-015c", "Dome kamera Telefunken VSC-1210a", "Dom kamera Ekin (Korpus ekin kamera telefunken)", "Dom kamera Hikvision DS-2DE4425IW-DE", "Dom kamera Hikvision DS-2DE4A425IWG-E", "Dom kamera Aviglon 5,0C-H5A-DO2", "PTZ Camera AXIS P5676-LE 50q", "Fix Kamera Hikvision IDS-2CD7A46G0/P-IZHS (2.8-12mm)", "FİX Kamera AXİS Q1615-LE", "FİX Kamera AXİS Q1615-E", "Sanyo 5600", "Digər" ];
    const switchModels = ["S5735-L8P4X-QA-V2 (8x10/100/1000BASE-T)", "Switch Allied Telesyn AT-iMG606BD", "6000", "Cisco Industrial Switch IE-2000-16PTC-G-E", "Switch Allied Telesyn AT-x230-10GP", "Switch Hikvision DS-3E2510P POE", "8100", "GS950"];
    const sfpModules = ["Allied Telesis 1310/1490", "Allied Telesis 1490/1310", "Huawei 1310/1490", "Huawei 1490/1310", "Hikvision 1330/1550", "Hikvision 1550/1330", "İntellinet 1330", "İntellinet 1550", "İnnova 1310/1490", "İnnova 1490/1310"];

    const currentAsset = selectedAssetForForm;

    const commonFields = (
        <>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="qurasdirilmaTarixi" className="text-right">Quraşdırılma Tarixi</Label>
                <Input id="qurasdirilmaTarixi" name="qurasdirilmaTarixi" type="date" className="col-span-3" defaultValue={currentAsset?.qurasdirilmaTarixi} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="qeyd" className="text-right">Qeyd</Label>
                <Input id="qeyd" name="qeyd" className="col-span-3" defaultValue={currentAsset?.qeyd} />
            </div>
        </>
    );

    if (selectedAssetType === 'Dirək' && currentAsset?.type === 'Dirək') {
      return (
        <>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="istehsalci" className="text-right">İstehsalçı</Label><Select name="istehsalci" defaultValue={currentAsset.istehsalci}><SelectTrigger className="col-span-3"><SelectValue placeholder="İstehsalçı seçin" /></SelectTrigger><SelectContent><SelectItem value="İDEA">İDEA</SelectItem><SelectItem value="OZON">OZON</SelectItem><SelectItem value="FRANSIZ">FRANSIZ</SelectItem><SelectItem value="BCG">BCG</SelectItem><SelectItem value="Digər">Digər</SelectItem></SelectContent></Select></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="hundurluk" className="text-right">Hündürlük (m)</Label><Input id="hundurluk" name="hundurluk" type="number" className="col-span-3" defaultValue={currentAsset.hundurluk} /></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="reng" className="text-right">Rəng</Label><Select name="reng" defaultValue={currentAsset.reng}><SelectTrigger className="col-span-3"><SelectValue placeholder="Rəngi seçin" /></SelectTrigger><SelectContent><SelectItem value="Boz">Boz</SelectItem><SelectItem value="Qara">Qara</SelectItem><SelectItem value="Ağ">Ağ</SelectItem><SelectItem value="Boyasız">Boyasız</SelectItem><SelectItem value="Digər">Digər</SelectItem></SelectContent></Select></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="nov" className="text-right">Növ</Label><Select name="nov" defaultValue={currentAsset.nov}><SelectTrigger className="col-span-3"><SelectValue placeholder="Dirək növünü seçin" /></SelectTrigger><SelectContent><SelectItem value="T">T</SelectItem><SelectItem value="I">I</SelectItem><SelectItem value="Г">Г</SelectItem></SelectContent></Select></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="hendesiForma" className="text-right">Həndəsi Forma</Label><Select name="hendesiForma" defaultValue={currentAsset.hendesiForma}><SelectTrigger className="col-span-3"><SelectValue placeholder="Formanı seçin" /></SelectTrigger><SelectContent><SelectItem value="Kvadrat">Kvadrat</SelectItem><SelectItem value="Dairəvi">Dairəvi</SelectItem><SelectItem value="Dairəvi Xonçalı">Dairəvi Xonçalı</SelectItem></SelectContent></Select></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="material" className="text-right">Material</Label><Select name="material" defaultValue={currentAsset.material}><SelectTrigger className="col-span-3"><SelectValue placeholder="Materialı seçin" /></SelectTrigger><SelectContent><SelectItem value="Qara metal">Qara metal</SelectItem><SelectItem value="Qalvanizasiya olunmuş qara metal">Qalvanizasiya olunmuş qara metal</SelectItem><SelectItem value="Aluminium">Aluminium</SelectItem></SelectContent></Select></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="istismarVeziyyeti" className="text-right">İstismar Vəziyyəti</Label><Select name="istismarVeziyyeti" defaultValue={currentAsset.istismarVeziyyeti}><SelectTrigger className="col-span-3"><SelectValue placeholder="Vəziyyəti seçin" /></SelectTrigger><SelectContent><SelectItem value="Yararlı">Yararlı</SelectItem><SelectItem value="Yararsız">Yararsız</SelectItem><SelectItem value="Restovrasiya olunmalıdır">Restovrasiya olunmalıdır</SelectItem></SelectContent></Select></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="qol" className="text-right">Qol</Label><Select name="qol" defaultValue={currentAsset.qol}><SelectTrigger className="col-span-3"><SelectValue placeholder="Vəziyyəti seçin" /></SelectTrigger><SelectContent><SelectItem value="Yararlı">Yararlı</SelectItem><SelectItem value="Yararsız">Yararsız</SelectItem><SelectItem value="Restovrasiya olunmalıdır">Restovrasiya olunmalıdır</SelectItem></SelectContent></Select></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="etek" className="text-right">Ətək</Label><Select name="etek" defaultValue={currentAsset.etek}><SelectTrigger className="col-span-3"><SelectValue placeholder="Vəziyyəti seçin" /></SelectTrigger><SelectContent><SelectItem value="Yararlı">Yararlı</SelectItem><SelectItem value="Yararsız">Yararsız</SelectItem><SelectItem value="Restovrasiya olunmalıdır">Restovrasiya olunmalıdır</SelectItem></SelectContent></Select></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="sapka" className="text-right">Şapka</Label><Select name="sapka" defaultValue={currentAsset.sapka}><SelectTrigger className="col-span-3"><SelectValue placeholder="Vəziyyəti seçin" /></SelectTrigger><SelectContent><SelectItem value="Yararlı">Yararlı</SelectItem><SelectItem value="Yararsız">Yararsız</SelectItem><SelectItem value="Restovrasiya olunmalıdır">Restovrasiya olunmalıdır</SelectItem></SelectContent></Select></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="qapaq" className="text-right">Qapaq</Label><Select name="qapaq" defaultValue={currentAsset.qapaq}><SelectTrigger className="col-span-3"><SelectValue placeholder="Vəziyyəti seçin" /></SelectTrigger><SelectContent><SelectItem value="Yararlı">Yararlı</SelectItem><SelectItem value="Yararsız">Yararsız</SelectItem><SelectItem value="Restovrasiya olunmalıdır">Restovrasiya olunmalıdır</SelectItem></SelectContent></Select></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="direyinTemizliyi" className="text-right">Dirəyin Təmizliyi</Label><Select name="direyinTemizliyi" defaultValue={currentAsset.direyinTemizliyi}><SelectTrigger className="col-span-3"><SelectValue placeholder="Təmizliyi seçin" /></SelectTrigger><SelectContent><SelectItem value="Təmiz">Təmiz</SelectItem><SelectItem value="Çirkli">Çirkli</SelectItem></SelectContent></Select></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="torpaqlanma" className="text-right">Torpaqlanma</Label><Select name="torpaqlanma" defaultValue={currentAsset.torpaqlanma}><SelectTrigger className="col-span-3"><SelectValue placeholder="Seçin" /></SelectTrigger><SelectContent><SelectItem value="Var">Var</SelectItem><SelectItem value="Yoxdur">Yoxdur</SelectItem></SelectContent></Select></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="bunovreNovu" className="text-right">Bünövrə Növü</Label><Select name="bunovreNovu" defaultValue={currentAsset.bunovreNovu}><SelectTrigger className="col-span-3"><SelectValue placeholder="Növü seçin" /></SelectTrigger><SelectContent><SelectItem value="Stasionar">Stasionar</SelectItem><SelectItem value="Səyyar bastırılmış">Səyyar bastırılmış</SelectItem><SelectItem value="Səyyar yer üstü">Səyyar yer üstü</SelectItem></SelectContent></Select></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="bunovreVeziyyeti" className="text-right">Bünövrə Vəziyyəti</Label><Select name="bunovreVeziyyeti" defaultValue={currentAsset.bunovreVeziyyeti}><SelectTrigger className="col-span-3"><SelectValue placeholder="Vəziyyəti seçin" /></SelectTrigger><SelectContent><SelectItem value="Yararlı">Yararlı</SelectItem><SelectItem value="Aşınmış">Aşınmış</SelectItem><SelectItem value="Ölçü qüsurlu">Ölçü qüsurlu</SelectItem></SelectContent></Select></div>
          <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="ankerVeziyyeti" className="text-right">Anker/Bolt/Qayka Vəziyyəti</Label><Select name="ankerVeziyyeti" defaultValue={currentAsset.ankerVeziyyeti}><SelectTrigger className="col-span-3"><SelectValue placeholder="Vəziyyəti seçin" /></SelectTrigger><SelectContent><SelectItem value="Yararlı">Yararlı</SelectItem><SelectItem value="Yararsız">Yararsız</SelectItem></SelectContent></Select></div>
          {commonFields}
        </>
      );
    } else if (selectedAssetType === 'Data Kabeli' && currentAsset?.type === 'Data Kabeli') {
        return (
            <>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="ethernetTipi" className="text-right">Ethernet Tipi</Label><Select name="ethernetTipi" defaultValue={currentAsset.ethernetTipi}><SelectTrigger className="col-span-3"><SelectValue placeholder="Ethernet tipini seçin" /></SelectTrigger><SelectContent><SelectItem value="Patchcord Ethernet CAT6 1M.">Patchcord Ethernet CAT6 1M.</SelectItem><SelectItem value="CAT6 Kabel Outdoor (Black)">CAT6 Kabel Outdoor (Black)</SelectItem><SelectItem value="Cat 6 Ethernet Kabel">Cat 6 Ethernet Kabel</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="ethernetUzunluq" className="text-right">Ethernet Uzunluq (m)</Label><Input id="ethernetUzunluq" name="ethernetUzunluq" type="number" className="col-span-3" defaultValue={currentAsset.ethernetUzunluq} /></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="patchcordTipi" className="text-right">Patchcord Tipi</Label><Select name="patchcordTipi" defaultValue={currentAsset.patchcordTipi}><SelectTrigger className="col-span-3"><SelectValue placeholder="Patchcord tipini seçin" /></SelectTrigger><SelectContent><SelectItem value="Patchcord optik 1M">Patchcord optik 1M</SelectItem><SelectItem value="FO Patchcord 7m">FO Patchcord 7m</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="patchcordUzunluq" className="text-right">Patchcord Uzunluq (m)</Label><Input id="patchcordUzunluq" name="patchcordUzunluq" type="number" className="col-span-3" defaultValue={currentAsset.patchcordUzunluq} /></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="optikYerlesme" className="text-right">Optik Yerləşmə</Label><Select name="optikYerlesme" defaultValue={currentAsset.optikYerlesme}><SelectTrigger className="col-span-3"><SelectValue placeholder="Yerləşməni seçin" /></SelectTrigger><SelectContent><SelectItem value="Aşağıda">Aşağıda</SelectItem><SelectItem value="Yuxarıda">Yuxarıda</SelectItem></SelectContent></Select></div>
                {commonFields}
            </>
        );
    } else if (selectedAssetType === 'Elektrik Kabeli' && currentAsset?.type === 'Elektrik Kabeli') {
        return (
            <>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="kabelTipi" className="text-right">Kabel Tipi</Label><Select name="kabelTipi" defaultValue={currentAsset.kabelTipi}><SelectTrigger className="col-span-3"><SelectValue placeholder="Kabel tipini seçin" /></SelectTrigger><SelectContent><SelectItem value="Elektrik kabeli 2x2.25">Elektrik kabeli 2x2.25</SelectItem><SelectItem value="Elektrik kabeli 2x0.75">Elektrik kabeli 2x0.75</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="kabelUzunluq" className="text-right">Kabel Uzunluğu (m)</Label><Input id="kabelUzunluq" name="kabelUzunluq" type="number" className="col-span-3" defaultValue={currentAsset.kabelUzunluq}/></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="uzaticiYuvaSayi" className="text-right">Uzadıcı Yuva Sayı</Label><Input id="uzaticiYuvaSayi" name="uzaticiYuvaSayi" type="number" className="col-span-3" defaultValue={currentAsset.uzaticiYuvaSayi} /></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="uzaticiUzunluq" className="text-right">Uzadıcı Uzunluğu (m)</Label><Input id="uzaticiUzunluq" name="uzaticiUzunluq" type="number" className="col-span-3" defaultValue={currentAsset.uzaticiUzunluq}/></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="birlesmeUsulu" className="text-right">Birləşmə Üsulu</Label><Select name="birlesmeUsulu" defaultValue={currentAsset.birlesmeUsulu}><SelectTrigger className="col-span-3"><SelectValue placeholder="Üsulu seçin" /></SelectTrigger><SelectContent><SelectItem value="Vilka">Vilka</SelectItem><SelectItem value="Birbaşa">Birbaşa</SelectItem></SelectContent></Select></div>
                {commonFields}
            </>
        );
    } else if (selectedAssetType === 'Kamera' && currentAsset?.type === 'Kamera') {
      return (
        <>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="parentId" className="text-right">Bağlı olduğu Cihaz</Label><Select name="parentId" defaultValue={currentAsset.parentId}><SelectTrigger className="col-span-3"><SelectValue placeholder="Kameranın qoşulduğu switch-i seçin" /></SelectTrigger><SelectContent>{availableSwitches.map(sw => <SelectItem key={sw.id} value={sw.id}>{sw.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="marka" className="text-right">Marka</Label><Select name="marka" defaultValue={currentAsset.marka}><SelectTrigger className="col-span-3"><SelectValue placeholder="Marka seçin" /></SelectTrigger><SelectContent><SelectItem value="Hikvision">Hikvision</SelectItem><SelectItem value="AXİS">AXİS</SelectItem><SelectItem value="Aviglon">Aviglon</SelectItem><SelectItem value="Dahua">Dahua</SelectItem><SelectItem value="Sanyo">Sanyo</SelectItem><SelectItem value="Digər">Digər</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="model" className="text-right">Model</Label><Select name="model" defaultValue={currentAsset.model}><SelectTrigger className="col-span-3"><SelectValue placeholder="Model seçin" /></SelectTrigger><SelectContent>{cameraModels.map(model => <SelectItem key={model} value={model}>{model}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="funksiya" className="text-right">Funksiya</Label><Select name="funksiya" defaultValue={currentAsset.funksiya}><SelectTrigger className="col-span-3"><SelectValue placeholder="Funksiya seçin" /></SelectTrigger><SelectContent><SelectItem value="PTZ musahide">PTZ müşahidə</SelectItem><SelectItem value="PTZ uz tanima">PTZ üz tanıma</SelectItem><SelectItem value="Fiz">Fiz</SelectItem><SelectItem value="NTS">NTS</SelectItem><SelectItem value="Termal">Termal</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="seriaNomresi" className="text-right">Seria Nömrəsi</Label><Input id="seriaNomresi" name="seriaNomresi" className="col-span-3" defaultValue={currentAsset.seriaNomresi}/></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="kameraNovu" className="text-right">Növ</Label><Select name="kameraNovu" defaultValue={currentAsset.kameraNovu}><SelectTrigger className="col-span-3"><SelectValue placeholder="Növü seçin" /></SelectTrigger><SelectContent><SelectItem value="Daxili">Daxili</SelectItem><SelectItem value="Xarici">Xarici</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="adapter" className="text-right">Adapter</Label><Select name="adapter" defaultValue={currentAsset.adapter}><SelectTrigger className="col-span-3"><SelectValue placeholder="Adapter seçin" /></SelectTrigger><SelectContent><SelectItem value="yoxdur">Yoxdur</SelectItem><SelectItem value="Dom kamera Tandem VU adapter CUV-090S036SP">Dom kamera Tandem VU adapter CUV-090S036SP</SelectItem><SelectItem value="Dom Adapter Hikvision TEAC-66-243000V, AC230V,AC24VA3A">Dom Adapter Hikvision TEAC-66-243000V, AC230V,AC24VA3A</SelectItem><SelectItem value="POE Injector Adapter">POE Injector Adapter</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="reng" className="text-right">Rəng</Label><Select name="reng" defaultValue={currentAsset.reng}><SelectTrigger className="col-span-3"><SelectValue placeholder="Rəng seçin" /></SelectTrigger><SelectContent><SelectItem value="ağ">Ağ</SelectItem><SelectItem value="boz">Boz</SelectItem><SelectItem value="qara">Qara</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="kameraQolu" className="text-right">Kamera Qolu</Label><Select name="kameraQolu" defaultValue={currentAsset.kameraQolu}><SelectTrigger className="col-span-3"><SelectValue placeholder="Seçin" /></SelectTrigger><SelectContent><SelectItem value="Var">Var</SelectItem><SelectItem value="Yox">Yox</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="qolIstismarVeziyyeti" className="text-right">Qol İstismar Vəziyyəti</Label><Select name="qolIstismarVeziyyeti" defaultValue={currentAsset.qolIstismarVeziyyeti}><SelectTrigger className="col-span-3"><SelectValue placeholder="Vəziyyəti seçin" /></SelectTrigger><SelectContent><SelectItem value="Yararlı">Yararlı</SelectItem><SelectItem value="Yararsız">Yararsız</SelectItem><SelectItem value="Restovrasiya olunmalıdır">Restovrasiya olunmalıdır</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="montajAksesuari" className="text-right">Montaj Aksesuarı</Label><Select name="montajAksesuari" defaultValue={currentAsset.montajAksesuari}><SelectTrigger className="col-span-3"><SelectValue placeholder="Aksesuarı seçin" /></SelectTrigger><SelectContent><SelectItem value="Təkli">Təkli</SelectItem><SelectItem value="Üçlü">Üçlü</SelectItem><SelectItem value="Düz">Düz</SelectItem><SelectItem value="Dairəvi">Dairəvi</SelectItem><SelectItem value="Yoxdur">Yoxdur</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="montajAksesuariIstismarVeziyyeti" className="text-right">Montaj Aksesuarı Vəziyyəti</Label><Select name="montajAksesuariIstismarVeziyyeti" defaultValue={currentAsset.montajAksesuariIstismarVeziyyeti}><SelectTrigger className="col-span-3"><SelectValue placeholder="Vəziyyəti seçin" /></SelectTrigger><SelectContent><SelectItem value="Yararlı">Yararlı</SelectItem><SelectItem value="Yararsız">Yararsız</SelectItem><SelectItem value="Restovrasiya olunmalıdır">Restovrasiya olunmalıdır</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="kameraTemizliyi" className="text-right">Kamera Təmizliyi</Label><Select name="kameraTemizliyi" defaultValue={currentAsset.kameraTemizliyi}><SelectTrigger className="col-span-3"><SelectValue placeholder="Təmizliyi seçin" /></SelectTrigger><SelectContent><SelectItem value="Təmiz">Təmiz</SelectItem><SelectItem value="Çirkli">Çirkli</SelectItem></SelectContent></Select></div>
            {commonFields}
        </>
      );
    } else if (selectedAssetType === 'Qutu' && currentAsset?.type === 'Qutu') {
        return (
            <>
                {showMertebe && (<div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="mertebe" className="text-right">Mərtəbə</Label><Select name="mertebe" defaultValue={currentAsset.mertebe}><SelectTrigger className="col-span-3"><SelectValue placeholder="Mərtəbəni seçin" /></SelectTrigger><SelectContent>{['M1', 'M2', 'M3', 'M4', 'M5', 'M6'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}{['Z0', 'Z1', 'Z2', 'Z3'].map(z => <SelectItem key={z} value={z}>{z}</SelectItem>)}</SelectContent></Select></div>)}
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="istehsalci" className="text-right">İstehsalçı</Label><Select name="istehsalci" defaultValue={currentAsset.istehsalci}><SelectTrigger className="col-span-3"><SelectValue placeholder="İstehsalçını seçin" /></SelectTrigger><SelectContent><SelectItem value="İDEA">İDEA</SelectItem><SelectItem value="Lande AviCOM">Lande AviCOM</SelectItem><SelectItem value="Lande">Lande</SelectItem><SelectItem value="Lande EKİN">Lande EKİN</SelectItem><SelectItem value="Legrant">Legrant</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="tipi" className="text-right">Tipi</Label><Select name="tipi" defaultValue={currentAsset.tipi}><SelectTrigger className="col-span-3"><SelectValue placeholder="Tipi seçin" /></SelectTrigger><SelectContent><SelectItem value="Yer">Yer</SelectItem><SelectItem value="Dirək">Dirək</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="soyutmaSistemi" className="text-right">Soyutma Sistemi</Label><Select name="soyutmaSistemi" defaultValue={currentAsset.soyutmaSistemi}><SelectTrigger className="col-span-3"><SelectValue placeholder="Sistemi seçin" /></SelectTrigger><SelectContent><SelectItem value="Yoxdur">Yoxdur</SelectItem><SelectItem value="FAN">FAN</SelectItem><SelectItem value="Kuller">Kuller</SelectItem><SelectItem value="Kondisioner">Kondisioner</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="termalSensor" className="text-right">Termal Sensor</Label><Select name="termalSensor" defaultValue={currentAsset.termalSensor}><SelectTrigger className="col-span-3"><SelectValue placeholder="Seçin" /></SelectTrigger><SelectContent><SelectItem value="Var">Var</SelectItem><SelectItem value="Yoxdur">Yoxdur</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="reng" className="text-right">Rəng</Label><Select name="reng" defaultValue={currentAsset.reng}><SelectTrigger className="col-span-3"><SelectValue placeholder="Rəng seçin" /></SelectTrigger><SelectContent><SelectItem value="Boz">Boz</SelectItem><SelectItem value="Qara">Qara</SelectItem><SelectItem value="Ağ">Ağ</SelectItem><SelectItem value="Digər">Digər</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="acarYeri" className="text-right">Açar Yeri</Label><Select name="acarYeri" defaultValue={currentAsset.acarYeri}><SelectTrigger className="col-span-3"><SelectValue placeholder="Seçin" /></SelectTrigger><SelectContent><SelectItem value="Plastik">Plastik</SelectItem><SelectItem value="Metal">Metal</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="refSayi" className="text-right">Rəf Sayı</Label><Select name="refSayi" defaultValue={currentAsset.refSayi}><SelectTrigger className="col-span-3"><SelectValue placeholder="Rəf sayını seçin" /></SelectTrigger><SelectContent><SelectItem value="Rəfsiz">Rəfsiz</SelectItem><SelectItem value="1 rəfli">1 rəfli</SelectItem><SelectItem value="2 rəfli">2 rəfli</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="berkidilmeUsulu" className="text-right">Bərkidilmə Üsulu</Label><Select name="berkidilmeUsulu" defaultValue={currentAsset.berkidilmeUsulu}><SelectTrigger className="col-span-3"><SelectValue placeholder="Üsulu seçin" /></SelectTrigger><SelectContent><SelectItem value="Kələpçə">Kələpçə</SelectItem><SelectItem value="Anker bolt">Anker bolt</SelectItem><SelectItem value="Probka şurup">Probka şurup</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="torpaqlanma" className="text-right">Torpaqlanma</Label><Select name="torpaqlanma" defaultValue={currentAsset.torpaqlanma}><SelectTrigger className="col-span-3"><SelectValue placeholder="Seçin" /></SelectTrigger><SelectContent><SelectItem value="Var">Var</SelectItem><SelectItem value="Yoxdur">Yoxdur</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="etiket" className="text-right">Etiket</Label><Select name="etiket" defaultValue={currentAsset.etiket}><SelectTrigger className="col-span-3"><SelectValue placeholder="Seçin" /></SelectTrigger><SelectContent><SelectItem value="Var">Var</SelectItem><SelectItem value="Yoxdur">Yoxdur</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="istismarVeziyyeti" className="text-right">İstismar Vəziyyəti</Label><Select name="istismarVeziyyeti" defaultValue={currentAsset.istismarVeziyyeti}><SelectTrigger className="col-span-3"><SelectValue placeholder="Vəziyyəti seçin" /></SelectTrigger><SelectContent><SelectItem value="Yararlı">Yararlı</SelectItem><SelectItem value="Yararsız">Yararsız</SelectItem><SelectItem value="Restovrasiya olunmalıdır">Restovrasiya olunmalıdır</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="elaveKilidMexanizmi" className="text-right">Əlavə Kilid Mexanizmi</Label><Select name="elaveKilidMexanizmi" defaultValue={currentAsset.elaveKilidMexanizmi}><SelectTrigger className="col-span-3"><SelectValue placeholder="Seçin" /></SelectTrigger><SelectContent><SelectItem value="Var">Var</SelectItem><SelectItem value="Yoxdur">Yoxdur</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="kilidIstismarVeziyyeti" className="text-right">Kilid İstismar Vəziyyəti</Label><Select name="kilidIstismarVeziyyeti" defaultValue={currentAsset.kilidIstismarVeziyyeti}><SelectTrigger className="col-span-3"><SelectValue placeholder="Vəziyyəti seçin" /></SelectTrigger><SelectContent><SelectItem value="Yararlı">Yararlı</SelectItem><SelectItem value="Yararsız">Yararsız</SelectItem><SelectItem value="Restovrasiya olunmalıdır">Restovrasiya olunmalıdır</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="qutununXariciTemizliyi" className="text-right">Qutunun Xarici Təmizliyi</Label><Select name="qutununXariciTemizliyi" defaultValue={currentAsset.qutununXariciTemizliyi}><SelectTrigger className="col-span-3"><SelectValue placeholder="Təmizliyi seçin" /></SelectTrigger><SelectContent><SelectItem value="Təmiz">Təmiz</SelectItem><SelectItem value="Çirkli">Çirkli</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="qutununDaxiliTemizliyi" className="text-right">Qutunun Daxili Təmizliyi</Label><Select name="qutununDaxiliTemizliyi" defaultValue={currentAsset.qutununDaxiliTemizliyi}><SelectTrigger className="col-span-3"><SelectValue placeholder="Təmizliyi seçin" /></SelectTrigger><SelectContent><SelectItem value="Təmiz">Təmiz</SelectItem><SelectItem value="Çirkli">Çirkli</SelectItem></SelectContent></Select></div>
                {commonFields}
            </>
        );
    } else if (selectedAssetType === 'Switch' && currentAsset?.type === 'Switch') {
        return (
            <>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="parentId" className="text-right">Bağlı olduğu Cihaz</Label><Select name="parentId" defaultValue={currentAsset.parentId}><SelectTrigger className="col-span-3"><SelectValue placeholder="Switch-in qoşulduğu qutunu seçin" /></SelectTrigger><SelectContent>{availableQutus.map(qutu => <SelectItem key={qutu.id} value={qutu.id}>{qutu.name}</SelectItem>)}</SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="marka" className="text-right">Marka</Label><Select name="marka" defaultValue={currentAsset.marka}><SelectTrigger className="col-span-3"><SelectValue placeholder="Marka seçin" /></SelectTrigger><SelectContent><SelectItem value="Huawei">Huawei</SelectItem><SelectItem value="Hikvision">Hikvision</SelectItem><SelectItem value="Aruba">Aruba</SelectItem><SelectItem value="Cisco">Cisco</SelectItem><SelectItem value="Dahua">Dahua</SelectItem><SelectItem value="AT">AT</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="model" className="text-right">Model</Label><Select name="model" defaultValue={currentAsset.model}><SelectTrigger className="col-span-3"><SelectValue placeholder="Model seçin" /></SelectTrigger><SelectContent>{switchModels.map(model => <SelectItem key={model} value={model}>{model}</SelectItem>)}</SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="adapter" className="text-right">Adapter</Label><Select name="adapter" defaultValue={currentAsset.adapter}><SelectTrigger className="col-span-3"><SelectValue placeholder="Adapter seçin" /></SelectTrigger><SelectContent><SelectItem value="yoxdur">Yoxdur</SelectItem><SelectItem value="Cisco Power Adapter PWR-IE 170W-PC-AC">Cisco Power Adapter PWR-IE 170W-PC-AC</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="seriaNomresi" className="text-right">Seria Nömrəsi</Label><Input id="seriaNomresi" name="seriaNomresi" className="col-span-3" defaultValue={currentAsset.seriaNomresi} /></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="switchTipi" className="text-right">Tipi</Label><Select name="switchTipi" defaultValue={currentAsset.switchTipi}><SelectTrigger className="col-span-3"><SelectValue placeholder="Növü seçin" /></SelectTrigger><SelectContent><SelectItem value="İndustrial tipli">İndustrial tipli</SelectItem><SelectItem value="Kommersiya tipli">Kommersiya tipli</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="management" className="text-right">Management</Label><Select name="management" defaultValue={currentAsset.management}><SelectTrigger className="col-span-3"><SelectValue placeholder="Seçin" /></SelectTrigger><SelectContent><SelectItem value="idarə olunan">İdarə olunan</SelectItem><SelectItem value="idarə olunmayan">İdarə olunmayan</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="switchYeri" className="text-right">Yeri</Label><Select name="switchYeri" defaultValue={currentAsset.switchYeri}><SelectTrigger className="col-span-3"><SelectValue placeholder="Yeri seçin" /></SelectTrigger><SelectContent><SelectItem value="Qapı">Qapı</SelectItem><SelectItem value="Rəf">Rəf</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="konfiqurasiya" className="text-right">Konfiqurasiya</Label><Select name="konfiqurasiya" defaultValue={currentAsset.konfiqurasiya}><SelectTrigger className="col-span-3"><SelectValue placeholder="Seçin" /></SelectTrigger><SelectContent><SelectItem value="olunub">Olunub</SelectItem><SelectItem value="olunmayıb">Olunmayıb</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="sfpModul" className="text-right">SFP Modul</Label><Select name="sfpModul" defaultValue={currentAsset.sfpModul}><SelectTrigger className="col-span-3"><SelectValue placeholder="SFP Modul seçin" /></SelectTrigger><SelectContent>{sfpModules.map(modul => <SelectItem key={modul} value={modul}>{modul}</SelectItem>)}</SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="ups" className="text-right">UPS</Label><Select name="ups" defaultValue={currentAsset.ups}><SelectTrigger className="col-span-3"><SelectValue placeholder="UPS marka və modelini seçin" /></SelectTrigger><SelectContent><SelectItem value="Makelsan">Makelsan</SelectItem><SelectItem value="Raptor">Raptor</SelectItem><SelectItem value="Digər">Digər</SelectItem></SelectContent></Select></div>
                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="stabilizator" className="text-right">Stabilizator</Label><Select name="stabilizator" defaultValue={currentAsset.stabilizator}><SelectTrigger className="col-span-3"><SelectValue placeholder="Stabilizator marka və modelini seçin" /></SelectTrigger><SelectContent><SelectItem value="Tuncmatik">Tuncmatik</SelectItem><SelectItem value="Metinkaya">Metinkaya</SelectItem><SelectItem value="Digər">Digər</SelectItem></SelectContent></Select></div>
                {commonFields}
            </>
        )
    }
    
    return commonFields;
  }

  const renderNodeView = () => {
    const existingProjects = [...new Set(nodes.map(node => node.layihe).filter(Boolean))] as string[];
    const existingNodes = [...new Set(nodes.map(node => node.name).filter(Boolean))] as string[];
    const uniqueNodeTypes = [...new Set(nodes.map(node => node.type).filter(Boolean))] as TasinmazEmlak['type'][];
    
    return (
    <Card>
        <CardHeader>
            <div className="flex flex-row items-start justify-between">
                <div>
                <CardTitle>Təhlükəsizlik Nöqtələri (Node)</CardTitle>
                <CardDescription>Assetləri görmək və ya yeni nöqtə yaratmaq üçün seçim edin. Tapılan nəticə sayı: {filteredNodes.length}</CardDescription>
                </div>
                <Dialog open={isNodeDialogOpen} onOpenChange={(isOpen) => {
                setIsNodeDialogOpen(isOpen);
                if (!isOpen) {
                    setIsCameraOpen(false);
                    setCapturedImage(null);
                    setHasCameraPermission(null);
                }
                }}>
                    <DialogTrigger asChild><Button size="sm" className="gap-1"><PlusCircle className="h-3.5 w-3.5" /><span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Yeni Nöqtə Əlavə Et</span></Button></DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleAddNode}>
                            <DialogHeader><DialogTitle>Yeni Təhlükəsizlik Nöqtəsi Yarat</DialogTitle><DialogDescription>Zəhmət olmasa, yeni nöqtənin təfərrüatlarını daxil edin.</DialogDescription></DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="type" className="text-right">Növ</Label><Select name="type" required onValueChange={(value) => handleNodeFormSelectChange('type', value)}><SelectTrigger className="col-span-3"><SelectValue placeholder="Nöqtə növünü seçin" /></SelectTrigger><SelectContent><SelectItem value="Təhlükəsizlik Nöqtəsi">Təhlükəsizlik Nöqtəsi (TŞ)</SelectItem><SelectItem value="Alt Keçid">Alt Keçid (AK)</SelectItem><SelectItem value="Üst Keçid">Üst Keçid (UK)</SelectItem><SelectItem value="Məscid">Məscid</SelectItem><SelectItem value="Ticarət Mərkəzi">Ticarət Mərkəzi (TM)</SelectItem><SelectItem value="ASAN">ASAN</SelectItem><SelectItem value="İdman və Konsert">İdman və Konsert (İK)</SelectItem><SelectItem value="POÇT">POÇT</SelectItem><SelectItem value="Metro">Metro</SelectItem><SelectItem value="Biznes Mərkəzi">Biznes Mərkəzi (BM)</SelectItem></SelectContent></Select></div>
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Ad (TŞ Nöqtəsi)</Label><Input id="name" name="name" className="col-span-3" required /></div>
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="aktivlesmeTarixi" className="text-right">Aktivləşmə Tarixi</Label><Input id="aktivlesmeTarixi" name="aktivlesmeTarixi" type="date" className="col-span-3" /></div>
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="seher" className="text-right">Şəhər</Label><Select name="seher" onValueChange={(value) => handleNodeFormSelectChange('seher', value)}><SelectTrigger className="col-span-3"><SelectValue placeholder="Şəhər seçin" /></SelectTrigger><SelectContent>{azerbaijanCities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent></Select></div>
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="rayon" className="text-right">Rayon</Label><Select name="rayon" value={nodeFormData.rayon} onValueChange={(value) => handleNodeFormSelectChange('rayon', value)} disabled={!availableRayons.length}><SelectTrigger className="col-span-3"><SelectValue placeholder="Rayon seçin" /></SelectTrigger><SelectContent>{availableRayons.map(rayon => <SelectItem key={rayon} value={rayon}>{rayon}</SelectItem>)}</SelectContent></Select></div>
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="koordinat" className="text-right">Koordinatlar (X, Y)</Label><div className="col-span-3 flex items-center gap-2"><Input id="koordinatX" name="koordinatX" placeholder="Uzunluq (X)" value={nodeFormData.koordinatX || ''} onChange={handleNodeFormChange} /><Input id="koordinatY" name="koordinatY" placeholder="Enlik (Y)" value={nodeFormData.koordinatY || ''} onChange={handleNodeFormChange} /><Button type="button" variant="outline" size="icon" onClick={getCoordinates}><LocateFixed className="h-4 w-4" /></Button></div></div>
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="layihe" className="text-right">Layihə</Label><Select name="layihe" onValueChange={(value) => handleNodeFormSelectChange('layihe', value)}><SelectTrigger className="col-span-3"><SelectValue placeholder="Layihə seçin və ya yazın" /></SelectTrigger><SelectContent>{existingProjects.map(proj => <SelectItem key={proj} value={proj}>{proj}</SelectItem>)}</SelectContent></Select></div>
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="dataMenbeyi" className="text-right">Data Mənbəyi</Label><Select name="dataMenbeyi" onValueChange={(value) => handleNodeFormSelectChange('dataMenbeyi', value as any)}><SelectTrigger className="col-span-3"><SelectValue placeholder="Data mənbəyini seçin" /></SelectTrigger><SelectContent><SelectItem value="Optik">Optik</SelectItem><SelectItem value="Anten">Anten</SelectItem><SelectItem value="Sim nömrə">Sim nömrə</SelectItem><SelectItem value="Digər">Digər</SelectItem></SelectContent></Select></div>
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="bagliOlduguNeqte" className="text-right">Bağlı Olduğu Nöqtə</Label><Select name="bagliOlduguNeqte" onValueChange={(value) => handleNodeFormSelectChange('bagliOlduguNeqte', value)}><SelectTrigger className="col-span-3"><SelectValue placeholder="Nöqtə seçin və ya yazın" /></SelectTrigger><SelectContent>{existingNodes.map(node => <SelectItem key={node} value={node}>{node}</SelectItem>)}</SelectContent></Select></div>
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="elektrikMenbeyi" className="text-right">Elektrik Mənbəyi</Label><Select name="elektrikMenbeyi" onValueChange={(value) => handleNodeFormSelectChange('elektrikMenbeyi', value as any)}><SelectTrigger className="col-span-3"><SelectValue placeholder="Mənbəyi seçin" /></SelectTrigger><SelectContent><SelectItem value="Transformator">Transformator</SelectItem><SelectItem value="İAŞƏ obyekti">İAŞƏ obyekti</SelectItem><SelectItem value="Vətəndaş">Vətəndaş</SelectItem><SelectItem value="Alternativ">Alternativ (Günəş paneli vs.)</SelectItem></SelectContent></Select></div>
                                <div className="grid grid-cols-4 items-start gap-4"><Label htmlFor="photo" className="text-right pt-2">Nöqtə Şəkli</Label><div className="col-span-3">{isCameraOpen ? (<div className="flex flex-col gap-2"><video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted />{hasCameraPermission === false && (<Alert variant="destructive"><AlertTitle>Kamera İcazəsi Tələb Olunur</AlertTitle><AlertDescription>Zəhmət olmasa, şəkil çəkmək üçün kamera icazəsini aktivləşdirin.</AlertDescription></Alert>)}<div className='flex gap-2'><Button type="button" onClick={takePhoto} disabled={!hasCameraPermission}>Şəkil çək</Button><Button type="button" variant="outline" onClick={() => setIsCameraOpen(false)}>Ləğv et</Button></div></div>) : (<div className="flex flex-col gap-2">{capturedImage ? (<div className='relative w-full max-w-xs'><Image src={capturedImage} alt="Captured Node" width={400} height={300} className="rounded-md" /><Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => setCapturedImage(null)}>Sil</Button></div>) : (<Button type="button" variant="outline" onClick={() => setIsCameraOpen(true)} className="gap-2"><Camera className="h-4 w-4" />Kamera ilə çək</Button>)}</div>)}<canvas ref={photoRef} className="hidden"></canvas></div></div>
                                <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="qeyd" className="text-right">Qeyd</Label><Textarea id="qeyd" name="qeyd" className="col-span-3" /></div>
                            </div>
                            <DialogFooter><Button type="submit">Nöqtəni Yarat</Button></DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="space-y-2"><Label htmlFor="region-filter">Region (Şəhər)</Label><Select value={nodeFilters.region} onValueChange={(value) => handleFilterChange('region', value)}><SelectTrigger id="region-filter"><SelectValue placeholder="Region seçin" /></SelectTrigger><SelectContent><SelectItem value="all">Bütün Regionlar</SelectItem>{azerbaijanCities.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label htmlFor="rayon-filter">Rayon</Label><Select value={nodeFilters.rayon} onValueChange={(value) => handleFilterChange('rayon', value)} disabled={!filterRayons.length}><SelectTrigger id="rayon-filter"><SelectValue placeholder="Rayon seçin" /></SelectTrigger><SelectContent><SelectItem value="all">Bütün Rayonlar</SelectItem>{filterRayons.map(rayon => <SelectItem key={rayon} value={rayon}>{rayon}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label htmlFor="nodetype-filter">Nöqtə Növü</Label><Select value={nodeFilters.nodeType} onValueChange={(value) => handleFilterChange('nodeType', value)}><SelectTrigger id="nodetype-filter"><SelectValue placeholder="Növ seçin" /></SelectTrigger><SelectContent><SelectItem value="all">Bütün Növlər</SelectItem>{uniqueNodeTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select></div>
                <div className="flex items-end gap-2 col-span-full lg:col-span-2"><Button onClick={applyNodeFilters} className="w-full">Filtirlə</Button><Button onClick={resetNodeFilters} variant="outline" size="icon" className="shrink-0"><FilterX className="h-4 w-4"/><span className="sr-only">Filtrləri təmizlə</span></Button></div>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader><TableRow><TableHead>Ad</TableHead><TableHead>Növ</TableHead><TableHead>Region</TableHead><TableHead>Layihə</TableHead></TableRow></TableHeader>
                <TableBody>{filteredNodes.length > 0 ? (filteredNodes.map((node) => (<TableRow key={node.id} onClick={() => setSelectedNode(node)} className="cursor-pointer"><TableCell className="font-medium">{node.name}</TableCell><TableCell>{node.type}</TableCell><TableCell>{node.seher ? `${node.seher}${node.rayon ? `, ${node.rayon}` : ''}` : 'N/A'}</TableCell><TableCell>{node.layihe}</TableCell></TableRow>))) : (<TableRow><TableCell colSpan={4} className="h-24 text-center">Filtrlərə uyğun nəticə tapılmadı.</TableCell></TableRow>)}</TableBody>
            </Table>
        </CardContent>
    </Card>
  );
  }

  const renderAssetDetailSheet = () => {
    if (!selectedAssetForDetail) return null;
    
    const asset = selectedAssetForDetail;
    const user = mockUsers.find(u => u.id === asset.addedBy);
    const parent = asset.parentId ? assets.find(a => a.id === asset.parentId) : null;
    
    const fields = Object.entries(asset).filter(([key]) => !['id', 'nodeId', 'parentId', 'location', 'type', 'name', 'status', 'addedBy', 'addedDate'].includes(key));

    return (
        <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
            <SheetContent className="w-full sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>{asset.name} - Detallar</SheetTitle>
                    <SheetDescription>{asset.type} tipli assetin ətraflı məlumatları.</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <span className="font-medium text-sm">Status</span>
                        <Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge>
                    </div>
                     {parent && <div className="flex items-center justify-between rounded-lg border p-3"><span className="font-medium text-sm">Valideyn Asset</span><span>{parent.name} ({parent.type})</span></div>}
                     <div className="flex items-center justify-between rounded-lg border p-3"><span className="font-medium text-sm">Əlavə edən</span><span>{user?.name || 'N/A'}</span></div>
                     <div className="flex items-center justify-between rounded-lg border p-3"><span className="font-medium text-sm">Əlavə Tarixi</span><span>{new Date(asset.addedDate).toLocaleDateString('az-AZ')}</span></div>
                    
                    {fields.map(([key, value]) => {
                        if (value === null || value === undefined || value === '') return null;
                        return (
                             <div key={key} className="flex items-center justify-between rounded-lg border p-3">
                                <span className="font-medium text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                <span>{String(value)}</span>
                            </div>
                        )
                    })}
                </div>
                 <SheetFooter>
                    <Button variant="outline" onClick={() => { handleOpenAssetForm(asset); setIsDetailSheetOpen(false); }}><Pencil className="mr-2 h-4 w-4" /> Redaktə et</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
  }

  const buildAssetTree = (assetsForNode: Asset[]): Asset[] => {
      const assetMap = new Map(assetsForNode.map(a => [a.id, {...a, children: []}]));
      const tree: Asset[] = [];
      
      for (const asset of assetsForNode) {
          if (asset.parentId && assetMap.has(asset.parentId)) {
              // This is a child, we don't handle it here. It will be found via its parent.
          } else {
              tree.push(asset);
          }
      }
      return tree;
  }

  const renderAssetView = () => {
    if (!selectedNode) return null;
    const filteredAssets = assets.filter(asset => asset.nodeId === selectedNode.id);
    const assetTree = buildAssetTree(filteredAssets);
    
    const nodeHasPole = filteredAssets.some(asset => asset.type === 'Dirək');
    const nodeHasBox = filteredAssets.some(asset => asset.type === 'Qutu');

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <Button variant="ghost" onClick={() => setSelectedNode(null)} className="mb-2"><ChevronLeft className="h-4 w-4 mr-2" />Geri</Button>
                    <CardTitle>{selectedNode.name} - Asset Ağacı</CardTitle>
                    <CardDescription>Bu nöqtəyə bağlı assetlərin iyerarxiyası. Detallar üçün assetə klikləyin. Cəmi {filteredAssets.length} asset tapıldı.</CardDescription>
                </div>
                <Dialog open={isAssetDialogOpen} onOpenChange={(isOpen) => { setIsAssetDialogOpen(isOpen); if (!isOpen) { setSelectedAssetType(''); setSelectedAssetForForm(null); } }}>
                    <DialogTrigger asChild><Button size="sm" className="gap-1"><PlusCircle className="h-3.5 w-3.5" /><span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Asset əlavə et</span></Button></DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleSaveAsset}>
                        <DialogHeader>
                            <DialogTitle>{selectedAssetForForm ? 'Asseti Redaktə Et' : 'Yeni Asset Əlavə Et'}</DialogTitle>
                            <DialogDescription>{selectedNode.name} üçün asset təfərrüatlarını daxil edin.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="type" className="text-right">Növ</Label>
                                <Select name="type" required onValueChange={(value: Asset['type']) => setSelectedAssetType(value)} defaultValue={selectedAssetForForm?.type || ''} disabled={!!selectedAssetForForm}>
                                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Asset növünü seçin" /></SelectTrigger>
                                    <SelectContent>
                                        {/* Rule: Only TS nodes can have a pole, and only one. */}
                                        {(selectedNode.type === 'Təhlükəsizlik Nöqtəsi' && !nodeHasPole) && <SelectItem value="Dirək">Dirək</SelectItem>}
                                        
                                        {/* Rule: TS nodes can only have one box. Other nodes can have multiple boxes. */}
                                        {(selectedNode.type === 'Təhlükəsizlik Nöqtəsi' && !nodeHasBox) && <SelectItem value="Qutu">Qutu</SelectItem>}
                                        {selectedNode.type !== 'Təhlükəsizlik Nöqtəsi' && <SelectItem value="Qutu">Qutu</SelectItem>}

                                        {/* Other assets can be added freely */}
                                        <SelectItem value="Kamera">Kamera</SelectItem>
                                        <SelectItem value="Switch">Switch</SelectItem>
                                        <SelectItem value="Data Kabeli">Data Kabeli</SelectItem>
                                        <SelectItem value="Elektrik Kabeli">Elektrik Kabeli</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {renderAddAssetFormFields()}
                        </div>
                        <DialogFooter><Button type="submit">Yadda saxla</Button></DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {assetTree.length > 0 ? (
                    assetTree.map(rootAsset => (
                        <AssetNode 
                            key={rootAsset.id} 
                            asset={rootAsset} 
                            allAssets={filteredAssets} 
                            level={0}
                            onAssetSelect={handleAssetDetailSelect}
                        />
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-10">Bu nöqtəyə aid heç bir asset tapılmadı.</div>
                )}
            </CardContent>
        </Card>
    );
  }

  return (
    <div>
        {selectedNode ? renderAssetView() : renderNodeView()}
        {renderAssetDetailSheet()}
    </div>
  );
}
