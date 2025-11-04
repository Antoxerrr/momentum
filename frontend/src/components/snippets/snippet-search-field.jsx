import {Input} from "@heroui/input";
import {useSnippetsStore} from "@/store/snippets.js";

export default function SnippetSearchField() {
  const queryString = useSnippetsStore(state => state.queryString);
  const setQueryString = useSnippetsStore(state => state.setQueryString);

  return (
    <Input
      label="Поиск"
      labelPlacement="inside"
      name="search"
      type="text"
      size="sm"
      isClearable
      value={queryString}
      onValueChange={setQueryString}
    />
  )
}