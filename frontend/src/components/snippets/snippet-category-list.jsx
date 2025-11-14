import { useShallow } from 'zustand/react/shallow';
import { useEffect } from 'react';

import SnippetCategoryItem from '@/components/snippets/snippet-category-item.jsx';
import { useSnippetsStore } from '@/store/snippets.js';

export default function SnippetCategoryList({ className }) {
  const { categories, loadCategories } = useSnippetsStore(
    useShallow((state) => ({
      categories: state.categories,
      loadCategories: state.loadCategories,
    })),
  );

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className={className}>
      {categories.map((category) => (
        <SnippetCategoryItem key={category.id} snippetCategory={category} />
      ))}
    </div>
  );
}
