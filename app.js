var vm= new Vue({
  el: '#app',
  data: {
    palabra: {
    	palabra: '',
    	categoria: '',
    	palabrasClaves:[],
      pelicula:'',
    },
    clave:'',
    palabras:[],
    palabrasJuego:[],
    palabraEnJuego:{},
    filtro: '',
    vista: 'jugar',
    boleanmensaje: false,
    fuerte:'',
    mensaje:'',
    tipomensaje:'',
    importacion:'reemplazar',
    palabrasJugadas:[],
    inGame:false,
  },
  computed: {
  	palabrasFiltradas() {
  		return this.palabras.filter(palabra => palabra.palabra.toLowerCase().indexOf(this.filtro.toLowerCase()) >= 0|| palabra.categoria.indexOf(this.filtro) >= 0);
  	},
    contenidoAexportar(){
      return JSON.stringify(this.palabras)
    },
    palabraOK(){
      return this.palabra.palabra && isNaN(this.palabra.palabra) && this.palabra.palabra.length >=3
    },
  	formOk() {
  		return this.palabraOK
  	}
  },
  methods: {
    getPalabra()
    {
      if (this.palabrasJuego.length>0) {
        let random= this.random(0,this.palabrasJuego.length)
        this.palabraEnJuego=this.palabrasJuego[random];
        this.palabrasJugadas.push(this.palabraEnJuego.palabra)
        this.inGame=true
        this.palabrasJuego.splice(random,1)
        localStorage.setItem("pj", JSON.stringify(this.palabraEnJuego))
        localStorage.setItem("juego", JSON.stringify(this.palabrasJuego))
      }
    },
    random(max,min){
      return Math.floor(Math.random() * (max-min)+min)
    },
  	agregarPalabra() {
      if(!this.verSiExiste()){
        this.palabras.push(Object.assign({}, this.palabra));
        const palabra=this.palabra.palabra
        this.limpiarpalabra();
        localStorage.setItem("datos", JSON.stringify(this.palabras))
        this.mostrarMensaje("Palabra Agregada!","Se ha agregado la palabra "+palabra+" a tu lista","alert-success")
      }
      else{
        this.mostrarMensaje("Advertencia!","Ya existe esa palabra en la lista","alert-warning")
      }
      
  	},
    agregarPalabraClave() {
        this.palabra.palabrasClaves.push(this.clave);
        this.clave="";
    },
    verSiExiste(){
      if (this.palabras.length>0) {
          if(this.palabras.filter(palabra => palabra.palabra.toLowerCase().indexOf(this.palabra.palabra.toLowerCase()) >= 0).length>0){
              return true
           }  
      }
      return false;
    },
    eliminarpalabra(indice){
      const palabra = this.palabras[indice].palabra
      this.palabras.splice(indice, 1);
      localStorage.setItem("datos", JSON.stringify(this.palabras))
      this.mostrarMensaje("Eliminada!","Palabra "+palabra+" a sido eliminada","alert-danger")
    },
  	limpiarpalabra() {
  		this.palabra.palabra = '';
  		this.palabra.categoria = '';
  		this.palabra.palabrasClaves = [];
  	},
  	cambiarVista(vista) {
  		this.vista = vista;
  	},
    mostrarMensaje(fuerte,mensaje,tipo){
      this.tipomensaje=tipo
      this.fuerte=fuerte
      this.mensaje=mensaje
      this.boleanmensaje=true
      setTimeout(this.cerrarMensaje,3000)
    },
  	cerrarMensaje() {
  		this.boleanmensaje = false;
  	},
    importar(){
      debugger
      var texto = document.getElementById("textimport").value
      if (this.importacion!="reemplazar") {
        var primerString = document.getElementById("txtexporat").value
        var segundoString = document.getElementById("textimport").value
        primerString=primerString.slice(0,-1)
        segundoString=segundoString.slice(1)
        debugger
        texto = primerString+","+segundoString
        debugger
      }
      this.palabras=JSON.parse(texto)
      localStorage.setItem("datos", JSON.stringify(this.palabras))
      this.mostrarMensaje("Importado","se han importado los datos","alert-success")
    },
    exportar(){
      var texto = document.getElementById("txtexporat")
      texto.select()
      document.execCommand("copy");
      this.mostrarMensaje("Copiado!","Se ha copiado el contenido, guardelo en un archivo de texto","alert-success")
    },
    reiniciarJuego(){
      this.palabrasJuego=JSON.parse(localStorage.getItem("datos"))
      this.palabraEnJuego={}
      inGame=false
      this.palabrasJugadas=[]
      localStorage.setItem("juego", JSON.stringify(this.palabrasJuego))
      this.getPalabra();

    }
  },
  mounted(){
      if (localStorage.getItem("datos")) {
        this.palabras=JSON.parse(localStorage.getItem("datos"))
      }
      if (localStorage.getItem("juego")) {
        this.palabrasJuego=JSON.parse(localStorage.getItem("juego"))
      }
      if (localStorage.getItem("pj")) {
        this.palabraEnJuego=JSON.parse(localStorage.getItem("pj"))
        inGame=true
      }
  }
})