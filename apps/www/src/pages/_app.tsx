import Head from 'next/head'
import { Router, useRouter } from 'next/router'

import { Layout } from '../components/Layout'

import { useMobileNavigationStore } from '../components/MobileNavigation'

import '../styles/tailwind.css'
import 'focus-visible'

function onRouteChange() {
  // @ts-expect-error
  useMobileNavigationStore.getState().close()
}

Router.events.on('routeChangeStart', onRouteChange)
Router.events.on('hashChangeStart', onRouteChange)

export default function App({ Component, pageProps }) {
  let router = useRouter()

  return (
    <>
      <Head>
        {router.pathname === '/' ? (
          <title>Protocol API Reference</title>
        ) : (
          <title>{`${pageProps.title} - Protocol API Reference`}</title>
        )}
        <meta name="description" content={pageProps.description} />
      </Head>

      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
