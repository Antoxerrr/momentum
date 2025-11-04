import {Form} from "@heroui/form";
import {Textarea} from "@heroui/input";
import {Controller, useForm} from "react-hook-form";
import {Marked} from "marked";
import {markedHighlight} from "marked-highlight";
import {formatMarkdown, highlightMarkdown} from "@/core/markdown.js";
import {useSnippetsStore} from "@/store/snippets.js";
import {useEffect, useState} from "react";
import {Select, SelectItem} from "@heroui/select";
import {Button} from "@heroui/button";
import {getAPI} from "@/core/api.js";
import {addToast} from "@heroui/toast";
import {useShallow} from "zustand/react/shallow";

export default function SnippetForm({ closeForm, snippet = null }) {
  const { loadCategories, loadSnippets, categories } = useSnippetsStore(
    useShallow(
      state => ({
        loadCategories: state.loadCategories,
        loadSnippets: state.loadSnippets,
        categories: state.categories
      })
    )
  )
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(snippet);

  useEffect(() => {
    loadCategories();
  }, []);

  const marked = new Marked(
    markedHighlight({
      emptyLangClass: 'hljs',
      langPrefix: 'hljs language-',
      highlight: highlightMarkdown
    }),
  );

  const {handleSubmit, control, reset, watch} = useForm({
    defaultValues: {
      text: snippet?.text || '',
      category: snippet?.category?.id.toString()
    }
  });
  const textValue = watch("text");

  const onSubmit = async data => {
    if (!data.text || !data.category) {
      return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        await getAPI().snippets.update(snippet.id, data);
      } else {
        await getAPI().snippets.create(data);
      }

      addToast({
        title: isEditing ? 'Сниппет изменён' : 'Сниппет создан',
        color: 'success',
      });
      closeForm();
      await loadSnippets();
    } catch (error) {
      addToast({
        title: isEditing ? 'Ошибка при редактировании сниппета' : 'Ошибка при создании сниппета',
        color: 'danger',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form className="w-full items-center" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-row w-full h-64 mt-5">
        <Controller
          control={control}
          name="text"
          render={({field: {name, value, onChange, onBlur, ref}, fieldState: {invalid, error}}) => (
            <Textarea
              ref={ref}
              errorMessage={error?.message}
              validationBehavior="aria"
              isInvalid={invalid}
              name={name}
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              disableAutosize
              classNames={{
                base: "w-1/2",
                input: "!h-full p-2",
                inputWrapper: "!h-full rounded-r-none",
              }}
            />
          )}
        />
        <div
          className="markdown-content w-1/2 bg-content1 h-full rounded-r-medium border-l-1 border-l-default-200 p-4 overflow-auto text-sm"
          dangerouslySetInnerHTML={{ __html: marked.parse(formatMarkdown(textValue)) }}
        />
      </div>

      <div className="flex flex-row items-center justify-between w-full">
        <Controller
          control={control}
          name="category"
          render={({field: {name, value, onChange, onBlur, ref}, fieldState: {invalid, error}}) => (
            <Select
              ref={ref}
              errorMessage={error?.message}
              validationBehavior="aria"
              isInvalid={invalid}
              name={name}
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              selectedKeys={value}
              className="w-1/2"
              size="sm"
              items={categories}
              label="Категория"
              placeholder="Выберите категорию"
              isRequired
            >
              {(category) => <SelectItem key={category.id}>{category.name}</SelectItem>}
            </Select>
          )}
        />

        <div className="flex flex-row items-center justify-center gap-3">
          <Button className="px-8" color="danger" onPress={closeForm}>Отмена</Button>
          <Button className="px-8" color="primary" type="submit" isLoading={loading}>{isEditing ? 'Изменить' : 'Создать'}</Button>
        </div>
      </div>
    </Form>
  )
}