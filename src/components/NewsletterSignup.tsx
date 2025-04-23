import React from 'react';

const NewsletterSignup: React.FC = () => {
  return (
    <div className="w-full bg-gray-800 dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-medium text-gray-100 dark:text-white">Subscribe to our Newsletter</h2>
          <p className="text-sm text-gray-200 dark:text-gray-300">
            Stay updated with our latest posts and news.
          </p>
        </div>
      </div>
      <form
        name="newsletter"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        className="flex flex-col sm:flex-row gap-3"
      >
        <input type="hidden" name="form-name" value="newsletter" />
        <div className="hidden">
          <input name="bot-field" />
        </div>
        
        <div className="flex-1 flex gap-3">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Your name"
            required
            className="flex-1 rounded-md border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-sm px-4 py-2"
          />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Your email"
            required
            className="flex-1 rounded-md border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-sm px-4 py-2"
          />
        </div>

        <button
          type="submit"
          className="whitespace-nowrap px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-500"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsletterSignup; 