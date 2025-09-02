import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const MolecularDataUpload = ({ objectType, data, onDataChange }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    handleFileUpload(files);
  };

  const handleFileUpload = (files) => {
    files?.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        onDataChange({
          ...data,
          files: [...(data?.files || []), {
            name: file?.name,
            size: file?.size,
            type: file?.type,
            content: e?.target?.result,
            uploadedAt: new Date()?.toISOString()
          }]
        });
      };
      reader?.readAsText(file);
    });
  };

  const removeFile = (index) => {
    const updatedFiles = data?.files?.filter((_, i) => i !== index) || [];
    onDataChange({ ...data, files: updatedFiles });
  };

  const getAcceptedFormats = () => {
    switch (objectType) {
      case 'protein':
        return '.pdb,.cif,.mmcif,.xyz';
      case 'compound':
        return '.mol,.sdf,.mol2,.xyz';
      case 'dataset':
        return '.csv,.xlsx,.json,.txt';
      case 'simulation':
        return '.xtc,.dcd,.trr,.pdb';
      default:
        return '*';
    }
  };

  const getFormatDescription = () => {
    switch (objectType) {
      case 'protein':
        return 'Archivos PDB, CIF, mmCIF, XYZ';
      case 'compound':
        return 'Archivos MOL, SDF, MOL2, XYZ';
      case 'dataset':
        return 'Archivos CSV, Excel, JSON, TXT';
      case 'simulation':
        return 'Archivos XTC, DCD, TRR, PDB';
      default:
        return 'Todos los formatos';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-foreground mb-2">
          Cargar datos moleculares
        </h3>
        <p className="text-muted-foreground">
          Sube los archivos necesarios para tu objeto M-UDO
        </p>
      </div>
      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          dragActive 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Icon name="Upload" size={32} className="text-muted-foreground" />
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-1">
              Arrastra archivos aquí o haz clic para seleccionar
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Formatos aceptados: {getFormatDescription()}
            </p>
            <p className="text-xs text-muted-foreground">
              Tamaño máximo: 100MB por archivo
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            Seleccionar archivos
          </Button>
          
          <input
            id="file-input"
            type="file"
            multiple
            accept={getAcceptedFormats()}
            onChange={(e) => handleFileUpload(Array.from(e?.target?.files))}
            className="hidden"
          />
        </div>
      </div>
      {/* Uploaded Files */}
      {data?.files && data?.files?.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Archivos cargados</h4>
          {data?.files?.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="File" size={20} className="text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{file?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file?.size / 1024)?.toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                iconName="X"
              >
                Eliminar
              </Button>
            </div>
          ))}
        </div>
      )}
      {/* Sequence Input */}
      {(objectType === 'protein' || objectType === 'compound') && (
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Información de secuencia</h4>
          
          {objectType === 'protein' && (
            <Input
              label="Secuencia de aminoácidos"
              type="text"
              placeholder="MKWVTFISLLLLFSSAYSRGVFRRDTHKSEIAHRFKDLGE..."
              description="Secuencia en formato FASTA o texto plano"
              value={data?.sequence || ''}
              onChange={(e) => onDataChange({ ...data, sequence: e?.target?.value })}
            />
          )}
          
          <Input
            label="Identificador UniProt/PDB"
            type="text"
            placeholder={objectType === 'protein' ? 'P02768' : 'CHEMBL25'}
            description="ID de base de datos para referencia cruzada"
            value={data?.identifier || ''}
            onChange={(e) => onDataChange({ ...data, identifier: e?.target?.value })}
          />
          
          <Input
            label="Nombre del objeto"
            type="text"
            placeholder="Ej: Albúmina sérica humana"
            required
            value={data?.name || ''}
            onChange={(e) => onDataChange({ ...data, name: e?.target?.value })}
          />
          
          <Input
            label="Descripción"
            type="text"
            placeholder="Descripción detallada del objeto molecular"
            value={data?.description || ''}
            onChange={(e) => onDataChange({ ...data, description: e?.target?.value })}
          />
        </div>
      )}
      {/* Dataset specific fields */}
      {objectType === 'dataset' && (
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Metadatos del dataset</h4>
          
          <Input
            label="Título del dataset"
            type="text"
            placeholder="Ej: Mediciones de pH en biorreactor"
            required
            value={data?.title || ''}
            onChange={(e) => onDataChange({ ...data, title: e?.target?.value })}
          />
          
          <Input
            label="Protocolo experimental"
            type="text"
            placeholder="Descripción del protocolo utilizado"
            value={data?.protocol || ''}
            onChange={(e) => onDataChange({ ...data, protocol: e?.target?.value })}
          />
          
          <Input
            label="Condiciones experimentales"
            type="text"
            placeholder="Temperatura, pH, concentraciones, etc."
            value={data?.conditions || ''}
            onChange={(e) => onDataChange({ ...data, conditions: e?.target?.value })}
          />
        </div>
      )}
      {/* Simulation specific fields */}
      {objectType === 'simulation' && (
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Parámetros de simulación</h4>
          
          <Input
            label="Software utilizado"
            type="text"
            placeholder="Ej: GROMACS 2023.1"
            value={data?.software || ''}
            onChange={(e) => onDataChange({ ...data, software: e?.target?.value })}
          />
          
          <Input
            label="Campo de fuerza"
            type="text"
            placeholder="Ej: AMBER99SB-ILDN"
            value={data?.forcefield || ''}
            onChange={(e) => onDataChange({ ...data, forcefield: e?.target?.value })}
          />
          
          <Input
            label="Tiempo de simulación (ns)"
            type="number"
            placeholder="100"
            value={data?.simulationTime || ''}
            onChange={(e) => onDataChange({ ...data, simulationTime: e?.target?.value })}
          />
        </div>
      )}
    </div>
  );
};

export default MolecularDataUpload;