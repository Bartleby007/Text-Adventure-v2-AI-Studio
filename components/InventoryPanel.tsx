
import React from 'react';
import { ITEMS } from '../data/world';

interface InventoryPanelProps {
  items: string[];
  onClose: () => void;
}

const InventoryPanel: React.FC<InventoryPanelProps> = ({ items, onClose }) => {
  return (
    <div className="absolute inset-0 z-50 bg-neutral-950/95 p-6 overflow-y-auto animate-in fade-in slide-in-from-top duration-200">
      <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
        <h3 className="text-xl font-bold flex items-center gap-3">
          <i className="fas fa-backpack text-emerald-500"></i>
          Inventory
        </h3>
        <button 
          onClick={onClose}
          className="bg-neutral-800 hover:bg-neutral-700 text-neutral-400 p-2 rounded-full transition-colors"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-neutral-600">
          <i className="fas fa-box-open text-4xl mb-4 opacity-20"></i>
          <p className="italic">Your pack is empty...</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map(itemId => {
            const item = ITEMS[itemId];
            return (
              <div key={itemId} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-start gap-4">
                <div className="bg-emerald-900/20 text-emerald-400 p-3 rounded-lg">
                  <i className="fas fa-gem"></i>
                </div>
                <div>
                  <h4 className="font-bold text-neutral-100">{item?.name}</h4>
                  <p className="text-sm text-neutral-400 mt-1 leading-tight">{item?.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8">
        <button 
          onClick={onClose}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all"
        >
          Back to Adventure
        </button>
      </div>
    </div>
  );
};

export default InventoryPanel;
