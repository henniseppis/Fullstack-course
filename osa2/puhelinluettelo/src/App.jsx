import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [Show, setShow] = useState(" ")

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`) }
    if (persons.some(person => person.number === newNumber)) {
      alert(`${newNumber} is already added to phonebook`)
    } else {
    const personObject = {
    name: newName,
    number: newNumber
    }
    setPersons(persons.concat(personObject))
    setNewName("")
    setNewNumber("")
    };
  }

  const handleNameChange = (event) => {
    console.log(event.target)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleShowChange = (event) => {
    setShow(event.target.value);
  };

  const numbersToShow = persons.filter(person =>
    person.name.toLowerCase().includes(Show.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with: {" "}
        <input 
        value={Show}
        onChange={handleShowChange}/>
      </div>
      <h2> Add new contact </h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} 
          onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} 
          onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {numbersToShow.map(person => <p key={person.name}> {person.name} {person.number} </p>)}
    </div>
  )

}

export default App
