import {getMenuLinks} from "@/core/navigation.js";
import {Link} from "@heroui/react";

export default function MobileMenu() {
  return (
    <div className="block md:hidden fixed bottom-0 left-0 w-full h-16 z-50 bg-background border-t border-default-500">
      <div className="flex w-full h-full">
        {getMenuLinks().map(({ href, title, mobileTitle, Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center flex-1 p-2 gap-1 text-default-500"
          >
            <Icon className="w-4 h-4"/>
            <span className="text-xs font-small">{mobileTitle || title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
