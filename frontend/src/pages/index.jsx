import DefaultLayout from "@/layouts/default";
import {TasksList} from "../components/tasks/tasks-list.jsx";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <TasksList/>
    </DefaultLayout>
  );
}
