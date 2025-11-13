import {Button} from "@heroui/react";
import {useSnippetsStore} from "@/store/snippets.js";

export default function SnippetCategoryItem({ snippetCategory }) {
  const switchCategory = useSnippetsStore(state => state.switchCategory);
  const categoryActive = useSnippetsStore(
    state => state.selectedCategories.includes(snippetCategory.id)
  );

  return (
    <Button size="sm" onPress={() => switchCategory(snippetCategory.id)} color={categoryActive ? "primary" : "default"}>
      {snippetCategory.name}
    </Button>
  )
}
