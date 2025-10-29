import Header from "../Header";

export default function HeaderExample() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="p-6">
        <h2 className="text-2xl font-bold">Header Component</h2>
        <p className="text-muted-foreground">Sticky navigation with search and user menu</p>
      </div>
    </div>
  );
}
