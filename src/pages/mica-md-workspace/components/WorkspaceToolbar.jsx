import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WorkspaceToolbar = ({ selectedMUDO, onMUDOChange }) => {
  const navigate = useNavigate();
  const [isTransferMode, setIsTransferMode] = useState(false);
  const [showMUDOSelector, setShowMUDOSelector] = useState(false);

  const mudoObjects = [
    {
      id: 'mudo_001',
      name: 'Proteína Quinasa A - Análisis MD',
      type: 'molecular_dynamics',
      status: 'active',
      lastModified: '2025-09-01T20:15:00Z',
      size: '2.3 GB',
      description: 'Simulación de dinámica molecular de 100ns para PKA'
    },
    {
      id: 'mudo_002',
      name: 'Hemoglobina - Estudio Conformacional',
      type: 'structural_analysis',
      status: 'completed',
      lastModified: '2025-08-30T14:22:00Z',
      size: '1.8 GB',
      description: 'Análisis conformacional de hemoglobina humana'
    },
    {
      id: 'mudo_003',
      name: 'Complejo Enzima-Sustrato',
      type: 'binding_analysis',
      status: 'processing',
      lastModified: '2025-09-01T18:45:00Z',
      size: '3.1 GB',
      description: 'Análisis de unión enzima-sustrato con ChronosFold'
    }
  ];

  const workspaces = [
    { id: 'antares-dashboard', name: 'ANTARES Dashboard', icon: 'BarChart3', path: '/antares-dashboard' },
    { id: 'mica-md-workspace', name: 'MICA MD Workspace', icon: 'Atom', path: '/mica-md-workspace' },
    { id: 'm-udo-creation-wizard', name: 'M-UDO Creation', icon: 'Plus', path: '/m-udo-creation-wizard' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'completed': return 'text-accent';
      case 'processing': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'Play';
      case 'completed': return 'CheckCircle';
      case 'processing': return 'Clock';
      case 'error': return 'AlertCircle';
      default: return 'Circle';
    }
  };

  const handleMUDOSelect = (mudo) => {
    onMUDOChange?.(mudo);
    setShowMUDOSelector(false);
  };

  const handleTransferMUDO = (workspaceId) => {
    if (selectedMUDO) {
      console.log(`Transferring M-UDO ${selectedMUDO?.id} to ${workspaceId}`);
      // In real implementation, this would handle the transfer
      setIsTransferMode(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/antares-dashboard')}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <Icon name="Home" size={16} />
            <span className="text-sm">ANTARES</span>
          </button>
          <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">MICA MD Workspace</span>
        </div>

        {/* M-UDO Selector and Controls */}
        <div className="flex items-center space-x-4">
          {/* M-UDO Selector */}
          <div className="relative">
            <button
              onClick={() => setShowMUDOSelector(!showMUDOSelector)}
              className="flex items-center space-x-2 px-4 py-2 bg-muted/50 border border-border rounded-lg hover:bg-muted transition-colors duration-200"
            >
              <Icon name="Database" size={16} />
              <div className="text-left">
                <div className="text-sm font-medium text-foreground">
                  {selectedMUDO ? selectedMUDO?.name : 'Seleccionar M-UDO'}
                </div>
                {selectedMUDO && (
                  <div className="text-xs text-muted-foreground">
                    {selectedMUDO?.size} • {formatDate(selectedMUDO?.lastModified)}
                  </div>
                )}
              </div>
              <Icon name="ChevronDown" size={16} className={`transition-transform duration-200 ${showMUDOSelector ? 'rotate-180' : ''}`} />
            </button>

            {showMUDOSelector && (
              <div className="absolute top-full right-0 mt-2 w-96 bg-popover border border-border rounded-lg shadow-elevation-2 z-50">
                <div className="p-3 border-b border-border">
                  <h3 className="text-sm font-medium text-foreground">Objetos M-UDO Disponibles</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {mudoObjects?.map(mudo => (
                    <button
                      key={mudo?.id}
                      onClick={() => handleMUDOSelect(mudo)}
                      className={`w-full flex items-start space-x-3 p-3 hover:bg-muted transition-colors duration-200 ${
                        selectedMUDO?.id === mudo?.id ? 'bg-accent/10 border-l-2 border-accent' : ''
                      }`}
                    >
                      <Icon name={getStatusIcon(mudo?.status)} size={16} className={getStatusColor(mudo?.status)} />
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-foreground">{mudo?.name}</div>
                        <div className="text-xs text-muted-foreground mb-1">{mudo?.description}</div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{mudo?.size}</span>
                          <span>•</span>
                          <span>{formatDate(mudo?.lastModified)}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-3 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => navigate('/m-udo-creation-wizard')}
                    className="w-full"
                  >
                    Crear Nuevo M-UDO
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Transfer Mode Toggle */}
          <Button
            variant={isTransferMode ? "default" : "outline"}
            size="sm"
            iconName="ArrowRightLeft"
            iconPosition="left"
            onClick={() => setIsTransferMode(!isTransferMode)}
            disabled={!selectedMUDO}
          >
            {isTransferMode ? 'Cancelar Transferencia' : 'Transferir M-UDO'}
          </Button>

          {/* Analysis Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Save"
              iconPosition="left"
            >
              Guardar Estado
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Exportar Resultados
            </Button>

            <Button
              variant="outline"
              size="sm"
              iconName="Settings"
            />
          </div>
        </div>
      </div>
      {/* Transfer Mode Overlay */}
      {isTransferMode && (
        <div className="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="ArrowRightLeft" size={16} className="text-accent" />
              <span className="text-sm font-medium text-foreground">
                Modo Transferencia: {selectedMUDO?.name}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Seleccionar destino:</span>
              {workspaces?.filter(ws => ws?.id !== 'mica-md-workspace')?.map(workspace => (
                  <button
                    key={workspace?.id}
                    onClick={() => handleTransferMUDO(workspace?.id)}
                    className="flex items-center space-x-2 px-3 py-1 bg-card border border-border rounded-lg hover:border-accent/50 hover:bg-accent/5 transition-colors duration-200"
                  >
                    <Icon name={workspace?.icon} size={14} />
                    <span className="text-sm text-foreground">{workspace?.name}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
      {/* Current M-UDO Status */}
      {selectedMUDO && !isTransferMode && (
        <div className="mt-4 flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon name={getStatusIcon(selectedMUDO?.status)} size={16} className={getStatusColor(selectedMUDO?.status)} />
            <div>
              <div className="text-sm font-medium text-foreground">M-UDO Activo: {selectedMUDO?.name}</div>
              <div className="text-xs text-muted-foreground">{selectedMUDO?.description}</div>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span>Tipo: {selectedMUDO?.type?.replace('_', ' ')}</span>
            <span>Estado: {selectedMUDO?.status}</span>
            <span>Tamaño: {selectedMUDO?.size}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceToolbar;