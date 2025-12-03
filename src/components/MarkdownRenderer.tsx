// src/components/MarkdownRenderer.tsx
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderMarkdown = (text: string): string => {
    let html = text;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-white mt-6 mb-3">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mt-8 mb-4">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mt-8 mb-4">$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-purple-400">$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong class="font-bold text-purple-400">$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>');
    html = html.replace(/_(.*?)_/g, '<em class="italic text-gray-300">$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:text-purple-300 underline">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4 border border-purple-500/30" />');

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-slate-950 rounded-lg p-4 my-4 overflow-x-auto border border-purple-500/30"><code class="text-sm text-gray-300">$2</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-950 px-2 py-1 rounded text-purple-400 text-sm">$1</code>');

    // Lists
    html = html.replace(/^\* (.+)$/gim, '<li class="ml-6 mb-2 text-gray-300 list-disc">$1</li>');
    html = html.replace(/^- (.+)$/gim, '<li class="ml-6 mb-2 text-gray-300 list-disc">$1</li>');
    html = html.replace(/^\d+\. (.+)$/gim, '<li class="ml-6 mb-2 text-gray-300 list-decimal">$1</li>');

    // Wrap consecutive list items in ul/ol
    html = html.replace(/(<li class="ml-6 mb-2 text-gray-300 list-disc">.*?<\/li>\n?)+/g, '<ul class="my-4">$&</ul>');
    html = html.replace(/(<li class="ml-6 mb-2 text-gray-300 list-decimal">.*?<\/li>\n?)+/g, '<ol class="my-4">$&</ol>');

    // Blockquotes
    html = html.replace(/^> (.+)$/gim, '<blockquote class="border-l-4 border-purple-500 pl-4 py-2 my-4 text-gray-400 italic">$1</blockquote>');

    // Horizontal rules
    html = html.replace(/^---$/gim, '<hr class="my-6 border-purple-500/30" />');

    // Line breaks
    html = html.replace(/\n\n/g, '</p><p class="text-gray-300 mb-4">');
    html = '<p class="text-gray-300 mb-4">' + html + '</p>';

    return html;
  };

  return (
    <div 
      className="prose prose-invert prose-purple max-w-none"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

export default MarkdownRenderer;