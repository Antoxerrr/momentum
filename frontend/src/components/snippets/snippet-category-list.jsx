import { useShallow } from 'zustand/react/shallow';
import { useEffect } from 'react';

import SnippetCategoryItem from '@/components/snippets/snippet-category-item.jsx';
import { useSnippetsStore } from '@/store/snippets.js';
import { SnippetCategoryEditDrawer } from './snippet-category-edit-drawer';
import {BiX} from "react-icons/bi";

export default function SnippetCategoryList() {
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
    <div className="mt-6 flex flex-wrap gap-3">
      <SnippetCategoryEditDrawer/>
        {categories.map((category) => (
          <SnippetCategoryItem key={category.id} snippetCategory={category} />
        ))}
      <ClearCategoriesButton/>
    </div>
  );
}


function ClearCategoriesButton() {
  const isCategoriesSelected = useSnippetsStore((state) =>
    state.selectedCategories.length > 0,
  );
  const clearSelectedCategories = useSnippetsStore((state) => state.clearSelectedCategories);

  if (!isCategoriesSelected) {
    return <div></div>
  }

  return (
    <div className="flex justify-center items-center w-[25px] ml-[-5px]">
      <BiX className="w-full h-full cursor-pointer" onClick={clearSelectedCategories}/>
    </div>
  )
}