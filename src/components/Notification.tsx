import { Transition } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { useNotification } from '../lib/notification-context';
import type { Notification as NotificationType, NotificationType as Type } from '../lib/notification-context';

const iconMap: Record<Type, React.ComponentType<{ className?: string }>> = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InformationCircleIcon,
};

const colorMap: Record<Type, { icon: string; title: string; bg: string }> = {
  success: {
    icon: 'text-green-400',
    title: 'text-gray-900 dark:text-white',
    bg: 'bg-white dark:bg-gray-800',
  },
  error: {
    icon: 'text-red-400',
    title: 'text-gray-900 dark:text-white',
    bg: 'bg-white dark:bg-gray-800',
  },
  info: {
    icon: 'text-blue-400',
    title: 'text-gray-900 dark:text-white',
    bg: 'bg-white dark:bg-gray-800',
  },
};

interface NotificationItemProps {
  notification: NotificationType;
  onDismiss: (id: string) => void;
}

function NotificationItem({ notification, onDismiss }: NotificationItemProps) {
  const Icon = iconMap[notification.type];
  const colors = colorMap[notification.type];

  return (
    <Transition
      show={true}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className={`pointer-events-auto w-full max-w-sm rounded-lg shadow-lg outline-1 outline-black/5 dark:-outline-offset-1 dark:outline-white/10 ${colors.bg}`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className="shrink-0">
              <Icon aria-hidden="true" className={`size-6 ${colors.icon}`} />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              {notification.title && (
                <p className={`text-sm font-medium ${colors.title}`}>
                  {notification.title}
                </p>
              )}
              <p className={`text-sm ${notification.title ? 'mt-1' : ''} text-gray-500 dark:text-gray-400`}>
                {notification.message}
              </p>
            </div>
            <div className="ml-4 flex shrink-0">
              <button
                type="button"
                onClick={() => onDismiss(notification.id)}
                className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 dark:hover:text-white dark:focus:outline-indigo-500"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}

export default function Notification() {
  const { notifications, dismissNotification } = useNotification();

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDismiss={dismissNotification}
            />
          ))}
        </div>
      </div>
    </>
  );
}
