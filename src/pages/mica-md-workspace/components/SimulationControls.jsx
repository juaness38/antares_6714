import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SimulationControls = ({ onSimulationStateChange }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(100);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [temperature, setTemperature] = useState(300);
  const [pressure, setPressure] = useState(1.0);
  const [energy, setEnergy] = useState(-125000);

  // Mock simulation progress
  useEffect(() => {
    let interval;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = Math.min(prev + 0.1 * speed, totalTime);
          setProgress((newTime / totalTime) * 100);
          
          // Mock energy fluctuation
          setEnergy(prev => prev + (Math.random() - 0.5) * 1000);
          
          if (newTime >= totalTime) {
            setIsRunning(false);
            onSimulationStateChange?.('completed');
          }
          
          return newTime;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, speed, totalTime, onSimulationStateChange]);

  const handlePlay = () => {
    setIsRunning(true);
    setIsPaused(false);
    onSimulationStateChange?.('running');
  };

  const handlePause = () => {
    setIsPaused(true);
    onSimulationStateChange?.('paused');
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentTime(0);
    setProgress(0);
    onSimulationStateChange?.('stopped');
  };

  const handleReset = () => {
    handleStop();
    setCurrentTime(0);
    setProgress(0);
    setEnergy(-125000);
  };

  const handleTimelineClick = (e) => {
    const rect = e?.currentTarget?.getBoundingClientRect();
    const clickX = e?.clientX - rect?.left;
    const newProgress = (clickX / rect?.width) * 100;
    const newTime = (newProgress / 100) * totalTime;
    
    setCurrentTime(newTime);
    setProgress(newProgress);
  };

  const formatTime = (time) => {
    return `${time?.toFixed(1)} ns`;
  };

  const getStatusColor = () => {
    if (isRunning && !isPaused) return 'text-success';
    if (isPaused) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getStatusText = () => {
    if (isRunning && !isPaused) return 'Ejecutándose';
    if (isPaused) return 'Pausado';
    if (progress >= 100) return 'Completado';
    return 'Detenido';
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Controles de Simulación</h3>
          <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
            <div className="w-2 h-2 rounded-full bg-current" />
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Button
            variant="outline"
            size="sm"
            iconName="SkipBack"
            onClick={handleReset}
            disabled={isRunning && !isPaused}
          />
          
          {!isRunning || isPaused ? (
            <Button
              variant="default"
              iconName="Play"
              onClick={handlePlay}
              className="bg-success hover:bg-success/90"
            />
          ) : (
            <Button
              variant="default"
              iconName="Pause"
              onClick={handlePause}
              className="bg-warning hover:bg-warning/90"
            />
          )}
          
          <Button
            variant="outline"
            size="sm"
            iconName="Square"
            onClick={handleStop}
            disabled={!isRunning && !isPaused}
          />
          
          <Button
            variant="outline"
            size="sm"
            iconName="SkipForward"
            disabled={isRunning && !isPaused}
          />
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progreso</span>
            <span className="text-foreground font-medium">
              {formatTime(currentTime)} / {formatTime(totalTime)}
            </span>
          </div>
          
          <div 
            className="w-full h-3 bg-muted rounded-full cursor-pointer relative"
            onClick={handleTimelineClick}
          >
            <div 
              className="h-full bg-accent rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-accent border-2 border-white rounded-full shadow-sm"
              style={{ left: `calc(${progress}% - 8px)` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>0 ns</span>
            <span>{progress?.toFixed(1)}%</span>
            <span>{totalTime} ns</span>
          </div>
        </div>
      </div>
      {/* Speed Control */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground">Velocidad de Reproducción</label>
          <span className="text-sm text-muted-foreground">{speed}x</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSpeed(Math.max(0.1, speed - 0.1))}
            disabled={isRunning && !isPaused}
          >
            -
          </Button>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e?.target?.value))}
            className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            disabled={isRunning && !isPaused}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSpeed(Math.min(5, speed + 0.1))}
            disabled={isRunning && !isPaused}
          >
            +
          </Button>
        </div>
      </div>
      {/* Real-time Metrics */}
      <div className="p-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Métricas en Tiempo Real</h4>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Thermometer" size={14} className="text-warning" />
              <span className="text-xs text-muted-foreground">Temperatura</span>
            </div>
            <div className="text-lg font-semibold text-foreground">
              {temperature?.toFixed(1)} K
            </div>
          </div>
          
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Gauge" size={14} className="text-accent" />
              <span className="text-xs text-muted-foreground">Presión</span>
            </div>
            <div className="text-lg font-semibold text-foreground">
              {pressure?.toFixed(2)} bar
            </div>
          </div>
        </div>

        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Zap" size={14} className="text-error" />
            <span className="text-xs text-muted-foreground">Energía Potencial</span>
          </div>
          <div className="text-lg font-semibold text-foreground">
            {energy?.toFixed(0)} kJ/mol
          </div>
        </div>

        {/* SMIC Lite Integration Status */}
        <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Cpu" size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">SMIC Lite</span>
            <div className="w-2 h-2 bg-success rounded-full" />
          </div>
          <div className="text-xs text-muted-foreground">
            Conectado • Procesando datos en tiempo real
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;