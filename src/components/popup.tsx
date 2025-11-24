'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { 
  XMarkIcon, 
  CheckCircleIcon, 
  InformationCircleIcon, 
  ExclamationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/solid';

type PopupType = 'success' | 'error' | 'info' | 'warning';

interface PopupProps {
  type: PopupType;
  message: string;
  title?: string;
  onClose: () => void;
  duration?: number; // Auto-close en ms (0 = pas d'auto-close)
  onAction?: () => void; // Fonction optionnelle déclenchée au clic sur le bouton "Compris"
}

function Popup({ type, message, title, onClose, duration = 0, onAction }: PopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animation d'entrée
    const timer = setTimeout(() => setIsVisible(true), 10);
    
    // Auto-close si duration > 0
    let autoCloseTimer: NodeJS.Timeout;
    if (duration > 0) {
      autoCloseTimer = setTimeout(() => handleClose(), duration);
    }
    
    return () => {
      clearTimeout(timer);
      if (autoCloseTimer) clearTimeout(autoCloseTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300); // Attend la fin de l'animation
  };

  const handleAction = () => {
    if (onAction) onAction();
    handleClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const config = {
    success: {
      icon: CheckCircleIcon,
      borderColor: 'border-green-500',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    error: {
      icon: ExclamationCircleIcon,
      borderColor: 'border-red-500',
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    info: {
      icon: InformationCircleIcon,
      borderColor: 'border-blue-500',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    warning: {
      icon: ExclamationTriangleIcon,
      borderColor: 'border-yellow-500',
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  }[type];

  const IconComponent = config.icon;

  return createPortal(
    <div 
      className={clsx(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      onClick={handleBackdropClick}
    >
      {/* Backdrop flouté */}
      <div className={clsx(
        "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity",
        isVisible ? "opacity-100" : "opacity-0"
      )} />

      {/* Popup */}
      <div 
        className={clsx(
          "relative w-full max-w-md bg-white rounded-2xl shadow-2xl border-l-4 overflow-hidden transition-all duration-300",
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-2",
          config.borderColor
        )}
      >
        {/* Header avec icône et titre */}
        <div className="flex items-center gap-4 p-6 pb-4">
          <div className={clsx("flex-shrink-0", config.iconColor)}>
            <IconComponent className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h3 className={clsx("text-lg font-semibold", config.iconColor)}>
              {title || type.charAt(0).toUpperCase() + type.slice(1)}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{message}</p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Fermer"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Action button optionnel */}
        <div className="px-6 pb-6">
          <button
            onClick={handleAction}
            className={clsx(
              "w-full px-4 py-2.5 rounded-xl font-medium transition-colors",
              type === 'success' && "bg-green-50 text-green-700 hover:bg-green-100",
              type === 'error' && "bg-red-50 text-red-700 hover:bg-red-100",
              type === 'info' && "bg-blue-50 text-blue-700 hover:bg-blue-100",
              type === 'warning' && "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
            )}
          >
            Compris
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ✅ Hook utilitaire pour faciliter l'utilisation
export function usePopup() {
  const [popup, setPopup] = useState<{
    type: PopupType;
    message: string;
    title?: string;
    duration?: number;
    onAction?: () => void;
  } | null>(null);

  const show = (props: { type: PopupType; message: string; title?: string; duration?: number; onAction?: () => void }) => {
    setPopup(props);
  };

  const hide = () => {
    setPopup(null);
  };

  const PopupComponent = popup ? (
    <Popup
      type={popup.type}
      message={popup.message}
      title={popup.title}
      duration={popup.duration}
      onClose={hide}
      onAction={popup.onAction}
    />
  ) : null;

  return { show, PopupComponent };
}