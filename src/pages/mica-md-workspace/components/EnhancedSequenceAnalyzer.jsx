import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EnhancedSequenceAnalyzer = ({ 
  structure, 
  realTimeData,
  selectedResidues,
  onResidueSelect,
  onSyncWith3DViewer,
  cavityData = null,
  chronosFoldData = null,
  simulationTime = 0
}) => {
  const [selectedChain, setSelectedChain] = useState('A');
  const [analysisMode, setAnalysisMode] = useState('interactive');
  const [timeSlice, setTimeSlice] = useState(0);
  const [showCavities, setShowCavities] = useState(true);
  const [showFlexibility, setShowFlexibility] = useState(true);
  const [showInteractions, setShowInteractions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMotif, setSelectedMotif] = useState(null);
  const sequenceRef = useRef(null);

  // Enhanced sequence data with real-time information
  const mockSequenceData = {
    A: {
      sequence: 'MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEKAVQVKVKALPDAQFEVVHSLAKWKRQTLGQHDFSAGEGLYTHMKALRPDEDRLSPLHSVYVDQWDWERVMGDGERQFSTLKSTVEAIWAGIKATEAAVSEEFGLAPFLPDQIHFVHSQELLSRYPDLDAKGRERAIAKDLGAVFLVGIGGKLSDGHRHDVRAPDYDDWUQTPGYPALDISEMCERIVPKPCCYLDVLEHVLHSRHSRHMPPGQRIHHKRFNVGDICVNHKPSNTKVVVQRKRQKLMP',
      annotations: [
        { start: 1, end: 25, type: 'signal', label: 'Péptido Señal', confidence: 0.92 },
        { start: 26, end: 150, type: 'domain', label: 'Dominio Catalítico', confidence: 0.96 },
        { start: 151, end: 200, type: 'binding', label: 'Sitio de Unión ATP', confidence: 0.89 },
        { start: 201, end: 280, type: 'regulatory', label: 'Región Regulatoria', confidence: 0.87 }
      ],
      flexibility: Array.from({ length: 350 }, (_, i) => ({
        position: i + 1,
        rmsf: 1.0 + Math.sin(i * 0.1) * 1.5 + Math.random() * 0.5,
        bFactor: 15 + Math.random() * 25
      })),
      interactions: [
        { residue: 45, partner: 123, type: 'hydrogen_bond', distance: 2.8, occupancy: 0.75 },
        { residue: 67, partner: 89, type: 'salt_bridge', distance: 3.2, occupancy: 0.85 },
        { residue: 156, partner: 178, type: 'hydrophobic', distance: 4.1, occupancy: 0.60 }
      ]
    }
  };

  // Analysis modes configuration
  const analysisModes = [
    { 
      id: 'interactive', 
      label: 'Interactivo', 
      icon: 'MousePointer',
      description: 'Selección manual de residuos'
    },
    { 
      id: 'temporal', 
      label: 'Temporal', 
      icon: 'Clock',
      description: 'Análisis a través del tiempo'
    },
    { 
      id: 'comparative', 
      label: 'Comparativo', 
      icon: 'GitCompare',
      description: 'Comparación entre estados'
    },
    { 
      id: 'cavity_focused', 
      label: 'Cavidades', 
      icon: 'Search',
      description: 'Enfocado en cavidades SMIC'
    }
  ];

  const currentSequence = mockSequenceData?.[selectedChain];

  // Real-time data processing
  useEffect(() => {
    if (realTimeData && simulationTime > 0) {
      // Update flexibility data based on real-time RMSD/RMSF
      // This would normally come from the MD simulation
      console.log('Updating sequence analysis with real-time data at time:', simulationTime);
    }
  }, [realTimeData, simulationTime]);

  const getResidueColor = (position) => {
    const residue = currentSequence?.sequence?.[position - 1];
    const annotation = currentSequence?.annotations?.find(
      ann => position >= ann?.start && position <= ann?.end
    );
    
    // Priority system for coloring
    if (selectedResidues?.includes(position - 1)) {
      return 'bg-primary text-primary-foreground border-primary';
    }
    
    if (showCavities && cavityData?.residues?.includes(position)) {
      return 'bg-error/30 text-error border-error/50';
    }
    
    if (showFlexibility && currentSequence?.flexibility?.[position - 1]?.rmsf > 2.5) {
      return 'bg-warning/30 text-warning border-warning/50';
    }
    
    if (annotation) {
      switch (annotation?.type) {
        case 'signal': return 'bg-info/20 text-info border-info/30';
        case 'domain': return 'bg-accent/20 text-accent border-accent/30';
        case 'binding': return 'bg-success/20 text-success border-success/30';
        case 'regulatory': return 'bg-warning/20 text-warning border-warning/30';
        default: return 'hover:bg-muted';
      }
    }
    
    return 'hover:bg-muted';
  };

  const handleResidueClick = (position) => {
    let index = position - 1;
    onResidueSelect?.(index);
    onSyncWith3DViewer?.(index, 'highlight');
  };

  const handleMotifSearch = () => {
    if (!searchTerm) return;
    
    const sequence = currentSequence?.sequence?.toUpperCase();
    const searchUpper = searchTerm?.toUpperCase();
    const matches = [];
    
    let index = 0;
    while ((index = sequence?.indexOf(searchUpper, index)) !== -1) {
      matches?.push({
        start: index + 1,
        end: index + searchUpper?.length,
        motif: searchUpper
      });
      index++;
    }
    
    setSelectedMotif(matches?.length > 0 ? matches : null);
  };

  const renderSequence = () => {
    if (!currentSequence) return null;

    const sequence = currentSequence?.sequence;
    const residues = [];

    for (let i = 0; i < sequence?.length; i++) {
      const residue = sequence?.[i];
      const position = i + 1;
      const isInMotif = selectedMotif?.some(motif => 
        position >= motif?.start && position <= motif?.end
      );
      
      // Get real-time data for this residue
      const flexibilityData = currentSequence?.flexibility?.[i];
      const interaction = currentSequence?.interactions?.find(int => int?.residue === position);
      
      residues?.push(
        <div
          key={i}
          className={`
            relative inline-block w-8 h-8 text-xs font-mono text-center leading-8 cursor-pointer border rounded transition-all duration-200
            ${getResidueColor(position)}
            ${isInMotif ? 'ring-2 ring-accent ring-offset-1' : ''}
          `}
          onClick={() => handleResidueClick(position)}
          title={`
            ${residue}${position}
            ${flexibilityData ? `RMSF: ${flexibilityData?.rmsf?.toFixed(2)} Å` : ''}
            ${interaction ? `\n${interaction?.type}: ${interaction?.distance?.toFixed(1)} Å` : ''}
          `}
        >
          {residue}
          
          {/* Real-time indicators */}
          {showInteractions && interaction && (
            <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
              interaction?.type === 'hydrogen_bond' ? 'bg-blue-500' :
              interaction?.type === 'salt_bridge'? 'bg-red-500' : 'bg-green-500'
            }`} />
          )}
          
          {/* Flexibility indicator */}
          {showFlexibility && flexibilityData?.rmsf > 3.0 && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 to-red-500" />
          )}
        </div>
      );

      // Add line break every 50 residues
      if ((i + 1) % 50 === 0) {
        residues?.push(
          <div key={`br-${i}`} className="w-full h-0 flex items-center justify-center my-2">
            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {i + 1}
            </div>
          </div>
        );
      }
    }

    return residues;
  };

  const renderRealTimePanel = () => (
    <div className="bg-muted/30 p-3 rounded-lg">
      <h5 className="text-sm font-medium text-foreground mb-2">Estado en Tiempo Real</h5>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="text-muted-foreground">Tiempo de Simulación:</div>
          <div className="font-mono">{simulationTime?.toFixed(1)} ns</div>
        </div>
        <div>
          <div className="text-muted-foreground">Residuos Flexibles:</div>
          <div className="font-mono">
            {currentSequence?.flexibility?.filter(f => f?.rmsf > 2.5)?.length}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Interacciones Activas:</div>
          <div className="font-mono">{currentSequence?.interactions?.length}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Cavidades Detectadas:</div>
          <div className="font-mono">{cavityData?.count || 0}</div>
        </div>
      </div>
    </div>
  );

  const renderAnalysisControls = () => (
    <div className="space-y-4">
      {/* Mode selector */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Modo de Análisis:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {analysisModes?.map(mode => (
            <button
              key={mode?.id}
              onClick={() => setAnalysisMode(mode?.id)}
              className={`
                flex items-center space-x-2 p-2 rounded border text-xs transition-colors duration-200
                ${analysisMode === mode?.id 
                  ? 'bg-accent/10 border-accent text-accent' :'bg-card border-border hover:border-accent/50'
                }
              `}
            >
              <Icon name={mode?.icon} size={14} />
              <span>{mode?.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Display options */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Mostrar:
        </label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showCavities}
              onChange={(e) => setShowCavities(e?.target?.checked)}
              className="rounded"
            />
            <span className="text-sm text-foreground">Cavidades SMIC</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showFlexibility}
              onChange={(e) => setShowFlexibility(e?.target?.checked)}
              className="rounded"
            />
            <span className="text-sm text-foreground">Flexibilidad (RMSF)</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showInteractions}
              onChange={(e) => setShowInteractions(e?.target?.checked)}
              className="rounded"
            />
            <span className="text-sm text-foreground">Interacciones</span>
          </label>
        </div>
      </div>

      {/* Motif search */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Buscar Motivo:
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            placeholder="ej: RGD, KDEL"
            className="flex-1 px-2 py-1 bg-input border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            variant="outline"
            size="sm"
            iconName="Search"
            onClick={handleMotifSearch}
          />
        </div>
        {selectedMotif && (
          <div className="mt-2 text-xs text-success">
            Encontrado en {selectedMotif?.length} ubicacion{selectedMotif?.length !== 1 ? 'es' : ''}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Type" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">
            Analizador de Secuencias 2D
          </h3>
          <div className="px-2 py-1 bg-accent/10 text-accent text-xs rounded">
            X-Ray Molecular
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e?.target?.value)}
            className="px-2 py-1 bg-input border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="A">Cadena A</option>
            <option value="B">Cadena B</option>
            <option value="all">Todas</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            onClick={() => onSyncWith3DViewer?.(null, 'sync_all')}
          />
        </div>
      </div>

      <div className="flex h-[calc(100%-80px)]">
        {/* Controls Panel */}
        <div className="w-64 p-4 border-r border-border bg-muted/20">
          {renderAnalysisControls()}
          {renderRealTimePanel()}
        </div>

        {/* Sequence Display */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="font-mono text-sm leading-relaxed space-y-1" ref={sequenceRef}>
            {renderSequence()}
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h5 className="text-sm font-medium text-foreground mb-3">Leyenda</h5>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-accent/20 border border-accent/30 rounded" />
                  <span className="text-foreground">Dominio Catalítico</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-success/20 border border-success/30 rounded" />
                  <span className="text-foreground">Sitio de Unión</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-error/30 border border-error/50 rounded" />
                  <span className="text-foreground">Cavidades SMIC</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-warning/30 border border-warning/50 rounded" />
                  <span className="text-foreground">Alta Flexibilidad</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-primary text-primary-foreground border border-primary rounded" />
                  <span className="text-foreground">Seleccionado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-foreground">Puente de Hidrógeno</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSequenceAnalyzer;