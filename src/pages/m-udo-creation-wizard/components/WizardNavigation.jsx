import React from 'react';
import Button from '../../../components/ui/Button';

const WizardNavigation = ({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  onCancel, 
  canProceed,
  isCreating 
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const getNextButtonText = () => {
    if (isLastStep) {
      return isCreating ? 'Creando M-UDO...' : 'Crear M-UDO';
    }
    return 'Siguiente';
  };

  const getNextButtonIcon = () => {
    if (isLastStep) {
      return isCreating ? 'Loader' : 'Check';
    }
    return 'ArrowRight';
  };

  return (
    <div className="flex items-center justify-between p-6 bg-card border-t border-border">
      {/* Left side - Cancel button */}
      <Button
        variant="ghost"
        onClick={onCancel}
        disabled={isCreating}
      >
        Cancelar
      </Button>

      {/* Center - Step indicator */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">
          Paso {currentStep} de {totalSteps}
        </span>
        <div className="flex space-x-1">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index + 1 <= currentStep ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right side - Navigation buttons */}
      <div className="flex items-center space-x-3">
        {!isFirstStep && (
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isCreating}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Anterior
          </Button>
        )}
        
        <Button
          variant={isLastStep ? "default" : "default"}
          onClick={onNext}
          disabled={!canProceed || isCreating}
          loading={isCreating}
          iconName={getNextButtonIcon()}
          iconPosition="right"
        >
          {getNextButtonText()}
        </Button>
      </div>
    </div>
  );
};

export default WizardNavigation;