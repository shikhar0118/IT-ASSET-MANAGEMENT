import { useState } from 'react';
import { api } from './api';
import { Sidebar } from './components/Sidebar';
import { LoginModal } from './components/LoginModal';
import { DashboardView } from './components/DashboardView';
import { AssetRegisterView } from './components/AssetRegisterView';
import { RepairsView } from './components/RepairsView';
import { TicketsView } from './components/TicketsView';
import { GenericModuleView } from './components/GenericModuleView';

export function App() {
  const [user, setUser] = useState<{ email: string; name: string; role: 'IT Admin' | 'IT Technician' | 'Viewer' } | null>(() => {
    return api.getCurrentUser();
  });
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    api.logout();
    setUser(null);
  };

  if (!user) {
    return <LoginModal onSuccess={setUser} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'assets' && <AssetRegisterView userRole={user.role} />}
          {activeTab === 'repairs' && <RepairsView userRole={user.role} />}
          {activeTab === 'tickets' && <TicketsView userRole={user.role} />}
          {['departments', 'expenses', 'cartridges', 'users', 'audit'].includes(activeTab) && (
            <GenericModuleView moduleName={activeTab} userRole={user.role} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
