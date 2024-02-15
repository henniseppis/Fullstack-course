import { useState } from 'react'

const Button = ({handleClick, text, color}) => 
    <button onClick={handleClick} style={{ backgroundColor: color }}>
      {text}
    </button>

const StatisticLine = ({text, value}) => 
<tbody>
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
</tbody>

const Statistics = (props) => {
    if ((props.good + props.bad + props.neutral) == 0){
      return ( 
      <h2> No feedback given </h2>
      )
    }
    return (
      <div>
      <h1>Statistics</h1>
      <table>
        <StatisticLine text="Good" value={props.good}/>
        <StatisticLine text="Neutral" value={props.neutral}/>
        <StatisticLine text="Bad" value={props.bad}/>
        <StatisticLine text="All" value={(props.good + props.bad + props.neutral)}/>
        <StatisticLine text="Average" value={(props.good-props.bad)/(props.good + props.bad + props.neutral)}/>
        <StatisticLine text="Positive" value={(props.good/(props.good + props.bad + props.neutral))*100 + " %"} />
      </table>
      </div>
     )  
    }

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  return (
    <div>
      <h1>Give Feedback</h1>
      <div style={{ display: 'flex', gap: '20px'}}>
        <Button handleClick={() => setGood(good + 1)} text="Good" color="green"/>
        <Button handleClick={() => setNeutral(neutral + 1)} text="Neutral" color="lightgrey"/>
        <Button handleClick={() => setBad(bad+1)} text="Bad" color="red"/>
      </div>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App