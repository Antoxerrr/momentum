import {
  addToast,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Input,
  useDisclosure
} from "@heroui/react";
import { FaEdit } from "react-icons/fa";
import {useSnippetsStore} from "@/store/snippets.js";
import {useShallow} from "zustand/react/shallow";
import {useState} from "react";
import {BiCheck} from "react-icons/bi";
import {getAPI} from "@/core/api.js";
import {FaPlus} from "react-icons/fa6";
import {MdDelete} from "react-icons/md";


export function SnippetCategoryEditDrawer() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [isCreating, setIsCreating] = useState(false);
  const { categories } = useSnippetsStore(
    useShallow((state) => ({
      categories: state.categories,
    })),
  );

  return (
    <>
      <Button onPress={onOpen} className="cursor-pointer" color="primary" size="sm" isIconOnly>
        <FaEdit/>
      </Button>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} isKeyboardDismissDisabled>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">Редактирование категорий</DrawerHeader>
              <DrawerBody>
                {categories.map(c => <CategoryInplaceEditor category={c} key={c.id}/>)}
                <CategoryInplaceEditor/>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Закрыть
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}


function CategoryInplaceEditor({ category=null }) {
  const {  loadCategories } = useSnippetsStore(
    useShallow((state) => ({
      loadCategories: state.loadCategories,
    })),
  );

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(category?.name || '');

  if (!category && !isEditing) {
    return (
      <Button color="primary" size="sm" onPress={() => { setIsEditing(true) }}>
        <FaPlus/>
      </Button>
    );
  }

  const saveCategory = async () => {
    setIsEditing(false);
    if (category && category?.name === value) {
      return;
    }

    const data = { name: value }

    if (category) {
      await getAPI().snippetsCategories.update(category.id, data)
    } else if (value) {
      await getAPI().snippetsCategories.create(data)
    }

    await loadCategories();
  };

  const deleteCategory = async () => {
    let success = true;
    try {
      await getAPI().snippetsCategories.delete(category.id);
    } catch (e) {
      success = false;
      const message = e.response?.data?.detail || 'Ошибка сервера';
      addToast({
        title: 'Категория не удалена',
        description: message,
        color: 'danger',
      });
    }

    if (success) {
      addToast({
        title: 'Категория удалена',
        color: 'success',
      });
      await loadCategories();
    }
  };

  return (
    <>
      {(isEditing || !category ?
        <div className="w-full flex gap-3">
          <Input value={value} onValueChange={setValue} variant="underlined" size="sm" classNames={{
            input: ["text-medium", "ps-0"],
            innerWrapper: ["pb-0"],
            inputWrapper: ["border-none", "shadow-none"]
          }}/>
          <Button isIconOnly color="success" size="sm" onPress={saveCategory}>
            <BiCheck size={24}/>
          </Button>
        </div> :
        <div className="flex justify-between items-center">
          <p className="mt-2 h-8 cursor-pointer" onClick={() => setIsEditing(true)}>{value}</p>
          <MdDelete className="cursor-pointer hover:text-danger" onClick={deleteCategory}/>
        </div>
      )}
    </>
  )
}
