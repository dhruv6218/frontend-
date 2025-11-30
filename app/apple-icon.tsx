// Never use @iconify/react inside this file.
import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

// Image metadata
export const size = {
  width: 180,
  height: 180
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(

    <div data-editor-id="app/apple-icon.tsx:15:7"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#0F172A',
        borderRadius: 28,
        padding: 16
      }}>

      <img data-editor-id="app/apple-icon.tsx:22:9"
        src="https://storage.googleapis.com/cosmic-project-image-assets/images/8426010c-1c72-441b-bf23-ae13286849ff/WhatsApp_Image_2025-07-25_at_14.54.52_6feab416.jpg"
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          borderRadius: 16
        }} />

    </div>,

    {
      ...size
    }
  );
}