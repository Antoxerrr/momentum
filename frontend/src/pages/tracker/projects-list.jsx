import DefaultLayout from "@/layouts/default.jsx";
import {useEffect} from "react";
import {setDocumentTitle} from "@/core/utils.js";

export default function TrackerProjectsListPage() {
  useEffect(() => {
    setDocumentTitle("Проекты");
  }, []);

  return (
    <DefaultLayout>
      123
    </DefaultLayout>
  )
}
