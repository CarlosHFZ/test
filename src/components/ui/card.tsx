export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6">
      {children}
    </div>
  );
}
