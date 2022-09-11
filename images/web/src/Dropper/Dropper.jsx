import React, { useEffect } from 'react'
import Loader from './../Common/Loader.jsx'
import DraggableClipping from './DraggableClipping'
import { ManagerContext } from "../Manager/index.js"



function Dropper(props) {

  const [ state, dispatch ] = React.useContext(ManagerContext)
  const [data, setData] = React.useState([]);
  const [position, setPosition] = React.useState({})
  const [allowed, setAllowed] = React.useState(true);

  useEffect(() => {
    fetch("https://api.datacratie.cc/clipping")
      .then(r => r.json())
      .then((data) => {
        console.log("fetched clippings")
        setData(data)
      })
  }, [])

  const checkPositioning = (x, y, active) => {
    let tooClose = 0;
    data.forEach((other) => {
      if(other.UUID !== active.UUID) {

        // const cx = x + (active.width / 2);
        // const cy = y + (active.height / 2);
        // const tx = other.x + (other.width / 2);
        // const ty = other.y + (other.height / 2);
        const cx = x + (100 / 2);
        const cy = y + (100 / 2);
        const tx = other.x + (100 / 2);
        const ty = other.y + (100 / 2);
        
        // const d = Math.sqrt( Math.pow((tx-cx), 2) + Math.pow((ty-cy), 2) );

        const d = Math.hypot(tx - cx, ty - cy)
        const minimal = 150
        if(d < minimal) {
          // console.log("too close", d, minimal)
          tooClose +=1;
        }
      }
    })
    setAllowed(tooClose == 0)
    return tooClose
  }

  const updatePosition = (p) => {
    setPosition(p)
  }

  const handlePositioned = (position) => {

    console.log("clipping", position)
    if(allowed) {
      fetch("https://api.datacratie.cc/clipping/"+state.clipping.UUID, {
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
          dispatch({ type: "clipping_positioned", payload: {...state.clipping, ...position} })
        })
    } else {
      console.log("cannot position here")
    }
  }
  
  return (
    <div id="container">
      {data.length === 0 ? <Loader message="loading clippings" /> : null}
      { data.map((clipping, key) => {
        clipping["zIndex"] = data.length - key;
        return <DraggableClipping 
          clipping_data={clipping}  
          key={key} 
          save_location={handlePositioned} 
          moveable={clipping.UUID === state.clipping.UUID} 
          checkPositioning={checkPositioning}  
          updatePosition={updatePosition}
        />
      })}


     <div id="header">
      <button className={allowed ? "active" : "inactive"} onClick={() => handlePositioned(position)}>Save position</button>
     </div>
    </div>
  )
}

export default Dropper;