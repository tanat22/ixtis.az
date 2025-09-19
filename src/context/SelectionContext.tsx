'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Specialty } from '@/lib/types';

interface SelectionContextType {
  selectedList: Specialty[];
  addToSelection: (specialty: Specialty) => void;
  removeFromSelection: (id: number) => void;
  clearSelection: () => void;
  userScore: number;
  setUserScore: (score: number) => void;
  
  // Filter states
  educationLevel: string;
  setEducationLevel: (level: string) => void;
  educationLang: string;
  setEducationLang: (lang: string) => void;
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
  selectedSubGroup: string;
  setSelectedSubGroup: (subGroup: string) => void;
  selectedUniversity: string;
  setSelectedUniversity: (university: string) => void;
  educationForm: string;
  setEducationForm: (form: string) => void;
  educationPaymentType: string;
  setEducationPaymentType: (type: string) => void;
  selectedSpecialtyName: string;
  setSelectedSpecialtyName: (name: string) => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedList, setSelectedList] = useState<Specialty[]>([]);
  const [userScore, setUserScoreState] = useState<number>(0);

  // Filter States
  const [educationLevel, setEducationLevel] = useState('bachelor');
  const [educationLang, setEducationLang] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedSubGroup, setSelectedSubGroup] = useState('all');
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [educationForm, setEducationForm] = useState('all');
  const [educationPaymentType, setEducationPaymentType] = useState('all');
  const [selectedSpecialtyName, setSelectedSpecialtyName] = useState('');


  useEffect(() => {
    const savedList = localStorage.getItem('selectedSpecialties');
    const savedScore = localStorage.getItem('userScore');
    if (savedList) {
      setSelectedList(JSON.parse(savedList));
    }
    if (savedScore) {
      setUserScoreState(JSON.parse(savedScore));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedSpecialties', JSON.stringify(selectedList));
  }, [selectedList]);

  const setUserScore = (score: number) => {
    setUserScoreState(score);
    localStorage.setItem('userScore', JSON.stringify(score));
  };

  const addToSelection = (specialty: Specialty) => {
    if (selectedList.length < 20 && !selectedList.find(item => item.id === specialty.id)) {
      setSelectedList(prevList => [...prevList, specialty]);
    }
  };

  const removeFromSelection = (id: number) => {
    setSelectedList(prevList => prevList.filter(item => item.id !== id));
  };

  const clearSelection = () => {
    setSelectedList([]);
  };

  return (
    <SelectionContext.Provider value={{
      selectedList, 
      addToSelection, 
      removeFromSelection, 
      clearSelection,
      userScore, 
      setUserScore,
      educationLevel,
      setEducationLevel,
      educationLang,
      setEducationLang,
      selectedGroup,
      setSelectedGroup,
      selectedSubGroup,
      setSelectedSubGroup,
      selectedUniversity,
      setSelectedUniversity,
      educationForm,
      setEducationForm,
      educationPaymentType,
      setEducationPaymentType,
      selectedSpecialtyName,
      setSelectedSpecialtyName,
    }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};