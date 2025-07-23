import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Submissions from './pages/Submissions';
import Downloads from './pages/Downloads';
import EventInfo from './pages/EventInfo';
import SubmissionsAndForms from './pages/SubmissionsAndForms';
import TestSupabase from './pages/TestSupabase';
import SupabaseTest from './pages/SupabaseTest';
import SupabaseDebug from './pages/SupabaseDebug';
import SupabaseDirectTest from './pages/SupabaseDirectTest';
import SupabaseRLSFix from './pages/SupabaseRLSFix';
import SupabaseSimpleRLSFix from './pages/SupabaseSimpleRLSFix';
import SupabaseTableFix from './pages/SupabaseTableFix';
import FAQ from './pages/FAQ';
import Admin from './pages/Admin';
import SecretRoom from './pages/SecretRoom';
import SecretRoomProtection from './components/SecretRoomProtection';
import AdminProtection from './components/AdminProtection';
import Forms from './pages/Forms';
import DataMigration from './pages/DataMigration';
import PasswordProtection from './components/PasswordProtection';
import SessionForm from './pages/forms/SessionForm';
import CompanyForm from './pages/forms/CompanyForm';
import PresentationEnvForm from './pages/forms/PresentationEnvForm';
import BoothForm from './pages/forms/BoothForm';
import SponsorForm from './pages/forms/SponsorForm';
import LogisticsForm from './pages/forms/LogisticsForm';
import PressForm from './pages/forms/PressForm';
import ReceptionForm from './pages/forms/ReceptionForm';
import SecretRoomChatWidget from './components/SecretRoomChatWidget';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <PasswordProtection>
      <Router>
        <ScrollToTop />
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/event-info" element={<EventInfo />} />
              <Route path="/submissions" element={<Submissions />} />
              <Route path="/downloads" element={<Downloads />} />
              <Route path="/test-supabase" element={<TestSupabase />} />
              <Route path="/supabase-test" element={<SupabaseTest />} />
              <Route path="/supabase-debug" element={<SupabaseDebug />} />
              <Route path="/supabase-direct-test" element={<SupabaseDirectTest />} />
              <Route path="/supabase-rls-fix" element={<SupabaseRLSFix />} />
              <Route path="/supabase-simple-rls-fix" element={<SupabaseSimpleRLSFix />} />
              <Route path="/supabase-table-fix" element={<SupabaseTableFix />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/admin" element={<AdminProtection><Admin /></AdminProtection>} />
              <Route path="/admin/secret-room" element={<AdminProtection><SecretRoomProtection><SecretRoomWithChat /></SecretRoomProtection></AdminProtection>} />
              <Route path="/forms" element={<Forms />} />
              <Route path="/submissions-and-forms" element={<SubmissionsAndForms />} />
              <Route path="/data-migration" element={<DataMigration />} />
              <Route path="/forms/session" element={<SessionForm />} />
              <Route path="/forms/company" element={<CompanyForm />} />
              <Route path="/forms/presentation-env" element={<PresentationEnvForm />} />
              <Route path="/forms/booth" element={<BoothForm />} />
              <Route path="/forms/sponsor" element={<SponsorForm />} />
              <Route path="/forms/logistics" element={<LogisticsForm />} />
              <Route path="/forms/press" element={<PressForm />} />
              <Route path="/forms/reception" element={<ReceptionForm />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </PasswordProtection>
  );
}

// 秘密の部屋用のチャットボットを含むコンポーネント
const SecretRoomWithChat = () => {
  return (
    <>
      <SecretRoom />
      <SecretRoomChatWidget />
    </>
  );
};

export default App;
