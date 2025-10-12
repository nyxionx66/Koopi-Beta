'use client';

import React from 'react';
import { Star, ThumbsUp, Trash2 } from 'lucide-react';

type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: any;
  approved: boolean;
};

type ReviewManagementProps = {
  reviews: Review[];
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ReviewManagement({ reviews, onApprove, onDelete }: ReviewManagementProps) {
  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="p-4 border rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{review.author}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!review.approved && (
                  <button onClick={() => onApprove(review.id)} className="p-2 text-green-500 hover:bg-green-50 rounded-full">
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => onDelete(review.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mt-2">{review.comment}</p>
            <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt?.seconds * 1000).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
}