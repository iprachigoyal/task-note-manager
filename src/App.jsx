
import  Header from './components/layout/Header';
import Board from './components/layout/board/Board';

function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <main className="flex-grow overflow-hidden">
        <Board />
      </main>
      <footer className="bg-gray-800 text-white py-2 text-center text-sm">
        TaskFlow - Your Task Management Solution
      </footer>
    </div>
  );
}

export default App;