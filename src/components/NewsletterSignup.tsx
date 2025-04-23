import React, { useState } from 'react';

const NewsletterSignup: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString(),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage('Oops! Something went wrong. Please try again.');
        console.error('Form submission error:', response);
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="w-full bg-gray-800 dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-medium text-gray-100 dark:text-white">Subscribe to our Newsletter</h2>
          <p className="text-sm text-gray-200 dark:text-gray-300">
            {status !== 'success' 
              ? 'Stay updated with our latest posts and news.'
              : 'Thanks for subscribing!'
            }
          </p>
        </div>
      </div>

      {status !== 'success' && (
        <form
          name="newsletter"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          {/* Hidden inputs for Netlify */}
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
              disabled={status === 'submitting'}
              className="flex-1 rounded-md border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-sm px-4 py-2 disabled:opacity-50"
            />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Your email"
              required
              disabled={status === 'submitting'}
              className="flex-1 rounded-md border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-sm px-4 py-2 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="whitespace-nowrap px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-500 disabled:opacity-50"
          >
            {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="mt-3 text-sm text-red-500 dark:text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default NewsletterSignup; 