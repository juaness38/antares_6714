import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ onCreateMUDO, recentActivity, notifications }) => {
  const navigate = useNavigate();

  const handleCreateMUDO = () => {
    navigate('/m-udo-creation-wizard');
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'simulation':
        return 'Play';
      case 'analysis':
        return 'BarChart3';
      case 'collaboration':
        return 'Users';
      case 'export':
        return 'Download';
      default:
        return 'Activity';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      case 'info':
        return 'Info';
      default:
        return 'Bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      case 'info':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-4">Acciones Rápidas</h3>
        
        <div className="space-y-3">
          <Button
            variant="default"
            fullWidth
            iconName="Plus"
            iconPosition="left"
            onClick={handleCreateMUDO}
          >
            Crear Nuevo M-UDO
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            iconName="Upload"
            iconPosition="left"
          >
            Importar Datos
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            iconName="Users"
            iconPosition="left"
          >
            Invitar Colaborador
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            iconName="Settings"
            iconPosition="left"
          >
            Configurar Workspace
          </Button>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Actividad Reciente</h3>
          <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
        </div>
        
        <div className="space-y-3">
          {recentActivity?.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name={getActivityIcon(activity?.type)} size={14} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity?.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-muted-foreground">{activity?.workspace}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{activity?.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="ghost" size="sm" fullWidth>
            Ver Toda la Actividad
          </Button>
        </div>
      </div>
      {/* Notifications */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Notificaciones</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full" />
            <span className="text-xs text-muted-foreground">{notifications?.length}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {notifications?.map((notification, index) => (
            <div key={index} className="flex items-start space-x-3">
              <Icon 
                name={getNotificationIcon(notification?.type)} 
                size={16} 
                className={`flex-shrink-0 mt-0.5 ${getNotificationColor(notification?.type)}`} 
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{notification?.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification?.message}</p>
                <span className="text-xs text-muted-foreground">{notification?.time}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="ghost" size="sm" fullWidth>
            Ver Todas las Notificaciones
          </Button>
        </div>
      </div>
      {/* System Status Summary */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-4">Estado del Sistema</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span className="text-sm text-foreground">Servicios Principales</span>
            </div>
            <span className="text-sm text-success">Operativo</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span className="text-sm text-foreground">APIs Externas</span>
            </div>
            <span className="text-sm text-success">Conectado</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full" />
              <span className="text-sm text-foreground">Base de Datos</span>
            </div>
            <span className="text-sm text-warning">Lento</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;