import React from 'react';
import { Link } from 'gatsby';

interface TopicProps {
  tag: string;
  isActive?: boolean;
  className?: string;
  count?: number;
}

const Topic: React.FC<TopicProps> = ({ tag, isActive = false, className = '', count }) => {
  const normalizedTag = tag.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <Link
      to={`/tags/${normalizedTag}`}
      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
        isActive
          ? 'bg-gray-900 dark:bg-gray-700 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      } ${className}`}
    >
      {tag}
      {count !== undefined && (
        <span className="ml-1 text-gray-500 dark:text-gray-400">({count})</span>
      )}
    </Link>
  );
};

export default Topic; 