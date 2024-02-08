//const App = () => (
//  <div>
//    <p>Hello world</p>
//  </div>
//)
//
//export default App

const Hello = (props) => {
  return (
    <div>

      <p>Hello {props.name}, you are {props.age} years old</p>
    </div>
  )
}

const App = () => {
  const nimi = "Pekka"
  const ika= 10
  console.log("toimii")
  return (
    <>
      <h1>Greetings</h1>
      <Hello name="Maya" age={21+3} />
      <Hello name={nimi} age={ika}/>
    </>
  )
}

export default App