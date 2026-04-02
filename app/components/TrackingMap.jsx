"use client";
import { useEffect, useRef } from "react";

export default function TrackingMap({ lat, lng }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    import("leaflet").then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current).setView([lat, lng], 15);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);

        const deliveryIcon = L.divIcon({
          className: "",
          html: `<div style="background:#17d492;width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.4)">🛵</div>`,
          iconSize: [42, 42],
          iconAnchor: [21, 21],
        });

        L.marker([lat, lng], { icon: deliveryIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup("<b>Delivery Partner</b><br/>On the way to you!")
          .openPopup();
      } else {
        mapInstanceRef.current.setView([lat, lng], 15);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng]);

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <div ref={mapRef} style={{ width: "100%", height: "100%", minHeight: "260px" }} />
    </>
  );
}
