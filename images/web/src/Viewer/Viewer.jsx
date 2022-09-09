import React, { useEffect } from 'react'
import Loader from './../Common/Loader.jsx'
import Clipping from './Clipping'
import { ManagerContext } from "../Manager/index.js"



function Viewer(props) {

  const [ , dispatch ] = React.useContext(ManagerContext)
  const [data, setData] = React.useState([]);

  useEffect(() => {
    fetch("https://api.datacratie.cc/clipping")
      .then(r => r.json())
      .then((data) => {
        setData(data)
      })
  }, [])


  const handleReturn = () => {
    console.log("init")
    dispatch({ type: "reset_and_select", payload: {} })
  }
  
  return (

    <div id="container">
      {data.length === 0 ? <Loader message="loading clippings" /> : null}
      { data.map((clipping, key) => {
        clipping["zIndex"] = data.length - key;
        return <Clipping clipping_data={clipping} key={key}  />
      })}
      <div id="header">
        <button onClick={handleReturn}>Select your own</button>
      </div>
    </div>
  )
}

export default Viewer;