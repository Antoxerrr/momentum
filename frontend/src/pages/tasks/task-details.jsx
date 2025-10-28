import DefaultLayout from "@/layouts/default.jsx";
import {Fade} from "@/components/animations/fade.jsx";
import TaskDetailsContainer from "@/components/tasks/details/task-details-container.jsx";


export default function TaskDetailsPage() {
  return (
    <DefaultLayout>
      <div className="w-full flex flex-col items-center">
        <div className="md:w-2/3 w-full">
          <Fade show={true} duration={0.5}>
            <TaskDetailsContainer/>
          </Fade>
        </div>
      </div>
    </DefaultLayout>
  );
}
