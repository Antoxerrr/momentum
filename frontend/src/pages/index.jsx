import DefaultLayout from "@/layouts/default";
import {Tabs, Tab} from "@heroui/tabs";
import {TasksList} from "../components/tasks/tasks-list.jsx";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <TasksList/>
    </DefaultLayout>
  );
}
