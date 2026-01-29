
import React from 'react';
import { Direction } from '../types';

interface NavGridProps {
  onMove: (dir: Direction) => void;
  onLook: () => void;
  activeExits: Partial<Record<Direction, string>>;
}

const NavGrid: React.FC<NavGridProps> = ({ onMove, onLook, activeExits }) => {
  const directions: { id: Direction | 'center'; label: string; icon: string }[] = [
    { id: 'nw', label: 'NW', icon: 'fa-arrow-up-left' },
    { id: 'n', label: 'N', icon: 'fa-arrow-up' },
    { id: 'ne', label: 'NE', icon: 'fa-arrow-up-right' },
    { id: 'w', label: 'W', icon: 'fa-arrow-left' },
    { id: 'center', label: 'WAIT', icon: 'fa-circle-dot' },
    { id: 'e', label: 'E', icon: 'fa-arrow-right' },
    { id: 'sw', label: 'SW', icon: 'fa-arrow-down-left' },
    { id: 's', label: 'S', icon: 'fa-arrow-down' },
    { id: 'se', label: 'SE', icon: 'fa-arrow-down-right' },
  ];

  return (
    <div className="grid grid-cols-3 gap-1.5 aspect-square">
      {directions.map((dir) => {
        const isExit = dir.id !== 'center' && activeExits[dir.id];
        const isCenter = dir.id === 'center';
        
        return (
          <button
            key={dir.id}
            onClick={() => dir.id === 'center' ? null : onMove(dir.id as Direction)}
            disabled={!isExit && !isCenter}
            className={`
              relative flex items-center justify-center rounded-lg text-sm font-bold transition-all active:scale-90
              ${isCenter 
                ? 'bg-neutral-800 text-neutral-500 border border-neutral-700' 
                : isExit 
                  ? 'bg-neutral-700 hover:bg-neutral-600 text-white border border-neutral-500 shadow-lg shadow-neutral-900/50' 
                  : 'bg-neutral-900 text-neutral-700 border border-neutral-800 opacity-40 cursor-not-allowed'}
            `}
            aria-label={dir.label}
          >
             <span className="sr-only">{dir.label}</span>
             <i className={`fas ${dir.icon}`}></i>
          </button>
        );
      })}
    </div>
  );
};

export default NavGrid;
