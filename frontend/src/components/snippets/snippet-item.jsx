import {Card, CardBody} from "@heroui/card";
import {Divider} from "@heroui/divider";
import 'highlight.js/styles/github.css';
import {Marked} from "marked";
import {markedHighlight} from "marked-highlight";
import {MdEdit} from "react-icons/md";
import {FaCheck, FaTrash} from "react-icons/fa";
import {IoCopyOutline} from "react-icons/io5";
import {useState} from "react";
import {formatMarkdown, highlightMarkdown} from "@/core/markdown.js";
import {Button} from "@heroui/button";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@heroui/modal";
import {getAPI} from "@/core/api.js";
import {addToast} from "@heroui/toast";
import {useSnippetsStore} from "@/store/snippets.js";
import SnippetForm from "@/components/snippets/snippet-form.jsx";

export default function SnippetItem({snippet}) {
  const marked = new Marked(
    markedHighlight({
      emptyLangClass: 'hljs',
      langPrefix: 'hljs language-',
      highlight: highlightMarkdown
    }),
  );

  const [copied, setCopied] = useState(false);
  
  const copySnippet = () => {
    const clipboardData =
        event.clipboardData ||
        window.clipboardData ||
        event.originalEvent?.clipboardData ||
        navigator.clipboard;
      clipboardData.writeText(snippet.text);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const { isOpen: deleteModalIsOpen, onOpen: deleteModalOnOpen, onOpenChange: deleteModalOnOpenChange } = useDisclosure();

  const [editing, setEditing] = useState(false);
  const closeEditForm = () => setEditing(false);

  if (editing) {
    return (
      <div className="w-full">
        <SnippetForm closeForm={closeEditForm} snippet={snippet}/>
      </div>
    )
  }

  return (
    <div className="w-full">
      <DeleteSnippetModal snippetId={snippet.id} isOpen={deleteModalIsOpen} onOpenChange={deleteModalOnOpenChange}/>
      <Card shadow="none" className="w-full p-2 snippet-card">
        <CardBody>
          <div className="flex justify-between items-center">
            <div className="text-[0.8rem] text-default-500">{snippet.category.name}</div>
            <div className="snippet-controls text-default-400">
              <FaTrash className="cursor-pointer hover:text-danger-400 duration-250" onClick={deleteModalOnOpen}/>
              <MdEdit className="cursor-pointer hover:text-primary-500 text-xl me-[-3px] duration-250" onClick={() => setEditing(true)}/>
              {copied ? (
                <FaCheck className="text-success-300"/>
              ) : (
                <IoCopyOutline className="cursor-pointer hover:text-primary-500 text-lg duration-250" onClick={copySnippet}/>
              )}
            </div>
          </div>
          <Divider className="my-3"/>
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: marked.parse(formatMarkdown(snippet.text)) }}
          />
        </CardBody>
      </Card>
    </div>
  )
}


function DeleteSnippetModal({ snippetId, isOpen, onOpenChange }) {
  const loadSnippets = useSnippetsStore(state => state.loadSnippets);
  const [loading, setLoading] = useState(false);

  const deleteSnippet = async (onClose) => {
    setLoading(true);

    try {
      await getAPI().snippets.delete(snippetId);
      onClose();
      await loadSnippets();
      addToast({
        title: 'Сниппет удалён',
        color: 'success',
      });
    } catch (error) {
      addToast({
        title: 'Ошибка при удалении сниппета',
        color: 'danger',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} disableAnimation>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Удалить сниппет</ModalHeader>
            <ModalBody>
              Вы точно хотите удалить сниппет?
            </ModalBody>
            <ModalFooter>
              <Button color="default" onPress={onClose}>
                Отмена
              </Button>
              <Button color="danger" onPress={() => deleteSnippet(onClose)} isLoading={loading}>
                Удалить
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
