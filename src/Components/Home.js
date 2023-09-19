import { useContext } from "react"
import Alerts from "./Alerts"
import Notes from "./Notes"
import noteContext from '../Context/Notes/noteContext'

export default function Home() {
  const context = useContext(noteContext)
  const {alert,type} = context
  

  return (
    <>
    <Alerts alert={alert} type={type}/>
      <div className="container">
        <Notes />
      </div>
    </>
  )
}
