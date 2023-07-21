import type { AppProps } from 'next/app';

import '@/styles/globals.css';
import 'toastr/build/toastr.min.css';

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
