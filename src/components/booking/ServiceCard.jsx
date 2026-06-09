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
      className={`cursor-pointer rounded-2xl transition-all duration-300 border-2 relative overflow-hidden
        ${compact ? 'p-4' : 'p-6'}
        ${isSelected 
          ? 'border-gold-500 bg-gold-500/5 shadow-[0_0_30px_rgba(201,152,26,0.15)]' 
          : 'border-dark-700 bg-dark-800 hover:border-gold-500/50 hover:bg-dark-800/80'}
      `}
    >
      {isSelected && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-gold-500/20 rounded-bl-full flex items-start justify-end p-3">
          <div className="w-3 h-3 bg-gold-500 rounded-full shadow-[0_0_10px_rgba(201,152,26,1)]"></div>
        </div>
      )}
      
      <h3 className={`font-heading font-bold text-text-primary ${compact ? 'text-lg mb-1' : 'text-2xl mb-2'}`}>
        {service.name}
      </h3>
      
      <div className={`flex items-baseline gap-1 ${compact ? 'mb-3' : 'mb-4'}`}>
        <span className={`text-gold-400 font-bold ${compact ? 'text-xl' : 'text-3xl'}`}>
          {price.toLocaleString('vi-VN')}
        </span>
        <span className="text-text-muted text-sm">đ</span>
      </div>
      
      <div className={`flex items-center gap-4 text-sm text-text-secondary ${compact ? 'mb-3' : 'mb-6'}`}>
        <span className="flex items-center gap-1.5">
          <Clock size={compact ? 14 : 16} />
          {duration} phút
        </span>
        <span className="flex items-center gap-1.5">
          <Star size={compact ? 14 : 16} className="text-gold-400" />
          +{points} điểm
        </span>
      </div>

      {!compact && service.features && (
        <div className="border-t border-dark-600/50 pt-4">
          <ul className="space-y-2">
            {service.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-gold-500 text-xs mt-1">✦</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {compact && service.features && (
        <div className="border-t border-dark-600/50 pt-3">
          <p className="text-xs text-text-muted">{service.features.length} tính năng bao gồm</p>
        </div>
      )}
    </div>
  );
}
