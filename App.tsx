import React, { useState, useEffect, useCallback } from 'react';
import { generateWikiEntry, generateInitialEntry, Language } from './services/geminiService';
import ClickableText from './components/ClickableText';

const Loader: React.FC = () => (
    <div className="text-gray-500 text-3xl">
        <span className="animate-pulse">.</span>
        <span className="animate-pulse" style={{ animationDelay: '75ms' }}>.</span>
        <span className="animate-pulse" style={{ animationDelay: '150ms' }}>.</span>
    </div>
);

interface BreadcrumbProps {
    history: string[];
    onNavigate: (index: number) => void;
    rootText: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ history, onNavigate, rootText }) => {
    if (history.length <= 1) return null;

    return (
        <div className="text-sm text-gray-500 mb-8 flex flex-wrap items-center justify-center gap-2">
            <span 
                className="cursor-pointer hover:text-gray-300 transition-colors"
                onClick={() => onNavigate(0)}
            >
                {rootText}
            </span>
            {history.slice(1).map((item, index) => (
                <React.Fragment key={index}>
                    <span>/</span>
                    <span 
                        className="cursor-pointer hover:text-gray-300 transition-colors"
                        onClick={() => onNavigate(index + 1)}
                    >
                        {item}
                    </span>
                </React.Fragment>
            ))}
        </div>
    );
};

const uiText = {
    zh: {
        title: '无限维基',
        rootBreadcrumb: '无限',
        footer: '每一次点击，都生成一个新的现实。',
        langToggle: 'EN'
    },
    en: {
        title: 'INFINITY WIKI',
        rootBreadcrumb: 'Infinity',
        footer: 'A new reality generated with every click.',
        langToggle: '中文'
    }
};

const App: React.FC = () => {
    const [language, setLanguage] = useState<Language>('zh');
    const [wikiContent, setWikiContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [history, setHistory] = useState<string[]>([uiText.zh.rootBreadcrumb]);
    const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
    const [contentId, setContentId] = useState<number>(0);

    const loadInitialContent = useCallback(async (lang: Language) => {
        setIsLoading(true);
        setWikiContent('');
        const initialContent = await generateInitialEntry(lang);
        setWikiContent(initialContent);
        setIsLoading(false);
        setContentId(id => id + 1);
    }, []);

    useEffect(() => {
        setHistory([uiText[language].rootBreadcrumb]);
        loadInitialContent(language);
    }, [language, loadInitialContent]);

    const handleWordClick = useCallback((word: string) => {
        if (isLoading) return;

        setIsFadingOut(true);

        setTimeout(async () => {
            setHistory(prev => [...prev, word]);
            setIsLoading(true);
            setWikiContent('');
            
            const newContent = await generateWikiEntry(word, language);
            
            setWikiContent(newContent);
            setIsLoading(false);
            setIsFadingOut(false);
            setContentId(id => id + 1);
        }, 500);
    }, [isLoading, language]);

    const handleBreadcrumbNavigate = useCallback((index: number) => {
        if (isLoading || index === history.length - 1) return;

        setIsFadingOut(true);

        setTimeout(async () => {
            const targetWord = history[index];
            const newHistory = history.slice(0, index + 1);
            setHistory(newHistory);

            setIsLoading(true);
            setWikiContent('');

            const newContent = targetWord === uiText[language].rootBreadcrumb
                ? await generateInitialEntry(language) 
                : await generateWikiEntry(targetWord, language);

            setWikiContent(newContent);
            setIsLoading(false);
            setIsFadingOut(false);
            setContentId(id => id + 1);
        }, 500);
    }, [history, isLoading, language]);

    const toggleLanguage = () => {
        setIsFadingOut(true);
        setTimeout(() => {
            setLanguage(prev => (prev === 'zh' ? 'en' : 'zh'));
            setIsFadingOut(false);
        }, 500);
    };

    return (
        <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center p-4 sm:p-8 font-serif">
            <div className="w-full max-w-3xl flex flex-col items-center text-center">
                <header className="mb-12">
                    <h1 className="text-5xl md:text-6xl font-thin tracking-widest text-gray-400">
                        {uiText[language].title}
                    </h1>
                </header>
                
                <nav className="h-10 flex items-center justify-center">
                   <Breadcrumb 
                        history={history} 
                        onNavigate={handleBreadcrumbNavigate}
                        rootText={uiText[language].rootBreadcrumb}
                   />
                </nav>

                <main className="min-h-[200px] flex items-center justify-center w-full">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <ClickableText
                            key={contentId}
                            text={wikiContent}
                            onWordClick={handleWordClick}
                            isFadingOut={isFadingOut}
                        />
                    )}
                </main>
            </div>
             <footer className="absolute bottom-4 text-xs text-gray-700 flex items-center gap-4">
                <span>{uiText[language].footer}</span>
                <button 
                    onClick={toggleLanguage} 
                    className="border border-gray-700 px-2 py-0.5 rounded-sm hover:border-gray-500 hover:text-gray-500 transition-colors"
                >
                    {uiText[language].langToggle}
                </button>
            </footer>
        </div>
    );
};

export default App;