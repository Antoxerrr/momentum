import BaseLayout from './base.jsx';

import { Navbar } from '@/components/navbar/navbar.jsx';

export default function AuthLayout({ children }) {
  return (
    <BaseLayout>
      <Navbar />
      <main className="container px-6 mx-auto flex flex-grow justify-center items-center">
        {children}
      </main>
    </BaseLayout>
  );
}
