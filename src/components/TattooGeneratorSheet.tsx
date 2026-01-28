import { useState, useMemo } from 'react';
import { Image as ImageIcon, X, Loader2, Download, AlertCircle } from 'lucide-react';
import { generateImage } from '../services/openRouter';
import { uploadFileToStorage } from '../services/storageUpload';
import { getCurrentUserId } from '../utils/user';

interface TattooGeneratorSheetProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  onProClick?: () => void;
}

export function TattooGeneratorSheet({ isOpen, onClose, isPro, onProClick }: TattooGeneratorSheetProps) {
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedTattooUrl, setGeneratedTattooUrl] = useState<string | null>(null);

  const canSubmit = useMemo(() => text.trim().length > 0 && !isLoading, [text, isLoading]);

  if (!isOpen) return null;

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
    setText('');
    setReferenceImage(null);
    setImagePreview(null);
    setIsLoading(false);
    setError(null);
    setGeneratedTattooUrl(null);
  };

  const handleGenerate = async () => {
    if (!canSubmit) return;

    // Check Pro status
    // TODO: 恢复Pro检查 - 临时注释掉以便测试
    // if (!isPro) {
    //   onClose();
    //   if (onProClick) {
    //     setTimeout(() => onProClick(), 300);
    //   }
    //   return;
    // }

    setIsLoading(true);
    setError(null);
    setGeneratedTattooUrl(null);

    try {
      let referenceImageUrl: string | undefined;
      if (referenceImage) {
        referenceImageUrl = await uploadFileToStorage({
          file: referenceImage,
          path: `tattoo-refs/current-user/${Date.now()}_${referenceImage.name}`,
        });
      }

      // Enhance prompt for tattoo generation
      const enhancedPrompt = referenceImageUrl
        ? `Tattoo design: ${text.trim()}. Style reference: ${referenceImageUrl}. Create a tattoo-style artwork with clean lines, bold contrast, and suitable for skin art.`
        : `Tattoo design: ${text.trim()}. Create a tattoo-style artwork with clean lines, bold contrast, and suitable for skin art.`;

      const res = await generateImage({
        prompt: enhancedPrompt,
        referenceImageUrl,
        userId: getCurrentUserId(),
        isPro: true,
      });

      if (!res.success || !res.imageUrl) {
        throw new Error(res.error || 'Something went wrong. Please try again.');
      }

      setGeneratedTattooUrl(res.imageUrl);
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

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
        <div className="bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto">
          {/* Handle Bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Content */}
          <div className="px-6 pb-8 pt-4">
            {/* Icon and Title */}
            <div className="flex items-center gap-3 mb-4">
              <div className="text-5xl">🦋</div>
              <h2 className="text-2xl font-bold text-gray-900">Tattoo Generator</h2>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Create unique tattoo designs with AI. Describe your tattoo idea and optionally upload a reference image.
            </p>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div className="flex-1">
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
              </div>
            )}

            {generatedTattooUrl && (
              <div className="mb-6">
                <div className="bg-[#F5F5F7] rounded-2xl p-3">
                  <img
                    src={generatedTattooUrl}
                    alt="Generated Tattoo"
                    className="w-full rounded-xl object-contain bg-white"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <a
                    href={generatedTattooUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="flex-1 bg-[#1a1d2e] hover:bg-[#2d3b6e] transition-colors text-white py-3 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                  <button
                    onClick={() => {
                      setGeneratedTattooUrl(null);
                      setError(null);
                    }}
                    className="flex-1 bg-[#F5F5F7] hover:bg-gray-200 transition-colors text-gray-900 py-3 rounded-2xl font-semibold text-base active:scale-95"
                  >
                    Generate Another
                  </button>
                </div>
              </div>
            )}

            {/* Reference Image Upload - Now First */}
            <div className="mb-4">
              <label
                htmlFor="tattoo-reference-image"
                className="flex items-center gap-4 bg-[#F5F5F7] rounded-2xl p-5 cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                </div>
                <span className="text-base text-gray-600">Add Reference Image (Optional)</span>
                <input
                  id="tattoo-reference-image"
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
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe your tattoo idea..."
                disabled={isLoading}
                className="w-full h-40 bg-[#F5F5F7] rounded-2xl p-5 text-base text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all disabled:opacity-60"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!canSubmit}
              className="w-full bg-[#1a1d2e] hover:bg-[#2d3b6e] transition-colors text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating your tattoo...
                </span>
              ) : (
                'Generate Tattoo'
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

          {/* Bottom Safe Area */}
          <div className="h-8" />
        </div>
      </div>
    </>
  );
}