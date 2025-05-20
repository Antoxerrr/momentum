import BaseLayout from "./base.jsx";
import {Navbar} from "@/components/navbar.jsx";

export default function DefaultLayout({children}) {
  return (
    <BaseLayout>
      <Navbar withNav={true}/>
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
    </BaseLayout>
  );
}
