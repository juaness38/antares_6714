import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ValidationResults = ({ objectType, data, parameters, validationResults, onRevalidate }) => {
  const mockValidationResults = {
    overall: 'success', // success, warning, error
    checks: [
      {
        id: 'file_format',
        name: 'Formato de archivos',
        status: 'success',
        message: 'Todos los archivos tienen formato válido',
        details: 'Se detectaron 2 archivos PDB con estructura correcta'
      },
      {
        id: 'data_integrity',
        name: 'Integridad de datos',
        status: 'success',
        message: 'Los datos son consistentes y completos',
        details: 'Coordenadas atómicas válidas, factores B en rango normal'
      },
      {
        id: 'metadata_completeness',
        name: 'Completitud de metadatos',
        status: 'warning',
        message: 'Algunos metadatos opcionales están vacíos',
        details: 'Se recomienda completar el campo "Institución" para mejor trazabilidad'
      },
      {
        id: 'parameter_validation',
        name: 'Validación de parámetros',
        status: 'success',
        message: 'Parámetros experimentales válidos',
        details: 'Temperatura, pH y concentraciones en rangos aceptables'
      },
      {
        id: 'cross_reference',
        name: 'Referencias cruzadas',
        status: 'success',
        message: 'Identificadores verificados',
        details: 'ID UniProt P02768 encontrado en base de datos'
      }
    ],
    suggestions: [
      'Considera añadir información sobre la institución para mejorar la trazabilidad',
      'Los parámetros de temperatura están optimizados para condiciones fisiológicas',
      'Se recomienda incluir datos de control negativo si están disponibles'
    ],
    statistics: {
      totalChecks: 5,
      passed: 4,
      warnings: 1,
      errors: 0,
      completeness: 85
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <Icon name="CheckCircle" size={20} className="text-success" />;
      case 'warning':
        return <Icon name="AlertTriangle" size={20} className="text-warning" />;
      case 'error':
        return <Icon name="XCircle" size={20} className="text-error" />;
      default:
        return <Icon name="Clock" size={20} className="text-muted-foreground" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'border-success bg-success/5';
      case 'warning':
        return 'border-warning bg-warning/5';
      case 'error':
        return 'border-error bg-error/5';
      default:
        return 'border-border bg-muted/5';
    }
  };

  const getOverallStatusMessage = () => {
    const { overall } = mockValidationResults;
    switch (overall) {
      case 'success':
        return {
          title: 'Validación exitosa',
          message: 'Tu objeto M-UDO está listo para ser creado',
          color: 'text-success'
        };
      case 'warning':
        return {
          title: 'Validación con advertencias',
          message: 'Se encontraron algunas advertencias que deberías revisar',
          color: 'text-warning'
        };
      case 'error':
        return {
          title: 'Errores de validación',
          message: 'Se encontraron errores que deben corregirse antes de continuar',
          color: 'text-error'
        };
      default:
        return {
          title: 'Validando...',
          message: 'Verificando la integridad de los datos',
          color: 'text-muted-foreground'
        };
    }
  };

  const statusMessage = getOverallStatusMessage();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-foreground mb-2">
          Resultados de validación
        </h3>
        <p className="text-muted-foreground">
          Verificación de integridad y calidad de los datos
        </p>
      </div>
      {/* Overall Status */}
      <div className={`p-6 rounded-lg border-2 ${getStatusColor(mockValidationResults?.overall)}`}>
        <div className="flex items-center space-x-3 mb-4">
          {getStatusIcon(mockValidationResults?.overall)}
          <div>
            <h4 className={`font-medium ${statusMessage?.color}`}>
              {statusMessage?.title}
            </h4>
            <p className="text-sm text-muted-foreground">
              {statusMessage?.message}
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {mockValidationResults?.statistics?.passed}
            </div>
            <div className="text-sm text-muted-foreground">Aprobadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">
              {mockValidationResults?.statistics?.warnings}
            </div>
            <div className="text-sm text-muted-foreground">Advertencias</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-error">
              {mockValidationResults?.statistics?.errors}
            </div>
            <div className="text-sm text-muted-foreground">Errores</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {mockValidationResults?.statistics?.completeness}%
            </div>
            <div className="text-sm text-muted-foreground">Completitud</div>
          </div>
        </div>
      </div>
      {/* Detailed Checks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-foreground">Verificaciones detalladas</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={onRevalidate}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Revalidar
          </Button>
        </div>

        {mockValidationResults?.checks?.map((check) => (
          <div
            key={check?.id}
            className={`p-4 rounded-lg border ${getStatusColor(check?.status)}`}
          >
            <div className="flex items-start space-x-3">
              {getStatusIcon(check?.status)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-medium text-foreground">{check?.name}</h5>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{check?.message}</p>
                <p className="text-xs text-muted-foreground">{check?.details}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Suggestions */}
      {mockValidationResults?.suggestions?.length > 0 && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="Lightbulb" size={16} className="text-accent" />
            <h5 className="font-medium text-foreground">Sugerencias de mejora</h5>
          </div>
          <ul className="space-y-2">
            {mockValidationResults?.suggestions?.map((suggestion, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Icon name="ArrowRight" size={14} className="text-accent mt-0.5" />
                <span className="text-sm text-muted-foreground">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Data Summary */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h5 className="font-medium text-foreground mb-3">Resumen de datos</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Tipo de objeto:</span>
            <span className="ml-2 font-medium text-foreground capitalize">{objectType}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Archivos cargados:</span>
            <span className="ml-2 font-medium text-foreground">
              {data?.files?.length || 0}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Parámetros configurados:</span>
            <span className="ml-2 font-medium text-foreground">
              {Object.keys(parameters || {})?.length}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Tamaño total:</span>
            <span className="ml-2 font-medium text-foreground">
              {data?.files?.reduce((total, file) => total + file?.size, 0) / 1024 || 0} KB
            </span>
          </div>
        </div>
      </div>
      {/* Error Details (if any) */}
      {mockValidationResults?.statistics?.errors > 0 && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <h5 className="font-medium text-error">Errores que requieren atención</h5>
          </div>
          <p className="text-sm text-muted-foreground">
            Debes corregir los errores marcados antes de poder crear el objeto M-UDO.
            Revisa los archivos cargados y los parámetros configurados.
          </p>
        </div>
      )}
    </div>
  );
};

export default ValidationResults;