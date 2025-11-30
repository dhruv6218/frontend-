// Never use @iconify/react inside this file.
import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

export const size = {
  width: 64,
  height: 64
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(

    <div data-editor-id="app/icon.tsx:13:7"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#0F172A',
        borderRadius: 12,
        padding: 8
      }}>

      <img data-editor-id="app/icon.tsx:20:9"
        src="https://storage.googleapis.com/cosmic-project-image-assets/images/8426010c-1c72-441b-bf23-ae13286849ff/WhatsApp_Image_2025-07-25_at_14.54.52_6feab416.jpg"
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          borderRadius: 8
        }} />

    </div>,

    {
      ...size
    }
  );
}