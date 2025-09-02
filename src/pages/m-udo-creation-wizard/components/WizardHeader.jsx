import React from 'react';
import Icon from '../../../components/AppIcon';

const WizardHeader = ({ currentStep, totalSteps, onClose }) => {
  const steps = [
    { id: 1, title: 'Tipo de Objeto', description: 'Seleccionar tipo de M-UDO' },
    { id: 2, title: 'Datos Moleculares', description: 'Cargar archivos y secuencias' },
    { id: 3, title: 'Parámetros Experimentales', description: 'Configurar parámetros' },
    { id: 4, title: 'Validación', description: 'Verificar integridad de datos' },
    { id: 5, title: 'Confirmación', description: 'Revisar y crear M-UDO' }
  ];

  return (
    <div className="bg-card border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Atom" size={20} color="white" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">Asistente de Creación M-UDO</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            Paso {currentStep} de {totalSteps}
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
          title="Cerrar asistente"
        >
          <Icon name="X" size={20} />
        </button>
      </div>
      {/* Progress Bar */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          {steps?.map((step, index) => (
            <div key={step?.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors duration-200 ${
                step?.id < currentStep 
                  ? 'bg-success border-success text-white' 
                  : step?.id === currentStep 
                    ? 'bg-primary border-primary text-white' :'bg-background border-border text-muted-foreground'
              }`}>
                {step?.id < currentStep ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <span className="text-sm font-medium">{step?.id}</span>
                )}
              </div>
              {index < steps?.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 transition-colors duration-200 ${
                  step?.id < currentStep ? 'bg-success' : 'bg-border'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <h2 className="text-lg font-medium text-foreground">{steps?.[currentStep - 1]?.title}</h2>
          <p className="text-sm text-muted-foreground">{steps?.[currentStep - 1]?.description}</p>
        </div>
      </div>
    </div>
  );
};

export default WizardHeader;