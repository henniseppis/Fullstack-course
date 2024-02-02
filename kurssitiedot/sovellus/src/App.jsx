const Total = (props) => {
  //tehtävien yhteismäärä
  return(
    <>
    <p> Number of exercises {props.total} </p>
    </>
  )
}

const Content = (props) => {
  //osat ja tehtävämäärät
  return (
    <>
    <p> {props.part} {props.ex}</p>
    </>
  )
}

const Header = (props) => {
  //kurssit
  return (
    <>
    <h1>{props.course}</h1>
    </>
  )
}


const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14
  return (
    <div>
      <Header course = {course}/>
      <Content part = {part1} ex ={exercises1}/>
      <Content part = {part2} ex ={exercises2}/>
      <Content part = {part3} ex ={exercises3}/>
      <Total total = {exercises1 + exercises2 + exercises3}/>
    </div>
  )
}

export default App