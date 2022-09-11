

import React, { useEffect } from 'react';
import { ManagerContext } from "../Manager/index.js"

function Clipping(props) {
  const [ state,  ] = React.useContext(ManagerContext)

  useEffect(() => {
    document.getElementById("image_fixed"+props.clipping_data.id).style.left = (props.clipping_data.x * state.options.scale.viewing) +"px"
    document.getElementById("image_fixed"+props.clipping_data.id).style.top = (props.clipping_data.y * state.options.scale.viewing) +"px"
    // document.getElementById("image_fixed"+props.clipping_data.id).style.zIndex = props.clipping_data.zIndex

  }, []);
  return (
    <div className="clippingItem" id={"image_fixed"+props.clipping_data.id}>
      <img 
        src={props.clipping_data.imageURI.replace("/800/", "/200/")}
        style={{
          width: `${200 * state.options.scale.viewing}px`,
          height: `${200 * state.options.scale.viewing}px`
        }}
        alt={"clipped piece from a user in a collage"}
      />
    </div>
  )
  

}
export default Clipping;

