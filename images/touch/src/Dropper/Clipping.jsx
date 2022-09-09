import React, { useRef, useEffect, useState } from 'react'
import styled from "styled-components";


function Clipping(props) {

  // console.log(props)
  const canvasRef = useRef(null)
  const [image, setImage] = useState();
  const [normal, setNormal] = useState();

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')


    ctx.fillStyle = '#000000'
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    if(image) {
      // ctx.drawImage(normal, 0, 0, image.width * scaleFactor, image.height * scaleFactor)
      // const normalData = ctx.getImageData(0, 0,canvas.width,  canvas.height);
      // const normalCollection = normalData.data;

      // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      ctx.drawImage(image, 0, 0, 200, 200)
      // const imageData = ctx.getImageData(0,0, canvas.width, canvas.height);

      // const data = imageData.data;
      
      // const removeBlack = function() {
      //     for (var i = 0; i < data.length; i += 4) {
      //         if(normalCollection[i]+ normalCollection[i + 1] + normalCollection[i + 2] < 500){ 
      //             data[i + 3] = 0; // alpha
      //         }
      //     } 
      //     ctx.putImageData(imageData, 0, 0); 
      // }; 
      // removeBlack();
    }



  }, [image])
  // load image

  React.useEffect(() => {
    const imageElement = new Image();   // Create new img element
    imageElement.addEventListener('load', () => { 
      imageElement.crossOrigin = "Anonymous";
      setImage(imageElement);
      props.image_loaded(true)
    }, false);
    imageElement.src = props.clipping_data.imageURI; // Set source path
  }, [])

  // loadNormal
  // React.useEffect(() => {
  //   const imageElement = new Image();   // Create new img element
  //   imageElement.addEventListener('load', () => { 
  //     imageElement.crossOrigin = "Anonymous";
   
  //     setNormal(imageElement);
  //   }, false);
  //   imageElement.src = props.clipping_data.normalURI; // Set source path
  // }, [])
  
  return <canvas ref={canvasRef} {...props}/>
  

}
export default Clipping;

