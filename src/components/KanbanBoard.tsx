import Button from "../ui/Button";
import PlusIcon from "../icons/PlusIcon.tsx";
import {useMemo, useState} from "react";
import type {Column, Id, Task} from "../types.ts";
import ColumnContainer from "./ColumnContainer.tsx";

import {
    DndContext,
    type DragEndEvent,
    type DragOverEvent,
    DragOverlay,
    type DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";

import {arrayMove, SortableContext} from "@dnd-kit/sortable";
import {createPortal} from "react-dom";
import TaskCard from "../ui/TaskCard.tsx";


function KanbanBoard() {

    const [columns, setColumns] = useState<Column[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 2,
        }
    }))
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

    return (<div
            className="flex min-h-screen w-full justify-center items-center px-[40px] overflow-x-auto overflow-y-hidden">
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
                <div className="m-auto flex gap-4">
                    <div className="flex gap-4">
                        <SortableContext items={columnsId}>
                            {columns.map((col) => (
                                <ColumnContainer key={col.id} column={col} deleteColumn={deleteColumn}
                                                 updateColumn={updateColumn} createTask={createTask}
                                                 deleteTask={deleteTask} updateTask={updateTask}
                                                 tasks={tasks.filter((task) => task.columnId === col.id)}
                                />))}
                        </SortableContext>

                    </div>
                    <Button className="flex gap-2 justify-center  border-2  h-[60px] w-[350px] min-w-[350px]"
                            onClick={() => {
                                createColumn();
                            }}
                    >
                        <PlusIcon/>
                        Add New Board
                    </Button>
                </div>
                {createPortal(<DragOverlay>
                    {activeColumn && (
                        <ColumnContainer column={activeColumn} deleteColumn={deleteColumn} updateColumn={updateColumn}
                                         createTask={createTask}
                                         tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                                         deleteTask={deleteTask}
                                         updateTask={updateTask}
                        />)}
                    {activeTask && (<TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask}/>)}
                </DragOverlay>, document.body)}


            </DndContext>

        </div>

    );

    function createColumn() {
        const columnToAdd: Column = {
            id: crypto.randomUUID(), title: `Column ${columns.length + 1}`,
        };
        setColumns([...columns, columnToAdd]);
    }

    function updateColumn(id: Id, title: string) {
        const updatedColumns = columns.map((col) => col.id === id ? {...col, title} : col);
        setColumns(updatedColumns);
    }

    function deleteColumn(id: Id) {
        const updatedColumns = columns.filter((col) => col.id !== id);
        setColumns(updatedColumns);
        const updatedTasks = tasks.filter((task) => task.columnId !== id);
        setTasks(updatedTasks);
    }

    function createTask(columnId: Id) {
        const newTask: Task = {
            id: crypto.randomUUID(), columnId, content: `Task ${tasks.length + 1}`,
        }
        setTasks([...tasks, newTask]);
    }

    function updateTask(id: Id, content: string) {
        const updatedTask = tasks.map((task) => task.id === id ? {...task, content} : task);
        setTasks(updatedTask);

    }

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === 'column') {
            setActiveColumn(event.active.data.current.column);
        }
        if (event.active.data.current?.type === 'task') {
            setActiveTask(event.active.data.current.task);
        }

    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);
        const {active, over} = event;
        if (!over) return;
        const activeColumnId = active.id;
        const overColumnId = over.id;
        if (activeColumnId === overColumnId) return;
        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex((col) => col.id === activeColumnId);
            const overColumnIndex = columns.findIndex((col) => col.id === overColumnId);
            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        })

    }

    function onDragOver(event: DragOverEvent) {
        const {active, over} = event;
        if (!over) return;
        const activeId: Id = active.id;
        const overId: Id = over.id;

        const isActiveATask = active.data.current?.type === "task"
        const isOverATask = over.data.current?.type === "task"

        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);
                tasks[activeIndex].columnId = tasks[overIndex].columnId
                return arrayMove(tasks, activeIndex, overIndex);
            })
        }

        const isOverAColumn = over.data.current?.type === 'column';
        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                tasks[activeIndex].columnId = overId
                return arrayMove(tasks, activeIndex, activeIndex);
            })
        }

    }

    function deleteTask(id: Id) {
        const updatedTasks = tasks.filter((task) => task.id !== id);

        setTasks(updatedTasks);
    }

}

export default KanbanBoard;
