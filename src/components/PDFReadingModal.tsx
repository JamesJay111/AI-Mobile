import { useMemo, useState } from 'react';
import { X, Upload, Loader2, AlertCircle } from 'lucide-react';
import { uploadFileToStorage } from '../services/storageUpload';
import { readPDF } from '../services/openRouter';
import { getCurrentUserId } from '../utils/user';

interface PDFReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  onProClick?: () => void;
}

export function PDFReadingModal({ isOpen, onClose, isPro, onProClick }: PDFReadingModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState<string | null>(null);

  const canAnalyze = useMemo(
    () => !!file && question.trim().length > 0 && !isLoading,
    [file, question, isLoading]
  );

  if (!isOpen) return null;

  const reset = () => {
    setFile(null);
    setQuestion('');
    setIsLoading(false);
    setError(null);
    setAnswer(null);
    setUploadedPdfUrl(null);
  };

  const handleClose = () => {
    onClose();
    // keep state by default for smoother UX
  };

  const handleUpload = async (): Promise<string> => {
    if (!file) throw new Error('Please choose a PDF first.');
    const url = await uploadFileToStorage({
      file,
      path: `pdfs/current-user/${Date.now()}_${file.name}`,
    });
    setUploadedPdfUrl(url);
    return url;
  };

  const handleAnalyze = async () => {
    if (!canAnalyze) return;

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
    setAnswer(null);

    try {
      const pdfUrl = uploadedPdfUrl ?? (await handleUpload());
      const res = await readPDF({
        pdfUrl,
        question: question.trim(),
        userId: getCurrentUserId(),
        isPro: true,
      });

      if (!res.success || !res.answer) {
        throw new Error(res.error || 'Something went wrong. Please try again.');
      }

      setAnswer(res.answer);
    } catch (e: any) {
      setError(e?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 transition-opacity" onClick={handleClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div className="bg-white rounded-t-[32px] px-6 pb-8 pt-4 max-h-[85vh] overflow-y-auto">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">📄</div>
            <h2 className="text-2xl font-semibold text-gray-900">PDF Reading</h2>
          </div>

          <p className="text-base text-gray-600 mb-6 leading-relaxed">
            Upload a PDF and ask a question. GemGPT will analyze the document and respond.
          </p>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="mt-2 text-red-700 underline text-sm disabled:opacity-50"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          <label className="block mb-4">
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f);
                setUploadedPdfUrl(null);
                setAnswer(null);
                setError(null);
              }}
              disabled={isLoading}
            />

            <div
              className={`bg-[#F5F5F7] hover:bg-gray-200 transition-colors rounded-2xl p-5 cursor-pointer flex items-center gap-4 ${
                isLoading ? 'opacity-60 pointer-events-none' : ''
              }`}
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Upload className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-medium truncate">
                  {file ? file.name : 'Choose a PDF file'}
                </p>
                {file && (
                  <p className="text-gray-500 text-sm">
                    {Math.max(1, Math.round(file.size / 1024))} KB
                  </p>
                )}
              </div>
            </div>
          </label>

          <div className="mb-6">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to know about this PDF?"
              disabled={isLoading}
              className="w-full h-32 bg-[#F5F5F7] rounded-2xl p-5 text-base text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all disabled:opacity-60"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl text-base font-medium hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Reading PDF...
              </span>
            ) : (
              'Analyze PDF'
            )}
          </button>

          {answer && (
            <div className="mt-6">
              <div className="bg-[#F5F5F7] rounded-2xl p-5">
                <p className="text-sm font-semibold text-gray-900 mb-2">Answer</p>
                <p className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {answer}
                </p>
              </div>
              <button
                onClick={() => {
                  setAnswer(null);
                  setError(null);
                  setQuestion('');
                }}
                className="w-full mt-3 bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-gray-900 py-3 rounded-2xl font-semibold text-base active:scale-95"
              >
                Ask Another Question
              </button>
            </div>
          )}

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

