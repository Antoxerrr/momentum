import BaseLayout from './base.jsx';

import { Navbar } from '@/components/navbar/navbar.jsx';
import MobileMenu from '@/components/navbar/mobile-menu.jsx';

export default function DefaultLayout({ children }) {
  return (
    <BaseLayout>
      <Navbar withNav={true} />
      <main
        className="container mx-auto max-w-7xl px-0 md:px-6 flex flex-col flex-grow pt-4 md:pt-12 pb-6"
        style={{
          paddingBottom:
            'calc(var(--bottom-bar-height) + var(--bottom-bar-gap) + env(safe-area-inset-bottom))',
        }}
      >
        {children}
      </main>
      <MobileMenu />
    </BaseLayout>
  );
}
