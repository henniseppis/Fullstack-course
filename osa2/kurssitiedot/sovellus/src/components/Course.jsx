const PartTotal = ({parts}) => {
    const total = parts.reduce((total, part) => total + part.exercises,0)
    return(
    <b>total of {total} exercises</b>
    )
  }
  
const PartHeader = ({name}) => <h3><b>{name}</b></h3>
    
  
const Part = ({part}) => {
    return (
      <>
      <PartHeader name = {part.name}/>
       {part.parts.map(part => <p key={part.id}> {part.name} {part.exercises}</p> )}
      <PartTotal parts={part.parts}/>
      </>
    )
  }

const Content = ({parts}) => 
    <>
    {parts.map(part => <Part key={part.id} part={part} /> )}
    </>


const Course = ({courses}) =>
  <>
    <Content parts = {courses}/>
  </>

export default Course