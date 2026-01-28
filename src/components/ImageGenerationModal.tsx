import { X, Image as ImageIcon, Loader2, Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import { generateImage } from '../services/openRouter';
import { uploadFileToStorage } from '../services/storageUpload';
import { getCurrentUserId } from '../utils/user';

interface ImageGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  onProClick?: () => void;
}

export function ImageGenerationModal({ isOpen, onClose, isPro, onProClick }: ImageGenerationModalProps) {
  const [description, setDescription] = useState('');
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const canSubmit = useMemo(() => description.trim().length > 0 && !isLoading, [description, isLoading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const reset = () => {
    setDescription('');
    setReferenceImage(null);
    setImagePreview(null);
    setIsLoading(false);
    setError(null);
    setGeneratedImageUrl(null);
  };

  const handleGenerate = async () => {
    if (!canSubmit) return;

    const requestId = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`[TRACE] feature=image step=validate requestId=${requestId}`, {
      promptLength: description.trim().length,
      hasReferenceImage: !!referenceImage,
      isPro,
    });

    // Check Pro status
    if (!isPro) {
      console.log(`[TRACE] feature=image step=paywall_block requestId=${requestId}`);
      onClose();
      if (onProClick) {
        setTimeout(() => onProClick(), 300);
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      let referenceImageUrl: string | undefined;
      if (referenceImage) {
        console.log(`[TRACE] feature=image step=upload requestId=${requestId}`, {
          fileName: referenceImage.name,
          fileSize: referenceImage.size,
        });
        referenceImageUrl = await uploadFileToStorage({
          file: referenceImage,
          path: `image-refs/${getCurrentUserId()}/${Date.now()}_${referenceImage.name}`,
        });
        console.log(`[TRACE] feature=image step=upload_complete requestId=${requestId}`, {
          referenceImageUrlLength: referenceImageUrl.length,
        });
      }

      console.log(`[TRACE] feature=image step=callable requestId=${requestId}`, {
        promptLength: description.trim().length,
        hasReferenceImage: !!referenceImageUrl,
      });

      const res = await generateImage({
        prompt: description.trim(),
        referenceImageUrl,
        userId: getCurrentUserId(),
        isPro: isPro,
      });

      console.log(`[TRACE] feature=image step=render requestId=${requestId}`, {
        success: res.success,
        hasImageUrl: !!res.imageUrl,
      });

      if (!res.success || !res.imageUrl) {
        throw new Error(res.error || 'Something went wrong. Please try again.');
      }

      setGeneratedImageUrl(res.imageUrl);
    } catch (e: any) {
      setError(e?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div className="bg-white rounded-t-[32px] px-6 pb-8 pt-4 max-h-[85vh] overflow-y-auto">
          {/* Handle bar */}
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Header with icon */}
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">🎨</div>
            <h2 className="text-2xl font-semibold text-gray-900">AI Image Generator</h2>
          </div>

          {/* Description */}
          <p className="text-base text-gray-600 mb-6 leading-relaxed">
            Describe the image you want to create. You can optionally upload a reference image.
          </p>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-red-800 font-medium">Generation failed</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="mt-2 text-red-700 underline text-sm disabled:opacity-50"
              >
                Retry
              </button>
            </div>
          )}

          {generatedImageUrl && (
            <div className="mb-6">
              <div className="bg-[#F5F5F7] rounded-2xl p-3">
                <img
                  src={generatedImageUrl}
                  alt="Generated"
                  className="w-full rounded-xl object-contain bg-white"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <a
                  href={generatedImageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-[#1a1d2e] hover:bg-[#2d3b6e] transition-colors text-white py-3 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
                <button
                  onClick={() => {
                    setGeneratedImageUrl(null);
                    setError(null);
                  }}
                  className="flex-1 bg-[#F5F5F7] hover:bg-gray-200 transition-colors text-gray-900 py-3 rounded-2xl font-semibold text-base active:scale-95"
                >
                  Generate Another
                </button>
              </div>
            </div>
          )}

          {/* Reference Image Upload */}
          <div className="mb-4">
            <label
              htmlFor="image-upload"
              className={`flex items-center gap-4 bg-[#F5F5F7] rounded-2xl p-5 cursor-pointer hover:bg-gray-200 transition-colors ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
              </div>
              <span className="text-base text-gray-600">Add reference image (optional)</span>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-3 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Reference"
                  className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setReferenceImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white" strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>

          {/* Description Input */}
          <div className="mb-6">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the image you want to create..."
              disabled={isLoading}
              className="w-full h-40 bg-[#F5F5F7] rounded-2xl p-5 text-base text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all disabled:opacity-60"
            />
          </div>

          {/* Continue Button */}
          <button
            onClick={handleGenerate}
            disabled={!canSubmit}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl text-base font-medium hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </span>
            ) : (
              'Generate Image'
            )}
          </button>

          <button
            onClick={reset}
            className="w-full mt-3 text-sm text-gray-600 hover:text-gray-900 underline"
            type="button"
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
}