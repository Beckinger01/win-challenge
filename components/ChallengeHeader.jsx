'use client';

export default function ChallengeHeader({
    title,
    isConnected,
    onToggleView,
    viewLabel = 'Presentation view',
    showOverlayButton = false,
    publicUrl,
    overlayUrl,
    className = '',
}) {
    return (
        <div className={`flex flex-col sm:flex-row justify-between items-center px-4 py-3 gap-2 ${className}`}>
            <h1 className="text-xl sm:text-2xl font-bold gold-shimmer-text truncate max-w-[200px] sm:max-w-none">
                {title}
            </h1>

            <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
                <button
                    onClick={onToggleView}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs sm:text-sm rounded transition duration-300"
                >
                    {viewLabel}
                </button>

                {publicUrl && (
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(publicUrl);
                            alert('Public view link copied');
                        }}
                        className="px-2 py-1 gold-bg text-black text-xs sm:text-sm rounded transition duration-300"
                    >
                        Copy View Link
                    </button>
                )}

                {showOverlayButton && overlayUrl && (
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(overlayUrl);
                            alert('BrowserSource Overlay copied');
                        }}
                        className="px-2 py-1 gold-bg text-black text-xs sm:text-sm rounded transition duration-300"
                    >
                        Copy Stream Overlay
                    </button>
                )}
            </div>
        </div>
    );
}