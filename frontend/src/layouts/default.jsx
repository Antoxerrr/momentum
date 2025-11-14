import BaseLayout from './base.jsx';

import { Navbar } from '@/components/navbar/navbar.jsx';

export default function DefaultLayout({ children }) {
  return (
    <BaseLayout>
      <Navbar withNav={true} />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-4 md:pt-12 pb-6">
        {children}
      </main>
    </BaseLayout>
  );
}
