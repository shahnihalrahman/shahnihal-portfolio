import { ImageResponse } from 'next/og';

import { site } from '@/lib/site';

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Generated at build time so there is no binary image asset to optimise,
 * compress or keep in sync with the copy.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#04060B',
          backgroundImage:
            'radial-gradient(900px 500px at 78% 12%, rgba(62,224,242,0.16), transparent 62%), radial-gradient(760px 460px at 8% 96%, rgba(169,140,255,0.14), transparent 60%)',
          color: '#E9EDF6',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: '#3EE0F2',
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: '#7C879E',
            }}
          >
            Applied AI · Digital Products
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div
            style={{
              fontSize: 92,
              lineHeight: 1.02,
              letterSpacing: -3.5,
              fontWeight: 700,
              maxWidth: 940,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              fontSize: 40,
              lineHeight: 1.2,
              letterSpacing: -1,
              color: '#B4BDD0',
              maxWidth: 900,
            }}
          >
            Applied AI &amp; Digital Product Builder
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.10)',
            paddingTop: 28,
            fontSize: 24,
            color: '#7C879E',
          }}
        >
          <div style={{ display: 'flex', gap: 26 }}>
            <span>Build</span>
            <span style={{ color: '#2C3442' }}>/</span>
            <span>Design</span>
            <span style={{ color: '#2C3442' }}>/</span>
            <span>Automate</span>
            <span style={{ color: '#2C3442' }}>/</span>
            <span>Deploy</span>
          </div>
          <div>India · Open to UAE / Gulf</div>
        </div>
      </div>
    ),
    size,
  );
}
