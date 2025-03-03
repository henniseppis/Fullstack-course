const Button = (props) => <button type={props.type}>{props.text}</button>

const Form = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div> name: <input value = {props.name} onChange={props.handleNameChange} /></div>
      <div> number: <input value = {props.number} onChange={props.handleNumberChange}/></div>
      <Button type = "submit" text = "add" />
    </form>
  )
}

export default Form;