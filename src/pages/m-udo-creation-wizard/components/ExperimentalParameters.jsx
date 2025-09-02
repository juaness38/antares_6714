import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExperimentalParameters = ({ objectType, parameters, onParametersChange }) => {
  const temperatureUnits = [
    { value: 'celsius', label: '°C (Celsius)' },
    { value: 'kelvin', label: 'K (Kelvin)' },
    { value: 'fahrenheit', label: '°F (Fahrenheit)' }
  ];

  const pressureUnits = [
    { value: 'bar', label: 'bar' },
    { value: 'atm', label: 'atm' },
    { value: 'pa', label: 'Pa' },
    { value: 'mmhg', label: 'mmHg' }
  ];

  const concentrationUnits = [
    { value: 'molar', label: 'M (Molar)' },
    { value: 'millimolar', label: 'mM (Millimolar)' },
    { value: 'micromolar', label: 'μM (Micromolar)' },
    { value: 'nanomolar', label: 'nM (Nanomolar)' }
  ];

  const timeUnits = [
    { value: 'seconds', label: 's (Segundos)' },
    { value: 'minutes', label: 'min (Minutos)' },
    { value: 'hours', label: 'h (Horas)' },
    { value: 'days', label: 'd (Días)' }
  ];

  const updateParameter = (key, value) => {
    onParametersChange({
      ...parameters,
      [key]: value
    });
  };

  const renderProteinParameters = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Temperatura"
          type="number"
          placeholder="25"
          value={parameters?.temperature || ''}
          onChange={(e) => updateParameter('temperature', e?.target?.value)}
        />
        <Select
          label="Unidad de temperatura"
          options={temperatureUnits}
          value={parameters?.temperatureUnit || 'celsius'}
          onChange={(value) => updateParameter('temperatureUnit', value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="pH"
          type="number"
          step="0.1"
          placeholder="7.4"
          value={parameters?.ph || ''}
          onChange={(e) => updateParameter('ph', e?.target?.value)}
        />
        <Input
          label="Fuerza iónica (M)"
          type="number"
          step="0.001"
          placeholder="0.150"
          value={parameters?.ionicStrength || ''}
          onChange={(e) => updateParameter('ionicStrength', e?.target?.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Concentración de proteína"
          type="number"
          placeholder="1.0"
          value={parameters?.proteinConcentration || ''}
          onChange={(e) => updateParameter('proteinConcentration', e?.target?.value)}
        />
        <Select
          label="Unidad de concentración"
          options={concentrationUnits}
          value={parameters?.concentrationUnit || 'millimolar'}
          onChange={(value) => updateParameter('concentrationUnit', value)}
        />
      </div>

      <div className="space-y-3">
        <h5 className="font-medium text-foreground">Condiciones adicionales</h5>
        <Checkbox
          label="Presencia de cofactores"
          checked={parameters?.cofactors || false}
          onChange={(e) => updateParameter('cofactors', e?.target?.checked)}
        />
        <Checkbox
          label="Ambiente reductor"
          checked={parameters?.reducing || false}
          onChange={(e) => updateParameter('reducing', e?.target?.checked)}
        />
        <Checkbox
          label="Condiciones anaeróbicas"
          checked={parameters?.anaerobic || false}
          onChange={(e) => updateParameter('anaerobic', e?.target?.checked)}
        />
      </div>
    </div>
  );

  const renderCompoundParameters = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Pureza (%)"
          type="number"
          min="0"
          max="100"
          placeholder="95"
          value={parameters?.purity || ''}
          onChange={(e) => updateParameter('purity', e?.target?.value)}
        />
        <Input
          label="Peso molecular (Da)"
          type="number"
          placeholder="180.16"
          value={parameters?.molecularWeight || ''}
          onChange={(e) => updateParameter('molecularWeight', e?.target?.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Punto de fusión (°C)"
          type="number"
          placeholder="146"
          value={parameters?.meltingPoint || ''}
          onChange={(e) => updateParameter('meltingPoint', e?.target?.value)}
        />
        <Input
          label="Solubilidad en agua (mg/mL)"
          type="number"
          placeholder="1000"
          value={parameters?.solubility || ''}
          onChange={(e) => updateParameter('solubility', e?.target?.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="LogP"
          type="number"
          step="0.01"
          placeholder="-0.77"
          value={parameters?.logp || ''}
          onChange={(e) => updateParameter('logp', e?.target?.value)}
        />
        <Input
          label="pKa"
          type="number"
          step="0.1"
          placeholder="12.35"
          value={parameters?.pka || ''}
          onChange={(e) => updateParameter('pka', e?.target?.value)}
        />
      </div>

      <Input
        label="Fórmula molecular"
        type="text"
        placeholder="C₆H₁₂O₆"
        value={parameters?.molecularFormula || ''}
        onChange={(e) => updateParameter('molecularFormula', e?.target?.value)}
      />
    </div>
  );

  const renderDatasetParameters = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Frecuencia de muestreo"
          type="number"
          placeholder="1"
          value={parameters?.samplingRate || ''}
          onChange={(e) => updateParameter('samplingRate', e?.target?.value)}
        />
        <Select
          label="Unidad de tiempo"
          options={timeUnits}
          value={parameters?.timeUnit || 'minutes'}
          onChange={(value) => updateParameter('timeUnit', value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Duración del experimento"
          type="number"
          placeholder="24"
          value={parameters?.duration || ''}
          onChange={(e) => updateParameter('duration', e?.target?.value)}
        />
        <Input
          label="Número de réplicas"
          type="number"
          min="1"
          placeholder="3"
          value={parameters?.replicates || ''}
          onChange={(e) => updateParameter('replicates', e?.target?.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Temperatura ambiente (°C)"
          type="number"
          placeholder="25"
          value={parameters?.ambientTemp || ''}
          onChange={(e) => updateParameter('ambientTemp', e?.target?.value)}
        />
        <Input
          label="Humedad relativa (%)"
          type="number"
          min="0"
          max="100"
          placeholder="60"
          value={parameters?.humidity || ''}
          onChange={(e) => updateParameter('humidity', e?.target?.value)}
        />
      </div>

      <Input
        label="Instrumentación utilizada"
        type="text"
        placeholder="Espectrofotómetro UV-Vis, pH-metro, etc."
        value={parameters?.instrumentation || ''}
        onChange={(e) => updateParameter('instrumentation', e?.target?.value)}
      />
    </div>
  );

  const renderSimulationParameters = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Paso de integración (fs)"
          type="number"
          placeholder="2"
          value={parameters?.timestep || ''}
          onChange={(e) => updateParameter('timestep', e?.target?.value)}
        />
        <Input
          label="Temperatura de simulación (K)"
          type="number"
          placeholder="298"
          value={parameters?.simTemp || ''}
          onChange={(e) => updateParameter('simTemp', e?.target?.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Presión (bar)"
          type="number"
          placeholder="1.0"
          value={parameters?.pressure || ''}
          onChange={(e) => updateParameter('pressure', e?.target?.value)}
        />
        <Input
          label="Cutoff electrostático (nm)"
          type="number"
          step="0.1"
          placeholder="1.0"
          value={parameters?.cutoff || ''}
          onChange={(e) => updateParameter('cutoff', e?.target?.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Número de átomos"
          type="number"
          placeholder="50000"
          value={parameters?.atomCount || ''}
          onChange={(e) => updateParameter('atomCount', e?.target?.value)}
        />
        <Input
          label="Volumen de la caja (nm³)"
          type="number"
          placeholder="125.0"
          value={parameters?.boxVolume || ''}
          onChange={(e) => updateParameter('boxVolume', e?.target?.value)}
        />
      </div>

      <div className="space-y-3">
        <h5 className="font-medium text-foreground">Algoritmos utilizados</h5>
        <Checkbox
          label="PME para electrostática"
          checked={parameters?.pme || false}
          onChange={(e) => updateParameter('pme', e?.target?.checked)}
        />
        <Checkbox
          label="Restricciones LINCS"
          checked={parameters?.lincs || false}
          onChange={(e) => updateParameter('lincs', e?.target?.checked)}
        />
        <Checkbox
          label="Termostato Nosé-Hoover"
          checked={parameters?.noseHoover || false}
          onChange={(e) => updateParameter('noseHoover', e?.target?.checked)}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-foreground mb-2">
          Configurar parámetros experimentales
        </h3>
        <p className="text-muted-foreground">
          Define las condiciones y parámetros específicos para tu objeto M-UDO
        </p>
      </div>
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Icon name="Info" size={16} className="text-accent" />
          <span className="text-sm font-medium text-foreground">Conversión automática de unidades</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          El sistema convertirá automáticamente las unidades al formato estándar para almacenamiento.
        </p>
      </div>
      {objectType === 'protein' && renderProteinParameters()}
      {objectType === 'compound' && renderCompoundParameters()}
      {objectType === 'dataset' && renderDatasetParameters()}
      {objectType === 'simulation' && renderSimulationParameters()}
      <div className="space-y-4">
        <h5 className="font-medium text-foreground">Metadatos adicionales</h5>
        
        <Input
          label="Investigador responsable"
          type="text"
          placeholder="Dr. María Rodríguez"
          value={parameters?.researcher || ''}
          onChange={(e) => updateParameter('researcher', e?.target?.value)}
        />
        
        <Input
          label="Institución"
          type="text"
          placeholder="Universidad de Barcelona"
          value={parameters?.institution || ''}
          onChange={(e) => updateParameter('institution', e?.target?.value)}
        />
        
        <Input
          label="Proyecto asociado"
          type="text"
          placeholder="ANTARES-2024-001"
          value={parameters?.project || ''}
          onChange={(e) => updateParameter('project', e?.target?.value)}
        />
        
        <Input
          label="Notas adicionales"
          type="text"
          placeholder="Observaciones o comentarios relevantes"
          value={parameters?.notes || ''}
          onChange={(e) => updateParameter('notes', e?.target?.value)}
        />
      </div>
    </div>
  );
};

export default ExperimentalParameters;