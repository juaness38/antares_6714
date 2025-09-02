import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import WizardHeader from './components/WizardHeader';
import ObjectTypeSelection from './components/ObjectTypeSelection';
import MolecularDataUpload from './components/MolecularDataUpload';
import ExperimentalParameters from './components/ExperimentalParameters';
import ValidationResults from './components/ValidationResults';
import FinalConfirmation from './components/FinalConfirmation';
import WizardNavigation from './components/WizardNavigation';

const MUDOCreationWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  
  // Wizard data state
  const [selectedObjectType, setSelectedObjectType] = useState('');
  const [molecularData, setMolecularData] = useState({});
  const [experimentalParameters, setExperimentalParameters] = useState({});
  const [validationResults, setValidationResults] = useState(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState('antares-dashboard');

  const totalSteps = 5;

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.ctrlKey || e?.metaKey) {
        switch (e?.key) {
          case 'ArrowLeft':
            e?.preventDefault();
            if (currentStep > 1 && !isCreating) {
              handlePrevious();
            }
            break;
          case 'ArrowRight':
            e?.preventDefault();
            if (canProceedToNext() && !isCreating) {
              handleNext();
            }
            break;
          case 'Escape':
            e?.preventDefault();
            if (!isCreating) {
              handleCancel();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, isCreating]);

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return selectedObjectType !== '';
      case 2:
        return (molecularData?.files && molecularData?.files?.length > 0) || 
               molecularData?.name || 
               molecularData?.title;
      case 3:
        return Object.keys(experimentalParameters)?.length > 0;
      case 4:
        return true; // Validation step always allows proceeding
      case 5:
        return selectedWorkspace !== '' && 
               (experimentalParameters?.agreedToTerms || true); // Mock agreement check
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === totalSteps) {
      await handleCreateMUDO();
    } else {
      if (currentStep === 3) {
        // Trigger validation when moving from parameters to validation
        setValidationResults({ validated: true, timestamp: new Date() });
      }
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleCancel = () => {
    if (window.confirm('¿Estás seguro de que deseas cancelar? Se perderán todos los datos ingresados.')) {
      navigate('/antares-dashboard');
    }
  };

  const handleClose = () => {
    handleCancel();
  };

  const handleRevalidate = () => {
    setValidationResults({ 
      validated: true, 
      timestamp: new Date(),
      revalidated: true 
    });
  };

  const handleCreateMUDO = async () => {
    setIsCreating(true);
    
    try {
      // Simulate M-UDO creation process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock successful creation
      const mudoId = `${selectedObjectType?.toUpperCase()?.substring(0, 3)}-${Date.now()}`;
      
      // Navigate to the selected workspace with success message
      navigate(`/${selectedWorkspace}`, {
        state: {
          mudoCreated: true,
          mudoId: mudoId,
          mudoType: selectedObjectType,
          mudoName: molecularData?.name || molecularData?.title || 'Nuevo M-UDO'
        }
      });
    } catch (error) {
      console.error('Error creating M-UDO:', error);
      setIsCreating(false);
      // In a real app, show error message
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ObjectTypeSelection
            selectedType={selectedObjectType}
            onTypeSelect={setSelectedObjectType}
          />
        );
      case 2:
        return (
          <MolecularDataUpload
            objectType={selectedObjectType}
            data={molecularData}
            onDataChange={setMolecularData}
          />
        );
      case 3:
        return (
          <ExperimentalParameters
            objectType={selectedObjectType}
            parameters={experimentalParameters}
            onParametersChange={setExperimentalParameters}
          />
        );
      case 4:
        return (
          <ValidationResults
            objectType={selectedObjectType}
            data={molecularData}
            parameters={experimentalParameters}
            validationResults={validationResults}
            onRevalidate={handleRevalidate}
          />
        );
      case 5:
        return (
          <FinalConfirmation
            objectType={selectedObjectType}
            data={molecularData}
            parameters={experimentalParameters}
            selectedWorkspace={selectedWorkspace}
            onWorkspaceChange={setSelectedWorkspace}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[1001] flex items-center justify-center p-4">
        <div className="bg-background rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Wizard Header */}
          <WizardHeader
            currentStep={currentStep}
            totalSteps={totalSteps}
            onClose={handleClose}
          />
          
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <div className="max-w-2xl mx-auto">
                {renderCurrentStep()}
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <WizardNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onCancel={handleCancel}
            canProceed={canProceedToNext()}
            isCreating={isCreating}
          />
        </div>
      </div>
    </div>
  );
};

export default MUDOCreationWizard;