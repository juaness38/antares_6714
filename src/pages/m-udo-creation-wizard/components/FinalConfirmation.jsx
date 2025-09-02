import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FinalConfirmation = ({ objectType, data, parameters, onWorkspaceChange, selectedWorkspace }) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const workspaceOptions = [
    { 
      value: 'antares-dashboard', 
      label: 'ANTARES Dashboard',
      description: 'Centro de comando principal'
    },
    { 
      value: 'mica-md-workspace', 
      label: 'MICA MD Workspace',
      description: 'Análisis de dinámicas moleculares'
    },
    { 
      value: 'evolucion-workspace', 
      label: 'Evolución Workspace',
      description: 'Análisis filogenético'
    },
    { 
      value: 'estadistica-workspace', 
      label: 'Estadística Workspace',
      description: 'Visualización bioestadística'
    }
  ];

  const getObjectTypeLabel = () => {
    switch (objectType) {
      case 'protein':
        return 'Estructura Proteica';
      case 'compound':
        return 'Compuesto Molecular';
      case 'dataset':
        return 'Dataset Experimental';
      case 'simulation':
        return 'Resultado de Simulación';
      default:
        return objectType;
    }
  };

  const generateMUDOId = () => {
    const prefix = objectType?.toUpperCase()?.substring(0, 3);
    const timestamp = new Date()?.toISOString()?.replace(/[-:]/g, '')?.substring(0, 15);
    const random = Math.random()?.toString(36)?.substring(2, 5)?.toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const mudoId = generateMUDOId();

  const getEstimatedSize = () => {
    const fileSize = data?.files?.reduce((total, file) => total + file?.size, 0) || 0;
    const metadataSize = JSON.stringify({ ...data, ...parameters })?.length;
    return ((fileSize + metadataSize) / 1024)?.toFixed(1);
  };

  const getKeyParameters = () => {
    const keyParams = [];
    
    if (parameters?.temperature) {
      keyParams?.push(`Temperatura: ${parameters?.temperature}${parameters?.temperatureUnit === 'celsius' ? '°C' : parameters?.temperatureUnit === 'kelvin' ? 'K' : '°F'}`);
    }
    if (parameters?.ph) {
      keyParams?.push(`pH: ${parameters?.ph}`);
    }
    if (parameters?.proteinConcentration) {
      keyParams?.push(`Concentración: ${parameters?.proteinConcentration} ${parameters?.concentrationUnit || 'mM'}`);
    }
    if (parameters?.purity) {
      keyParams?.push(`Pureza: ${parameters?.purity}%`);
    }
    if (parameters?.samplingRate) {
      keyParams?.push(`Frecuencia: ${parameters?.samplingRate} ${parameters?.timeUnit || 'min'}`);
    }
    if (parameters?.timestep) {
      keyParams?.push(`Paso temporal: ${parameters?.timestep} fs`);
    }
    
    return keyParams?.slice(0, 4); // Mostrar máximo 4 parámetros clave
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-foreground mb-2">
          Confirmación final
        </h3>
        <p className="text-muted-foreground">
          Revisa los detalles antes de crear tu objeto M-UDO
        </p>
      </div>
      {/* M-UDO Summary Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Atom" size={24} color="white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-medium text-foreground">
                {data?.name || data?.title || 'Objeto M-UDO'}
              </h4>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                {getObjectTypeLabel()}
              </span>
            </div>
            
            <p className="text-muted-foreground mb-4">
              {data?.description || data?.protocol || 'Objeto M-UDO creado mediante el asistente'}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">ID M-UDO:</span>
                <div className="font-mono font-medium text-foreground">{mudoId}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Archivos:</span>
                <div className="font-medium text-foreground">{data?.files?.length || 0}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Tamaño:</span>
                <div className="font-medium text-foreground">{getEstimatedSize()} KB</div>
              </div>
              <div>
                <span className="text-muted-foreground">Fecha:</span>
                <div className="font-medium text-foreground">
                  {new Date()?.toLocaleDateString('es-ES')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Key Parameters */}
      {getKeyParameters()?.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h5 className="font-medium text-foreground mb-3">Parámetros clave</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {getKeyParameters()?.map((param, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Icon name="ArrowRight" size={14} className="text-accent" />
                <span className="text-sm text-muted-foreground">{param}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Files Summary */}
      {data?.files && data?.files?.length > 0 && (
        <div className="space-y-3">
          <h5 className="font-medium text-foreground">Archivos incluidos</h5>
          <div className="space-y-2">
            {data?.files?.slice(0, 3)?.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="File" size={16} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{file?.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {(file?.size / 1024)?.toFixed(1)} KB
                </span>
              </div>
            ))}
            {data?.files?.length > 3 && (
              <div className="text-center text-sm text-muted-foreground">
                ... y {data?.files?.length - 3} archivos más
              </div>
            )}
          </div>
        </div>
      )}
      {/* Workspace Assignment */}
      <div className="space-y-4">
        <h5 className="font-medium text-foreground">Asignación de workspace</h5>
        <Select
          label="Workspace de destino"
          description="Selecciona el workspace donde se creará el objeto M-UDO"
          options={workspaceOptions}
          value={selectedWorkspace}
          onChange={onWorkspaceChange}
          required
        />
        
        {selectedWorkspace && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-accent" />
              <span className="text-sm font-medium text-foreground">
                Workspace seleccionado
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {workspaceOptions?.find(w => w?.value === selectedWorkspace)?.description}
            </p>
          </div>
        )}
      </div>
      {/* Metadata Summary */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h5 className="font-medium text-foreground mb-3">Metadatos del investigador</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Investigador:</span>
            <span className="ml-2 font-medium text-foreground">
              {parameters?.researcher || 'No especificado'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Institución:</span>
            <span className="ml-2 font-medium text-foreground">
              {parameters?.institution || 'No especificada'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Proyecto:</span>
            <span className="ml-2 font-medium text-foreground">
              {parameters?.project || 'No especificado'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Creado:</span>
            <span className="ml-2 font-medium text-foreground">
              {new Date()?.toLocaleString('es-ES')}
            </span>
          </div>
        </div>
      </div>
      {/* Terms and Conditions */}
      <div className="bg-card border border-border rounded-lg p-4">
        <Checkbox
          label="Acepto los términos y condiciones"
          description="Confirmo que los datos proporcionados son precisos y que tengo autorización para crear este objeto M-UDO"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e?.target?.checked)}
          required
        />
      </div>
      {/* Creation Warning */}
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Icon name="AlertTriangle" size={16} className="text-warning" />
          <span className="text-sm font-medium text-foreground">Importante</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Una vez creado, el objeto M-UDO será inmutable. Asegúrate de que todos los datos 
          y parámetros son correctos antes de proceder.
        </p>
      </div>
      {/* Action Buttons Preview */}
      <div className="flex items-center justify-center space-x-4 pt-4">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">
            {agreedToTerms && selectedWorkspace ? 'Listo para crear' : 'Completa los requisitos'}
          </div>
          <div className={`w-4 h-4 rounded-full mx-auto ${
            agreedToTerms && selectedWorkspace ? 'bg-success' : 'bg-muted'
          }`} />
        </div>
      </div>
    </div>
  );
};

export default FinalConfirmation;