import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar: fixa em desktop, overlay em mobile */}
      <Sidebar />

      {/* Main content: ocupa espaço restante */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
