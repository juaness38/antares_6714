import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import WorkspaceToolbar from './components/WorkspaceToolbar';
import MolecularStructureBrowser from './components/MolecularStructureBrowser';
import MolstarViewer from './components/MolstarViewer';
import RMSDRMSFAnalysis from './components/RMSDRMSFAnalysis';
import SimulationControls from './components/SimulationControls';
import AnalysisParameterControls from './components/AnalysisParameterControls';
import ToolPanel from './components/ToolPanel';
import ChatPanel from './components/ChatPanel';
import ExpandablePanel from './components/ExpandablePanel';
import EnhancedSequenceAnalyzer from './components/EnhancedSequenceAnalyzer';
import Icon from '../../components/AppIcon';


const MICAMDWorkspace = () => {
  // Core state management
  const [selectedMUDO, setSelectedMUDO] = useState(null);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [selectedResidues, setSelectedResidues] = useState([]);
  const [analysisParameters, setAnalysisParameters] = useState({});
  const [simulationState, setSimulationState] = useState('stopped');
  const [simulationTime, setSimulationTime] = useState(0);

  // Panel state management - ANTARES cockpit philosophy
  const [panelStates, setPanelStates] = useState({
    toolPanel: { isExpanded: false, isFullScreen: false, isCollapsed: false },
    chatPanel: { isExpanded: false, isFullScreen: false, isCollapsed: false },
    sequenceAnalyzer: { isExpanded: false, isFullScreen: false, isCollapsed: false },
    rmsdAnalysis: { isExpanded: false, isFullScreen: false, isCollapsed: false },
    molstarViewer: { isExpanded: false, isFullScreen: false, isCollapsed: false }
  });

  // Real-time synchronization state
  const [realTimeData, setRealTimeData] = useState({
    rmsd: 0,
    rmsf: [],
    cavities: null,
    chronosFoldPredictions: null,
    interactions: []
  });

  const [isMobile, setIsMobile] = useState(false);
  const [activePanel, setActivePanel] = useState('viewer');

  // SMIC and ChronosFold integration data
  const [smicData, setSMICData] = useState(null);
  const [chronosFoldData, setChronosFoldData] = useState(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Increased threshold for better UX
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize with default M-UDO following ANTARES principles
  useEffect(() => {
    const defaultMUDO = {
      id: 'mudo_001',
      name: 'Proteína Quinasa A - Análisis MD',
      type: 'molecular_dynamics',
      status: 'active',
      lastModified: '2025-09-02T01:02:54Z',
      size: '2.3 GB',
      description: 'Simulación de dinámica molecular de 100ns para PKA - ChronosFold Enhanced'
    };
    setSelectedMUDO(defaultMUDO);
  }, []);

  // Real-time data simulation - Cockpit philosophy
  useEffect(() => {
    if (simulationState === 'running') {
      const interval = setInterval(() => {
        setSimulationTime(prev => prev + 0.1);
        
        // Generate synchronized real-time data
        setRealTimeData(prev => ({
          ...prev,
          rmsd: 1.2 + Math.sin(simulationTime * 0.1) * 0.8 + Math.random() * 0.3,
          timestamp: Date.now(),
          cavities: smicData ? {
            ...smicData,
            volume: smicData?.volume + Math.random() * 5 - 2.5
          } : null
        }));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [simulationState, simulationTime, smicData]);

  // Panel expansion handler - ANTARES expandable architecture
  const handlePanelExpansion = useCallback((panelId, state) => {
    setPanelStates(prev => ({
      ...prev,
      [panelId]: state
    }));
  }, []);

  // M-UDO change handler with full synchronization
  const handleMUDOChange = useCallback((mudo) => {
    setSelectedMUDO(mudo);
    setSelectedStructure(null);
    setSelectedResidues([]);
    setSimulationTime(0);
    
    // Reset real-time data
    setRealTimeData({
      rmsd: 0,
      rmsf: [],
      cavities: null,
      chronosFoldPredictions: null,
      interactions: []
    });
    
    console.log('M-UDO changed - Full workspace synchronized:', mudo?.name);
  }, []);

  // Structure selection with real-time sync
  const handleStructureSelect = useCallback((structure) => {
    setSelectedStructure(structure);
    setSelectedResidues([]);
    
    // Initialize SMIC analysis for new structure
    if (structure) {
      setSMICData({
        cavities: 3,
        volume: 234.5,
        druggability: 87,
        sites: [
          { id: 1, name: 'Cavidad Principal', volume: 234.5, druggability: 87 },
          { id: 2, name: 'Sitio Alostérico', volume: 156.2, druggability: 72 }
        ]
      });
      
      // Initialize ChronosFold predictions
      setChronosFoldData({
        confidence: 89.3,
        lddt: 0.87,
        states: 15,
        predictions: [
          { state: 'closed', probability: 0.67, description: 'Estado basal' },
          { state: 'open', probability: 0.28, description: 'Conformación activa' }
        ]
      });
    }
    
    console.log('Structure selected - All components synchronized:', structure?.name);
  }, []);

  // Residue selection synchronization
  const handleResidueSelect = useCallback((residueIndex) => {
    if (selectedResidues?.includes(residueIndex)) {
      setSelectedResidues(prev => prev?.filter(i => i !== residueIndex));
    } else {
      setSelectedResidues(prev => [...prev, residueIndex]);
    }
  }, [selectedResidues]);

  // Real-time 3D viewer synchronization
  const handleSyncWith3DViewer = useCallback((data, action) => {
    switch (action) {
      case 'highlight':
        // Synchronize highlighting between 2D sequence and 3D viewer
        console.log('Syncing highlight for residue:', data);
        break;
      case 'sync_all':
        // Full synchronization
        console.log('Full sync between sequence analyzer and 3D viewer');
        break;
      default:
        break;
    }
  }, []);

  // AI action handler for chat panel
  const handleAIAction = useCallback((action) => {
    console.log('AI Action triggered:', action);
    
    switch (action?.type) {
      case 'show_analysis':
        setPanelStates(prev => ({
          ...prev,
          rmsdAnalysis: { ...prev?.rmsdAnalysis, isExpanded: true }
        }));
        break;
      case 'highlight_cavities':
        if (smicData) {
          // Highlight cavities in 3D viewer
          console.log('Highlighting cavities:', smicData?.sites);
        }
        break;
      case 'show_conformations':
        if (chronosFoldData) {
          console.log('Showing ChronosFold conformations:', chronosFoldData?.predictions);
        }
        break;
      default:
        console.log('Unhandled AI action:', action);
    }
  }, [smicData, chronosFoldData]);

  const mobilePanels = [
    { id: 'viewer', label: 'Visualizador', icon: 'Eye' },
    { id: 'sequence', label: 'Secuencia', icon: 'Type' },
    { id: 'analysis', label: 'Análisis', icon: 'BarChart3' },
    { id: 'tools', label: 'Herramientas', icon: 'Wrench' },
    { id: 'chat', label: 'Chat AI', icon: 'MessageCircle' }
  ];

  const renderMobileView = () => (
    <div className="h-full flex flex-col">
      {/* Mobile Panel Selector */}
      <div className="flex border-b border-border bg-card">
        {mobilePanels?.map(panel => (
          <button
            key={panel?.id}
            onClick={() => setActivePanel(panel?.id)}
            className={`flex-1 flex flex-col items-center justify-center py-3 text-xs font-medium transition-colors duration-200 ${
              activePanel === panel?.id
                ? 'text-accent border-b-2 border-accent bg-accent/5' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={panel?.icon} size={16} className="mb-1" />
            <span>{panel?.label}</span>
          </button>
        ))}
      </div>

      {/* Mobile Panel Content */}
      <div className="flex-1 overflow-hidden">
        {activePanel === 'viewer' && (
          <MolstarViewer
            structure={selectedStructure}
            selectedResidues={selectedResidues}
          />
        )}
        
        {activePanel === 'sequence' && (
          <EnhancedSequenceAnalyzer
            structure={selectedStructure}
            realTimeData={realTimeData}
            selectedResidues={selectedResidues}
            onResidueSelect={handleResidueSelect}
            onSyncWith3DViewer={handleSyncWith3DViewer}
            cavityData={smicData}
            chronosFoldData={chronosFoldData}
            simulationTime={simulationTime}
          />
        )}
        
        {activePanel === 'analysis' && (
          <RMSDRMSFAnalysis structure={selectedStructure} />
        )}
        
        {activePanel === 'tools' && (
          <ToolPanel
            isExpanded={true}
            selectedStructure={selectedStructure}
            realTimeData={realTimeData}
            syncedTime={simulationTime}
          />
        )}
        
        {activePanel === 'chat' && (
          <ChatPanel
            selectedMUDO={selectedMUDO}
            selectedStructure={selectedStructure}
            onAIAction={handleAIAction}
            isExpanded={true}
          />
        )}
      </div>
    </div>
  );

  const renderDesktopView = () => (
    <div className="grid grid-cols-12 gap-6 h-full relative">
      {/* Left Panel - 3 columns */}
      <div className="col-span-3 space-y-4">
        <ExpandablePanel
          id="structureBrowser"
          title="Explorador de Estructuras"
          icon="Database"
          position="left"
          className="h-80"
          onExpansionChange={handlePanelExpansion}
        >
          <MolecularStructureBrowser
            onStructureSelect={handleStructureSelect}
            selectedStructure={selectedStructure}
          />
        </ExpandablePanel>
        
        <ExpandablePanel
          id="sequenceAnalyzer"
          title="Analizador de Secuencias"
          icon="Type"
          position="left"
          className="flex-1"
          canFullScreen={true}
          onExpansionChange={handlePanelExpansion}
          expandedContent={
            <EnhancedSequenceAnalyzer
              structure={selectedStructure}
              realTimeData={realTimeData}
              selectedResidues={selectedResidues}
              onResidueSelect={handleResidueSelect}
              onSyncWith3DViewer={handleSyncWith3DViewer}
              cavityData={smicData}
              chronosFoldData={chronosFoldData}
              simulationTime={simulationTime}
            />
          }
        >
          <div className="p-4">
            <div className="text-sm text-muted-foreground">
              Secuencia: {selectedStructure?.name || 'Ninguna seleccionada'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Click para expandir análisis completo
            </div>
          </div>
        </ExpandablePanel>
      </div>

      {/* Center Panel - 6 columns */}
      <div className="col-span-6">
        <ExpandablePanel
          id="molstarViewer"
          title="Visualizador Molecular"
          icon="Atom"
          position="center"
          className="h-full"
          canFullScreen={true}
          onExpansionChange={handlePanelExpansion}
        >
          <MolstarViewer
            structure={selectedStructure}
            selectedResidues={selectedResidues}
          />
        </ExpandablePanel>
      </div>

      {/* Right Panel - 3 columns */}
      <div className="col-span-3 space-y-4">
        <ExpandablePanel
          id="rmsdAnalysis"
          title="Análisis RMSD/RMSF"
          icon="TrendingUp"
          position="right"
          className="h-96"
          canFullScreen={true}
          onExpansionChange={handlePanelExpansion}
        >
          <RMSDRMSFAnalysis structure={selectedStructure} />
        </ExpandablePanel>
        
        <ExpandablePanel
          id="simulationControls"
          title="Controles de Simulación"
          icon="Play"
          position="right"
          className="h-64"
          onExpansionChange={handlePanelExpansion}
        >
          <SimulationControls 
            onSimulationStateChange={(state) => setSimulationState(state)}
          />
        </ExpandablePanel>
        
        <ExpandablePanel
          id="analysisParameters"
          title="Parámetros de Análisis"
          icon="Settings"
          position="right"
          className="flex-1"
          onExpansionChange={handlePanelExpansion}
        >
          <AnalysisParameterControls 
            onParametersChange={(params) => setAnalysisParameters(params)} 
          />
        </ExpandablePanel>
      </div>

      {/* Floating ToolPanel - ANTARES Cockpit */}
      <ToolPanel
        isExpanded={panelStates?.toolPanel?.isExpanded}
        onToggleExpand={(expanded) => 
          setPanelStates(prev => ({
            ...prev,
            toolPanel: { ...prev?.toolPanel, isExpanded: expanded }
          }))
        }
        onToolSelect={(tool) => console.log('Tool selected:', tool)}
        selectedStructure={selectedStructure}
        realTimeData={realTimeData}
        syncedTime={simulationTime}
      />

      {/* Floating ChatPanel - AI Coordination */}
      {selectedMUDO && (
        <div className="fixed bottom-6 right-6 w-96 h-96 z-30">
          <ExpandablePanel
            id="chatPanel"
            title="Chat AI - MICA Driver"
            icon="MessageCircle"
            position="bottom"
            className="h-full"
            canFullScreen={true}
            defaultExpanded={false}
            onExpansionChange={handlePanelExpansion}
          >
            <ChatPanel
              selectedMUDO={selectedMUDO}
              selectedStructure={selectedStructure}
              onAIAction={handleAIAction}
              isExpanded={panelStates?.chatPanel?.isExpanded}
              onToggleExpand={(expanded) => 
                setPanelStates(prev => ({
                  ...prev,
                  chatPanel: { ...prev?.chatPanel, isExpanded: expanded }
                }))
              }
            />
          </ExpandablePanel>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-[60px]">
        <WorkspaceToolbar
          selectedMUDO={selectedMUDO}
          onMUDOChange={handleMUDOChange}
        />
        
        <div className="p-6 h-[calc(100vh-140px)]">
          {isMobile ? renderMobileView() : renderDesktopView()}
        </div>
      </div>

      {/* Real-time status indicator - ANTARES philosophy */}
      {selectedMUDO && !isMobile && (
        <div className="fixed top-20 right-6 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-elevation-2 z-20">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs font-medium text-foreground">
              ANTARES Cockpit Active
            </span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Tiempo: {simulationTime?.toFixed(1)}ns
          </div>
        </div>
      )}

      {/* Floating Transfer Zones (Desktop only) */}
      {!isMobile && selectedMUDO && (
        <>
          <div className="fixed bottom-6 left-6 w-16 h-16 bg-accent/20 border-2 border-dashed border-accent rounded-full flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-200">
            <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h8V3H9v6H3v4zm0 8h8v-6H9v4H3v2zm8 0h8V11h-2v8h2z"/>
            </svg>
          </div>
          
          <div className="fixed bottom-6 right-6 w-16 h-16 bg-success/20 border-2 border-dashed border-success rounded-full flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-200">
            <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </>
      )}
    </div>
  );
};

export default MICAMDWorkspace;