import Header from "./components/header";
import Footer from "./components/footer";
import Menu from "./components/menu";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <Menu/>
      <main className="flex-grow pt-20 p-6">
        <h1 className="text-3xl font-rubik">Welcome to MyWebsite</h1>
        <p className="mt-4 text-primary1">This is your content area.</p>
      </main>
      <Footer />
    </div>
  );
}
