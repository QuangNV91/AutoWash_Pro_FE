import React from 'react';
import { Clock, Star } from 'lucide-react';

export default function ServiceCard({ service, isSelected, onSelect, compact = false }) {
  // Hỗ trợ cả field cũ (price, duration, points) và field mới (base_price, duration_minutes, base_points)
  const price = service.base_price ?? service.price;
  const duration = service.duration_minutes ?? service.duration;
  const points = service.base_points ?? service.points;

  return (
    <div 
      onClick={() => onSelect(service)}
      className={`cursor-pointer rounded-2xl transition-all duration-300 border relative overflow-hidden
        ${compact ? 'p-4' : 'p-6'}
        ${isSelected 
          ? 'border-white bg-white/5' 
          : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'}
      `}
    >
      {isSelected && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-bl-full flex items-start justify-end p-3">
          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
        </div>
      )}
      
      <h3 className={`font-hero font-medium text-white ${compact ? 'text-lg mb-1' : 'text-2xl mb-2'} tracking-tight`}>
        {service.name}
      </h3>
      
      <div className={`flex items-baseline gap-1 ${compact ? 'mb-3' : 'mb-4'}`}>
        <span className={`text-white font-medium ${compact ? 'text-xl' : 'text-3xl'}`}>
          {price.toLocaleString('vi-VN')}
        </span>
        <span className="text-white/40 text-sm">đ</span>
      </div>
      
      <div className={`flex items-center gap-4 text-sm text-white/60 ${compact ? 'mb-3' : 'mb-6'}`}>
        <span className="flex items-center gap-1.5">
          <Clock size={compact ? 14 : 16} />
          {duration} phút
        </span>
        <span className="flex items-center gap-1.5">
          <Star size={compact ? 14 : 16} className="text-white/80" />
          +{points} điểm
        </span>
      </div>

      {!compact && service.features && (
        <div className="border-t border-white/10 pt-4">
          <ul className="space-y-2">
            {service.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-white/60">
                <span className="text-white/80 text-xs mt-1">●</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {compact && service.features && (
        <div className="border-t border-white/10 pt-3">
          <p className="text-xs text-white/40">{service.features.length} tính năng bao gồm</p>
        </div>
      )}
    </div>
  );
}
