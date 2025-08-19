import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // You need to add your Mapbox access token here
    // Get it from: https://mapbox.com/
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNtNDBhY2JhZDBienAycXM3cW05cG5lZGgifQ.UQD7rMaRRfvOx_T7KzPfBw';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-77.0369, 39.0457], // Rockville, MD coordinates
      zoom: 14,
    });

    // Add a marker for the BioArk office
    new mapboxgl.Marker({
      color: '#0A2A4D'
    })
    .setLngLat([-77.0369, 39.0457])
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="padding: 10px;">
            <h3 style="margin: 0 0 5px 0; font-weight: bold;">BioArk Technologies</h3>
            <p style="margin: 0; font-size: 14px;">13 Taft, Suite 213<br>Rockville, MD, 20850</p>
          </div>
        `)
    )
    .addTo(map.current);

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden shadow-md border border-border">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;