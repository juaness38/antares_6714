import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSystemStatusOpen, setIsSystemStatusOpen] = useState(false);
  const workspaceRef = useRef(null);
  const userMenuRef = useRef(null);
  const systemStatusRef = useRef(null);

  const workspaces = [
    {
      id: 'antares-dashboard',
      name: 'ANTARES Dashboard',
      path: '/antares-dashboard',
      icon: 'BarChart3',
      activeProjects: 12,
      description: 'Central command center'
    },
    {
      id: 'mica-md-workspace',
      name: 'MICA MD Workspace',
      path: '/mica-md-workspace',
      icon: 'Atom',
      activeProjects: 3,
      description: 'Molecular dynamics analysis'
    }
  ];

  const systemStatus = {
    simulations: { active: 4, total: 7, status: 'running' },
    sensors: { connected: 23, total: 25, status: 'healthy' },
    resources: { cpu: 67, memory: 45, storage: 23, status: 'optimal' }
  };

  const currentWorkspace = workspaces?.find(ws => ws?.path === location?.pathname) || workspaces?.[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (workspaceRef?.current && !workspaceRef?.current?.contains(event?.target)) {
        setIsWorkspaceOpen(false);
      }
      if (userMenuRef?.current && !userMenuRef?.current?.contains(event?.target)) {
        setIsUserMenuOpen(false);
      }
      if (systemStatusRef?.current && !systemStatusRef?.current?.contains(event?.target)) {
        setIsSystemStatusOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleWorkspaceSelect = (workspace) => {
    navigate(workspace?.path);
    setIsWorkspaceOpen(false);
  };

  const handleMUDOCreation = () => {
    navigate('/m-udo-creation-wizard');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': case'healthy': case'optimal':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[60px] bg-card border-b border-border z-[1000]">
      <div className="flex items-center justify-between h-full px-4">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Atom" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">ANTARES</span>
          </div>
        </div>

        {/* Center Navigation */}
        <div className="flex items-center space-x-6">
          {/* Workspace Selector */}
          <div className="relative" ref={workspaceRef}>
            <button
              onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-200"
            >
              <Icon name={currentWorkspace?.icon} size={18} />
              <span className="font-medium text-foreground">{currentWorkspace?.name}</span>
              <Icon name="ChevronDown" size={16} className={`transition-transform duration-200 ${isWorkspaceOpen ? 'rotate-180' : ''}`} />
            </button>

            {isWorkspaceOpen && (
              <div className="absolute top-full left-0 mt-1 w-80 bg-popover border border-border rounded-lg shadow-elevation-2 animate-slide-down">
                <div className="p-2">
                  {workspaces?.map((workspace) => (
                    <button
                      key={workspace?.id}
                      onClick={() => handleWorkspaceSelect(workspace)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors duration-200 ${
                        workspace?.path === location?.pathname ? 'bg-accent/10 border border-accent/20' : ''
                      }`}
                    >
                      <Icon name={workspace?.icon} size={20} />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-foreground">{workspace?.name}</div>
                        <div className="text-sm text-muted-foreground">{workspace?.description}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {workspace?.activeProjects} projects
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* M-UDO Creation Button */}
          <Button
            variant="default"
            onClick={handleMUDOCreation}
            iconName="Plus"
            iconPosition="left"
            className="bg-primary hover:bg-primary/90"
          >
            Create M-UDO
          </Button>

          {/* System Status Indicator */}
          <div className="relative" ref={systemStatusRef}>
            <button
              onClick={() => setIsSystemStatusOpen(!isSystemStatusOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-200"
            >
              <div className={`w-2 h-2 rounded-full ${getStatusColor(systemStatus?.resources?.status)} bg-current`} />
              <Icon name="Activity" size={18} />
            </button>

            {isSystemStatusOpen && (
              <div className="absolute top-full right-0 mt-1 w-72 bg-popover border border-border rounded-lg shadow-elevation-2 animate-slide-down">
                <div className="p-4">
                  <h3 className="font-medium text-foreground mb-3">System Status</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon name="Play" size={16} />
                        <span className="text-sm text-foreground">Simulations</span>
                      </div>
                      <div className="text-sm">
                        <span className={getStatusColor(systemStatus?.simulations?.status)}>
                          {systemStatus?.simulations?.active}/{systemStatus?.simulations?.total}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon name="Wifi" size={16} />
                        <span className="text-sm text-foreground">Sensors</span>
                      </div>
                      <div className="text-sm">
                        <span className={getStatusColor(systemStatus?.sensors?.status)}>
                          {systemStatus?.sensors?.connected}/{systemStatus?.sensors?.total}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Resources</span>
                        <span className={`text-sm ${getStatusColor(systemStatus?.resources?.status)}`}>
                          {systemStatus?.resources?.status}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>CPU</span>
                          <span>{systemStatus?.resources?.cpu}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1">
                          <div 
                            className="bg-accent h-1 rounded-full transition-all duration-200" 
                            style={{ width: `${systemStatus?.resources?.cpu}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <Icon name="ChevronDown" size={16} className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-popover border border-border rounded-lg shadow-elevation-2 animate-slide-down">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-border">
                    <div className="font-medium text-foreground">Dr. Maria Rodriguez</div>
                    <div className="text-sm text-muted-foreground">Senior Researcher</div>
                  </div>
                  
                  <div className="py-2">
                    <button className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-200">
                      <Icon name="Settings" size={16} />
                      <span className="text-sm text-foreground">Workspace Settings</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-200">
                      <Icon name="Users" size={16} />
                      <span className="text-sm text-foreground">Collaboration</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-200">
                      <Icon name="HelpCircle" size={16} />
                      <span className="text-sm text-foreground">Help & Support</span>
                    </button>
                    <div className="border-t border-border my-2" />
                    <button className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-200 text-error">
                      <Icon name="LogOut" size={16} />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;