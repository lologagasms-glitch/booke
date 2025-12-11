'use client';
import { useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TransletText } from '@/app/lib/services/translation/transletText';

/* --------------  TYPES  -------------- */
export type MarkerData = {
  position: [number, number];
  size?: number;
  popupText?: string;
};

export type MapClientProps = {
  /* un seul marker */
  size?: number;
  position?: [number, number];
  popupText?: string;
  /* plusieurs markers */
  markers?: MarkerData[];
  /* props MapContainer */
  className?: string;
  zoom?: number;
  scrollWheelZoom?: boolean | 'center';
  zoomControl?: boolean;
  attribution?: boolean;
};

/* --------------  GLASS PIN  -------------- */
function useGlassPin(size: number, color = 'var(--color-theme-main, #ff0055)') {
  return useMemo(() => {
    const uid = `g-${Math.random().toString(36).slice(2)}`;
    const gradId = `${uid}-gradient`;
    const filterId = `${uid}-shadow`;

    const svg = `
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>`;

    return L.divIcon({
      html: `<div class="glass-pin">${svg}</div>`,
      className: 'glass-marker',
      iconSize: [size, size * 1.33],  
      iconAnchor: [size / 2, size * 1.33],
      popupAnchor: [0, -size * 1.33],
    });
  }, [size, color]);
}

/* --------------  COMPOSANT  -------------- */
export default function MapClient({
  size = 40,
  position = [6.3703, 2.4187],
  popupText = 'We are here!',
  markers,
  className,
  zoom = 14,
  scrollWheelZoom = true,
  zoomControl = true,
  attribution = true,
}: MapClientProps) {
  /* normalisation tableau de markers */
  const normalizedMarkers = useMemo<MarkerData[]>(() => {
    if (markers?.length) return markers;
    return [{ position, size, popupText }];
  }, [markers, position, size, popupText]);

  return (
    <MapContainer
      center={normalizedMarkers[0]?.position ?? position}
      zoom={zoom}
      scrollWheelZoom={scrollWheelZoom}
      zoomControl={zoomControl}
      className={`theme-card bg-theme-card ${className ?? ''}`}
      style={{ height: '100%', width: '100%', borderRadius: '1rem' }}
      dragging={true}
    >
      {/* >>> COUCHE RASTER CYCLOSM (gratuit, zoom 22, très détaillé) <<< */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={22}
        detectRetina
      />

      {normalizedMarkers.map((m, i) => (
        <EmojiMarker key={i} {...m} />
      ))}
    </MapContainer>
  );
}

/* --------------  MARKER  -------------- */
function EmojiMarker({ position, size = 40, popupText }: MarkerData) {
  const icon = useGlassPin(size);
  return (
    <Marker position={position} icon={icon}>
      {popupText && (
        <Popup className="theme-card bg-theme-card">
          <span className="theme-main text-theme-main">
            <TransletText>{popupText}</TransletText>
          </span>
        </Popup>
      )}
    </Marker>
  );
}