import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AnalysisParameterControls = ({ onParametersChange }) => {
  const [parameters, setParameters] = useState({
    simulationTime: '100',
    timeStep: '2.0',
    temperature: '300',
    pressure: '1.0',
    solventModel: 'tip3p',
    forceField: 'amber99sb',
    cutoffRadius: '12.0',
    constraintAlgorithm: 'lincs',
    outputFrequency: '1000',
    trajectoryFormat: 'xtc'
  });

  const [activeTab, setActiveTab] = useState('simulation');

  const handleParameterChange = (key, value) => {
    const newParameters = { ...parameters, [key]: value };
    setParameters(newParameters);
    onParametersChange?.(newParameters);
  };

  const presets = [
    {
      name: 'Simulación Rápida',
      description: 'Configuración optimizada para análisis preliminar',
      icon: 'Zap',
      params: {
        simulationTime: '10',
        timeStep: '2.0',
        temperature: '300',
        outputFrequency: '500'
      }
    },
    {
      name: 'Producción Estándar',
      description: 'Configuración balanceada para análisis detallado',
      icon: 'Settings',
      params: {
        simulationTime: '100',
        timeStep: '2.0',
        temperature: '300',
        outputFrequency: '1000'
      }
    },
    {
      name: 'Alta Precisión',
      description: 'Configuración para análisis de máxima calidad',
      icon: 'Target',
      params: {
        simulationTime: '500',
        timeStep: '1.0',
        temperature: '300',
        outputFrequency: '2000'
      }
    }
  ];

  const tabs = [
    { id: 'simulation', label: 'Simulación', icon: 'Play' },
    { id: 'analysis', label: 'Análisis', icon: 'BarChart3' },
    { id: 'output', label: 'Salida', icon: 'FileOutput' }
  ];

  const applyPreset = (preset) => {
    const newParameters = { ...parameters, ...preset?.params };
    setParameters(newParameters);
    onParametersChange?.(newParameters);
  };

  const renderSimulationTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Tiempo (ns)"
          type="number"
          value={parameters?.simulationTime}
          onChange={(e) => handleParameterChange('simulationTime', e?.target?.value)}
          placeholder="100"
        />
        <Input
          label="Paso Temporal (fs)"
          type="number"
          value={parameters?.timeStep}
          onChange={(e) => handleParameterChange('timeStep', e?.target?.value)}
          placeholder="2.0"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Temperatura (K)"
          type="number"
          value={parameters?.temperature}
          onChange={(e) => handleParameterChange('temperature', e?.target?.value)}
          placeholder="300"
        />
        <Input
          label="Presión (bar)"
          type="number"
          value={parameters?.pressure}
          onChange={(e) => handleParameterChange('pressure', e?.target?.value)}
          placeholder="1.0"
        />
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Campo de Fuerza
          </label>
          <select
            value={parameters?.forceField}
            onChange={(e) => handleParameterChange('forceField', e?.target?.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="amber99sb">AMBER99SB-ILDN</option>
            <option value="charmm36">CHARMM36</option>
            <option value="gromos54a7">GROMOS54A7</option>
            <option value="opls">OPLS-AA</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Modelo de Solvente
          </label>
          <select
            value={parameters?.solventModel}
            onChange={(e) => handleParameterChange('solventModel', e?.target?.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="tip3p">TIP3P</option>
            <option value="tip4p">TIP4P</option>
            <option value="spc">SPC</option>
            <option value="spce">SPC/E</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderAnalysisTab = () => (
    <div className="space-y-4">
      <Input
        label="Radio de Corte (Å)"
        type="number"
        value={parameters?.cutoffRadius}
        onChange={(e) => handleParameterChange('cutoffRadius', e?.target?.value)}
        placeholder="12.0"
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Algoritmo de Restricciones
        </label>
        <select
          value={parameters?.constraintAlgorithm}
          onChange={(e) => handleParameterChange('constraintAlgorithm', e?.target?.value)}
          className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="lincs">LINCS</option>
          <option value="shake">SHAKE</option>
          <option value="settle">SETTLE</option>
        </select>
      </div>

      <div className="bg-muted/50 p-3 rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">Análisis Automático</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm text-foreground">Calcular RMSD</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" defaultChecked className="rounded" />
            <span className="text-sm text-foreground">Calcular RMSF</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-foreground">Radio de Giro</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-foreground">Área Superficial</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderOutputTab = () => (
    <div className="space-y-4">
      <Input
        label="Frecuencia de Salida"
        type="number"
        value={parameters?.outputFrequency}
        onChange={(e) => handleParameterChange('outputFrequency', e?.target?.value)}
        placeholder="1000"
        description="Cada cuántos pasos guardar datos"
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Formato de Trayectoria
        </label>
        <select
          value={parameters?.trajectoryFormat}
          onChange={(e) => handleParameterChange('trajectoryFormat', e?.target?.value)}
          className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="xtc">XTC (comprimido)</option>
          <option value="trr">TRR (completo)</option>
          <option value="dcd">DCD</option>
          <option value="pdb">PDB</option>
        </select>
      </div>

      <div className="bg-muted/50 p-3 rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">Archivos de Salida</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="File" size={14} />
            <span>trajectory.{parameters?.trajectoryFormat}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="File" size={14} />
            <span>energy.edr</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="File" size={14} />
            <span>analysis_results.xvg</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Parámetros de Análisis</h3>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Configuraciones Predefinidas</h4>
          <div className="grid gap-2">
            {presets?.map((preset, index) => (
              <button
                key={index}
                onClick={() => applyPreset(preset)}
                className="flex items-center space-x-2 p-2 rounded-lg border border-border hover:border-accent/50 hover:bg-muted/50 transition-colors duration-200 text-left"
              >
                <Icon name={preset?.icon} size={16} className="text-accent" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{preset?.name}</div>
                  <div className="text-xs text-muted-foreground">{preset?.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex border-b border-border">
        {tabs?.map(tab => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab?.id
                ? 'text-accent border-b-2 border-accent bg-accent/5' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span>{tab?.label}</span>
          </button>
        ))}
      </div>
      <div className="p-4 h-[calc(100%-280px)] overflow-y-auto">
        {activeTab === 'simulation' && renderSimulationTab()}
        {activeTab === 'analysis' && renderAnalysisTab()}
        {activeTab === 'output' && renderOutputTab()}
      </div>
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" iconName="RotateCcw" iconPosition="left">
            Restablecer
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Save" iconPosition="left">
              Guardar Config
            </Button>
            <Button variant="default" size="sm" iconName="Play" iconPosition="left">
              Ejecutar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisParameterControls;