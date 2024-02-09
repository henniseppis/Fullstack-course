import { useState } from 'react'

const Button = ({handleClick, text, color}) => 
    <button onClick={handleClick} style={{ backgroundColor: color }}>
      {text}
    </button>

const StatisticLine = (props) => {
  <p>Good {props.good}</p>
}

const Statistics = (props) => {
  const average = (good, bad, total) => {
    if (total === 0) {
      return (
      <p> No feedback has been given yet</p>
      )
    }
    const badValue = bad * -1
    return (good + badValue) / total
  }
  const positive = (good, total) => {
    if (good === 0) {
      return (
        <div>No positive feedback has been given yet </div>
      )
    }
    const positive_feedback = (good / total) * 100
    return (<div>{positive_feedback} %</div>)

  }
    if (props.total == 0){
      return ( 
      <h2> No feedback given </h2>
      )
    }
    return (
      <div>
      <h1>Statistics</h1>
        <p>Good {props.good}</p>
        <p>Neutral {props.neutral}</p>
        <p>Bad {props.bad}</p>
        <p>Average {average(props.good, props.bad, props.total)}</p>
        <p>Positive {positive(props.good, props.total)}</p>
      </div>
     )  
    }

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)

  const handleGoodClick = () => {
    const updateGood = good +1
    setGood(updateGood)
    setTotal(updateGood + neutral + bad) 
  }
      
  const handleNeutralClick = () => {
    const updateNeutral = neutral +1
    setNeutral(updateNeutral)
    setTotal(good + updateNeutral + bad) 
  }

  const handleBadClick = () => {
    const updateBad = bad + 1
    setBad(updateBad)
    setTotal(good + neutral + updateBad) 
  }

  return (
    <div>
      <h1>Give Feedback</h1>
      <div style={{ display: 'flex', gap: '20px'}}>
        <Button 
          handleClick= {handleGoodClick}
          text="good" 
          color="green"
        />
        <Button 
          handleClick={handleNeutralClick} 
          text="neutral"
          color="lightgrey"
        />
        <Button 
          handleClick={handleBadClick} 
          text="bad" 
          color="red" 
        />
      </div>
      <Statistics good={good} neutral={neutral} bad={bad} total={total}/>
    </div>
  )
}

export default App