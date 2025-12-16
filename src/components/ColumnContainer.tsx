import type {Column, Id, Task} from "../types.ts";
import Button from "../ui/Button.tsx";
import TrashIcon from "../icons/TrashIcon.tsx";
import {SortableContext, useSortable} from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import {useMemo, useState} from "react";
import PlusIcon from "../icons/PlusIcon.tsx";
import TaskCard from "../ui/TaskCard.tsx";


interface ColumnContainerProps {
  column : Column
    deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
    updateTask: (id: Id, content: string) => void;

    deleteTask: (id: Id) => void;
  tasks: Task[];

}
function ColumnContainer(props: ColumnContainerProps) {
    const {column , deleteColumn , updateColumn ,createTask ,tasks ,deleteTask , updateTask} = props;
    const [editMode , setEditMode] = useState(false);
    const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);


    const {setNodeRef , attributes ,listeners, transform , transition, isDragging} = useSortable({
        id: column.id,
        data: {
            type: 'column',
            column
        },
        disabled: editMode
    });
    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    }
    if( isDragging){
        return (
            <div ref={setNodeRef} style={style}  className="bg-column-bg-main w-[350px] h-[500px] rounded-md flex flex-col max-h-[500px] opacity-60 border-2 border-rose-400">
            </div>
            )
    }
  return (
      <>
          <div ref={setNodeRef} style={style}  className="bg-column-bg-main w-[350px] h-[500px] rounded-md flex flex-col max-h-[500px]">
              <div onClick={()=>{setEditMode(true)}} {...attributes} {...listeners} className="bg-bg-main m-1 rounded-sm p-2 flex justify-between items-center px-4 font-semibold cursor-grab">
                  <div className="flex items-center gap-2">
                      <p className="rounded-full text-sm font-bold bg-column-bg-main flex items-center justify-center">
                          0
                      </p>
                      {!editMode && column.title}
                      {editMode &&(
                          <input
                              autoFocus
                              value={column.title}
                              onChange={e=>updateColumn(column.id, e.target.value)}
                              type="text"
                              placeholder={column.title}
                              onBlur={()=>{
                                    setEditMode(false);
                              }}
                              onKeyDown={(event)=>{
                                  if(event.key === 'Enter'){
                                      setEditMode(false);
                                  }
                              }}

                              />
                      )}
                  </div>

                  <div className="flex ">
                      <Button onClick={()=>{
                          deleteColumn(column.id);
                      }} >
                          <TrashIcon/>
                      </Button>
                  </div>
              </div>
              <div className="flex-grow flex gap-4 flex-col p-2 overflow-x-hidden overflow-y-auto" >
                  <SortableContext items={taskIds}>
                  {
                      tasks.map((task)=>(
                          <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}/>
                      ) )}
                  </SortableContext>

              </div>
              <Button className="flex gap-2 items-center  p-4"
              onClick={()=>{
                  createTask(column.id);
              }}
              >
                  <PlusIcon/>
                  Add New Task
              </Button>
          </div>


      </>
  );
}

export default ColumnContainer;
