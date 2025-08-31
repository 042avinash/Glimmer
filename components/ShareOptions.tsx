import React, { useState, useCallback } from 'react';
import type { SavedQuote } from '../types';

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 16 16">
        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
    </svg>
);

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 16 16">
        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0 0 3.603 0 8.049c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
    </svg>
);

export const ShareOptions: React.FC<{ quote: SavedQuote }> = ({ quote }) => {
    const [copyStatus, setCopyStatus] = useState<'idle' | 'link' | 'bbcode'>('idle');

    const shareableData = btoa(JSON.stringify({
        quote: quote.quote,
        source: quote.source,
        imageUrl: quote.imageUrl,
        fontClass: quote.fontClass,
    }));
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?quote=${shareableData}`;
    const bbCode = `[IMG]${quote.imageUrl}[/IMG]`;

    const handleCopy = useCallback((type: 'link' | 'bbcode') => {
        const textToCopy = type === 'bbcode' ? bbCode : shareUrl;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopyStatus(type);
            setTimeout(() => setCopyStatus('idle'), 2500);
        });
    }, [shareUrl, bbCode]);
    
    const tweetText = encodeURIComponent(`Check out this quote I generated: "${quote.quote}"`);
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${tweetText}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

    const openShareWindow = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
    };

    return (
        <div className="mt-2 p-3 bg-gray-900 rounded-md space-y-3">
            <div className="grid grid-cols-2 gap-2">
                <button onClick={() => openShareWindow(twitterUrl)} className="flex items-center justify-center gap-2 w-full text-xs bg-gray-800 hover:bg-black text-white font-semibold py-2 px-3 rounded transition-colors">
                    <XIcon />
                    Share on X
                </button>
                 <button onClick={() => openShareWindow(facebookUrl)} className="flex items-center justify-center gap-2 w-full text-xs bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold py-2 px-3 rounded transition-colors">
                    <FacebookIcon />
                    Share
                </button>
            </div>
            <div>
                 <button onClick={() => handleCopy('link')} className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded transition-colors">
                    {copyStatus === 'link' ? 'Link Copied!' : 'Copy Link'}
                </button>
            </div>
            <div>
                 <button onClick={() => handleCopy('bbcode')} className="w-full text-xs bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-3 rounded transition-colors">
                    {copyStatus === 'bbcode' ? 'BBCode Copied!' : 'Copy Image BBCode'}
                </button>
                <p className="text-xs text-center text-gray-500 mt-1">For forums. May not be supported everywhere.</p>
            </div>
        </div>
    );
};
