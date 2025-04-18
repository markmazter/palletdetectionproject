
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { History } from 'lucide-react';

interface HistoryEntry {
  id: string;
  timestamp: string;
  imageUrl: string;
  totalCount: number;
  modelVersion: string;
}

interface HistoryLogProps {
  entries: HistoryEntry[];
  onSelectEntry: (entry: HistoryEntry) => void;
}

const HistoryLog = ({ entries, onSelectEntry }: HistoryLogProps) => {
  if (entries.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-white">
        <div className="flex items-center gap-2 mb-2">
          <History className="h-4 w-4" />
          <h3 className="text-lg font-semibold">History Log</h3>
        </div>
        <p className="text-gray-500 text-sm">No history entries yet</p>
      </div>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-4 w-4" />
        <h3 className="text-lg font-semibold">History Log</h3>
      </div>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => onSelectEntry(entry)}
              className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={entry.imageUrl}
                    alt="Thumbnail"
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm font-medium">
                      Detected {entry.totalCount} objects
                    </p>
                    <p className="text-xs text-gray-500">
                      Model v{entry.modelVersion} • {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default HistoryLog;
