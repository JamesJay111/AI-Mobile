import { X, Camera, Image } from 'lucide-react';

interface ImagePickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFromGallery: () => void;
  onTakePhoto: () => void;
}

export function ImagePickerSheet({ 
  isOpen, 
  onClose, 
  onSelectFromGallery,
  onTakePhoto 
}: ImagePickerSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-50 animate-slide-up pb-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Image</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Options */}
        <div className="px-6 pt-4 space-y-3">
          <button
            onClick={() => {
              onSelectFromGallery();
              onClose();
            }}
            className="w-full bg-[#F5F5F7] rounded-2xl px-6 py-5 flex items-center gap-4 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Image className="w-6 h-6 text-gray-700" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-base font-semibold text-gray-900 mb-1">Choose from Gallery</h3>
              <p className="text-sm text-gray-500">Select an existing photo</p>
            </div>
          </button>

          <button
            onClick={() => {
              onTakePhoto();
              onClose();
            }}
            className="w-full bg-[#F5F5F7] rounded-2xl px-6 py-5 flex items-center gap-4 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Camera className="w-6 h-6 text-gray-700" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-base font-semibold text-gray-900 mb-1">Take a Photo</h3>
              <p className="text-sm text-gray-500">Use your camera</p>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
