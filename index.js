
import { ROOMS, ITEMS, INITIAL_ROOM_ID } from './world.js';

// --- Game State ---
let state = {
    currentRoomId: INITIAL_ROOM_ID,
    inventory: [],
    roomItems: Object.keys(ROOMS).reduce((acc, roomId) => {
        acc[roomId] = [...ROOMS[roomId].items];
        return acc;
    }, {})
};

// --- DOM Elements ---
const roomNameEl = document.getElementById('room-name');
const logEl = document.getElementById('message-log');
const navGridEl = document.getElementById('nav-grid');
const nearbyContainer = document.getElementById('nearby-container');
const nearbyItemsEl = document.getElementById('nearby-items');
const invCountEl = document.getElementById('inv-count');
const exitCountEl = document.getElementById('exit-count');
const lookBtn = document.getElementById('look-btn');
const toggleInvBtn = document.getElementById('toggle-inventory');
const closeInvBtn = document.getElementById('close-inventory');
const invPanel = document.getElementById('inventory-panel');
const invListEl = document.getElementById('inventory-list');
const emptyInvEl = document.getElementById('empty-inventory');

// --- Directions Config ---
const DIRECTIONS = [
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

// --- Functions ---

function addLog(text, type = 'description') {
    const entry = document.createElement('div');
    entry.className = 'transition-all duration-300 animate-in fade-in slide-in-from-bottom-2';
    
    let textClass = 'text-neutral-300';
    let prefix = '';

    switch (type) {
        case 'action':
            textClass = 'text-emerald-400 font-bold';
            prefix = '> ';
            break;
        case 'description':
            textClass = 'text-neutral-300 leading-relaxed';
            break;
        case 'system':
            textClass = 'text-sky-400 italic text-sm';
            break;
        case 'error':
            textClass = 'text-rose-400 text-sm italic';
            break;
    }

    entry.innerHTML = `<span class="terminal-text ${textClass}">${prefix}${text}</span>`;
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;
}

function updateUI() {
    const room = ROOMS[state.currentRoomId];
    roomNameEl.textContent = room.name;
    invCountEl.textContent = state.inventory.length;
    exitCountEl.textContent = Object.keys(room.exits).length;

    // Render Navigation
    navGridEl.innerHTML = '';
    DIRECTIONS.forEach(dir => {
        const isExit = dir.id !== 'center' && room.exits[dir.id];
        const isCenter = dir.id === 'center';
        
        const btn = document.createElement('button');
        btn.className = `
            relative flex items-center justify-center rounded-lg text-sm font-bold transition-all active:scale-90 h-full w-full py-3
            ${isCenter 
                ? 'bg-neutral-800 text-neutral-500 border border-neutral-700' 
                : isExit 
                    ? 'bg-neutral-700 hover:bg-neutral-600 text-white border border-neutral-500 shadow-lg shadow-neutral-900/50' 
                    : 'bg-neutral-900 text-neutral-700 border border-neutral-800 opacity-40 cursor-not-allowed'}
        `;
        btn.innerHTML = `<i class="fas ${dir.icon}"></i>`;
        btn.onclick = () => isExit ? move(dir.id) : null;
        navGridEl.appendChild(btn);
    });

    // Render Nearby Items
    const itemsInRoom = state.roomItems[state.currentRoomId] || [];
    if (itemsInRoom.length > 0) {
        nearbyContainer.classList.remove('hidden');
        nearbyItemsEl.innerHTML = '';
        itemsInRoom.forEach(itemId => {
            const item = ITEMS[itemId];
            const btn = document.createElement('button');
            btn.className = "bg-emerald-900/40 text-emerald-400 border border-emerald-800/50 px-3 py-1.5 rounded-full text-sm hover:bg-emerald-800/60 transition-all flex items-center gap-2";
            btn.innerHTML = `<i class="fas fa-hand-sparkles"></i> Take ${item.name}`;
            btn.onclick = () => takeItem(itemId);
            nearbyItemsEl.appendChild(btn);
        });
    } else {
        nearbyContainer.classList.add('hidden');
    }

    // Update Inventory List
    invListEl.innerHTML = '';
    if (state.inventory.length === 0) {
        emptyInvEl.classList.remove('hidden');
    } else {
        emptyInvEl.classList.add('hidden');
        state.inventory.forEach(itemId => {
            const item = ITEMS[itemId];
            const div = document.createElement('div');
            div.className = "bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-start gap-4";
            div.innerHTML = `
                <div class="bg-emerald-900/20 text-emerald-400 p-3 rounded-lg">
                    <i class="fas fa-gem"></i>
                </div>
                <div>
                    <h4 class="font-bold text-neutral-100">${item.name}</h4>
                    <p class="text-sm text-neutral-400 mt-1 leading-tight">${item.description}</p>
                </div>
            `;
            invListEl.appendChild(div);
        });
    }
}

function move(dir) {
    const room = ROOMS[state.currentRoomId];
    const nextRoomId = room.exits[dir];
    if (nextRoomId) {
        state.currentRoomId = nextRoomId;
        addLog(`You move ${dir.toUpperCase()}.`, 'action');
        addLog(ROOMS[nextRoomId].description, 'description');
        updateUI();
    }
}

function takeItem(itemId) {
    const item = ITEMS[itemId];
    if (item && item.canTake) {
        state.inventory.push(itemId);
        state.roomItems[state.currentRoomId] = state.roomItems[state.currentRoomId].filter(id => id !== itemId);
        addLog(`You picked up: ${item.name}`, 'action');
        updateUI();
    }
}

function look() {
    const room = ROOMS[state.currentRoomId];
    addLog(`You look around the ${room.name}.`, 'action');
    addLog(room.description, 'description');
    const items = state.roomItems[state.currentRoomId];
    if (items.length > 0) {
        const names = items.map(id => ITEMS[id].name).join(', ');
        addLog(`Visible items: ${names}`, 'system');
    }
}

// --- Event Listeners ---
lookBtn.onclick = look;
toggleInvBtn.onclick = () => invPanel.classList.toggle('active');
closeInvBtn.onclick = () => invPanel.classList.remove('active');

// --- Initialization ---
window.onload = () => {
    updateUI();
    addLog('Welcome to Echoes of the Void. Your adventure begins...', 'system');
    addLog(ROOMS[INITIAL_ROOM_ID].description, 'description');
};
