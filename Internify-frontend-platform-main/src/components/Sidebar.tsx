import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarItem {
  label: string;
  path: string;
  icon?: string;
}

interface SidebarProps {
  items: SidebarItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-6">
      <nav className="space-y-2">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon && <span className="text-xl">{item.icon}</span>}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
