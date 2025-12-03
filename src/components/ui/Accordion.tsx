'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

interface AccordionItemProps {
    title: React.ReactNode;
    children: React.ReactNode;
}

export function AccordionItem({ title, children }: AccordionItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <button
                className="flex justify-between items-center w-full py-4 text-left focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</span>
                <ChevronDownIcon
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''
                        }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="text-gray-600 dark:text-gray-300">{children}</div>
            </div>
        </div>
    );
}

interface AccordionProps {
    children: React.ReactNode;
}

export function Accordion({ children }: AccordionProps) {
    return <div className="w-full">{children}</div>;
}
