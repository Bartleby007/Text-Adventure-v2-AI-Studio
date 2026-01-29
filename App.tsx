
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Direction, GameState, GameLogEntry, Room } from './types';
import { ROOMS, ITEMS, INITIAL_ROOM_ID } from './data/world';
import NavGrid from './components/NavGrid';
import InventoryPanel from './components/InventoryPanel';
import MessageLog from './components/MessageLog';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    currentRoomId: INITIAL_ROOM_ID,
    inventory: [],
    roomItems: Object.keys(ROOMS).reduce((acc, roomId) => {
      acc[roomId] = [...ROOMS[roomId].items];
      return acc;
    }, {} as Record<string, string[]>),
    log: [
      {
        id: 'init',
        text: 'Welcome to Echoes of the Void. Your adventure begins...',
        type: 'system',
        timestamp: Date.now()
      }
    ]
  });

  const [showInventory, setShowInventory] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((text: string, type: GameLogEntry['type'] = 'description') => {
    setState(prev => ({
      ...prev,
      log: [
        ...prev.log,
        {
          id: Math.random().toString(36).substr(2, 9),
          text,
          type,
          timestamp: Date.now()
        }
      ]
    }));
  }, []);

  // Show room description on start
  useEffect(() => {
    const room = ROOMS[INITIAL_ROOM_ID];
    addLog(room.description, 'description');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.log]);

  const currentRoom = ROOMS[state.currentRoomId];
  const itemsInRoom = state.roomItems[state.currentRoomId] || [];

  const handleMove = (dir: Direction) => {
    const nextRoomId = currentRoom.exits[dir];
    if (nextRoomId) {
      const nextRoom = ROOMS[nextRoomId];
      setState(prev => ({ ...prev, currentRoomId: nextRoomId }));
      addLog(`You move ${dir.toUpperCase()}.`, 'action');
      addLog(nextRoom.description, 'description');
    } else {
      addLog(`You cannot go ${dir.toUpperCase()} from here.`, 'error');
    }
  };

  const handleTake = (itemId: string) => {
    const item = ITEMS[itemId];
    if (item && item.canTake) {
      setState(prev => ({
        ...prev,
        inventory: [...prev.inventory, itemId],
        roomItems: {
          ...prev.roomItems,
          [prev.currentRoomId]: prev.roomItems[prev.currentRoomId].filter(id => id !== itemId)
        }
      }));
      addLog(`You picked up: ${item.name}`, 'action');
    }
  };

  const handleLook = () => {
    addLog(`You look around the ${currentRoom.name}.`, 'action');
    addLog(currentRoom.description, 'description');
    if (itemsInRoom.length > 0) {
      const itemNames = itemsInRoom.map(id => ITEMS[id].name).join(', ');
      addLog(`Visible items: ${itemNames}`, 'system');
    } else {
      addLog(`There are no interesting items here.`, 'system');
    }
  };

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto bg-neutral-900 shadow-2xl overflow-hidden border-x border-neutral-800">
      {/* Header */}
      <header className="bg-neutral-950 p-4 border-b border-neutral-800 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Location</h1>
          <h2 className="text-xl font-bold text-emerald-500 truncate">{currentRoom.name}</h2>
        </div>
        <button 
          onClick={() => setShowInventory(!showInventory)}
          className={`p-3 rounded-lg transition-colors ${showInventory ? 'bg-emerald-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
          aria-label="Toggle Inventory"
        >
          <i className="fas fa-backpack text-lg"></i>
        </button>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        {/* Inventory Overlay */}
        {showInventory && (
          <InventoryPanel 
            items={state.inventory} 
            onClose={() => setShowInventory(false)} 
          />
        )}

        {/* Message Log */}
        <MessageLog log={state.log} scrollRef={logEndRef} />
      </main>

      {/* Footer Controls */}
      <footer className="bg-neutral-950 p-4 border-t border-neutral-800 shrink-0">
        {/* Quick Item Actions (if items in room) */}
        {itemsInRoom.length > 0 && (
          <div className="mb-4 animate-pulse">
            <h3 className="text-xs font-bold text-neutral-500 uppercase mb-2">Nearby</h3>
            <div className="flex flex-wrap gap-2">
              {itemsInRoom.map(itemId => (
                <button
                  key={itemId}
                  onClick={() => handleTake(itemId)}
                  className="bg-emerald-900/40 text-emerald-400 border border-emerald-800/50 px-3 py-1.5 rounded-full text-sm hover:bg-emerald-800/60 transition-all flex items-center gap-2"
                >
                  <i className="fas fa-hand-sparkles"></i>
                  Take {ITEMS[itemId].name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* Movement Grid */}
          <div className="flex-1 max-w-[180px]">
            <NavGrid onMove={handleMove} onLook={handleLook} activeExits={currentRoom.exits} />
          </div>
          
          {/* Context Actions */}
          <div className="flex-1 flex flex-col gap-2">
            <button 
              onClick={handleLook}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 py-4 rounded-xl font-bold border border-neutral-700 active:scale-95 transition-transform flex flex-col items-center"
            >
              <i className="fas fa-eye mb-1"></i>
              LOOK
            </button>
            <div className="grid grid-cols-2 gap-2">
               <div className="text-center p-2 rounded bg-neutral-900/50 border border-neutral-800 text-[10px] text-neutral-500 uppercase tracking-tighter">
                Exits: {Object.keys(currentRoom.exits).join(', ')}
               </div>
               <div className="text-center p-2 rounded bg-neutral-900/50 border border-neutral-800 text-[10px] text-neutral-500 uppercase tracking-tighter">
                Inv: {state.inventory.length}
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
