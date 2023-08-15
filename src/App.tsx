import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import "../src/index.css"

export default function App() {

  const inputRef = useRef<HTMLInputElement>(null);
  const firstRender = useRef(true);

  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<string[]>([])

  const [editTask, setEditTask] = useState({
    enabled: false,
    task: ''
  })

  useEffect(() => {
    const tarefasSalvas = localStorage.getItem("@cursoreact")

    if (tarefasSalvas) {
      setTasks(JSON.parse(tarefasSalvas));
    }


  }, [])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    localStorage.setItem("@cursoreact", JSON.stringify(tasks))

  }, [tasks]);

  const handleRegister = useCallback(() => {
    if (!input) {
      alert("Preencha o nome da sua tarefa!")
      return;
    }

    if (editTask.enabled) {
      handleSaveEdit();
      return;
    }

    setTasks(tarefas => [...tarefas, input])
    setInput("")

  }, [input, tasks])




  function handleSaveEdit() {
    const findIndexTask = tasks.findIndex(task => task === editTask.task)
    const allTasks = [...tasks];

    allTasks[findIndexTask] = input;
    setTasks(allTasks);

    setEditTask({
      enabled: false,
      task: ''
    })
    setInput("")
  }

  function handleDelete(item: string) {
    const removeTask = tasks.filter(task => task !== item)
    setTasks(removeTask)
  }

  function handleEdit(item: string) {

    inputRef.current?.focus();

    setInput(item)
    setEditTask({
      enabled: true,
      task: item
    })
  }

  const totalTarefas = useMemo(() => {
    return tasks.length
  }, [tasks])

  return (
    <div className=" flex flex-col w-full py-4 items-center justify-center">
      <div>
        <h1 className="md:text-4xl text-center text-3xl font-bold text-white mt-20">LISTA DE TAREFA
        LEANDRO HENRIQUE </h1>
      </div>
      <div>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-5 mt-5"
          placeholder="Digite o nome da tarefa..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          ref={inputRef}
        />
      </div>
      <div>
        <button className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded mb-3"
          onClick={handleRegister}>{
            editTask.enabled ? "Atualizar tarefa" : "Adicionar tarefa"
          }</button>
      </div>
      <hr />

      <strong className=" text-white ">VOCÊ TEM {totalTarefas} TAREFAS!</strong>
      <br /><br />

      {tasks.map((item) => (

        <section className=" flex justify-around w-11/12">
          <div className=" w-52">
            <span className=" text-white">{item}</span>
          </div>
          <div className=" flex gap-3 mb-5 ">
          <div>
            <button className="bg-green-500 hover:bg-green-700 text-white
             font-bold text-sm py-2 px-4 border border-green-700 rounded"
              onClick={() => handleEdit(item)}>Editar</button>
          </div>
          <div>
            <button className="bg-green-500 hover:bg-green-700
             text-white font-bold text-sm py-2 px-4 border border-green-700 rounded"
              onClick={() => handleDelete(item)}>Excluir</button>
          </div>
          </div>
        </section>

      ))}
    </div>
  )
}