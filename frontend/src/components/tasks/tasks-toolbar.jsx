import { useState } from "react";
import { GoPlus } from "react-icons/go";
import { LuRefreshCw } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { TaskForm } from "./task-form";
import { Tab, Tabs } from "@heroui/tabs";
import { FaArchive } from "react-icons/fa";
import { TbClockPlay } from "react-icons/tb";
import { MdDownloading } from "react-icons/md";
import { useDispatch } from "react-redux";
import { loadTasks } from "@/store/tasks";

const tabs = {
  CURRENT: 'current',
  UPCOMING: 'upcoming',
  ARCHIVED: 'archived'
};

const tabsToFilters = {
  [tabs.CURRENT]: {
    current: true
  },
  [tabs.UPCOMING]: {
    current: false
  },
  [tabs.ARCHIVED]: {
    archived: true
  }
};


export function TasksToolbar() {
  const [formActive, setFormActive] = useState(false);
  const [selectedTab, setSelectedTab] = useState(tabs.CURRENT);
  const dispatch = useDispatch();

  const onTaskCreated = (payload) => {
    setFormActive(false);
    let targetTab = tabs.CURRENT;
    
    if (payload.period) {
      targetTab = tabs.CURRENT;
    } else if (payload.date) {
      const taskDate = new Date(payload.date);
      const today = new Date();
      
      today.setHours(0, 0, 0, 0);
      taskDate.setHours(0, 0, 0, 0);
      
      if (taskDate > today) {
        targetTab = tabs.UPCOMING;
      }
    }
    setSelectedTab(targetTab);
    dispatch(loadTasks(tabsToFilters[targetTab]));
  };

  return (
    <div>
      <ToolbarControls 
        formActive={formActive}
        setFormActive={setFormActive}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <TaskForm formActive={formActive} onTaskCreated={onTaskCreated}/>
    </div>
  )
}

function ToolbarControls({formActive, setFormActive, selectedTab, setSelectedTab}) {
  const showForm = () => setFormActive(true);
  const hideForm = () => setFormActive(false);

  return (
    <div className="flex justify-between my-5 h-[30px] items-center">
      <div>
        <TaskTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>
      </div>

      <div className="flex flex-row-reverse items-center gap-2 select-none">
        <LuRefreshCw className={`text-xl cursor-pointer hover:text-primary-500 transition-colors duration-200`}/>
        {formActive ? 
        <RxCross2 className={`text-2xl cursor-pointer transition-colors duration-200 hover:text-danger-400 me-1`} onClick={hideForm}/> :
        <GoPlus className={`text-3xl cursor-pointer hover:text-primary-500 transition-colors duration-200`} onClick={showForm}/>}
      </div>
    </div>
  )
}

function TaskTabs({selectedTab, setSelectedTab}) {

  const dispatch = useDispatch();

  const switchTab = (tab) => {
    dispatch(loadTasks(tabsToFilters[tab]));
    setSelectedTab(tab);
  }

  return (
    <Tabs variant="light" selectedKey={selectedTab} onSelectionChange={switchTab}>
      <Tab
        key={tabs.CURRENT}
        title={
          <div className="flex items-center space-x-2">
            <TbClockPlay className="text-lg"/>
            <span>Текущие</span>
          </div>
        }
      />
      <Tab
        key={tabs.UPCOMING}
        title={
          <div className="flex items-center space-x-2">
            <MdDownloading className="text-xl"/>
            <span>Предстоящие</span>
          </div>
        }
      />
      <Tab
        key={tabs.ARCHIVED}
        title={
          <div className="flex items-center space-x-2">
            <FaArchive/>
            <span>Архив</span>
          </div>
        }
      />
    </Tabs>
  )
}