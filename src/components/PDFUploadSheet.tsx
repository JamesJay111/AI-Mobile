import { useState } from 'react';
import { FileText, Upload } from 'lucide-react';

interface PDFUploadSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (file: File) => void;
}

export function PDFUploadSheet({ isOpen, onClose, onContinue }: PDFUploadSheetProps) {
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleContinue = () => {
    if (file) {
      onContinue(file);
      setFile(null);
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
              <div className="text-5xl">📄</div>
              <h2 className="text-2xl font-bold text-gray-900">Upload PDF</h2>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              You can ask questions about or search any content in the file, or let GemGPT summarize it.
            </p>

            {/* File Upload Area */}
            <label className="block mb-6">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="bg-gray-100 hover:bg-gray-200 transition-colors rounded-2xl p-6 cursor-pointer flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Upload className="w-6 h-6 text-gray-600" />
                </div>
                <span className="text-gray-700 text-base">
                  {file ? file.name : 'Add your file'}
                </span>
              </div>
            </label>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!file}
              className="w-full bg-[#1a1d2e] hover:bg-[#2d3b6e] transition-colors text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
            >
              Continue
            </button>
          </div>

          {/* Bottom Safe Area */}
          <div className="h-8" />
        </div>
      </div>
    </>
  );
}