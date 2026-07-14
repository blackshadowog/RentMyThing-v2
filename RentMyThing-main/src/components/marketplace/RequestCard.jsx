import { Calendar, DollarSign, Tag, MapPin, MessageSquare, Clock } from 'lucide-react';

export default function RequestCard({ request, onViewOffers, onMakeOffer, isOwner = false }) {
  const {
    id,
    title = 'Untitled Request',
    category = 'General',
    description = '',
    budget = 0,
    duration = '1 day',
    pickupDate = '',
    college = '',
    offersCount = 0,
    status = 'active',
    user = {},
  } = request || {};

  const statusColors = {
    active: 'bg-emerald-100 text-emerald-700',
    fulfilled: 'bg-blue-100 text-blue-700',
    expired: 'bg-gray-100 text-gray-500',
  };

  return (
    <div
      id={`request-card-${id}`}
      className="group rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
            <Tag size={10} className="mr-0.5 inline" />
            {category}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColors[status] || statusColors.active}`}>
            {status}
          </span>
        </div>
        {offersCount > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">
            <MessageSquare size={10} />
            {offersCount} offer{offersCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <h3 className="mt-3 text-sm font-bold text-gray-900 line-clamp-1">{title}</h3>
      {description && (
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{description}</p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
          <DollarSign size={12} className="text-emerald-500" />
          <span className="font-semibold text-gray-700">₹{budget}</span>
          <span>budget</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
          <Clock size={12} className="text-blue-500" />
          <span className="font-semibold text-gray-700">{duration}</span>
        </div>
        {pickupDate && (
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <Calendar size={12} className="text-purple-500" />
            <span>{pickupDate}</span>
          </div>
        )}
        {college && (
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <MapPin size={12} className="text-rose-500" />
            <span className="truncate">{college}</span>
          </div>
        )}
      </div>

      {/* Requester */}
      <div className="mt-3 flex items-center gap-2 border-t border-gray-50 pt-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-amber-400 text-[10px] font-bold text-white">
          {(user.name || 'U')[0]}
        </div>
        <span className="text-[11px] font-medium text-gray-600">{user.name || 'Student'}</span>
      </div>

      {/* Actions */}
      <div className="mt-3 flex gap-2">
        {isOwner && status === 'active' ? (
          <button
            onClick={() => onMakeOffer?.(request)}
            className="flex-1 rounded-2xl bg-rose-500 py-2 text-[11px] font-bold text-white shadow-md shadow-rose-200 transition hover:bg-rose-600"
            id={`offer-btn-${id}`}
          >
            Make an Offer
          </button>
        ) : (
          <button
            onClick={() => onViewOffers?.(request)}
            className="flex-1 rounded-2xl bg-gray-100 py-2 text-[11px] font-bold text-gray-700 transition hover:bg-gray-200"
            id={`view-offers-btn-${id}`}
          >
            {offersCount > 0 ? `View ${offersCount} Offer${offersCount !== 1 ? 's' : ''}` : 'View Details'}
          </button>
        )}
      </div>
    </div>
  );
}
