import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const WorkspaceCard = ({ workspace, onDrop, onDragOver }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(workspace?.path);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    const mudoData = JSON.parse(e?.dataTransfer?.getData('text/plain'));
    onDrop(workspace?.id, mudoData);
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    onDragOver(workspace?.id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'idle':
        return 'text-muted-foreground';
      case 'processing':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="bg-card border border-border rounded-lg p-6 cursor-pointer hover:shadow-md hover:border-accent/50 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-200">
            <Icon name={workspace?.icon} size={24} className="text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{workspace?.name}</h3>
            <p className="text-sm text-muted-foreground">{workspace?.description}</p>
          </div>
        </div>
        <div className={`w-2 h-2 rounded-full ${getStatusColor(workspace?.status)} bg-current`} />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Proyectos Activos</span>
          <span className="text-sm font-medium text-foreground">{workspace?.active_projects}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Última Actividad</span>
          <span className="text-sm text-muted-foreground">{workspace?.last_activity}</span>
        </div>

        {workspace?.recent_mudos && workspace?.recent_mudos?.length > 0 && (
          <div className="pt-2 border-t border-border">
            <div className="flex items-center space-x-2">
              <Icon name="FileText" size={14} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {workspace?.recent_mudos?.length} M-UDO recientes
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Estado del Workspace</span>
          <span className={`text-xs font-medium ${getStatusColor(workspace?.status)}`}>
            {workspace?.status === 'active' ? 'Activo' : 
             workspace?.status === 'processing' ? 'Procesando' : 'Inactivo'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCard;