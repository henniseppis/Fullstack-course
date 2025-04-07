const Filter = ({ text, filter, onChange }) =>
    <div> {text} <input value={filter} onChange={onChange}/> </div>
  
export default Filter;  