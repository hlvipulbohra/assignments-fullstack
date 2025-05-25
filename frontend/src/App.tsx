import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResumeInput from "./pages/ResumeInput.tsx";
import ParsedResume from "./pages/ParsedResume.tsx";
import ResumeHistory from "./pages/ResumeHistory.tsx";
import NotFound from "./pages/NotFound.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ResumeInput />} />
        <Route path="/view/:id" element={<ParsedResume />} />
        <Route path="/history" element={<ResumeHistory />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
