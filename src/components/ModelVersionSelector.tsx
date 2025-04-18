
import { Badge } from '@/components/ui/badge';
import { MODEL_PRECISION } from '@/config/constants';

interface ModelVersionSelectorProps {
  currentVersion: string;
  onVersionSelect: (version: string) => void;
}

const ModelVersionSelector = ({ currentVersion, onVersionSelect }: ModelVersionSelectorProps) => {
  return (
    <div className="mb-6 border-b pb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Model Configuration</h3>
      
      <div>
        <p className="text-sm text-gray-600 mb-3">Select a model version by clicking on one of the boxes below:</p>
        
        <div className="flex flex-wrap gap-3 mb-2">
          <div 
            className={`rounded-md border px-3 py-2 ${currentVersion === '1' ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'} 
            cursor-pointer hover:border-orange-300 transition-colors`}
            onClick={() => onVersionSelect('1')}
          >
            <div className="text-xs text-gray-500">Version 1</div>
            <div className="font-medium text-sm flex items-center gap-1">
              Precision: <Badge variant={currentVersion === '1' ? 'default' : 'secondary'} className={currentVersion === '1' ? 'bg-orange-500' : ''}>61.0%</Badge>
            </div>
          </div>
          
          <div 
            className={`rounded-md border px-3 py-2 ${currentVersion === '2' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} 
            cursor-pointer hover:border-green-300 transition-colors`}
            onClick={() => onVersionSelect('2')}
          >
            <div className="text-xs text-gray-500">Version 2 (Recommended)</div>
            <div className="font-medium text-sm flex items-center gap-1">
              Precision: <Badge variant={currentVersion === '2' ? 'default' : 'secondary'} className={currentVersion === '2' ? 'bg-green-500' : ''}>91.9%</Badge>
            </div>
          </div>
          
          <div 
            className={`rounded-md border px-3 py-2 ${currentVersion === '3' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'} 
            cursor-pointer hover:border-blue-300 transition-colors`}
            onClick={() => onVersionSelect('3')}
          >
            <div className="text-xs text-gray-500">Version 3</div>
            <div className="font-medium text-sm flex items-center gap-1">
              Precision: <Badge variant={currentVersion === '3' ? 'default' : 'secondary'} className={currentVersion === '3' ? 'bg-blue-500' : ''}>87.1%</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelVersionSelector;
