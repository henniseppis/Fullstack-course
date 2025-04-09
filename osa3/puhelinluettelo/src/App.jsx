import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import Form from './components/Form'
import axios from 'axios'
import personService from './services/persons'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [Show, setShow] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(showPersons => {
        setPersons(showPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already in phonebook. Want to replace ${newName}'s number?`)) {
        const p = persons.find(p => p.name === newName)
        personService
        .update(p.id, {name: p.name, number: newNumber })
        .then(returnedData => {
          setPersons(persons.map(person => person.id !== p.id ? person: returnedData))
          setErrorMessage(false)
          setMessage(
            `${p.name}'s number changed succesfully`
          )
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
      }
    } else {
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (!newName || !newNumber) {
      setErrorMessage(true)
      setMessage('Name and number are required')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
      return
    }
    personService
    .create(personObject)
    .then(returnedData => {
      setPersons(persons.concat(returnedData))
      setErrorMessage(false)
      setMessage(
        `'${newName}' added`
      )
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    })
  }
  setNewName('')
  setNewNumber('')
}

  const deletePerson = (id) => {
    const p = persons.find(p => p.id === id)
    console.log("name" + p.name)
    if (window.confirm(`Delete ${p.name}?`)) {
      personService
      .del(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
        setErrorMessage(false)
        setMessage(
          `${p.name} deleted succesfully from the phonebook`
        )
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
      .catch(error => {
        setErrorMessage(true)
        setMessage(
          `infromation of ${p.name} has already been deleted from server`
        )
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      })
  }
}

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleShowChange = (event) => {
    setShow(event.target.value);
  };

  const peopleToShow = persons.filter(person =>
    person && person.name && person.name.toLowerCase().includes(Show.toLowerCase())
  );
  
  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} isError={errorMessage} />
      <Filter text = {"Filter shown with:"} filter={Show} onChange={handleShowChange}/>
      <h2>Add new</h2>
      <Form onSubmit={addPerson} 
      name = {newName} 
      number = {newNumber}
      handleNameChange={handleNameChange}
      handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <ul>
        {peopleToShow.map(person =>
        <Persons
        key={person.id}
        person={person}
        delButton={() => deletePerson(person.id)}/>
        )}
      </ul>
    </div>
  )

}

export default App