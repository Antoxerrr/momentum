import { useState } from "react";
import { GoPlus } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import { TaskForm } from "../task-form.jsx";
import { Tab, Tabs } from "@heroui/react";
import { FaArchive } from "react-icons/fa";
import { TbClockPlay } from "react-icons/tb";
import { MdDownloading } from "react-icons/md";
import { Select, SelectItem } from "@heroui/react";
import { TASKS_LIST_TABS } from "@/core/const/tasks.js";
import { useTasksStore } from "@/store/tasks.js";
import { useShallow } from "zustand/react/shallow";
import {SlideDown} from "@/components/animations/slide-down.jsx";
import {Divider} from "@heroui/react";

const tabsIcons = {
  [TASKS_LIST_TABS.CURRENT]: <TbClockPlay/>,
  [TASKS_LIST_TABS.UPCOMING]: <MdDownloading/>,
  [TASKS_LIST_TABS.ARCHIVED]: <FaArchive/>
};


export function TasksToolbar() {
  const [formActive, setFormActive] = useState(false);

  return (
    <div>
      <ToolbarControls
        formActive={formActive}
        setFormActive={setFormActive}
      />
      <SlideDown show={formActive}>
        <TaskForm
          setFormActive={setFormActive}
        />
        <Divider className="mb-5"/>
      </SlideDown>
    </div>
  )
}


function ToolbarControls({formActive, setFormActive}) {
  const showForm = () => setFormActive(true);
  const hideForm = () => setFormActive(false);

  return (
    <div className="flex justify-between my-5 h-[30px] items-center">
      <div className="w-full">
        <TaskTabs/>
      </div>

      <div className="flex flex-row-reverse items-center gap-2 select-none">
        {formActive ?
        <RxCross2 className="text-2xl cursor-pointer transition-colors duration-200 hover:text-danger-400 me-1" onClick={hideForm}/> :
        <GoPlus className="text-3xl cursor-pointer hover:text-primary-500 transition-colors duration-200" onClick={showForm}/>}
      </div>
    </div>
  )
}


function TaskTabs() {
  const { currentTab, setTab, loadTasksForCurrentTab } = useTasksStore(
    useShallow(state => ({
      currentTab: state.currentTab,
      setTab: state.setTab,
      loadTasksForCurrentTab: state.loadTasksForCurrentTab
    }))
  );
  const [selectedTabIcon, setSelectedTabIcon] = useState(tabsIcons[currentTab]);

  const switchTab = (tab) => {
    if (typeof tab !== 'string') {
      tab = tab.currentKey;
    }

    if (tab === currentTab) {
      return;
    }

    setTab(tab);
    loadTasksForCurrentTab();
    setSelectedTabIcon(tabsIcons[tab]);
  }

  return (
    <>
      <Select
        startContent={selectedTabIcon}
        onSelectionChange={switchTab}
        selectedKeys={[currentTab]}
        aria-labelledby="task tab"
        className="md:hidden w-3/4"
      >
        <SelectItem key={TASKS_LIST_TABS.CURRENT} startContent={tabsIcons[TASKS_LIST_TABS.CURRENT]}>
          Текущие
        </SelectItem>
        <SelectItem key={TASKS_LIST_TABS.UPCOMING} startContent={tabsIcons[TASKS_LIST_TABS.UPCOMING]}>
          Предстоящие
        </SelectItem>
        <SelectItem key={TASKS_LIST_TABS.ARCHIVED} startContent={tabsIcons[TASKS_LIST_TABS.ARCHIVED]}>
          Архив
        </SelectItem>
      </Select>
      <Tabs
        variant="light"
        selectedKey={currentTab}
        onSelectionChange={switchTab}
        className="md:inline-flex hidden"
      >
        <Tab
          key={TASKS_LIST_TABS.CURRENT}
          title={
            <div className="flex items-center space-x-2">
              <TbClockPlay className="text-lg"/>
              <span>Текущие</span>
            </div>
          }
        />
        <Tab
          key={TASKS_LIST_TABS.UPCOMING}
          title={
            <div className="flex items-center space-x-2">
              <MdDownloading className="text-xl"/>
              <span>Предстоящие</span>
            </div>
          }
        />
        <Tab
          key={TASKS_LIST_TABS.ARCHIVED}
          title={
            <div className="flex items-center space-x-2">
              <FaArchive/>
              <span>Архив</span>
            </div>
          }
        />
      </Tabs>
    </>
  )
}