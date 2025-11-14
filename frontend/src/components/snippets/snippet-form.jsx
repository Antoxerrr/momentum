import { Form } from '@heroui/react';
import { Textarea } from '@heroui/react';
import { Controller, useForm } from 'react-hook-form';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { useEffect, useState } from 'react';
import { Select, SelectItem } from '@heroui/react';
import { Button } from '@heroui/react';
import { addToast } from '@heroui/react';
import { useShallow } from 'zustand/react/shallow';

import { getAPI } from '@/core/api.js';
import { useSnippetsStore } from '@/store/snippets.js';
import { formatMarkdown, highlightMarkdown } from '@/core/markdown.js';

export default function SnippetForm({ closeForm, snippet = null }) {
  const { loadCategories, loadSnippets, categories } = useSnippetsStore(
    useShallow((state) => ({
      loadCategories: state.loadCategories,
      loadSnippets: state.loadSnippets,
      categories: state.categories,
    })),
  );
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(snippet);

  useEffect(() => {
    loadCategories();
  }, []);

  const marked = new Marked(
    markedHighlight({
      emptyLangClass: 'hljs',
      langPrefix: 'hljs language-',
      highlight: highlightMarkdown,
    }),
  );

  const { handleSubmit, control, watch } = useForm({
    defaultValues: {
      text: snippet?.text || '',
      category: snippet?.category?.id.toString(),
    },
  });
  const textValue = watch('text');

  const onSubmit = async (data) => {
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
        title: isEditing
          ? 'Ошибка при редактировании сниппета'
          : 'Ошибка при создании сниппета',
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
          render={({
            field: { name, value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <Textarea
              ref={ref}
              disableAutosize
              classNames={{
                base: 'w-1/2',
                input: '!h-full p-2',
                inputWrapper: '!h-full rounded-r-none',
              }}
              errorMessage={error?.message}
              isInvalid={invalid}
              name={name}
              validationBehavior="aria"
              value={value}
              onBlur={onBlur}
              onChange={onChange}
            />
          )}
        />
        <div
          dangerouslySetInnerHTML={{
            __html: marked.parse(formatMarkdown(textValue)),
          }}
          className="markdown-content w-1/2 bg-content1 h-full rounded-r-medium border-l-1 border-l-default-200 p-4 overflow-auto text-sm"
        />
      </div>

      <div className="flex flex-row items-center justify-between w-full">
        <Controller
          control={control}
          name="category"
          render={({
            field: { name, value, onChange, onBlur, ref },
            fieldState: { invalid, error },
          }) => (
            <Select
              ref={ref}
              isRequired
              className="w-1/2"
              errorMessage={error?.message}
              isInvalid={invalid}
              items={categories}
              label="Категория"
              name={name}
              placeholder="Выберите категорию"
              selectedKeys={value}
              size="sm"
              validationBehavior="aria"
              value={value}
              onBlur={onBlur}
              onChange={onChange}
            >
              {(category) => (
                <SelectItem key={category.id}>{category.name}</SelectItem>
              )}
            </Select>
          )}
        />

        <div className="flex flex-row items-center justify-center gap-3">
          <Button className="px-8" color="danger" onPress={closeForm}>
            Отмена
          </Button>
          <Button
            className="px-8"
            color="primary"
            isLoading={loading}
            type="submit"
          >
            {isEditing ? 'Изменить' : 'Создать'}
          </Button>
        </div>
      </div>
    </Form>
  );
}
