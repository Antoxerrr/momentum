import DefaultLayout from "@/layouts/default.jsx";
import {Fade} from "@/components/animations/fade.jsx";
import {GoPlus} from "react-icons/go";
import {useEffect, useState} from "react";
import {Button} from "@heroui/react";
import {SlideDown} from "@/components/animations/slide-down.jsx";
import SnippetForm from "@/components/snippets/snippet-form.jsx";
import SnippetCategoryList from "@/components/snippets/snippet-category-list.jsx";
import SnippetSearchField from "@/components/snippets/snippet-search-field.jsx";
import SnippetsList from "@/components/snippets/snippets-list.jsx";
import {setDocumentTitle} from "@/core/utils.js";

export default function SnippetsListPage() {
  useEffect(() => {
    setDocumentTitle("Сниппеты");
  }, []);

  const [creating, setCreating] = useState(false);

  const closeForm = () => setCreating(false);

  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center">
        <div className="md:w-3/4 w-full">
          <Fade show={true} duration={0.5}>
            <div className="flex flex-row gap-3 items-center justify-center">
              <SnippetSearchField/>
              <Button isIconOnly color={creating ? "danger" : "primary"} onPress={() => setCreating(!creating)}>
                <GoPlus className={`text-3xl transition-transform duration-300 ${creating && 'rotate-[-45deg]'}`}/>
              </Button>
            </div>

            <SlideDown show={creating}>
              <SnippetForm closeForm={closeForm}/>
            </SlideDown>

            <SnippetCategoryList className="mt-6 flex flex-wrap gap-3"/>

            <SnippetsList className="flex flex-col gap-7 mt-6"/>
          </Fade>
        </div>
      </div>
    </DefaultLayout>
  )
}