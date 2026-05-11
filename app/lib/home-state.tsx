'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface HomeState {
  activeFilter: string;
  searchQuery: string;
  setActiveFilter: (f: string) => void;
  setSearchQuery: (q: string) => void;
}

const HomeStateContext = createContext<HomeState>({
  activeFilter: 'all',
  searchQuery: '',
  setActiveFilter: () => {},
  setSearchQuery: () => {},
});

export function HomeStateProvider({ children }: { children: ReactNode }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <HomeStateContext.Provider value={{ activeFilter, searchQuery, setActiveFilter, setSearchQuery }}>
      {children}
    </HomeStateContext.Provider>
  );
}

export function useHomeState() {
  return useContext(HomeStateContext);
}
