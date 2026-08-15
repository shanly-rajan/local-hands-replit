import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BottomNav } from './BottomNav';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 sm:pb-0">
        {children}
      </main>
      <Footer className="hidden sm:block" />
      <BottomNav />
    </div>
  );
}
