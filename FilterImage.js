class FilterImage extends HTMLElement {
  constructor(){
    super()
   /*
 this.filters = `
filter: blur(5px);
filter: brightness(0.4);
filter: contrast(200%);
filter: grayscale(50%);
filter: hue-rotate(90deg);
filter: invert(75%);
filter: opacity(25%);
filter: saturate(30%);
filter: sepia(60%);
    `
   */
    this.innerHTML = `
    <figure>
      <figcaption>
        <input class=upload-image type=file accept="image/*">
        <button class=reset-levels>reset</button>
      </figcaption>
      <img src>
    </figure>
    <form>
      <label class="filter-function">contrast: <input type="range" name="contrast" min="0" max="200" data-unit="%" data-default="100"></label>
      <label class="filter-function">grayscale: <input type="range" name="grayscale" min="0" max="200" data-unit="%" data-default="100"></label>
      <label class="filter-function">brightness: <input type="range" name="brightness" value="100" min="0" max="200" data-unit="%" data-default="100"></label>
      <label class="filter-function">invert: <input type="range" name="invert" value="0" step="100" min="0" max="100" data-unit="%" data-default="0"></label>
      <label>hue-rotate: <input type="range" name="hue-rotate" min="0" value="0" max="360" data-unit="deg" data-default="0"></label>
      <label>saturate: <input type="range" name="saturate" min="0" max="200" value="100" data-unit="%" data-default="100"></label>
      <label>opacity: <input type="range" name="opacity" min="0" max="200" value="100" data-unit="%" data-default="100"></label>
    </form>
      `
    this.dropzone = this
    this.listen()
  }

  /*
      <label>blur: <input type="range" name="blur" value=0 min="0" max="10" data-unit="%">px</label>
      <label>sepia: <input type="range" name="sepia" min="0" max="100" data-unit="%">%</label>

  */

  async fetch(url){
    let response = await fetch(url)
    let data = await response.json()
    this.data = data
  }

  connectedCallback(){

  }

  static get observedAttributes(){
    return ["src"]
  }

  attributeChangedCallback(attribute, oldValue, newValue){
    if(attribute == "src"){
      this.querySelector('img').src = newValue
    }
  }

  set data(data){
    this.whatever = data.whatever
    this.metadata = data.metadata
    this.render()
  }

  get data(){
    return Array.from(this.querySelectorAll('[name]'))
      .map(input => [input.name, input.value, input.dataset.unit])
      .filter(([name, value, unit]) => value > 0)
      .map(([name,value,unit]) => 
        `${name}(${value}${unit})`
      )
      .join(' ')
    
  }
 

  render(){

  }

  listen(){
    this.addEventListener('change', changeEvent => {
      console.log(this.data)
      if(changeEvent.target.matches('.filter-function input')){
        this.querySelector("img").style.filter = this.data
      }
    })

    this.addEventListener('click', clickEvent => {
      if(clickEvent.target.matches('.reset-levels')){
        this.querySelectorAll('input[type=range]')
          .forEach(input => input.value = input.dataset.default)
      }
    })

    this.querySelector('.upload-image').addEventListener('change', changeEvent => {
      this.querySelector("img").src = URL.createObjectURL(changeEvent.target.files[0])
    })

    this.dropzone.addEventListener("dragover", (e) => {
      console.log(e)
      e.preventDefault()
      this.dropzone.classList.add("dragover")
    })

    this.dropzone.addEventListener("dragleave", () => {
      this.dropzone.classList.remove("dragover")
    })

    this.dropzone.addEventListener("drop", async (e) => {
      e.preventDefault()
      this.dropzone.classList.remove("dragover")

      const file = e.dataTransfer.files[0]

      this.querySelector('input[type=file]').files = e.dataTransfer.files
      this.querySelector('img').src = URL.createObjectURL(file)

      this.render()
    })
  }
}

export {FilterImage}
customElements.define('filter-image', FilterImage)
