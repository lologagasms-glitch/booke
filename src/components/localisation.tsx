'use client';

import { useEffect, useRef, useState, useId, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModernLocationMapProps {
  lat: number;
  lng: number;
  label: string;
  className?: string;
}

/* ---------- Icône de localisation premium pour Leaflet ---------- */
function createPremiumIcon(color: string = '#FF6B6B') {
  return L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, ${color}, #C44569);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        position: relative;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="3" fill="${color}"/>
        </svg>
        <div style="
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid ${color};
        "></div>
      </div>
    `,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -48],
    className: 'premium-marker',
  });
}

/* ---------- Composant Carte Modal ---------- */
function MapModal({ lat, lng, label, onClose }: {
  lat: number;
  lng: number;
  label: string;
  onClose: () => void;
}) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true,
    }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);

    L.marker([lat, lng], { icon: createPremiumIcon() })
      .addTo(mapRef.current)
      .bindPopup(`<div style="font-weight: 600; color: #1f2937;">${label}</div>`, {
        autoClose: false,
        closeOnClick: false,
      })
      .openPopup();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, label]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full h-full max-w-5xl max-h-[80vh] bg-white rounded-2xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition backdrop-blur"
          aria-label="Fermer la carte"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}

/* ---------- Composant Carte Miniature ---------- */
export default function ModernLocationMap({ lat, lng, label, className = '' }: ModernLocationMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current, {
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
    }).setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
      maxZoom: 19,
    }).addTo(mapRef.current);

    L.marker([lat, lng], { icon: createPremiumIcon() })
      .addTo(mapRef.current)
      .bindPopup(`<div style="font-weight: 600;">${label}</div>`);

    // Désactiver le context menu sur la miniature
    mapContainerRef.current.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, label]);

  return (
    <>
      <div
        ref={mapContainerRef}
        className={`relative overflow-hidden rounded-xl border border-white/20 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${className}`}
        onClick={() => setIsModalOpen(true)}
        title={`Voir ${label} sur la carte`}
      />
      {isModalOpen && (
        <MapModal
          lat={lat}
          lng={lng}
          label={label}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}