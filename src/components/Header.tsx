import { Menu as MenuIcon, TreeDeciduous, LogOut, Crown, Home, CreditCard } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { useAuthStore } from '../store/authStore';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { FEATURES } from '../config/features';

export function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { getCurrentPlan } = useSubscriptionStore();
  const currentPlan = getCurrentPlan();
  const isSubscribed = currentPlan.id !== 'hobby';

  const menuItems = [
    { id: 'home', label: 'Home', path: '/', icon: Home },
    { id: 'pricing', label: 'Pricing', path: '/pricing', icon: CreditCard },
    ...FEATURES.map(feature => ({
      id: feature.id,
      label: feature.name,
      path: feature.path,
      icon: feature.icon,
      premium: feature.isPremium
    }))
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  return (
    <header className="bg-bonsai-stone dark:bg-stone-900 text-white shadow-lg relative">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <TreeDeciduous className="h-8 w-8 text-bonsai-green" />
            <div>
              <h1 className="text-2xl font-display font-bold">Bonsai</h1>
              <p className="text-xs text-bonsai-green">for beginners</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-8 h-8 rounded-full bg-bonsai-green text-white flex items-center justify-center hover:bg-bonsai-moss transition-colors"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.email || ''} 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <span className="text-sm font-medium">
                      {getInitials(user.email || '')}
                    </span>
                  )}
                </button>

                {showUserMenu && (
                  <>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-stone-800 rounded-lg shadow-xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-stone-200 dark:border-stone-700">
                        <p className="text-sm text-stone-600 dark:text-stone-300 truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                  </>
                )}
              </div>
            )}
            <ThemeToggle />
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-bonsai-bark/20 dark:hover:bg-stone-800 rounded-full transition-colors"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {showMenu && (
        <div className="absolute top-full right-4 w-72 bg-white dark:bg-stone-800 rounded-lg shadow-xl py-2 z-50">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-bonsai-bark dark:text-white hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors flex items-center"
            >
              <div className="flex items-center flex-1 min-w-0">
                {item.icon && <item.icon className="w-4 h-4 text-bonsai-green mr-2 flex-shrink-0" />}
                <span className="truncate">{item.label}</span>
              </div>
              {item.premium && (
                <Crown className="w-4 h-4 text-bonsai-terra ml-2 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}

      {showMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </header>
  );
}