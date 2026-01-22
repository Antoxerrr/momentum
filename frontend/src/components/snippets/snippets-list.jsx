import { useEffect } from 'react';

import { useSnippetsStore } from '@/store/snippets.js';
import SnippetItem from '@/components/snippets/snippet-item.jsx';
import LoadingSpinner from '@/components/loading-spinner.jsx';
import { Fade } from '@/components/animations/fade.jsx';

export default function SnippetsList({ className }) {
  const clearState = useSnippetsStore((state) => state.clearState);
  const listLoading = useSnippetsStore((state) => state.listLoading);
  const snippets = useSnippetsStore((state) => state.snippets);
  const loadSnippets = useSnippetsStore((state) => state.loadSnippets);

  useEffect(() => {
    clearState();
    loadSnippets();
  }, []);

  if (listLoading) {
    return (
      <Fade duration={0.7} show={true}>
        <div className="w-full px-3 md:px-0 md:p-16 mt-7 md:mt-0 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </Fade>
    );
  }

  return (
    <div className={className}>
      {snippets.map((snippet) => (
        <SnippetItem key={snippet.id} snippet={snippet} />
      ))}
    </div>
  );
}
