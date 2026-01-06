import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Portfolio | Full-Stack Developer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #054672 0%, #0f4e79 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f4d390',
          padding: '40px 80px',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            marginBottom: 20,
            background: 'linear-gradient(90deg, #e79b47 0%, #cd7931 100%)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Full-Stack Developer
        </div>
        <div
          style={{
            fontSize: 36,
            color: '#68748a',
            textAlign: 'center',
          }}
        >
          Building exceptional digital experiences
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
