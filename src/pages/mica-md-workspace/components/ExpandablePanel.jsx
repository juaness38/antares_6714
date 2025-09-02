import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExpandablePanel = ({
  id,
  title,
  children,
  defaultExpanded = false,
  canFullScreen = true,
  position = 'right', // 'left', 'right', 'top', 'bottom'
  onExpansionChange,
  expandedContent = null,
  icon = null,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    onExpansionChange?.(id, { isExpanded, isFullScreen, isCollapsed });
  }, [isExpanded, isFullScreen, isCollapsed, id, onExpansionChange]);

  const toggleExpanded = () => {
    if (isFullScreen) {
      setIsFullScreen(false);
    }
    setIsExpanded(!isExpanded);
  };

  const toggleFullScreen = () => {
    if (!canFullScreen) return;
    
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      setIsExpanded(true);
      setIsCollapsed(false);
    }
  };

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
    if (isCollapsed) {
      setIsExpanded(false);
      setIsFullScreen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Escape' && isFullScreen) {
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    if (isFullScreen) {
      document.addEventListener('keydown', handleKeyPress);
      // Prevent body scroll when in fullscreen
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'auto';
    };
  }, [isFullScreen]);

  const getCollapseDirection = () => {
    const directions = {
      'left': 'ChevronLeft',
      'right': 'ChevronRight', 
      'top': 'ChevronUp',
      'bottom': 'ChevronDown'
    };
    return directions?.[position] || 'ChevronRight';
  };

  const getSlideClasses = () => {
    if (isFullScreen) {
      return 'fixed inset-0 z-50 bg-background';
    }
    
    if (isCollapsed) {
      return `${position === 'left' ? '-translate-x-full' : ''}${position === 'right' ? 'translate-x-full' : ''}${position === 'top' ? '-translate-y-full' : ''}${position === 'bottom' ? 'translate-y-full' : ''} transition-transform duration-300`;
    }
    
    if (isExpanded) {
      return 'transform scale-105 transition-all duration-300 shadow-elevation-3';
    }
    
    return 'transition-all duration-300';
  };

  if (isCollapsed) {
    return (
      <div className={`
        ${position === 'left' || position === 'right' ? 'w-8' : 'h-8'} 
        bg-card border border-border flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors duration-200
        ${position === 'left' ? 'border-r-0 rounded-r-lg' : ''}
        ${position === 'right' ? 'border-l-0 rounded-l-lg' : ''}
        ${position === 'top' ? 'border-b-0 rounded-b-lg' : ''}
        ${position === 'bottom' ? 'border-t-0 rounded-t-lg' : ''}
      `}
      onClick={toggleCollapsed}>
        <Icon 
          name={getCollapseDirection()} 
          size={16} 
          className={`text-muted-foreground transform ${isCollapsed ? 'rotate-180' : ''}`}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${getSlideClasses()} ${className}`}>
      <div className="h-full bg-card border border-border rounded-lg overflow-hidden shadow-elevation-1">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
          <div className="flex items-center space-x-2">
            {icon && <Icon name={icon} size={16} className="text-accent" />}
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
            
            {/* Expansion indicators */}
            <div className="flex space-x-1">
              {isExpanded && !isFullScreen && (
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              )}
              {isFullScreen && (
                <div className="px-2 py-1 bg-accent/20 text-accent text-xs rounded font-medium">
                  Pantalla Completa
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Drag handle */}
            <Button
              variant="ghost"
              size="sm"
              iconName="GripVertical"
              className={`cursor-move ${isDragging ? 'text-accent' : 'text-muted-foreground'}`}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
            />
            
            {/* Expand toggle */}
            <Button
              variant="ghost"
              size="sm"
              iconName={isExpanded ? "Minimize" : "Maximize"}
              onClick={toggleExpanded}
              title={isExpanded ? 'Contraer' : 'Expandir'}
            />
            
            {/* Full screen toggle */}
            {canFullScreen && (
              <Button
                variant="ghost"
                size="sm"
                iconName={isFullScreen ? "Minimize2" : "Maximize2"}
                onClick={toggleFullScreen}
                title={isFullScreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              />
            )}
            
            {/* Collapse toggle */}
            <Button
              variant="ghost"
              size="sm"
              iconName={getCollapseDirection()}
              onClick={toggleCollapsed}
              title="Ocultar panel"
              className="hover:bg-destructive/20 hover:text-destructive"
            />
          </div>
        </div>

        {/* Content */}
        <div className={`
          ${isFullScreen ? 'h-[calc(100vh-60px)]' : 'h-[calc(100%-48px)]'} 
          overflow-hidden
        `}>
          {isExpanded && expandedContent ? (
            <div className="h-full p-4">
              {expandedContent}
            </div>
          ) : (
            <div className="h-full">
              {children}
            </div>
          )}
        </div>

        {/* Full screen overlay controls */}
        {isFullScreen && (
          <>
            {/* Escape hint */}
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-xs">
              Presiona ESC para salir
            </div>
            
            {/* Quick actions */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                className="bg-background/90 backdrop-blur-sm"
              >
                Exportar
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Share"
                className="bg-background/90 backdrop-blur-sm"
              >
                Compartir
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpandablePanel;