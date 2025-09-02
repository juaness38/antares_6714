import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ChatPanel = ({ 
  selectedMUDO, 
  selectedStructure, 
  onAIAction, 
  isExpanded,
  onToggleExpand 
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content: 'MICA AI Driver iniciado. Listo para coordinar análisis biotecnológicos.',
      timestamp: new Date(),
      actions: []
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // AI Capabilities and workflows
  const aiCapabilities = [
    {
      id: 'sequence_analysis',
      name: 'Análisis de Secuencias',
      icon: 'Type',
      description: 'Análisis completo de secuencias con anotaciones'
    },
    {
      id: 'md_analysis',
      name: 'MD Analysis',
      icon: 'Activity',
      description: 'Análisis de dinámicas moleculares'
    },
    {
      id: 'structure_prediction',
      name: 'Predicción Estructural',
      icon: 'Brain',
      description: 'ChronosFold y predicciones conformacionales'
    },
    {
      id: 'cavity_detection',
      name: 'Detección de Cavidades',
      icon: 'Search',
      description: 'SMIC para sitios de unión y cavidades'
    },
    {
      id: 'file_management',
      name: 'Gestión de Archivos',
      icon: 'FileText',
      description: 'Subir, convertir y gestionar archivos'
    },
    {
      id: 'visualization',
      name: 'Visualización',
      icon: 'Eye',
      description: 'Control del visualizador molecular'
    }
  ];

  // Predefined quick actions
  const quickActions = [
    {
      id: 'analyze_structure',
      label: 'Analizar Estructura',
      icon: 'Atom',
      prompt: 'Analiza la estructura actual con todos los algoritmos disponibles'
    },
    {
      id: 'predict_dynamics',
      label: 'Predecir Dinámicas',
      icon: 'Brain',
      prompt: 'Utiliza ChronosFold para predecir las dinámicas de esta proteína'
    },
    {
      id: 'find_cavities',
      label: 'Encontrar Cavidades',
      icon: 'Search',
      prompt: 'Ejecuta SMIC para detectar todas las cavidades y sitios de unión'
    },
    {
      id: 'export_results',
      label: 'Exportar Resultados',
      icon: 'Download',
      prompt: 'Prepara un reporte completo con todos los análisis realizados'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate AI response
  const simulateAIResponse = async (userMessage) => {
    setIsTyping(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let response = '';
    let actions = [];
    
    // Simple AI response logic based on user input
    const lowercaseMessage = userMessage?.toLowerCase();
    
    if (lowercaseMessage?.includes('analiz') || lowercaseMessage?.includes('rmsd') || lowercaseMessage?.includes('rmsf')) {
      response = `Ejecutando análisis completo de la estructura ${selectedStructure?.name || 'seleccionada'}. 

Iniciando pipeline de análisis:
• ✅ Carga de trayectoria MD completada
• 🔄 Calculando RMSD y RMSF...
• 🔄 Análisis PCA Ca-Ca en progreso...
• ⏳ Detección de cavidades con SMIC...

Resultados preliminares: La proteína muestra estabilidad estructural con RMSD promedio de 1.8 Å.`;
      
      actions = [
        { type: 'show_analysis', label: 'Ver Análisis RMSD/RMSF' },
        { type: 'export_data', label: 'Exportar Datos' }
      ];
    } else if (lowercaseMessage?.includes('cavidad') || lowercaseMessage?.includes('sitio') || lowercaseMessage?.includes('smic')) {
      response = `Ejecutando SMIC (Sitio Molecular Inteligente Classifier) en la estructura actual...

🔍 **Análisis de Cavidades Detectadas:**
• Cavidad Principal: 234.5 Ų - Druggability: 87%
• Sitio Alostérico: 156.2 Ų - Druggability: 72%
• Bolsillo Secundario: 89.7 Ų - Druggability: 45%

🎯 **Sitios Recomendados para Drug Design:**
1. Cavidad Principal - Alto potencial terapéutico
2. Región de unión ATP - Sitio conservado

Los resultados se han sincronizado con el visualizador molecular.`;
      
      actions = [
        { type: 'highlight_cavities', label: 'Resaltar Cavidades' },
        { type: 'cavity_report', label: 'Reporte Detallado' }
      ];
    } else if (lowercaseMessage?.includes('chronos') || lowercaseMessage?.includes('predic') || lowercaseMessage?.includes('conformac')) {
      response = `ChronosFold iniciado para predicción conformacional...

🧠 **Análisis Predictivo:**
• Confianza del modelo: 89.3%
• LDDT Score: 0.87
• Conformaciones predichas: 15 estados significativos

📊 **Estados Conformacionales Identificados:**
1. Estado Cerrado (67% del tiempo) - Estado basal
2. Estado Abierto (28% del tiempo) - Conformación activa  
3. Estados intermedios (5%) - Transiciones dinámicas

La proteína muestra flexibilidad en los bucles 45-67 y 156-178, consistente con sitios de unión de ligandos.`;
      
      actions = [
        { type: 'show_conformations', label: 'Mostrar Estados' },
        { type: 'chronos_animation', label: 'Animación Temporal' }
      ];
    } else if (lowercaseMessage?.includes('archivo') || lowercaseMessage?.includes('subir') || lowercaseMessage?.includes('cargar')) {
      response = `Sistema de gestión de archivos activado.

📁 **Formatos Soportados:**
• Estructuras: PDB, mmCIF, CIF, SDF
• Trayectorias: DCD, XTC, TRR, NetCDF
• Secuencias: FASTA, PIR, PHYLIP
• Datos: CSV, JSON, HDF5

🔄 **Conversiones Automáticas:**
• PDB → mmCIF (para estructuras grandes)
• Trayectorias → formato optimizado HDF5
• Secuencias → alineamientos MSA

¿Qué tipo de archivo necesitas procesar?`;
      
      actions = [
        { type: 'upload_file', label: 'Subir Archivo' },
        { type: 'convert_format', label: 'Convertir Formato' }
      ];
    } else if (lowercaseMessage?.includes('export') || lowercaseMessage?.includes('reporte') || lowercaseMessage?.includes('download')) {
      response = `Preparando reporte completo del análisis actual...

📋 **Contenido del Reporte:**
• Resumen ejecutivo de análisis MD
• Gráficos RMSD/RMSF de alta resolución
• Mapas de cavidades y sitios activos
• Predicciones ChronosFold
• Métricas de calidad de simulación

📊 **Formatos Disponibles:**
• PDF - Reporte científico completo
• Excel - Datos tabulares y gráficos
• PyMol - Script de visualización
• CSV - Datos brutos para análisis

Preparación completada. Listo para descarga.`;
      
      actions = [
        { type: 'download_pdf', label: 'Descargar PDF' },
        { type: 'download_excel', label: 'Descargar Excel' },
        { type: 'download_pymol', label: 'Script PyMol' }
      ];
    } else {
      response = `Entiendo tu consulta. Como tu asistente AI especializado en biotecnología, puedo ayudarte con:

🔬 **Análisis Disponibles:**
• Dinámicas moleculares (RMSD, RMSF, PCA)
• Detección de cavidades con SMIC
• Predicciones con ChronosFold
• Análisis de secuencias y interacciones

🛠️ **Herramientas Activas:**
${aiCapabilities?.map(cap => `• ${cap?.name}: ${cap?.description}`)?.join('\n')}

¿En qué te gustaría que me enfoque? Puedo ejecutar análisis específicos o coordinar múltiples herramientas para un estudio completo.`;
      
      actions = quickActions?.map(qa => ({ type: qa?.id, label: qa?.label }));
    }
    
    const aiMessage = {
      id: Date.now(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      actions: actions
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
    
    // Trigger workflow if applicable
    if (lowercaseMessage?.includes('analiz')) {
      setCurrentWorkflow('analysis_pipeline');
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage?.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      actions: []
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    await simulateAIResponse(inputMessage);
  };

  const handleQuickAction = (action) => {
    setInputMessage(action?.prompt);
    // Auto-send after a brief delay
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleActionClick = (action) => {
    onAIAction?.(action);
    
    // Add confirmation message
    const confirmationMessage = {
      id: Date.now(),
      type: 'system',
      content: `Ejecutando acción: ${action?.label}`,
      timestamp: new Date(),
      actions: []
    };
    
    setMessages(prev => [...prev, confirmationMessage]);
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    return timestamp?.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = (message) => {
    const isUser = message?.type === 'user';
    const isSystem = message?.type === 'system';
    
    return (
      <div key={message?.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
          {/* Avatar and name */}
          <div className={`flex items-center space-x-2 mb-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-center space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isUser ? 'bg-accent text-accent-foreground' : 
                isSystem ? 'bg-muted': 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
              }`}>
                <Icon name={
                  isUser ? 'User' : isSystem ?'Settings': 'Brain'
                } size={14} />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {isUser ? 'Tú' : isSystem ? 'Sistema' : 'MICA AI'}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(message?.timestamp)}
              </span>
            </div>
          </div>
          
          {/* Message content */}
          <div className={`p-3 rounded-lg whitespace-pre-wrap ${
            isUser 
              ? 'bg-accent text-accent-foreground' 
              : isSystem
                ? 'bg-muted/50 text-muted-foreground border border-border'
                : 'bg-card border border-border'
          }`}>
            {message?.content}
          </div>
          
          {/* Action buttons */}
          {message?.actions && message?.actions?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {message?.actions?.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleActionClick(action)}
                  className="text-xs"
                >
                  {action?.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-card border border-border rounded-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Icon name="MessageCircle" size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Panel Chat</h3>
            <div className="text-xs text-muted-foreground">
              AI Driver • {selectedMUDO ? selectedMUDO?.name : 'Sin M-UDO'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? "Minimize2" : "Maximize2"}
            onClick={() => onToggleExpand?.()}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {quickActions?.map(action => (
            <Button
              key={action?.id}
              variant="outline"
              size="sm"
              iconName={action?.icon}
              onClick={() => handleQuickAction(action)}
              className="text-xs"
            >
              {action?.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages?.map(renderMessage)}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="bg-card border border-border p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span className="text-xs text-muted-foreground">MICA AI está escribiendo...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e?.target?.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu consulta... (Enter para enviar)"
              className="w-full px-3 py-2 pr-10 bg-input border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="Mic"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            />
          </div>
          <Button
            variant="default"
            iconName="Send"
            onClick={handleSendMessage}
            disabled={!inputMessage?.trim()}
          />
        </div>
        
        {/* Current workflow indicator */}
        {currentWorkflow && (
          <div className="mt-2 text-xs text-muted-foreground flex items-center space-x-2">
            <Icon name="Activity" size={12} className="animate-spin" />
            <span>Workflow activo: {currentWorkflow}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;