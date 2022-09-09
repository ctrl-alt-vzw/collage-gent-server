import React, { useEffect, useState } from 'react'
import Clipping from './HTMLClipping'
import interact from 'interactjs'


function DraggableClipping(props) {
  const [position, setPosition] = useState({x: 0, y:0})
  const [imageIsLoaded, imageLoaded] = useState(false)

  const dragPosition = {x: props.clipping_data.x, y: props.clipping_data.y}

  useEffect(() => {
    document.getElementById("image"+props.clipping_data.id).style.left = props.clipping_data.x+"px"
    document.getElementById("image"+props.clipping_data.id).style.top = props.clipping_data.y+"px"
    document.getElementById("image"+props.clipping_data.id).style.zIdex = props.clipping_data.zIndex

    // setPosition({x: props.clipping_data.x, y: props.clipping_data.y}) 
    

    if(props.moveable) {
      interact('#image'+props.clipping_data.id).draggable({
        listeners: {
          start (event) {
            // console.log(event.type, event.target)
          },
          move (event) {
            dragPosition.x += event.dx
            dragPosition.y += event.dy
            // event.target.style.transform = `translate(${position.x}px, ${position.y}px)`
            event.target.style.top = dragPosition.y+"px";
            event.target.style.left = dragPosition.x+"px";
            setPosition(dragPosition)
            // console.log(event.target.style.top)
          },
        }
      })
    }
  }, [])
  return (
    <div className="draggable" id={"image"+props.clipping_data.id} style={{zIndex: props.clipping_data.zIndex}}>
      <Clipping 
        clipping_data={props.clipping_data} 
        key={props.clipping_data.id + "clipping"} 
        image_is_loaded={imageIsLoaded} 
        image_loaded={imageLoaded} 
        style={{
          top: `${position.x}px`,
          left: `${position.y}px`
        }}
   /> 
   { props.moveable ? 
     <div className="actions">
      <button onClick={() => props.save_location(props.clipping_data, position)}>Save position</button>
     </div>
     : null
   }
    </div>
  )  
}
export default DraggableClipping;

// <Clipping clipping_data={props.clipping_data} position={position} />


