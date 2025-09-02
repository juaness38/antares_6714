import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const MUDOCard = ({ mudo, onDragStart, onSelect, isSelected }) => {
  const handleDragStart = (e) => {
    e?.dataTransfer?.setData('text/plain', JSON.stringify(mudo));
    onDragStart(mudo);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'validated':
        return 'text-success bg-success/10 border-success/20';
      case 'pending':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'draft':
        return 'text-muted-foreground bg-muted border-border';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'protein':
        return 'Atom';
      case 'dna':
        return 'Dna';
      case 'compound':
        return 'Beaker';
      default:
        return 'FileText';
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onSelect(mudo)}
      className={`bg-card border border-border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all duration-200 ${
        isSelected ? 'ring-2 ring-accent border-accent' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name={getTypeIcon(mudo?.type)} size={16} className="text-accent" />
          <span className="text-sm font-medium text-foreground">{mudo?.name}</span>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(mudo?.status)}`}>
          {mudo?.status}
        </div>
      </div>
      <div className="mb-3">
        <Image
          src={mudo?.structure_preview}
          alt={`${mudo?.name} structure`}
          className="w-full h-24 object-cover rounded-md bg-muted"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Creado</span>
          <span>{new Date(mudo.created_at)?.toLocaleDateString('es-ES')}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Tamaño</span>
          <span>{mudo?.size}</span>
        </div>
        {mudo?.confidence_score && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Confianza</span>
            <span>{mudo?.confidence_score}%</span>
          </div>
        )}
      </div>
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center space-x-2">
          <Icon name="User" size={12} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{mudo?.created_by}</span>
        </div>
      </div>
    </div>
  );
};

export default MUDOCard;