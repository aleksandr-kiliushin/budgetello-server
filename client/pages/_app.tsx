import React from 'react'

// components
import Layout from '#components/layout'

// styles
import '#styles/globals.css'

// types
import type { AppProps } from 'next/app'

const MyApp = ({ Component, pageProps }: AppProps) => {
	return (
		<Layout>
			<Component {...pageProps} />
		</Layout>
	)
}
export default MyApp
