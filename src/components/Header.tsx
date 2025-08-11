"use client";

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { LinkButton } from './LinkButton';
import { useRouter } from "next/navigation";

// Um ícone simples de usuário como placeholder
const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
  </svg>
);

type Props = {
  children?: ReactNode;
};

export function Header({ children }: Props) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  if (isLoading) {
    // Pode mostrar um loader menor ou nada enquanto o auth carrega
    return (
      <header className="w-full bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Placeholder para logo e texto durante o carregamento */}
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-blue-500 animate-pulse rounded"></div> {/* Placeholder para logoPrefeitura */}
            <div className="h-8 w-32 bg-blue-500 animate-pulse rounded"></div> {/* Placeholder para "Portal Saber" */}
          </div>
          <div className="h-8 w-20 bg-blue-500 animate-pulse rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-custom-blue py-7 px-4 sm:px-6 lg:px-8 z-50 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo e Nome do Portal */}
        <Link href="/" className="flex flex-col md:flex-row items-center gap-1 md:gap-4">
          {/* Logo Prefeitura - Menor em mobile */}
          <div className="w-40 md:w-auto">
            <Image
              src="/assets/images/logoBranco.png"
              alt="Logo Prefeitura"
              width={300}
              height={100}
              layout="responsive"
            />
          </div>

          {/* Separador - Visível apenas em telas maiores */}
          <div className="hidden md:block text-white text-4xl font-light">|</div>

          {/* Logo Portal Saber - Menor em mobile */}
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 md:w-10 md:h-10 fill-white" viewBox="0 0 24 24">
              <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
            </svg>
            <div className="font-black text-xl md:text-3xl tracking-wider text-white">PORTAL SABER</div>
          </div>
        </Link>

        {/* Custom Navigation Links passed as children */}
        {children && (
          <nav className="hidden md:flex gap-6 items-center">
            {children}
          </nav>
        )}

        {/* Authentication Status */}
        <nav className="flex md:gap-4 items-center">
          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                aria-label="Menu do usuário"
              >
                {/* Idealmente, user.image seria a URL da foto de perfil */}
                {user.image ? (
                  <img src={user.image} alt="Foto do perfil" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <UserIcon className="w-6 h-6 text-white" />
                )}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-gray-700">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className='md:hidden relative' ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 md:hidden"
                  aria-label="Menu do usuário">
                  <UserIcon className="w-6 h-6 text-white md:hidden" />
                </button>
                {isDropdownOpen && (
                  <div>
                    <div className="absolute right-0 mt-2 w-30 bg-white rounded-md shadow-lg py-1 z-50 text-gray-700">
                      <Link
                        href="/cadastro"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 font-bold"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Cadastro
                      </Link>
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Entrar
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className='hidden md:flex w-46 justify-between'>
                <LinkButton href="/cadastro" label="Cadastro" />
                <LinkButton href="/login" label="Login" />
              </div>
            </>
          )}
        </nav>

       
        <div className="flex items-center gap-3">
        {/* Botão addTutorial */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => router.push("/adm/addTutorial")}
              className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-800 transition"
            >
              Adicionar Tutorial
            </button>
          )}
        </div>
      </div>
    </header>
  );
};