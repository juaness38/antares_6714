import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsPanel = ({ metrics }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': case'optimal': case'running':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error': case'critical':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getProgressColor = (value, thresholds) => {
    if (value >= thresholds?.critical) return 'bg-error';
    if (value >= thresholds?.warning) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="space-y-6">
      {/* System Performance */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Rendimiento del Sistema</h3>
          <div className={`w-2 h-2 rounded-full ${getStatusColor(metrics?.system?.status)} bg-current`} />
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">CPU</span>
              <span className="text-foreground">{metrics?.system?.cpu}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(metrics?.system?.cpu, { warning: 70, critical: 90 })}`}
                style={{ width: `${metrics?.system?.cpu}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Memoria</span>
              <span className="text-foreground">{metrics?.system?.memory}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(metrics?.system?.memory, { warning: 80, critical: 95 })}`}
                style={{ width: `${metrics?.system?.memory}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Almacenamiento</span>
              <span className="text-foreground">{metrics?.system?.storage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(metrics?.system?.storage, { warning: 85, critical: 95 })}`}
                style={{ width: `${metrics?.system?.storage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Active Simulations */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Simulaciones Activas</h3>
          <Icon name="Play" size={16} className="text-accent" />
        </div>
        
        <div className="space-y-3">
          {metrics?.simulations?.map((sim, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(sim?.status)} bg-current`} />
                <span className="text-sm text-foreground">{sim?.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-foreground">{sim?.progress}%</div>
                <div className="text-xs text-muted-foreground">{sim?.eta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* IoT Sensors */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Sensores IoT</h3>
          <Icon name="Wifi" size={16} className="text-accent" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{metrics?.iot?.connected}</div>
            <div className="text-xs text-muted-foreground">Conectados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">{metrics?.iot?.total}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estado General</span>
            <span className={`font-medium ${getStatusColor(metrics?.iot?.status)}`}>
              {metrics?.iot?.status === 'healthy' ? 'Saludable' : 
               metrics?.iot?.status === 'warning' ? 'Advertencia' : 'Error'}
            </span>
          </div>
        </div>
      </div>
      {/* Recent Analyses */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Análisis Recientes</h3>
          <Icon name="BarChart3" size={16} className="text-accent" />
        </div>
        
        <div className="space-y-3">
          {metrics?.recent_analyses?.map((analysis, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="FileText" size={14} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{analysis?.name}</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">{analysis?.workspace}</div>
                <div className="text-xs text-muted-foreground">{analysis?.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;