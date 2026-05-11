'use client';

import { useMemo } from 'react';
import { TOOLS } from './lib/tools';
import { useI18n } from './lib/i18n';
import { useHomeState } from './lib/home-state';
import Header from './components/Header';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import ToolGrid from './components/ToolGrid';
import Footer from './components/Footer';

export default function Home() {
  const { activeFilter, searchQuery, setActiveFilter, setSearchQuery } = useHomeState();
  const { t } = useI18n();

  const filteredTools = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return TOOLS.filter((tool) => {
      const matchFilter = activeFilter === 'all' || tool.cat === activeFilter;
      if (!matchFilter) return false;
      if (!query) return true;
      const toolT = t.tools[tool.slug];
      const name = toolT?.name || tool.name;
      const desc = toolT?.desc || tool.desc;
      const catLabel = t.filter[tool.cat as keyof typeof t.filter];
      return name.toLowerCase().includes(query) ||
        desc.toLowerCase().includes(query) ||
        catLabel.toLowerCase().includes(query) ||
        tool.slug.includes(query);
    });
  }, [activeFilter, searchQuery, t]);

  return (
    <div style={{display:'flex',flexDirection:'column',minHeight:'100vh'}}>
      <Header toolCount={TOOLS.length} />
      <Hero
        toolCount={TOOLS.length}
        searchQuery={searchQuery}
        resultCount={filteredTools.length}
        onSearchChange={setSearchQuery}
      />
      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <ToolGrid tools={filteredTools} />
      <div style={{flex:1}} />
      <Footer />
    </div>
  );
}
