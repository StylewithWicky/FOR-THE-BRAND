import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';


const customIcon = L.divIcon({
  className: 'custom-pin',
  html: `<div style="background-color: #f59e0b; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
  iconSize: [12, 12],
});

export default function PassportMap({ locations }: { locations: { name: string, coords: [number, number] }[] }) {
  return (
    <div className="h-64 w-full rounded-3xl overflow-hidden border border-white/5 opacity-80 hover:opacity-100 transition-opacity">
      <MapContainer 
        center={[-1.2921, 36.8219]} 
        zoom={6} 
        style={{ height: '100%', width: '100%', background: '#0b0c0e' }}
        scrollWheelZoom={false}
      >
        {/* Dark Mode Map Layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
        />
        
        {locations.map((loc, idx) => (
          <Marker key={idx} position={loc.coords} icon={customIcon}>
            <Popup className="text-black font-mono text-[10px] uppercase">
              {loc.name}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}