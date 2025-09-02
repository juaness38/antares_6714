import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RMSDRMSFAnalysis = ({ structure }) => {
  const [activeTab, setActiveTab] = useState('rmsd');
  const [timeRange, setTimeRange] = useState([0, 100]);
  const [selectedChain, setSelectedChain] = useState('A');

  // Mock RMSD data
  const rmsdData = Array.from({ length: 100 }, (_, i) => ({
    time: i,
    rmsd: 1.2 + Math.sin(i * 0.1) * 0.8 + Math.random() * 0.3,
    backbone: 0.8 + Math.sin(i * 0.08) * 0.4 + Math.random() * 0.2,
    sidechain: 1.8 + Math.sin(i * 0.12) * 1.2 + Math.random() * 0.4
  }));

  // Mock RMSF data
  const rmsfData = Array.from({ length: 350 }, (_, i) => {
    let baseValue = 1.0;
    // Add higher flexibility for loop regions
    if (i > 50 && i < 80) baseValue = 2.5; // Loop 1
    if (i > 150 && i < 180) baseValue = 3.2; // Loop 2
    if (i > 280 && i < 310) baseValue = 2.8; // Loop 3
    
    return {
      residue: i + 1,
      rmsf: baseValue + Math.random() * 0.5,
      secondary: i > 25 && i < 150 ? 'helix' : i > 200 && i < 280 ? 'sheet' : 'loop'
    };
  });

  const tabs = [
    { id: 'rmsd', label: 'RMSD', icon: 'TrendingUp' },
    { id: 'rmsf', label: 'RMSF', icon: 'BarChart3' },
    { id: 'analysis', label: 'Análisis', icon: 'Calculator' }
  ];

  const getSecondaryStructureColor = (type) => {
    switch (type) {
      case 'helix': return '#ef4444';
      case 'sheet': return '#3b82f6';
      case 'loop': return '#10b981';
      default: return '#6b7280';
    }
  };

  const calculateStatistics = (data, key) => {
    const values = data?.map(d => d?.[key]);
    const mean = values?.reduce((a, b) => a + b, 0) / values?.length;
    const variance = values?.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values?.length;
    const stdDev = Math.sqrt(variance);
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return { mean, stdDev, min, max };
  };

  const rmsdStats = calculateStatistics(rmsdData, 'rmsd');
  const rmsfStats = calculateStatistics(rmsfData, 'rmsf');

  const renderRMSDTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">
          Desviación Cuadrática Media (RMSD)
        </h4>
        <div className="flex items-center space-x-2">
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e?.target?.value)}
            className="px-2 py-1 bg-input border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="A">Cadena A</option>
            <option value="B">Cadena B</option>
            <option value="all">Todas</option>
          </select>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rmsdData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              label={{ value: 'Tiempo (ns)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              label={{ value: 'RMSD (Å)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="rmsd" 
              stroke="var(--color-accent)" 
              strokeWidth={2}
              name="RMSD Total"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="backbone" 
              stroke="var(--color-success)" 
              strokeWidth={2}
              name="Backbone"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="sidechain" 
              stroke="var(--color-warning)" 
              strokeWidth={2}
              name="Cadenas Laterales"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="text-muted-foreground">RMSD Promedio</div>
          <div className="text-lg font-semibold text-foreground">
            {rmsdStats?.mean?.toFixed(2)} Å
          </div>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="text-muted-foreground">Desv. Estándar</div>
          <div className="text-lg font-semibold text-foreground">
            {rmsdStats?.stdDev?.toFixed(2)} Å
          </div>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="text-muted-foreground">Rango</div>
          <div className="text-lg font-semibold text-foreground">
            {rmsdStats?.min?.toFixed(2)} - {rmsdStats?.max?.toFixed(2)} Å
          </div>
        </div>
      </div>
    </div>
  );

  const renderRMSFTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">
          Fluctuaciones Cuadráticas Medias (RMSF)
        </h4>
        <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
          Exportar
        </Button>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rmsfData?.filter((_, i) => i % 5 === 0)}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="residue" 
              stroke="var(--color-muted-foreground)"
              label={{ value: 'Número de Residuo', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              label={{ value: 'RMSF (Å)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px'
              }}
              formatter={(value, name, props) => [
                `${value?.toFixed(2)} Å`,
                'RMSF'
              ]}
              labelFormatter={(label) => `Residuo ${label}`}
            />
            <Bar 
              dataKey="rmsf" 
              fill={(entry) => getSecondaryStructureColor(entry?.secondary)}
              name="RMSF"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-foreground">Leyenda Estructura Secundaria</h5>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded" />
              <span className="text-foreground">Hélices α</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-foreground">Láminas β</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-foreground">Bucles</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h5 className="text-sm font-medium text-foreground">Estadísticas RMSF</h5>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Promedio:</span>
              <span className="text-foreground">{rmsfStats?.mean?.toFixed(2)} Å</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Máximo:</span>
              <span className="text-foreground">{rmsfStats?.max?.toFixed(2)} Å</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Residuos flexibles:</span>
              <span className="text-foreground">
                {rmsfData?.filter(d => d?.rmsf > 2.0)?.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalysisTab = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-foreground">Análisis Comparativo</h4>
      
      <div className="bg-muted/50 p-4 rounded-lg">
        <h5 className="text-sm font-medium text-foreground mb-3">Resumen del Análisis</h5>
        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
            <div>
              <div className="font-medium text-foreground">Estabilidad Estructural</div>
              <div className="text-muted-foreground">
                La proteína muestra estabilidad con RMSD promedio de {rmsdStats?.mean?.toFixed(2)} Å
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
            <div>
              <div className="font-medium text-foreground">Regiones Flexibles</div>
              <div className="text-muted-foreground">
                Se identificaron {rmsfData?.filter(d => d?.rmsf > 2.5)?.length} residuos con alta flexibilidad
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-accent mt-0.5" />
            <div>
              <div className="font-medium text-foreground">Sitios de Interés</div>
              <div className="text-muted-foreground">
                Los bucles muestran mayor movilidad, típico para sitios de unión
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-3">
          <h5 className="text-sm font-medium text-foreground mb-2">Convergencia RMSD</h5>
          <div className="text-xs text-muted-foreground mb-2">
            Últimos 20 ns: {rmsdData?.slice(-20)?.reduce((a, b) => a + b?.rmsd, 0) / 20 < 2.0 ? 'Convergente' : 'No convergente'}
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-success h-2 rounded-full" 
              style={{ width: '85%' }}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-3">
          <h5 className="text-sm font-medium text-foreground mb-2">Calidad Simulación</h5>
          <div className="text-xs text-muted-foreground mb-2">
            Basado en estabilidad y convergencia
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full" 
              style={{ width: '92%' }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button variant="outline" iconName="FileText" iconPosition="left">
          Generar Reporte
        </Button>
        <Button variant="default" iconName="Share" iconPosition="left">
          Compartir Análisis
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-card border border-border rounded-lg">
      <div className="flex border-b border-border">
        {tabs?.map(tab => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab?.id
                ? 'text-accent border-b-2 border-accent bg-accent/5' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span>{tab?.label}</span>
          </button>
        ))}
      </div>
      <div className="p-4 h-[calc(100%-60px)] overflow-y-auto">
        {activeTab === 'rmsd' && renderRMSDTab()}
        {activeTab === 'rmsf' && renderRMSFTab()}
        {activeTab === 'analysis' && renderAnalysisTab()}
      </div>
    </div>
  );
};

export default RMSDRMSFAnalysis;