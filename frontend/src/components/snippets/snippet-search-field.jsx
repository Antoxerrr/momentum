import { Input } from '@heroui/react';

import { useSnippetsStore } from '@/store/snippets.js';

export default function SnippetSearchField() {
  const queryString = useSnippetsStore((state) => state.queryString);
  const setQueryString = useSnippetsStore((state) => state.setQueryString);

  return (
    <Input
      isClearable
      label="Поиск"
      labelPlacement="inside"
      name="search"
      size="sm"
      type="text"
      value={queryString}
      onValueChange={setQueryString}
    />
  );
}
