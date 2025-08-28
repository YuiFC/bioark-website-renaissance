import React from 'react';

// --- Component Props ---
interface MapProps {
  center: [number, number]; // [lon, lat]
  marker?: {
    coordinates: [number, number]; // [lon, lat]
  };
  className?: string;
}

const Map = ({
  center,
  marker,
  className = "w-full h-64 rounded-lg overflow-hidden shadow-md border border-border",
}: MapProps) => {
  // Use marker coordinates when provided, otherwise use center
  const [lon, lat] = marker ? marker.coordinates : center;

  // Define a bounding box around the marker to determine map view
  // Smaller delta will zoom in more
  const delta = 0.02;
  const minLon = lon - delta;
  const maxLon = lon + delta;
  const minLat = lat - (delta / 2);
  const maxLat = lat + (delta / 2);

  const bbox = [minLon, minLat, maxLon, maxLat].join(',');
  const markerCoords = `${lat},${lon}`;

  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${markerCoords}`;

  return (
    <div className={className}>
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={osmUrl}
        title="BioArk Technologies Location on OpenStreetMap"
      ></iframe>
    </div>
  );
};

export default Map;