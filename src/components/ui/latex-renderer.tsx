'use client';

import { useMemo } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface LatexRendererProps {
    content: string;
    className?: string;
}

/**
 * LatexRenderer component that renders text with embedded LaTeX formulas.
 * 
 * Supports:
 * - Inline math: $formula$ or \(formula\)
 * - Block math: $$formula$$ or \[formula\]
 * 
 * Example:
 * "The equation $E = mc^2$ is famous." will render with the formula styled.
 */
export function LatexRenderer({ content, className = '' }: LatexRendererProps) {
    const renderedContent = useMemo(() => {
        if (!content) return null;

        // Split content by LaTeX delimiters
        // Match: $$...$$ (block), $...$ (inline), \[...\] (block), \(...\) (inline)
        const parts: { type: 'text' | 'inline' | 'block'; content: string }[] = [];

        // Regex to match all LaTeX patterns
        const latexRegex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\))/g;

        let lastIndex = 0;
        let match;

        while ((match = latexRegex.exec(content)) !== null) {
            // Add text before the match
            if (match.index > lastIndex) {
                parts.push({
                    type: 'text',
                    content: content.slice(lastIndex, match.index)
                });
            }

            const matchedStr = match[0];
            let formula: string;
            let type: 'inline' | 'block';

            if (matchedStr.startsWith('$$') && matchedStr.endsWith('$$')) {
                // Block math with $$
                formula = matchedStr.slice(2, -2).trim();
                type = 'block';
            } else if (matchedStr.startsWith('\\[') && matchedStr.endsWith('\\]')) {
                // Block math with \[ \]
                formula = matchedStr.slice(2, -2).trim();
                type = 'block';
            } else if (matchedStr.startsWith('\\(') && matchedStr.endsWith('\\)')) {
                // Inline math with \( \)
                formula = matchedStr.slice(2, -2).trim();
                type = 'inline';
            } else {
                // Inline math with $
                formula = matchedStr.slice(1, -1).trim();
                type = 'inline';
            }

            parts.push({ type, content: formula });
            lastIndex = match.index + matchedStr.length;
        }

        // Add remaining text
        if (lastIndex < content.length) {
            parts.push({
                type: 'text',
                content: content.slice(lastIndex)
            });
        }

        return parts.map((part, index) => {
            if (part.type === 'text') {
                return <span key={index}>{part.content}</span>;
            } else if (part.type === 'inline') {
                try {
                    return <InlineMath key={index} math={part.content} />;
                } catch (error) {
                    console.error('LaTeX parsing error:', error);
                    return <span key={index} className="text-red-500 font-mono text-sm">{`$${part.content}$`}</span>;
                }
            } else {
                try {
                    return (
                        <div key={index} className="my-4 overflow-x-auto">
                            <BlockMath math={part.content} />
                        </div>
                    );
                } catch (error) {
                    console.error('LaTeX parsing error:', error);
                    return <div key={index} className="text-red-500 font-mono text-sm my-2">{`$$${part.content}$$`}</div>;
                }
            }
        });
    }, [content]);

    return <div className={className}>{renderedContent}</div>;
}

export default LatexRenderer;
