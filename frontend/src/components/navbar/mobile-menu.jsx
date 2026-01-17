import { useEffect } from 'react';
import { getMenuLinks } from '@/core/navigation.js';
import { Link } from '@heroui/react';
import { useUserStore } from '@/store/user.js';
import UserAvatar from '@/components/user-avatar.jsx';

export default function MobileMenu() {
  const { account, isAuthenticated, loadUserAccount } = useUserStore();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    loadUserAccount();
  }, []);

  return (
    <div
      className="block md:hidden fixed bottom-0 left-0 w-full z-50 bg-background border-t border-default-100"
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
            className={`flex items-center justify-center flex-1 p-2 transition-colors ${isActive ? 'text-foreground' : 'text-default-300'}`}
          >
            <Icon className="w-6 h-6" />
          </Link>
          );
        })}
        <Link
          href="/profile"
          aria-label="Профиль"
          className={`flex items-center justify-center flex-1 p-2 transition-colors ${location.pathname.startsWith('/profile') ? 'text-foreground' : 'text-default-500'}`}
        >
          <UserAvatar
            className="cursor-pointer"
            sizeClassName="w-[29px] h-[29px] text-[12px]"
            username={account.username}
          />
        </Link>
      </div>
    </div>
  );
}
