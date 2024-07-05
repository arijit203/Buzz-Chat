import React, { useState } from 'react';
import ImageModal from './modals/ImageModal';


interface ImageComponentProps {
  src: string;
  alt: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ src, alt }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const handleMediaClick = () => {
    setImageModalOpen(true);
    window.open(src, '_blank'); // Opens image in a new tab
  };

  return (
    <div className="relative">
      <img
        alt={alt}
        src={src}
        className="object-cover cursor-pointer hover:scale-110 transition duration-300"
        onClick={handleMediaClick}
        style={{ width: '288px', height: '288px' }} // Customize as needed
      />
      <ImageModal src={src} isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} />
    </div>
  );
};

export default ImageComponent;
