import type {Id, Task} from "../types.ts";
import TrashIcon from "../icons/TrashIcon.tsx";
import {useState} from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";


interface TaskCardProps {
    task: Task;
    deleteTask: (id: Id) => void;
    updateTask: (id:Id , content:string) =>void
}

function TaskCard({ task, deleteTask, updateTask}: TaskCardProps) {
    const [editMode , setEditMode] = useState(false);
    const {setNodeRef , attributes ,listeners, transform , transition , isDragging} = useSortable({
        id: task.id,
        data: {
            type: 'task',
            task
        },
        disabled: editMode
    });
    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    }
    if( isDragging){
        return (
            <div ref={setNodeRef} style={style}  className="bg-column-bg-main h-[100px] rounded-md flex flex-col max-h-[500px] opacity-60 border-2 border-rose-400">

            </div>
        )
    }

    if(editMode){
        return (
            <div   className="group bg-bg-main p-2.5 flex items-center justify-between h-[100px] text-left relative min-h-[100px] rounded-md shadow-md cursor-grab hover:ring-inset hover:ring-2 hover:ring-rose-500">

                {/* Task content */}
                <textarea autoFocus className="h-[100%] w-full resize-none rounded bg-transparenttext-white focus:outline-none "
                    value={task.content}
                          placeholder="Plan your task"
                          onBlur={()=>setEditMode(false)}
                          onKeyDown={(e)=>{
                              if(e.key === 'Enter' && !e.shiftKey){
                                  e.preventDefault();
                                  setEditMode(false);
                              }
                          }}
                          onChange={(e) => updateTask(task.id,e.target.value)}
                >{task.content}</textarea>

            </div>
        )
    }

    return (

        <div ref={setNodeRef} style={style}  {...attributes} {...listeners}  onClick={()=>setEditMode(true)} className="group bg-bg-main p-2.5 flex items-center justify-between h-[100px] text-left relative min-h-[100px] rounded-md shadow-md cursor-grab hover:ring-inset hover:ring-2 hover:ring-rose-500">

            {/* Task content */}
            <p className=" my-auto w-full h-[90%] overflow-y-auto overflow-x-hidden ">{task.content}</p>

            {/* Delete button (hidden by default) */}
            <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mx-2 cursor-pointer"
            >
                <TrashIcon />
            </button>

        </div>
            );
}

export default TaskCard;
