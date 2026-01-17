import { useEffect } from 'react';

import DefaultLayout from '@/layouts/default.jsx';
import { setDocumentTitle } from '@/core/utils.js';

export default function FinancePage() {
  useEffect(() => {
    setDocumentTitle('Финансы');
  }, []);

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6">Финансы</h1>
        <p className="text-default-500">В разработке</p>
      </div>
    </DefaultLayout>
  );
}
