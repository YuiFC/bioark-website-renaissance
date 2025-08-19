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
  // 使用标记的坐标（如果提供），否则使用中心坐标
  const [lon, lat] = marker ? marker.coordinates : center;

  // 在标记周围定义一个边界框，用于确定地图视野
  // 较小的 delta 值会使地图更放大
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