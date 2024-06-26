import React, { useEffect, useState } from 'react';
import {
   Dropdown,
   DropdownItem,
   DropdownMenu,
   DropdownSection,
   DropdownTrigger,
} from '@nextui-org/react';
import { ProfileAvatar } from '../shared/ProfileAvatar';
import { Profile } from '../shared/icons/Profile.icon';
import { ArrowOut } from '../shared/icons/ArrowOut.icon';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Key } from 'react';
import { useTheme } from 'next-themes';
import { MoonIcon } from '../shared/icons/Moon.icon';
import { SunIcon } from '../shared/icons/Sun.icon';

interface ProfileDropdownProps {
   username?: string;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
   username = 'Новый пользователь',
}) => {
   const { logout } = useAuth();
   const navigate = useNavigate();
   const { theme, setTheme } = useTheme();
   const [isMounted, setIsMounted] = useState(false);
   const [isDark, setIsDark] = useState(theme === "dark");

   useEffect(() => {
      setIsMounted(true);
   }, []);

   useEffect(() => {
      if (isMounted) {
         setIsDark(theme === "dark");
      }
   }, [theme, isMounted]);

   const handleToggle = () => {
      setTheme(isDark ? "light" : "dark");
   };

   const handleAction = (key: Key) => {
      if (key === 'my-profile') {
         navigate('/dashboard/profile');
      } else if (key === 'exit') {
         logout();
      } else if (key === 'theme-switcher') {
         handleToggle();
      }
   };

   return (
      <Dropdown>
         <DropdownTrigger>
            <button>
               <ProfileAvatar />
            </button>
         </DropdownTrigger>
         <DropdownMenu aria-label="User Profile" disabledKeys={['profile']} onAction={handleAction}>
            <DropdownSection>
               <DropdownItem 
                  key="profile" 
                  isReadOnly 
                  className="opacity-100"
                  textValue={username}
               >
                  <div className="flex w-1/4 items-center">
                     <ProfileAvatar />
                     <p className="pl-4 text-xl text-wrap">{username}</p>
                  </div>
               </DropdownItem>
            </DropdownSection>
            <DropdownSection>
               <DropdownItem 
                  key="my-profile" 
                  textValue="Мой профиль"
               >
                  <div className="flex items-center gap-2">
                     <Profile />
                     <p>Мой профиль</p>
                  </div>
               </DropdownItem>
            </DropdownSection>
            <DropdownSection className="block md:hidden">
               <DropdownItem 
                  key="theme-switcher"
                  textValue='Тема'
                  onClick={handleToggle}
               >
                  <div className="flex items-center gap-2">
                     {isDark ? (
                        <MoonIcon className="text-2xl" />
                     ) : (
                        <SunIcon className="text-2xl" />
                     )}
                     <p>Тема</p>
                  </div>
               </DropdownItem>
            </DropdownSection>
            <DropdownSection>
               <DropdownItem 
                  key="exit" 
                  textValue="Выйти"
               >
                  <div className="flex items-center gap-2">
                     <ArrowOut />
                     <p>Выйти</p>
                  </div>
               </DropdownItem>
            </DropdownSection>
         </DropdownMenu>
      </Dropdown>
   );
};
