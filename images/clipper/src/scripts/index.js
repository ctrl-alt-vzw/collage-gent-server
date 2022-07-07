"use strict"

const URL = "https://media.datacratie.cc"

const app = {
  userDrawn: [],
  cutOut: false,
  img1: new Image(),
  init() {
    console.log("initialising")
    const imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', (e) => this.handleImage(e), false);

    document.getElementById("cut").addEventListener("click", (e) => {
      this.cutOut = !this.cutOut;
      console.log(this.cutOut)
      this.update();
    })

    document.getElementById("save").addEventListener("click", (e) => {
      const strMime = "image/png";
      const canvas = document.getElementById('clipper');
      const link = document.createElement("a");
      // resize


      const startClippingX = this.userDrawn.sort((a, b) => a.x - b.x)[0].x;
      const startClippingY = this.userDrawn.sort((a, b) => a.y - b.y)[0].y;
      const clippingWidth = this.userDrawn.sort((a, b) => b.x - a.x)[0].x - startClippingX;
      const clippingHeight = this.userDrawn.sort((a, b) => b.y - a.y)[0].y - startClippingY;


      const hidden_canvas = document.createElement("canvas");
      const hidden_ctx = hidden_canvas.getContext('2d');
      hidden_canvas.width = clippingWidth;
      hidden_canvas.height = clippingHeight;
      document.getElementById("hiddenCanvasContainer").insertAdjacentElement("beforeend", hidden_canvas)
      hidden_ctx.drawImage(
        canvas,
        startClippingX,
        startClippingY,
        clippingWidth,
        clippingHeight,
        0,
        0,
        clippingWidth,
        clippingHeight
      );


      const b64Image = hidden_canvas.toDataURL(strMime);
      const u8Image = this.b64ToUint8Array(b64Image);
      const formData = new FormData();
      formData.append("clipping", new Blob([u8Image], { type: strMime }));
      // const xhr = new XMLHttpRequest();
      // xhr.open("POST", "http://localhost:3030/upload", true);
      // xhr.send(formData);
      fetch(`${URL}/upload`, {
        method: 'POST',
        body: formData
      })
        .then(r => r.json())
        .then((data) => {
          console.log(data)
        })
        .catch((e) => {
          console.log(e)
        })

    })

    document.getElementById("clipper").addEventListener("click", (e) => {
      this.userDrawn.push(this.getCursorPosition(e))
      this.update()
    })


  },
  update() {

    const canvas = document.getElementById('clipper');

    if (canvas.getContext) {

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);





      ctx.beginPath();
      this.userDrawn.forEach((pos, i) => {
        if (i == 0) {
          ctx.moveTo(pos.x, pos.y);
        } else {
          ctx.lineTo(pos.x, pos.y);
        }
      })
      ctx.fillStyle = "red";
      ctx.fill();


      if (this.cutOut) {
        ctx.globalCompositeOperation = 'source-in';
      } else {
        ctx.globalCompositeOperation = 'source-over';

      }

      ctx.drawImage(this.img1, 0, 0, 800, 600);
      if (!this.cutOut) {
        this.userDrawn.forEach((pos, i) => {
          ctx.beginPath();
          ctx.lineWidth = 2;

          ctx.arc(pos.x, pos.y, 5, 0, 2 * Math.PI, false);
          ctx.stroke();
        })
      }
    }
  },
  getCursorPosition(e) {
    const canvas = document.getElementById("clipper")
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    return { x, y }
  },
  b64ToUint8Array(b64Image) {
    const img = atob(b64Image.split(',')[1]);
    const img_buffer = [];
    let i = 0;
    while (i < img.length) {
      img_buffer.push(img.charCodeAt(i));
      i++;
    }
    return new Uint8Array(img_buffer);
  },
  handleImage(e) {
    var canvas = document.getElementById('clipper');
    var ctx = canvas.getContext('2d');
    var reader = new FileReader();
    reader.onload = (event) =>  {
      var img = new Image();
      img.onload =  () => {
        this.img1 = img;
        this.update();
      }
      img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
  }
}
export default app;