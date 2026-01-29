
import React from 'react';
import { GameLogEntry } from '../types';

interface MessageLogProps {
  log: GameLogEntry[];
  scrollRef: React.RefObject<HTMLDivElement>;
}

const MessageLog: React.FC<MessageLogProps> = ({ log, scrollRef }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
      {log.map((entry) => {
        let textClass = 'text-neutral-300';
        let prefix = '';

        switch (entry.type) {
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

        return (
          <div key={entry.id} className={`${textClass} transition-all duration-300 animate-in fade-in slide-in-from-bottom-2`}>
            <span className="terminal-text">
              {prefix}{entry.text}
            </span>
          </div>
        );
      })}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageLog;
