import React from 'react';
import Modal from './Modal';

interface ImageModalProps {
  src: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="flex justify-center items-center">
        <img
          src={src}
          alt="Full Size"
          className="object-cover max-w-full max-h-full"
          style={{ maxWidth: '100%', maxHeight: '80vh' }}
        />
      </div>
    </Modal>
  );
};

export default ImageModal;
