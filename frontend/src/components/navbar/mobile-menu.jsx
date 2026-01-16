import { getMenuLinks } from '@/core/navigation.js';
import { Link } from '@heroui/react';

export default function MobileMenu() {
  return (
    <div
      className="block md:hidden fixed bottom-0 left-0 w-full z-50 bg-background border-t border-default-200"
      style={{
        height: 'var(--bottom-bar-height)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex w-full h-full">
        {getMenuLinks().map(({ href, title, mobileTitle, Icon }) => {
          const isActive = location.pathname.startsWith(href);
          const label = mobileTitle || title;

          return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={`flex items-center justify-center flex-1 p-2 transition-colors ${isActive ? 'text-foreground' : 'text-default-500'}`}
          >
            <Icon className="w-6 h-6" />
          </Link>
          );
        })}
      </div>
    </div>
  );
}
