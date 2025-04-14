import { AppRouter } from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { SignupProvider } from "./context/SignupContext";

function App() {

  return (
    <AuthProvider>
      <SignupProvider>
      <AppRouter/>
      </SignupProvider>
    </AuthProvider>
  );
}

export default App;
