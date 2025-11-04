import {useEffect} from "react";
import {useSnippetsStore} from "@/store/snippets.js";
import SnippetItem from "@/components/snippets/snippet-item.jsx";

export default function SnippetsList({ className }) {
  const snippets = useSnippetsStore(state => state.snippets);
  const loadSnippets = useSnippetsStore(state => state.loadSnippets);

  useEffect(() => {
    loadSnippets();
  }, []);

  return (
    <div className={className}>
      {snippets.map(snippet => <SnippetItem key={snippet.id} snippet={snippet}/>)}
    </div>
  )
}