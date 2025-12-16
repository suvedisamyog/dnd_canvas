

import './App.css'
import KanbanBoard from "./components/KanbanBoard.tsx";
import {DndContext} from "@dnd-kit/core";

function App() {

  return (
      <>
          <DndContext>
        <KanbanBoard/>

          </DndContext>

      </>
  )
}

export default App
