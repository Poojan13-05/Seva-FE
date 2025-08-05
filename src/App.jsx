import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Login</h2>
      <Input type="email" placeholder="Enter your email" />
      <Input type="password" placeholder="Enter your password" />
      <Button>Login</Button>
    </div>
  );
}

export default App;
