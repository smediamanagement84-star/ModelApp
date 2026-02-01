import React, { useState } from 'react';
import { X, Calendar, DollarSign, Clock, FileText } from 'lucide-react';
import { Model } from '../types';

interface BookingModalProps {
  talent: Model;
  onClose: () => void;
  onSubmit: (data: BookingFormData) => Promise<void>;
}

export interface BookingFormData {
  projectName: string;
  description: string;
  shootDate: string;
  durationDays: number;
  budget: number;
}

const BookingModal: React.FC<BookingModalProps> = ({ talent, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    projectName: '',
    description: '',
    shootDate: '',
    durationDays: 1,
    budget: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl">Book {talent.name}</h2>
            <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">
              {talent.role} • {talent.category}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Project Name *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                placeholder="e.g., Summer Campaign 2026"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-black focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Project Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the project, style, location, and any specific requirements..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 focus:border-black focus:outline-none text-sm resize-none"
            />
          </div>

          {/* Shoot Date */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Shoot Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                required
                value={formData.shootDate}
                onChange={(e) => setFormData({ ...formData, shootDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-black focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Duration & Budget Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Duration */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                Duration (Days) *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  required
                  min={1}
                  max={30}
                  value={formData.durationDays}
                  onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 1 })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-black focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                Budget (USD) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:border-black focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Talent Rate Info */}
          <div className="bg-gray-50 p-4 text-sm">
            <p className="text-gray-600">
              <span className="font-medium text-black">{talent.name}'s</span> rate is{' '}
              <span className="font-bold text-black">
                ${talent.price}/{talent.priceType}
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Final pricing will be confirmed by the talent upon accepting your request.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-black text-white text-xs uppercase tracking-widest font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending Request...' : 'Send Booking Request'}
          </button>

          <p className="text-xs text-center text-gray-400">
            The talent will receive your request and respond within 48 hours.
          </p>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
