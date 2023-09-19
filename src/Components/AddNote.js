import React,{useContext,useState} from 'react'
import noteContext from '../Context/Notes/noteContext'

export default function AddNote() {
    const context = useContext(noteContext)
    const {addNote} = context

    const [note, setNote] = useState({title:"",description:"",tag:"default"})
    const handleClick = (e)=>{
        e.preventDefault()
        addNote(note.title,note.description,note.tag)
        setNote({title:"",description:"",tag:""})
    }

    const onChange=(e)=>{
        setNote({...note,[e.target.name]:e.target.value})
    }

    return (
        <div className="container">
            <form>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" value={note.title} id="title" name='title' onChange={onChange}aria-describedby="emailHelp" required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" value={note.description} id="description" name='description' onChange={onChange} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" value={note.tag} id="tag" name='tag' onChange={onChange} />
                </div>
                <button type="submit" disabled={note.title.length<5 || note.description.length<5} className="btn btn-primary" onClick={handleClick}>Add Note</button>
            </form>
        </div>
    )
}
