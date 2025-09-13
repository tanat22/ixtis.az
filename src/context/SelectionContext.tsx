'use client';

import * as React from 'react';
import type { Specialty } from '@/lib/types';

interface SelectionContextType {
  selectedList: Specialty[];
  addToSelection: (spec: Specialty) => void;
  removeFromSelection: (specId: string) => void;
  moveSelection: (index: number, direction: 'up' | 'down') => void;
  clearSelection: () => void;
  userScore: number;
  setUserScore: (score: number) => void;
}

const SelectionContext = React.createContext<SelectionContextType | undefined>(undefined);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedList, setSelectedList] = React.useState<Specialty[]>([]);
  const [userScore, setUserScoreState] = React.useState<number>(0);

  const addToSelection = (spec: Specialty) => {
    if (!selectedList.find((s) => s.id === spec.id) && selectedList.length < 15) {
      setSelectedList((prev) => [...prev, spec]);
    }
  };

  const removeFromSelection = (specId: string) => {
    setSelectedList((prev) => prev.filter((s) => s.id !== specId));
  };

  const moveSelection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === selectedList.length - 1)
    )
      return;

    const newList = [...selectedList];
    const item = newList[index];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    newList[index] = newList[swapIndex];
    newList[swapIndex] = item;
    setSelectedList(newList);
  };
  
  const clearSelection = () => {
      setSelectedList([]);
  }

  const setUserScore = (score: number) => {
      setUserScoreState(score);
  }

  return (
    <SelectionContext.Provider value={{
         selectedList, 
         addToSelection, 
         removeFromSelection, 
         moveSelection, 
         clearSelection,
         userScore,
         setUserScore 
        }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = React.useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
}
