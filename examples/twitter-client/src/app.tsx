import { ProtectedRoute } from "./components/protected";
import { Home } from "./routes/home";

export function App() {
    return (
        <ProtectedRoute>
            <Home />
        </ProtectedRoute>
    )
}