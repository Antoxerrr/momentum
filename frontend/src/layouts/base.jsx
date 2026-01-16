export default function BaseLayout({ children }) {
  return (
    <div className="relative flex flex-col min-h-[100dvh]">
      {children}
    </div>
  );
}
