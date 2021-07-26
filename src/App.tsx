import React, { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {

  const [currentQuery, setCurrentQuery] = useState('')
  const [message, setMessage] = useState('')
  var dataBase: Database
  useEffect(() => {
    dataBase = window.openDatabase("DemoWebSql", "1.0", "Test DataBase", 1024 * 1024 * 2, () => {
      console.log("dataBase Created")
    })
  })

  const runQuery = async () => {
    console.log("running the query : ", currentQuery)
    dataBase.transaction((query) => {
      query.executeSql(currentQuery, undefined, (transaction, result) => {
        console.log("query executed with the result: ", result)
        if (result.insertId) {
          setMessage("Row(s) Inserted Successfully to Row Number " + result.insertId);
        }
        else if(result.rows){
          
        }
      }, (transaction, error): any => {
        console.log("query failed with error", error, "bad query", currentQuery)
        setMessage(error.message + ", Error Code : " + error.code);
      })
    })
  }
  return (
    <div className="App">
      <h2>WebSql Executor</h2>
      <textarea rows={12} cols={50} placeholder={"Write Your Query Here"} onChange={(e) => { setCurrentQuery(e.target.value) }} />
      <br />
      <button onClick={runQuery}>Run Query</button>
      <hr />
      <div className="output">
        <div className="top">
          <span>Message: <span>{message}</span></span>
        </div>
      </div>
    </div>
  )
}

export default App
