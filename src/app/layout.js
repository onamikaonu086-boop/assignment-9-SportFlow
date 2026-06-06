import Navbar from "@/components/Shared/Navbar";
import "./globals.css";
import Footer from "@/components/Shared/Footer";
import ClientProviders from "@/components/ClientProviders";

export const metadata = {
  title: "SportFlow – Sports Facility Booking",
  description: "Book football turfs, badminton courts, swimming pools and more with SportFlow.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('theme') || 'light';
                document.documentElement.setAttribute('data-theme', t);
                document.documentElement.classList.toggle('dark', t === 'dark');
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ClientProviders>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
