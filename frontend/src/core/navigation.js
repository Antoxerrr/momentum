import {FaPlus} from "react-icons/fa6";
import {BsCashCoin} from "react-icons/bs";
import {BiCopy} from "react-icons/bi";
import {GrNotes, GrTask} from "react-icons/gr";
import {AiOutlineProject} from "react-icons/ai";

export function getMenuLinks() {
  return [
    {
      href: '/tracker/projects',
      title: 'Трекер',
      Icon: AiOutlineProject,
    },
    {
      href: '/finance',
      title: 'Финансы',
      Icon: BsCashCoin,
    },
    {
      href: '/tasks',
      title: 'Список дел',
      mobileTitle: 'TODO',
      Icon: GrTask,
    },
    {
      href: '/snippets',
      title: 'Сниппеты',
      Icon: BiCopy,
    },
    {
      href: '/notes',
      title: 'Заметки',
      Icon: GrNotes,
    },
  ];
}
