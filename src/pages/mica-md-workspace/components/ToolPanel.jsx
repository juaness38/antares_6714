import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ToolPanel = ({ 
  isExpanded, 
  onToggleExpand, 
  selectedStructure, 
  onToolSelect, 
  realTimeData,
  syncedTime = 0 
}) => {
  const [activeTools, setActiveTools] = useState(['rmsd', 'sequence']);
  const [toolsData, setToolsData] = useState({});
  const [panelPosition, setPanelPosition] = useState('right');
  const [miniMode, setMiniMode] = useState(!isExpanded);

  // Analysis tools configuration following ANTARES cockpit philosophy
  const analysisTools = [
    {
      id: 'rmsd',
      name: 'RMSD',
      icon: 'TrendingUp',
      type: 'chart',
      description: 'Desviación cuadrática media en tiempo real',
      color: 'accent',
      shortcut: 'R'
    },
    {
      id: 'rmsf',
      name: 'RMSF',
      icon: 'BarChart3',
      type: 'chart',
      description: 'Fluctuaciones por residuo',
      color: 'success',
      shortcut: 'F'
    },
    {
      id: 'sequence',
      name: 'Secuencia',
      icon: 'Type',
      type: 'viewer',
      description: 'Analizador de secuencias 2D',
      color: 'warning',
      shortcut: 'S'
    },
    {
      id: 'smic',
      name: 'SMIC',
      icon: 'Search',
      type: 'detector',
      description: 'Detector de cavidades y sitios',
      color: 'error',
      shortcut: 'C'
    },
    {
      id: 'chronos',
      name: 'ChronosFold',
      icon: 'Brain',
      type: 'predictor',
      description: 'Predicción temporal de conformaciones',
      color: 'info',
      shortcut: 'H'
    },
    {
      id: 'pca',
      name: 'PCA Ca-Ca',
      icon: 'Network',
      type: 'analysis',
      description: 'Análisis de componentes principales',
      color: 'accent',
      shortcut: 'P'
    },
    {
      id: 'contacts',
      name: 'Contactos',
      icon: 'Link',
      type: 'interaction',
      description: 'Matriz de contactos intramoleculares',
      color: 'success',
      shortcut: 'T'
    },
    {
      id: 'energetics',
      name: 'Energética',
      icon: 'Zap',
      type: 'energy',
      description: 'Análisis energético de la simulación',
      color: 'warning',
      shortcut: 'E'
    }
  ];

  // Generate real-time mock data for active tools
  useEffect(() => {
    if (selectedStructure && activeTools?.length > 0) {
      const interval = setInterval(() => {
        const newData = {};
        activeTools?.forEach(toolId => {
          const tool = analysisTools?.find(t => t?.id === toolId);
          if (tool) {
            switch (tool?.type) {
              case 'chart':
                newData[toolId] = {
                  value: Math.random() * 3 + 0.5,
                  trend: Math.random() > 0.5 ? 'up' : 'down',
                  timestamp: syncedTime
                };
                break;
              case 'detector':
                newData[toolId] = {
                  cavities: Math.floor(Math.random() * 5) + 1,
                  volume: Math.random() * 100 + 50,
                  druggability: Math.random() * 100
                };
                break;
              case 'predictor':
                newData[toolId] = {
                  confidence: 85 + Math.random() * 15,
                  prediction: 'stable',
                  lddt: 0.85 + Math.random() * 0.1
                };
                break;
              default:
                newData[toolId] = {
                  status: 'active',
                  progress: Math.random() * 100
                };
            }
          }
        });
        setToolsData(newData);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [selectedStructure, activeTools, syncedTime]);

  const toggleTool = (toolId) => {
    if (activeTools?.includes(toolId)) {
      setActiveTools(activeTools?.filter(id => id !== toolId));
    } else {
      setActiveTools([...activeTools, toolId]);
    }
    onToolSelect?.(toolId);
  };

  const getToolColor = (colorName) => {
    const colors = {
      accent: 'text-accent bg-accent/10 border-accent/20',
      success: 'text-success bg-success/10 border-success/20',
      warning: 'text-warning bg-warning/10 border-warning/20',
      error: 'text-error bg-error/10 border-error/20',
      info: 'text-info bg-info/10 border-info/20'
    };
    return colors?.[colorName] || colors?.accent;
  };

  const renderMiniTool = (tool) => {
    const isActive = activeTools?.includes(tool?.id);
    const data = toolsData?.[tool?.id];
    
    return (
      <div
        key={tool?.id}
        className={`
          relative p-2 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105
          ${isActive ? getToolColor(tool?.color) : 'bg-muted/50 border-border hover:border-accent/50'}
        `}
        onClick={() => toggleTool(tool?.id)}
        title={`${tool?.name} - ${tool?.description} (${tool?.shortcut})`}
      >
        <div className="flex items-center justify-between">
          <Icon name={tool?.icon} size={16} />
          {data && (
            <div className="text-xs font-mono">
              {tool?.type === 'chart' && data?.value?.toFixed(1)}
              {tool?.type === 'detector' && data?.cavities}
              {tool?.type === 'predictor' && data?.confidence?.toFixed(0) + '%'}
            </div>
          )}
        </div>
        
        <div className="text-xs font-medium mt-1 truncate">
          {tool?.name}
        </div>

        {/* Real-time indicator */}
        {isActive && data && (
          <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
            data?.trend === 'up' ? 'bg-success animate-pulse' : 
            data?.trend === 'down'? 'bg-error animate-pulse' : 'bg-accent animate-pulse'
          }`} />
        )}
      </div>
    );
  };

  const renderExpandedTool = (tool) => {
    const isActive = activeTools?.includes(tool?.id);
    const data = toolsData?.[tool?.id];
    
    return (
      <div
        key={tool?.id}
        className={`
          p-4 rounded-lg border cursor-pointer transition-all duration-200
          ${isActive ? getToolColor(tool?.color) : 'bg-card border-border hover:border-accent/50'}
        `}
        onClick={() => toggleTool(tool?.id)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Icon name={tool?.icon} size={20} />
            <div>
              <div className="font-medium text-foreground">{tool?.name}</div>
              <div className="text-xs text-muted-foreground">
                Atajo: {tool?.shortcut}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Maximize2"
              onClick={(e) => {
                e?.stopPropagation();
                // Expand tool to full screen
                onToggleExpand?.(tool?.id);
              }}
            />
            {isActive && (
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground mb-3">
          {tool?.description}
        </div>
        {/* Real-time data display */}
        {isActive && data && (
          <div className="bg-muted/30 p-3 rounded border">
            {tool?.type === 'chart' && (
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Valor actual:</span>
                  <span className="text-sm font-mono">{data?.value?.toFixed(2)} Å</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Tendencia:</span>
                  <Icon 
                    name={data?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                    size={16} 
                    className={data?.trend === 'up' ? 'text-success' : 'text-error'}
                  />
                </div>
              </div>
            )}
            
            {tool?.type === 'detector' && (
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Cavidades:</span>
                  <span className="text-sm font-mono">{data?.cavities}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Volumen:</span>
                  <span className="text-sm font-mono">{data?.volume?.toFixed(1)} Ų</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Druggability:</span>
                  <span className="text-sm font-mono">{data?.druggability?.toFixed(0)}%</span>
                </div>
              </div>
            )}
            
            {tool?.type === 'predictor' && (
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Confianza:</span>
                  <span className="text-sm font-mono">{data?.confidence?.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">LDDT:</span>
                  <span className="text-sm font-mono">{data?.lddt?.toFixed(3)}</span>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Quick actions */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              iconName="Settings"
              onClick={(e) => {
                e?.stopPropagation();
                // Configure tool
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              onClick={(e) => {
                e?.stopPropagation();
                // Export tool data
              }}
            />
          </div>
          
          <Button
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={(e) => {
              e?.stopPropagation();
              toggleTool(tool?.id);
            }}
          >
            {isActive ? 'Activo' : 'Activar'}
          </Button>
        </div>
      </div>
    );
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.ctrlKey || e?.metaKey) {
        const tool = analysisTools?.find(t => 
          t?.shortcut?.toLowerCase() === e?.key?.toLowerCase()
        );
        if (tool) {
          e?.preventDefault();
          toggleTool(tool?.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (miniMode) {
    return (
      <div className={`
        fixed ${panelPosition === 'right' ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 
        bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-elevation-2 p-2 z-40
        max-h-96 overflow-y-auto
      `}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-medium text-foreground px-2">ToolPanel</div>
          <Button
            variant="ghost"
            size="sm"
            iconName="Maximize2"
            onClick={() => setMiniMode(false)}
            className="h-6 w-6"
          />
        </div>
        
        <div className="space-y-2 w-20">
          {analysisTools?.map(renderMiniTool)}
        </div>

        {/* Position toggle */}
        <div className="mt-2 pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            onClick={() => setPanelPosition(panelPosition === 'right' ? 'left' : 'right')}
            className="w-full h-6 text-xs"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Wrench" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">ToolPanel</h3>
          <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            Cockpit Antares
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-xs text-muted-foreground">
            {activeTools?.length} activo{activeTools?.length !== 1 ? 's' : ''}
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="Minimize2"
            onClick={() => setMiniMode(true)}
          />
        </div>
      </div>

      {/* Tools Grid */}
      <div className="p-4 h-[calc(100%-80px)] overflow-y-auto">
        <div className="grid grid-cols-1 gap-4">
          {analysisTools?.map(renderExpandedTool)}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>Sincronizado: {syncedTime?.toFixed(1)}ns</span>
          {selectedStructure && (
            <span>Estructura: {selectedStructure?.name}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="Wifi" size={12} className="text-success" />
          <span>En tiempo real</span>
        </div>
      </div>
    </div>
  );
};

export default ToolPanel;