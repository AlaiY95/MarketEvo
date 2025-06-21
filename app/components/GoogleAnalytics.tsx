// app/components/GoogleAnalytics.tsx
import Script from 'next/script'

const GoogleAnalytics: React.FC = () => {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID

  // Debug logging
  // console.log('🔍 GoogleAnalytics component loaded')
  // console.log('🔍 GA_TRACKING_ID:', GA_TRACKING_ID)

  if (!GA_TRACKING_ID) {
    // console.log('❌ No GA_TRACKING_ID found, component not rendering')
    return null
  }

  // console.log('✅ Rendering GA scripts for ID:', GA_TRACKING_ID)

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
            // console.log('📊 GA config executed for ${GA_TRACKING_ID}');
          `,
        }}
      />
    </>
  )
}

export default GoogleAnalytics