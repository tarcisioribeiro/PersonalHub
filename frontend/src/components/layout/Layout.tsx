import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Skip link para acessibilidade - permite pular navegacao */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Pular para o conteudo principal
      </a>

      {/* Sidebar: fixa em desktop, overlay em mobile */}
      <Sidebar />

      {/* Main content: ocupa espaço restante */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main id="main-content" className="flex-1 p-4 lg:p-6" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
