import { Outlet } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink font-sans selection:bg-brand selection:text-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
