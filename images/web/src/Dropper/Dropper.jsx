import React, { useEffect } from 'react'
import Loader from './../Common/Loader.jsx'
import DraggableClipping from './DraggableClipping'
import { ManagerContext } from "../Manager/index.js"



function Dropper(props) {

  const [ state, dispatch ] = React.useContext(ManagerContext)
  const [data, setData] = React.useState([]);

  useEffect(() => {
    fetch("https://api.datacratie.cc/clipping")
      .then(r => r.json())
      .then((data) => {
        console.log("fetched clippings")
        setData(data)
      })
  }, [])

  const handlePositioned = (clipping, position) => {
    console.log("clipping", position)
    fetch("https://api.datacratie.cc/clipping/"+clipping.UUID, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        x: position.x,
        y: position.y
      })
    })
      .then(r => r.json())
      .then((data) => {
        console.log(data)    
        dispatch({ type: "clipping_positioned", payload: {...clipping, ...position} })
      })
  }
  
  return (
    <div id="container">
      {data.length === 0 ? <Loader message="loading clippings" /> : null}
      { data.map((clipping, key) => {
        clipping["zIndex"] = data.length - key;
        return <DraggableClipping clipping_data={clipping}  key={key} save_location={handlePositioned} moveable={clipping.UUID === state.clipping.UUID}  />
      })}
    </div>
  )
}

export default Dropper;