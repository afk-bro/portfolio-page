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
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px 80px',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            marginBottom: 20,
            background: 'linear-gradient(90deg, #22d3ee 0%, #2dd4bf 100%)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Full-Stack Developer
        </div>
        <div
          style={{
            fontSize: 36,
            color: '#94a3b8',
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
