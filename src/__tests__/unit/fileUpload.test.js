import { describe, it, expect, vi } from 'vitest';
import { validateFile, isImage, isVideo } from '../../utils/fileUpload';

describe('fileUpload utils', () => {
  describe('validateFile', () => {
    it('should accept valid image files under size limit', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
      
      expect(() => validateFile(file)).not.toThrow();
    });

    it('should accept valid video files under size limit', () => {
      const file = new File(['test'], 'test.mp4', { type: 'video/mp4' });
      Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 }); // 10MB
      
      expect(() => validateFile(file)).not.toThrow();
    });

    it('should reject files over 50MB', () => {
      const file = new File(['test'], 'large.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 51 * 1024 * 1024 }); // 51MB
      
      expect(() => validateFile(file)).toThrow('File size exceeds 50MB limit');
    });

    it('should reject unsupported file types', () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB
      
      expect(() => validateFile(file)).toThrow('File type not supported');
    });

    it('should accept all supported image formats', () => {
      const formats = [
        { name: 'test.jpg', type: 'image/jpeg' },
        { name: 'test.png', type: 'image/png' },
        { name: 'test.gif', type: 'image/gif' },
        { name: 'test.webp', type: 'image/webp' },
      ];

      formats.forEach(({ name, type }) => {
        const file = new File(['test'], name, { type });
        Object.defineProperty(file, 'size', { value: 1024 * 1024 });
        expect(() => validateFile(file)).not.toThrow();
      });
    });

    it('should accept all supported video formats', () => {
      const formats = [
        { name: 'test.mp4', type: 'video/mp4' },
        { name: 'test.webm', type: 'video/webm' },
        { name: 'test.mov', type: 'video/quicktime' },
      ];

      formats.forEach(({ name, type }) => {
        const file = new File(['test'], name, { type });
        Object.defineProperty(file, 'size', { value: 1024 * 1024 });
        expect(() => validateFile(file)).not.toThrow();
      });
    });
  });

  describe('isImage', () => {
    it('should return true for image MIME types', () => {
      expect(isImage('image/jpeg')).toBe(true);
      expect(isImage('image/png')).toBe(true);
      expect(isImage('image/gif')).toBe(true);
      expect(isImage('image/webp')).toBe(true);
    });

    it('should return false for non-image MIME types', () => {
      expect(isImage('video/mp4')).toBe(false);
      expect(isImage('application/pdf')).toBe(false);
      expect(isImage('text/plain')).toBe(false);
    });
  });

  describe('isVideo', () => {
    it('should return true for video MIME types', () => {
      expect(isVideo('video/mp4')).toBe(true);
      expect(isVideo('video/webm')).toBe(true);
      expect(isVideo('video/quicktime')).toBe(true);
    });

    it('should return false for non-video MIME types', () => {
      expect(isVideo('image/jpeg')).toBe(false);
      expect(isVideo('application/pdf')).toBe(false);
      expect(isVideo('text/plain')).toBe(false);
    });
  });
});
