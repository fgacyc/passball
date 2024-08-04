/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";

import "@/styles/globals.css";
import { FirebaseAppProvider } from "reactfire";
import { firebaseConfig } from "@/lib/FirebaseConfig";
import { FirebaseProps } from "@/lib/firebaseProps";
import { female, male } from "@/data/players";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={GeistSans.className}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <FirebaseProps>
          <main className="min-h-screen w-full overflow-hidden bg-[url('/assets/bg.png')] bg-cover bg-center py-20">
            <img
              className="fixed left-0 top-0 z-[10] object-contain"
              src="/assets/top_left.png"
            />
            <img
              className="fixed bottom-0 right-0 z-[10] w-[100px] object-contain mix-blend-screen"
              src="/assets/bottom_right.png"
            />
            <Component {...pageProps} />
            {male.map((pax, i) => (
              <img
                className="absolute left-0 top-0 max-h-px min-h-px min-w-px max-w-px"
                key={i}
                src={`assets/male/${pax.img}.png`}
              />
            ))}
            {female.map((pax, i) => (
              <img
                className="absolute left-0 top-0 max-h-px min-h-px min-w-px max-w-px"
                key={i}
                src={`assets/female/${pax.img}.png`}
              />
            ))}
          </main>
        </FirebaseProps>
      </FirebaseAppProvider>
    </div>
  );
};

export default MyApp;
