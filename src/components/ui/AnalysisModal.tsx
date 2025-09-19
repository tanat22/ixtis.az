'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, Loader, Server, BarChart, BrainCircuit, FileDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const analysisSteps = [
  { text: "Balınız və qrup seçimləriniz təhlil edilir...", icon: <BrainCircuit className="h-5 w-5 text-blue-400" /> },
  { text: "Seçdiyiniz ixtisaslar analiz olunur...", icon: <Server className="h-5 w-5 text-purple-400" /> },
  { text: "Əvvəlki illərin statistik məlumatları nəzərdən keçirilir...", icon: <BarChart className="h-5 w-5 text-yellow-400" /> },
  { text: "Risk və ehtimal alqoritmləri işə salınır...", icon: <BrainCircuit className="h-5 w-5 text-blue-400" /> },
  { text: "Yüksək ehtimallı ixtisaslar qruplaşdırılır...", icon: <Server className="h-5 w-5 text-purple-400" /> },
  { text: "Alternativ strategiyalar və 'kənar' seçimlər hazırlanır...", icon: <BrainCircuit className="h-5 w-5 text-blue-400" /> },
  { text: "Fərdi təkliflərinizlə birlikdə yekun hesabat generasiya olunur...", icon: <FileDown className="h-5 w-5 text-green-400" /> },
];

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state on open
      setVisibleLines(0);
      setProgress(0);
      setIsComplete(false);

      const lineInterval = setInterval(() => {
        setVisibleLines(prev => prev + 1);
      }, 900); // Each line appears every 0.9 seconds

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 100;
          return prev + 1;
        });
      }, 60);

      setTimeout(() => {
         clearInterval(lineInterval);
         clearInterval(progressInterval);
         setIsComplete(true);
         setProgress(100);
         setTimeout(() => {
            onComplete();
            onClose();
         }, 1200); // Wait for "Hazırdır!" animation then trigger download
      }, analysisSteps.length * 900);

      return () => {
        clearInterval(lineInterval);
        clearInterval(progressInterval);
      };
    }
  }, [isOpen, onComplete, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900/80 backdrop-blur-sm border-gray-700 text-white sm:max-w-[480px] shadow-2xl shadow-blue-500/10">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold tracking-wider">Hesabat Hazırlanır</DialogTitle>
        </DialogHeader>
        <div className="mt-4 mb-6 space-y-4 px-4">
            <Progress value={progress} className="w-full h-2 bg-gray-700 [&>*]:bg-blue-500" />
            <div className="h-48 flex flex-col justify-start space-y-3 overflow-hidden text-sm font-light text-gray-300 pt-2">
              {analysisSteps.map((step, index) => (
                <div key={index} className={cn(
                    "flex items-center gap-3 transition-all duration-500 ease-in-out",
                    visibleLines > index ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
                )}>
                    {visibleLines > index + 1 || isComplete ? 
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" /> : 
                        <Loader className="h-5 w-5 text-blue-400 animate-spin flex-shrink-0" />
                    }
                    <span>{step.text}</span>
                </div>
              ))}
              {isComplete && (
                  <div className="flex items-center justify-center gap-3 pt-6 text-lg font-semibold text-green-400 animate-pulse">
                      <CheckCircle className="h-6 w-6" />
                      <span>Hazırdır! Yüklənir...</span>
                  </div>
              )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
