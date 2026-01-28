import { X, Image, Camera, FileText } from 'lucide-react';

interface AttachmentSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AttachmentSheet({ isOpen, onClose }: AttachmentSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet - Simplified */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="mx-4 mb-4 space-y-2">
          <button
            onClick={onClose}
            className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors shadow-lg text-left"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <Image className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
            </div>
            <span className="text-base text-gray-900">Image Library</span>
          </button>

          <button
            onClick={onClose}
            className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors shadow-lg text-left"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
            </div>
            <span className="text-base text-gray-900">Camera</span>
          </button>
        </div>

        {/* Bottom Safe Area */}
        <div className="h-8" />
      </div>
    </>
  );
}