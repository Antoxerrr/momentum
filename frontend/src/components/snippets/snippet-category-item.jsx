import { Button } from '@heroui/react';

import { useSnippetsStore } from '@/store/snippets.js';

export default function SnippetCategoryItem({ snippetCategory }) {
  const switchCategory = useSnippetsStore((state) => state.switchCategory);
  const categoryActive = useSnippetsStore((state) =>
    state.selectedCategories.includes(snippetCategory.id),
  );

  return (
    <Button
      color={categoryActive ? 'primary' : 'default'}
      size="sm"
      onPress={() => switchCategory(snippetCategory.id)}
    >
      {snippetCategory.name}
    </Button>
  );
}
