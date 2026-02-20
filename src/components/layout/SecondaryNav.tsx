import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS_FULL } from './navData';

const NavLink: React.FC<{ label: string; cnLabel: string; to?: string }> = ({ label, cnLabel, to }) => {
  const className = "px-3 border-r border-gray-300 last:border-r-0 text-[11px] font-bold uppercase tracking-wider text-charcoal-light hover:text-science-red transition-colors whitespace-nowrap";

  if (to) {
    return <Link to={to} className={className}>{label} / {cnLabel}</Link>;
  }
  return <a href="#" className={className}>{label} / {cnLabel}</a>;
};

export const SecondaryNav: React.FC = () => (
  <div className="hidden md:block w-full bg-[#F2F2F2] border-b border-gray-300">
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5 flex flex-wrap justify-center gap-y-1">
      {NAV_LINKS_FULL.map(link => (
        <NavLink key={link.label} label={link.label} cnLabel={link.cn} to={link.to} />
      ))}
    </div>
  </div>
);
