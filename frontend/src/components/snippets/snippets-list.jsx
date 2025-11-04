import {useEffect} from "react";
import {useSnippetsStore} from "@/store/snippets.js";
import SnippetItem from "@/components/snippets/snippet-item.jsx";
import LoadingSpinner from "@/components/loading-spinner.jsx";
import {Fade} from "@/components/animations/fade.jsx";

export default function SnippetsList({ className }) {
  const clearState = useSnippetsStore(state => state.clearState);
  const listLoading = useSnippetsStore(state => state.listLoading);
  const snippets = useSnippetsStore(state => state.snippets);
  const loadSnippets = useSnippetsStore(state => state.loadSnippets);

  useEffect(() => {
    clearState();
    loadSnippets();
  }, []);

  if (listLoading) {
    return (
      <Fade show={true} duration={0.7}>
        <div className="w-100 p-16 flex items-center justify-center">
          <LoadingSpinner/>
        </div>
      </Fade>
    )
  }

  return (
    <div className={className}>
      {snippets.map(snippet => <SnippetItem key={snippet.id} snippet={snippet}/>)}
    </div>
  )
}