import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SequenceViewer = ({ structure }) => {
  const [selectedChain, setSelectedChain] = useState('A');
  const [selectedResidues, setSelectedResidues] = useState([]);
  const [viewMode, setViewMode] = useState('single');
  const sequenceRef = useRef(null);

  const mockSequence = {
    A: {
      sequence: 'MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEKAVQVKVKALPDAQFEVVHSLAKWKRQTLGQHDFSAGEGLYTHMKALRPDEDRLSPLHSVYVDQWDWERVMGDGERQFSTLKSTVEAIWAGIKATEAAVSEEFGLAPFLPDQIHFVHSQELLSRYPDLDAKGRERAIAKDLGAVFLVGIGGKLSDGHRHDVRAPDYDDWUQTPGYPALDISEMCERIVPKPCCYLDVLEHVLHSRHSRHMPPGQRIHHKRFNVGDICVNHKPSNTKVVVQRKRQKLMP',
      annotations: [
        { start: 1, end: 25, type: 'signal', label: 'Péptido Señal' },
        { start: 26, end: 150, type: 'domain', label: 'Dominio Catalítico' },
        { start: 151, end: 200, type: 'binding', label: 'Sitio de Unión ATP' },
        { start: 201, end: 280, type: 'regulatory', label: 'Región Regulatoria' }
      ]
    },
    B: {
      sequence: 'VHLTPEEKSAVTALWGKVNVDEVGGEALGRLLVVYPWTQRFFESFGDLSTPDAVMGNPKVKAHGKKVLGAFSDGLAHLDNLKGTFATLSELHCDKLHVDPENFRLLGNVLVCVLAHHFGKEFTPPVQAAYQKVVAGVANALAHKYH',
      annotations: [
        { start: 1, end: 50, type: 'domain', label: 'Hélice α1' },
        { start: 51, end: 100, type: 'domain', label: 'Hélice α2' },
        { start: 101, end: 147, type: 'binding', label: 'Sitio de Unión Hemo' }
      ]
    }
  };

  const chains = structure ? Object.keys(mockSequence) : ['A'];
  const currentSequence = mockSequence?.[selectedChain];

  const getAnnotationColor = (type) => {
    switch (type) {
      case 'signal': return 'bg-warning/20 text-warning';
      case 'domain': return 'bg-accent/20 text-accent';
      case 'binding': return 'bg-success/20 text-success';
      case 'regulatory': return 'bg-error/20 text-error';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleResidueClick = (index) => {
    if (selectedResidues?.includes(index)) {
      setSelectedResidues(selectedResidues?.filter(i => i !== index));
    } else {
      setSelectedResidues([...selectedResidues, index]);
    }
  };

  const renderSequence = () => {
    if (!currentSequence) return null;

    const sequence = currentSequence?.sequence;
    const residues = [];

    for (let i = 0; i < sequence?.length; i++) {
      const residue = sequence?.[i];
      const position = i + 1;
      const isSelected = selectedResidues?.includes(i);
      
      // Find annotation for this position
      const annotation = currentSequence?.annotations?.find(
        ann => position >= ann?.start && position <= ann?.end
      );

      residues?.push(
        <span
          key={i}
          className={`inline-block w-6 h-6 text-xs font-mono text-center leading-6 cursor-pointer border border-transparent rounded ${
            isSelected 
              ? 'bg-primary text-primary-foreground border-primary' 
              : annotation 
                ? getAnnotationColor(annotation?.type)
                : 'hover:bg-muted'
          }`}
          onClick={() => handleResidueClick(i)}
          title={`${residue}${position}${annotation ? ` - ${annotation?.label}` : ''}`}
        >
          {residue}
        </span>
      );

      // Add line break every 50 residues
      if ((i + 1) % 50 === 0) {
        residues?.push(<br key={`br-${i}`} />);
      }
    }

    return residues;
  };

  return (
    <div className="h-full bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Visor de Secuencias</h3>
          <div className="flex items-center space-x-2">
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e?.target?.value)}
              className="px-2 py-1 bg-input border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {chains?.map(chain => (
                <option key={chain} value={chain}>Cadena {chain}</option>
              ))}
            </select>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              FASTA
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">Longitud:</span>
            <span className="font-medium text-foreground">
              {currentSequence?.sequence?.length || 0} residuos
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">Seleccionados:</span>
            <span className="font-medium text-foreground">
              {selectedResidues?.length}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4 h-[calc(100%-200px)] overflow-y-auto">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Anotaciones:</h4>
          <div className="space-y-1">
            {currentSequence?.annotations?.map((annotation, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                <div className={`w-3 h-3 rounded ${getAnnotationColor(annotation?.type)}`} />
                <span className="text-foreground">{annotation?.label}</span>
                <span className="text-muted-foreground">
                  ({annotation?.start}-{annotation?.end})
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="font-mono text-sm leading-relaxed" ref={sequenceRef}>
          {renderSequence()}
        </div>
      </div>
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedResidues([])}
              disabled={selectedResidues?.length === 0}
            >
              Limpiar Selección
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Search"
              iconPosition="left"
            >
              Buscar Motivo
            </Button>
          </div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Icon name="Info" size={12} />
            <span>Click para seleccionar residuos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequenceViewer;