import React from 'react';
import Icon from '../../../components/AppIcon';

const ObjectTypeSelection = ({ selectedType, onTypeSelect }) => {
  const objectTypes = [
    {
      id: 'protein',
      title: 'Estructura Proteica',
      description: 'Datos de estructura tridimensional de proteínas',
      icon: 'Dna',
      features: ['Archivos PDB', 'Coordenadas atómicas', 'Factores B', 'Análisis conformacional'],
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      id: 'compound',
      title: 'Compuesto Molecular',
      description: 'Moléculas pequeñas y compuestos químicos',
      icon: 'Atom',
      features: ['Fórmulas químicas', 'Propiedades fisicoquímicas', 'Estructuras 2D/3D', 'Datos SMILES'],
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      id: 'dataset',
      title: 'Dataset Experimental',
      description: 'Conjuntos de datos experimentales y mediciones',
      icon: 'BarChart3',
      features: ['Datos tabulares', 'Series temporales', 'Mediciones IoT', 'Metadatos experimentales'],
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    },
    {
      id: 'simulation',
      title: 'Resultado de Simulación',
      description: 'Resultados de dinámicas moleculares y simulaciones',
      icon: 'Zap',
      features: ['Trayectorias MD', 'Análisis RMSD/RMSF', 'Energías', 'Parámetros de simulación'],
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-foreground mb-2">
          Selecciona el tipo de objeto M-UDO
        </h3>
        <p className="text-muted-foreground">
          Elige el tipo que mejor describa los datos que deseas almacenar
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {objectTypes?.map((type) => (
          <div
            key={type?.id}
            onClick={() => onTypeSelect(type?.id)}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedType === type?.id 
                ? 'border-primary bg-primary/5 shadow-md' 
                : type?.color
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${
                selectedType === type?.id ? 'bg-primary text-white' : 'bg-white'
              }`}>
                <Icon name={type?.icon} size={24} />
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">{type?.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{type?.description}</p>
                
                <div className="space-y-1">
                  {type?.features?.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon name="Check" size={14} className="text-success" />
                      <span className="text-xs text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedType === type?.id && (
                <div className="text-primary">
                  <Icon name="CheckCircle" size={20} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {selectedType && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="Info" size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Tipo seleccionado</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {objectTypes?.find(t => t?.id === selectedType)?.title} - 
            Los siguientes pasos se adaptarán a este tipo de objeto.
          </p>
        </div>
      )}
    </div>
  );
};

export default ObjectTypeSelection;