import React from 'react';

const ImageBlock = ({ data }) => {
  if (!data || !data.file?.url) return null;

  const { url, name } = data.file;
  const caption = data.caption || name || '';
  const withBorder = data.withBorder;
  const withBackground = data.withBackground;
  const stretched = data.stretched;

  return (
    <figure className={`my-6 ${withBackground ? 'bg-gray-50 p-4 rounded-xl' : ''}`}>
      <div className={`${stretched ? 'w-full' : 'max-w-2xl mx-auto'}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={caption}
          className={`w-full h-auto rounded-lg object-cover ${withBorder ? 'border border-gray-200' : ''}`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-center text-gray-400 italic">{caption}</figcaption>
      )}
    </figure>
  );
};

export default ImageBlock;
