import React, { useRef, useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MolstarViewer = ({ structure, selectedResidues }) => {
  const viewerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('cartoon');
  const [colorScheme, setColorScheme] = useState('chain');
  const [showSurface, setShowSurface] = useState(false);
  const [measurements, setMeasurements] = useState([]);

  // Mock Molstar integration - in real implementation, this would initialize Molstar
  useEffect(() => {
    if (structure && viewerRef?.current) {
      setIsLoading(true);
      // Simulate loading time
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }, [structure]);

  const viewModes = [
    { value: 'cartoon', label: 'Cartoon', icon: 'Waves' },
    { value: 'spacefill', label: 'Spacefill', icon: 'Circle' },
    { value: 'ball-stick', label: 'Ball & Stick', icon: 'Atom' },
    { value: 'ribbon', label: 'Ribbon', icon: 'Wind' }
  ];

  const colorSchemes = [
    { value: 'chain', label: 'Por Cadena' },
    { value: 'residue', label: 'Por Residuo' },
    { value: 'secondary', label: 'Estructura Secundaria' },
    { value: 'hydrophobicity', label: 'Hidrofobicidad' },
    { value: 'temperature', label: 'Factor B' }
  ];

  const handleScreenshot = () => {
    // Mock screenshot functionality
    console.log('Capturando pantalla...');
  };

  const handleMeasurement = (type) => {
    // Mock measurement functionality
    const newMeasurement = {
      id: Date.now(),
      type,
      value: type === 'distance' ? '12.5 Å' : type === 'angle' ? '109.5°' : '15.2 Å³',
      atoms: type === 'distance' ? ['CA-123', 'CB-456'] : ['N-123', 'CA-123', 'C-123']
    };
    setMeasurements([...measurements, newMeasurement]);
  };

  const removeMeasurement = (id) => {
    setMeasurements(measurements?.filter(m => m?.id !== id));
  };

  return (
    <div className="h-full bg-card border border-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="p-3 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-foreground">Vista:</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e?.target?.value)}
                className="px-2 py-1 bg-input border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {viewModes?.map(mode => (
                  <option key={mode?.value} value={mode?.value}>
                    {mode?.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-foreground">Color:</label>
              <select
                value={colorScheme}
                onChange={(e) => setColorScheme(e?.target?.value)}
                className="px-2 py-1 bg-input border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {colorSchemes?.map(scheme => (
                  <option key={scheme?.value} value={scheme?.value}>
                    {scheme?.label}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showSurface}
                onChange={(e) => setShowSurface(e?.target?.checked)}
                className="rounded"
              />
              <span className="text-sm text-foreground">Superficie</span>
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Camera"
              onClick={handleScreenshot}
            />
            <Button
              variant="outline"
              size="sm"
              iconName="RotateCcw"
            />
            <Button
              variant="outline"
              size="sm"
              iconName="Maximize"
            />
          </div>
        </div>
      </div>
      {/* Main Viewer Area */}
      <div className="relative h-[calc(100%-120px)]">
        <div
          ref={viewerRef}
          className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center"
        >
          {isLoading ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
              <p className="text-white">Cargando estructura molecular...</p>
            </div>
          ) : structure ? (
            <div className="relative w-full h-full">
              {/* Mock 3D Visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Mock protein structure representation */}
                  <div className="w-64 h-64 relative">
                    {/* Alpha helices */}
                    <div className="absolute top-8 left-8 w-32 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full transform rotate-12 opacity-80" />
                    <div className="absolute top-16 left-16 w-28 h-6 bg-gradient-to-r from-red-400 to-red-500 rounded-full transform rotate-45 opacity-70" />
                    
                    {/* Beta sheets */}
                    <div className="absolute bottom-12 right-8 w-24 h-4 bg-gradient-to-r from-blue-500 to-blue-600 transform -rotate-12 opacity-80" />
                    <div className="absolute bottom-8 right-12 w-20 h-4 bg-gradient-to-r from-blue-400 to-blue-500 transform -rotate-6 opacity-70" />
                    
                    {/* Loops */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-16 h-16 border-4 border-green-500 rounded-full opacity-60" />
                      <div className="w-12 h-12 border-3 border-green-400 rounded-full opacity-50 absolute top-2 left-2" />
                    </div>
                    
                    {/* Active site */}
                    <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
                  </div>
                  
                  {/* Structure info overlay */}
                  <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded text-sm">
                    <div>{structure?.name}</div>
                    <div className="text-xs opacity-80">PDB: {structure?.pdbId}</div>
                  </div>
                </div>
              </div>

              {/* ChronosFold prediction overlay */}
              <div className="absolute top-4 right-4 bg-black/70 text-white p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Brain" size={16} className="text-accent" />
                  <span className="text-sm font-medium">ChronosFold</span>
                </div>
                <div className="text-xs space-y-1">
                  <div>Confianza: 87.3%</div>
                  <div>LDDT: 0.89</div>
                  <div>Estado: Predicción completa</div>
                </div>
              </div>

              {/* Selected residues indicator */}
              {selectedResidues && selectedResidues?.length > 0 && (
                <div className="absolute bottom-4 left-4 bg-black/70 text-white p-2 rounded">
                  <div className="text-xs">
                    Residuos seleccionados: {selectedResidues?.length}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 text-white">
              <Icon name="Atom" size={48} className="opacity-50" />
              <p>Selecciona una estructura para visualizar</p>
            </div>
          )}
        </div>

        {/* Measurement tools */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Ruler"
            onClick={() => handleMeasurement('distance')}
            className="bg-black/50 text-white border-white/20 hover:bg-black/70"
          />
          <Button
            variant="outline"
            size="sm"
            iconName="Triangle"
            onClick={() => handleMeasurement('angle')}
            className="bg-black/50 text-white border-white/20 hover:bg-black/70"
          />
          <Button
            variant="outline"
            size="sm"
            iconName="Box"
            onClick={() => handleMeasurement('volume')}
            className="bg-black/50 text-white border-white/20 hover:bg-black/70"
          />
        </div>
      </div>
      {/* Measurements Panel */}
      {measurements?.length > 0 && (
        <div className="p-3 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-foreground">Mediciones</h4>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={() => setMeasurements([])}
            />
          </div>
          <div className="space-y-1">
            {measurements?.map(measurement => (
              <div key={measurement?.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">
                  {measurement?.type}: {measurement?.value}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Trash2"
                  onClick={() => removeMeasurement(measurement?.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MolstarViewer;