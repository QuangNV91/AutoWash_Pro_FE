import React from 'react';
import { Clock, Star } from 'lucide-react';

export default function ServiceCard({ service, isSelected, onSelect }) {
  return (
    <div 
      onClick={() => onSelect(service)}
      className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 border-2 relative overflow-hidden
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
      
      <h3 className="font-heading text-2xl font-bold text-text-primary mb-2">
        {service.name}
      </h3>
      
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-gold-400 text-3xl font-bold">
          {service.price.toLocaleString('vi-VN')}
        </span>
        <span className="text-text-muted text-sm">đ</span>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-text-secondary mb-6">
        <span className="flex items-center gap-1.5">
          <Clock size={16} />
          {service.duration} phút
        </span>
        <span className="flex items-center gap-1.5">
          <Star size={16} className="text-gold-400" />
          +{service.points} điểm
        </span>
      </div>

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
    </div>
  );
}
