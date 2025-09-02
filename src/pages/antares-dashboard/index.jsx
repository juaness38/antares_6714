import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import MUDOCard from './components/MUDOCard';
import WorkspaceCard from './components/WorkspaceCard';
import MetricsPanel from './components/MetricsPanel';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AntaresDashboard = () => {
  const [selectedMUDO, setSelectedMUDO] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [draggedMUDO, setDraggedMUDO] = useState(null);

  // Mock M-UDO data
  const mudoObjects = [
    {
      id: 'mudo-001',
      name: 'Proteína SARS-CoV-2 Spike',
      type: 'protein',
      status: 'validated',
      created_at: '2025-08-28T10:30:00Z',
      created_by: 'Dr. María Rodríguez',
      size: '2.4 MB',
      confidence_score: 94,
      structure_preview: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'
    },
    {
      id: 'mudo-002',
      name: 'Secuencia ADN BRCA1',
      type: 'dna',
      status: 'pending',
      created_at: '2025-08-30T14:15:00Z',
      created_by: 'Dr. Carlos Mendoza',
      size: '1.8 MB',
      confidence_score: 87,
      structure_preview: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg?w=400&h=300&fit=crop'
    },
    {
      id: 'mudo-003',
      name: 'Compuesto Antiviral AV-2024',
      type: 'compound',
      status: 'draft',
      created_at: '2025-09-01T09:45:00Z',
      created_by: 'Dra. Ana López',
      size: '856 KB',
      confidence_score: 72,
      structure_preview: 'https://images.pixabay.com/photo/2017/03/23/19/33/pill-2169313_1280.jpg?w=400&h=300&fit=crop'
    },
    {
      id: 'mudo-004',
      name: 'Enzima Catalasa Optimizada',
      type: 'protein',
      status: 'validated',
      created_at: '2025-08-25T16:20:00Z',
      created_by: 'Dr. Roberto Silva',
      size: '3.1 MB',
      confidence_score: 96,
      structure_preview: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop'
    },
    {
      id: 'mudo-005',
      name: 'Péptido Antimicrobiano PM-X1',
      type: 'protein',
      status: 'pending',
      created_at: '2025-08-31T11:30:00Z',
      created_by: 'Dra. Elena Vásquez',
      size: '1.2 MB',
      confidence_score: 89,
      structure_preview: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?w=400&h=300&fit=crop'
    },
    {
      id: 'mudo-006',
      name: 'Receptor ACE2 Modificado',
      type: 'protein',
      status: 'validated',
      created_at: '2025-08-27T13:10:00Z',
      created_by: 'Dr. Fernando García',
      size: '2.8 MB',
      confidence_score: 91,
      structure_preview: 'https://images.pixabay.com/photo/2020/04/24/03/55/cells-5084537_1280.jpg?w=400&h=300&fit=crop'
    }
  ];

  // Mock workspace data
  const workspaces = [
    {
      id: 'mica-md',
      name: 'MICA MD',
      description: 'Dinámica molecular y análisis estructural',
      icon: 'Atom',
      path: '/mica-md-workspace',
      status: 'active',
      active_projects: 8,
      last_activity: 'hace 2 min',
      recent_mudos: ['mudo-001', 'mudo-004']
    },
    {
      id: 'evolucion',
      name: 'Evolución',
      description: 'Análisis filogenético y evolutivo',
      icon: 'GitBranch',
      path: '/evolucion-workspace',
      status: 'active',
      active_projects: 3,
      last_activity: 'hace 15 min',
      recent_mudos: ['mudo-002']
    },
    {
      id: 'estadistica',
      name: 'Estadística',
      description: 'Análisis bioestadístico avanzado',
      icon: 'BarChart3',
      path: '/estadistica-workspace',
      status: 'idle',
      active_projects: 5,
      last_activity: 'hace 1 hora',
      recent_mudos: []
    },
    {
      id: 'iot',
      name: 'IoT',
      description: 'Gestión de biorreactores y sensores',
      icon: 'Wifi',
      path: '/iot-workspace',
      status: 'processing',
      active_projects: 12,
      last_activity: 'hace 5 min',
      recent_mudos: ['mudo-003', 'mudo-005']
    },
    {
      id: 'superdinamo',
      name: 'SUPERDINAMO',
      description: 'Simulaciones de alta performance',
      icon: 'Zap',
      path: '/superdinamo-workspace',
      status: 'active',
      active_projects: 2,
      last_activity: 'hace 30 min',
      recent_mudos: ['mudo-006']
    }
  ];

  // Mock metrics data
  const metricsData = {
    system: {
      status: 'healthy',
      cpu: 67,
      memory: 45,
      storage: 23
    },
    simulations: [
      {
        name: 'Plegamiento Proteína X',
        status: 'running',
        progress: 78,
        eta: '2h 15min'
      },
      {
        name: 'Docking Molecular AV-2024',
        status: 'running',
        progress: 34,
        eta: '4h 30min'
      },
      {
        name: 'Análisis RMSD Catalasa',
        status: 'running',
        progress: 92,
        eta: '15min'
      }
    ],
    iot: {
      connected: 23,
      total: 25,
      status: 'healthy'
    },
    recent_analyses: [
      {
        name: 'Análisis RMSF Spike',
        workspace: 'MICA MD',
        time: 'hace 10 min'
      },
      {
        name: 'Árbol Filogenético BRCA1',
        workspace: 'Evolución',
        time: 'hace 25 min'
      },
      {
        name: 'Correlación Estadística',
        workspace: 'Estadística',
        time: 'hace 1 hora'
      }
    ]
  };

  // Mock recent activity data
  const recentActivity = [
    {
      type: 'simulation',
      description: 'Simulación de plegamiento completada para Proteína SARS-CoV-2 Spike',
      workspace: 'MICA MD',
      time: 'hace 5 min'
    },
    {
      type: 'analysis',
      description: 'Nuevo análisis RMSD iniciado para Enzima Catalasa',
      workspace: 'MICA MD',
      time: 'hace 12 min'
    },
    {
      type: 'collaboration',
      description: 'Dr. Carlos Mendoza compartió M-UDO Secuencia ADN BRCA1',
      workspace: 'Evolución',
      time: 'hace 20 min'
    },
    {
      type: 'export',
      description: 'Resultados exportados para Compuesto Antiviral AV-2024',
      workspace: 'IoT',
      time: 'hace 35 min'
    }
  ];

  // Mock notifications data
  const notifications = [
    {
      type: 'success',
      title: 'Simulación Completada',
      message: 'El análisis de dinámica molecular ha finalizado exitosamente',
      time: 'hace 3 min'
    },
    {
      type: 'warning',
      title: 'Recursos Limitados',
      message: 'El uso de CPU está cerca del límite recomendado',
      time: 'hace 15 min'
    },
    {
      type: 'info',
      title: 'Nueva Colaboración',
      message: 'Invitación pendiente de Dra. Ana López',
      time: 'hace 1 hora'
    }
  ];

  const filteredMUDOs = mudoObjects?.filter(mudo => {
    const matchesSearch = mudo?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         mudo?.created_by?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesFilter = filterStatus === 'all' || mudo?.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleMUDODragStart = (mudo) => {
    setDraggedMUDO(mudo);
  };

  const handleWorkspaceDrop = (workspaceId, mudoData) => {
    console.log(`M-UDO ${mudoData?.name} transferido a workspace ${workspaceId}`);
    // Here you would implement the actual transfer logic
  };

  const handleWorkspaceDragOver = (workspaceId) => {
    // Visual feedback for drag over
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-[60px]">
        <div className="container mx-auto px-4 py-6">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">ANTARES Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Centro de comando para gestión de M-UDO y navegación entre workspaces especializados
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Última sincronización</div>
                  <div className="text-sm font-medium text-foreground">
                    {new Date()?.toLocaleTimeString('es-ES')}
                  </div>
                </div>
                <Button variant="outline" iconName="RefreshCw" size="sm">
                  Sincronizar
                </Button>
              </div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar - M-UDO Library */}
            <div className="col-span-12 lg:col-span-3">
              <div className="bg-card border border-border rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Biblioteca M-UDO</h2>
                  <Button variant="ghost" size="sm" iconName="Filter" />
                </div>
                
                {/* Search and Filter */}
                <div className="space-y-3 mb-4">
                  <Input
                    type="search"
                    placeholder="Buscar M-UDO..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e?.target?.value)}
                  />
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e?.target?.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="validated">Validado</option>
                    <option value="pending">Pendiente</option>
                    <option value="draft">Borrador</option>
                  </select>
                </div>

                {/* M-UDO Cards */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredMUDOs?.map((mudo) => (
                    <MUDOCard
                      key={mudo?.id}
                      mudo={mudo}
                      onDragStart={handleMUDODragStart}
                      onSelect={setSelectedMUDO}
                      isSelected={selectedMUDO?.id === mudo?.id}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Center Area - Metrics Dashboard */}
            <div className="col-span-12 lg:col-span-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Panel de Métricas en Tiempo Real</h2>
                <MetricsPanel metrics={metricsData} />
              </div>

              {/* Workspaces Grid */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Workspaces Especializados</h2>
                  <div className="flex items-center space-x-2">
                    <Icon name="Info" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Arrastra M-UDO aquí para transferir
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workspaces?.map((workspace) => (
                    <WorkspaceCard
                      key={workspace?.id}
                      workspace={workspace}
                      onDrop={handleWorkspaceDrop}
                      onDragOver={handleWorkspaceDragOver}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Quick Actions */}
            <div className="col-span-12 lg:col-span-3">
              <QuickActions
                recentActivity={recentActivity}
                notifications={notifications}
                onCreateMUDO={() => {}}
              />
            </div>
          </div>

          {/* Selected M-UDO Details */}
          {selectedMUDO && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedMUDO(null)}>
              <div className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full mx-4" onClick={(e) => e?.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-foreground">{selectedMUDO?.name}</h3>
                  <Button variant="ghost" size="sm" iconName="X" onClick={() => setSelectedMUDO(null)} />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <img
                      src={selectedMUDO?.structure_preview}
                      alt={`${selectedMUDO?.name} structure`}
                      className="w-full h-48 object-cover rounded-lg bg-muted"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                      <p className="text-foreground capitalize">{selectedMUDO?.type}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Estado</label>
                      <p className="text-foreground capitalize">{selectedMUDO?.status}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Creado por</label>
                      <p className="text-foreground">{selectedMUDO?.created_by}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Fecha de creación</label>
                      <p className="text-foreground">
                        {new Date(selectedMUDO.created_at)?.toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Tamaño</label>
                      <p className="text-foreground">{selectedMUDO?.size}</p>
                    </div>
                    
                    {selectedMUDO?.confidence_score && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Puntuación de confianza</label>
                        <p className="text-foreground">{selectedMUDO?.confidence_score}%</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <Button variant="outline" onClick={() => setSelectedMUDO(null)}>
                    Cerrar
                  </Button>
                  <Button variant="default">
                    Abrir en Workspace
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AntaresDashboard;