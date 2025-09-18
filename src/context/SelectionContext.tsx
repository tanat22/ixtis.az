'use client';

import * as React from 'react';
import type { Specialty } from '@/lib/types';

interface SelectionContextType {
  selectedList: Specialty[];
  addToSelection: (specialty: Specialty) => void;
  removeFromSelection: (id: string) => void;
  clearSelection: () => void;
  moveItem: (fromIndex: number, toIndex: number) => void;
  userScore: number;
  setUserScore: (score: number) => void;
}

const SelectionContext = React.createContext<SelectionContextType | undefined>(undefined);

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedList, setSelectedList] = React.useState<Specialty[]>([]);
  const [userScore, setUserScoreState] = React.useState<number>(0);

  React.useEffect(() => {
    // Load state from localStorage only on the client side
    try {
      const savedSpecialties = window.localStorage.getItem('selectedSpecialties');
      if (savedSpecialties) {
        setSelectedList(JSON.parse(savedSpecialties));
      }
      const savedScore = window.localStorage.getItem('userScore');
      if (savedScore) {
        setUserScoreState(Number(JSON.parse(savedScore)));
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
    }
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem('selectedSpecialties', JSON.stringify(selectedList));
    } catch (error) {
      console.error(error);
    }
  }, [selectedList]);

  React.useEffect(() => {
    try {
      window.localStorage.setItem('userScore', JSON.stringify(userScore));
    } catch (error) { console.error(error); }
  }, [userScore]);

  const addToSelection = (specialty: Specialty) => {
    setSelectedList((prevList) => {
      if (prevList.length >= 20 && !prevList.find(item => item.id === specialty.id)) {
        alert("Maksimum 20 ixtisas seçə bilərsiniz.");
        return prevList;
      }
      if (prevList.find((item) => item.id === specialty.id)) {
        return prevList; // Already exists
      }
      return [...prevList, specialty];
    });
  };

  const removeFromSelection = (id: string) => {
    setSelectedList((prevList) => prevList.filter((item) => item.id !== id));
  };

  const clearSelection = () => {
    setSelectedList([]);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    setSelectedList(prevList => {
      if (fromIndex < 0 || fromIndex >= prevList.length || toIndex < 0 || toIndex >= prevList.length) {
        return prevList; // Invalid index
      }
      const newList = [...prevList];
      const [movedItem] = newList.splice(fromIndex, 1);
      newList.splice(toIndex, 0, movedItem);
      return newList;
    });
  };

  const setUserScore = (score: number) => {
      setUserScoreState(score > 700 ? 700 : score < 0 ? 0 : score);
  }

  return (
    <SelectionContext.Provider value={{ selectedList, addToSelection, removeFromSelection, clearSelection, userScore, setUserScore, moveItem }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = React.useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};
