import UrlForm from "../components/UrlForm";

const Home = () => (
  <div className="mx-auto max-w-4xl px-6 py-12">
    <div className="mb-10 text-center">
      <h1 className="text-4xl font-bold">SnapLink URL Shortener</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        Create short, trackable links with analytics in seconds.
      </p>
    </div>
    <UrlForm />
  </div>
);

export default Home;
