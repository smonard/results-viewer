import React from 'react';
import { Combobox } from 'react-widgets';
import 'react-widgets/dist/css/react-widgets.css';
import './Main.css'
import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment';
import Button from '../widgets/button'

Moment.locale('en')
momentLocalizer()

class NewsAnalysisVisualizer extends React.Component {
  defaults = {
    backendUrl: 'http://localhost:5000/',
    result: {
      details:{}
    },
    outlets: [
      { id: 'comercio', value: 'El Comercio'},
      { id: 'universo', value: 'El Universo'},
      { id: 'vistazo', value: 'Vistazo'},
      { id: 'expreso', value: 'El Expreso'},
      { id: 'telegrafo', value: 'El Telégrafo'},
      { id: 'mercurio', value: 'El Mercurio'}
    ]
  }
  
  state = {
    loading : false,
    data: this.defaults.result
  }

  loadResults = (e) => {
    e.preventDefault()
    const {shouldProceed, url} = this.inferUrl()
    if(shouldProceed) {
      this.setState({loading: true})
      fetch(url)
      .then(data => data.json())
      .then(data => this.setState({data, loading: false}))
      .catch(_ => {
        alert("Error. Por favor intente nuevamente más tarde.")
        this.setState({data: this.defaults.result, loading: false})
      })
    }
  }

  inferUrl = () => {
    const shouldProceed = this.state.provider === undefined && (this.state.url === '' || this.state.url === undefined) ? false : true
    const complement = this.state.provider !== undefined ? 
      `analyze-provider/${this.state.provider}` :
      `analyze-news?url=${this.state.url}`
    const url = `${this.defaults.backendUrl}${complement}`
    return {shouldProceed, url}
  }

  formatData = (data) => {
    let formattedData = {}
    if(data.position === undefined) {
      formattedData = {
        position: '',
        value: '',
        analyzed: '',
        provider: ''
      }
    } else {
      let rate = (Object.values(data.details).sort().reverse()[0] * 100).toFixed(2)
      formattedData = {
        position: data.position,
        value: `${rate}%`,
        analyzed: data.analyzed,
        provider: data.provider
      }
    }

    return formattedData
  }

  render() {
    let data = this.formatData(this.state.data)
    return (<div>
      <div className="loading-pane" style={this.state.loading? {} : {display: 'none'} } >
        <h4>Analizando...</h4>
        <div className="spinner"/>
      </div>
      <br></br><br></br>
      <h1>Analizador de noticias locales </h1>
      <br></br><br></br><br></br>
      <div className="container">
        <form className="form" onSubmit={this.loadResults}>
          <h4 className="hint">Selecciona un proveedor de noticias para ver su posición: </h4>
          <Combobox value={this.state.provider} onChange={(val) => this.setState({provider: val.id, url: ''})} data={this.defaults.outlets} valueField='id' textField='value'/>
          <h4 className="hint">O ingresa un vínculo a un noticia específica (funciona solo con proveedores soportados): </h4>
          <input type="text" value={this.state.url} onChange={(evt) => this.setState({ url: evt.target.value, provider: undefined })} className="numerical-input"></input>
          <div />
          <Button>Analizar</Button>
        </form>
        <div className="result">
          <div className="result-widget">
            <div className={`result-circle ${data.position.toLowerCase()}-view`}><span>{data.position}</span></div>
          </div>
          <div className="tab-results">
            <div>
              <p>Posición</p>
            </div>
            <div>
              <p><strong>{`${data.position} - ${data.value}`}</strong></p>
            </div>
            <div>
              <p>Proveedor</p>
            </div>
            <div>
              <p><strong>{data.provider}</strong></p>
            </div>
            <div>
              <p>Analizados</p>
            </div>
            <div>
              <p><strong>{data.analyzed}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>)
  }
}


export default NewsAnalysisVisualizer;
