const Persons = ({person, delButton}) => {
    return (
      <li> 
        {person.name} {person.number} 
        <button onClick={delButton}>delete</button>
      </li>
    )
  }

  export default Persons;