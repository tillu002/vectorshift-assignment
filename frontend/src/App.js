import { Header } from './Header';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { EdgeSidebar } from './EdgeSidebar';

function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <PipelineToolbar />
      <div className="flex-1 relative">
        <PipelineUI />
        <EdgeSidebar />
      </div>
      <SubmitButton />
    </div>
  );
}

export default App;
