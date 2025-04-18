
export interface HistoryEntry {
  id: string;
  timestamp: string;
  imageUrl: string;
  totalCount: number;
  modelVersion: string;
  predictions: Array<{
    class: string;
    confidence: number;
    bbox?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
}

export interface ModelPrecision {
  [key: string]: string;
}
