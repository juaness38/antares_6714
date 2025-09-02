import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import MUDOCreationWizard from './pages/m-udo-creation-wizard';
import MICAMDWorkspace from './pages/mica-md-workspace';
import AntaresDashboard from './pages/antares-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AntaresDashboard />} />
        <Route path="/m-udo-creation-wizard" element={<MUDOCreationWizard />} />
        <Route path="/mica-md-workspace" element={<MICAMDWorkspace />} />
        <Route path="/antares-dashboard" element={<AntaresDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
