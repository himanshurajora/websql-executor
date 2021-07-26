import React, { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {

  const [currentQuery, setCurrentQuery] = useState('')
  const [message, setMessage] = useState('')
  const [outputRows, setOutputRows] = useState<Array<any>>()
  const [outputRowHeads, setOutputRowHeads] = useState<Array<string>>()
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
        try {
          if (result.insertId) {
            setMessage("Row(s) Inserted Successfully to Row Number " + result.insertId)
          }
        }
        catch (err) { }

        if (result.rows.length) {
          setMessage("Row(s) got Fetched Successfully, Length is " + result.rows.length)
          var resultToArray = []; 
          var keys = Object.keys(result.rows[0])
          setOutputRowHeads(keys)
          for(var i = 0; i < result.rows.length; i++){
            var item : any = {}
            for(var key of keys){
              item[key] = result.rows[i][key]
            }
            resultToArray.push(item)
          }
          console.log(outputRowHeads,resultToArray);
        }
        else if (result.rowsAffected) {
          setMessage("Changed Got Applied Number of Affected Rows is " + result.rowsAffected)
        }

        else {
          setMessage("Query Executed Successfully")
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
          <span>Output: <span>{message}</span></span>
        </div>
        <div className="bottom">
          {
        
          }
        </div>
      </div>
    </div>
  )
}

export default App
