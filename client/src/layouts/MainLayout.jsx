import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Chatbot from '../components/ui/Chatbot';
import { PageTransition } from '../components/ui/Motion';
import ErrorBoundary from '../components/ui/ErrorBoundary';

const MainLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {/* Add top padding on non-home pages so fixed navbar doesn't hide content */}
      <main className={`flex-1 ${isHome ? '' : 'pt-16 lg:pt-20'}`}>
        <ErrorBoundary>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </ErrorBoundary>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default MainLayout;
