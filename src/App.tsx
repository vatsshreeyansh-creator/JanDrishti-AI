import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { GovLayout } from './layouts/GovLayout';
import { CitizenLayout } from './layouts/CitizenLayout';

import Landing from './pages/Landing';

import GovOverview from './pages/gov/GovOverview';
import GovMap from './pages/gov/GovMap';
import GovHotspots from './pages/gov/GovHotspots';
import GovRecommendations from './pages/gov/GovRecommendations';
import GovBudget from './pages/gov/GovBudget';
import GovImpact from './pages/gov/GovImpact';
import GovRisks from './pages/gov/GovRisks';

import CitizenHome from './pages/citizen/CitizenHome';
import CitizenReport from './pages/citizen/ReportIssue';
import MyReports from './pages/citizen/MyReports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />

        {/* Government Routes */}
        <Route path="/gov" element={<GovLayout><GovOverview /></GovLayout>} />
        <Route path="/gov/map" element={<GovLayout><GovMap /></GovLayout>} />
        <Route path="/gov/hotspots" element={<GovLayout><GovHotspots /></GovLayout>} />
        <Route path="/gov/recommendations" element={<GovLayout><GovRecommendations /></GovLayout>} />
        <Route path="/gov/budget" element={<GovLayout><GovBudget /></GovLayout>} />
        <Route path="/gov/impact" element={<GovLayout><GovImpact /></GovLayout>} />
        <Route path="/gov/risks" element={<GovLayout><GovRisks /></GovLayout>} />

        {/* Citizen Routes */}
        <Route path="/citizen" element={<CitizenLayout><CitizenHome /></CitizenLayout>} />
        <Route path="/citizen/report" element={<CitizenLayout><CitizenReport /></CitizenLayout>} />
        <Route path="/citizen/my-reports" element={<CitizenLayout><MyReports /></CitizenLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
