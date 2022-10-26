import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2'

interface contractErrors {
  code:string;
  message:string
}

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor() { }

  possibleErrors:contractErrors[] = [
    {
      code:'#001',
      message:'Owner can NOT be candidate'
    },
    {
      code:'#002',
      message:'Candidate already registered'
    },
    {
      code:'#001',
      message:'Not owner'
    },
    {
      code:'#001',
      message:'The requested account and/or method has not been authorized by the user.'
    },  
    {
      code:'#003',
      message:'Debe cambiar de estado la votacion'
    },  
    {
      code:'#004',
      message:'Add 1 more candidate or voter / draw is not allowed'
    },      
    {
      code:'#001',
      message:'Voter already registered'      
    },      
    {
      code:'#001',
      message:'Add more candidates'      
    },     
    {
      code:'#001',
      message:'No one has voted yet'      
    },    
    
    
  ]

  public async mostrarAlertaError(info: any): Promise<void | SweetAlertResult<any>> {
    let res;
    if (info?.data) {
      const keys = Object.keys(info.data)
      res = await Swal.fire('Error', info?.data[keys[0]].reason, 'error');
    } else {
      this.checkError(info.message)
    }
    return res;
  }

  public checkError(errMessage:string) { 
    
    let errorToShow:string = '';
    let foundErrorCode: boolean = false;
    for (const err of this.possibleErrors) {
      if (errMessage.includes(err.message)) {
        errorToShow = err.message;
        foundErrorCode = true;
        Swal.fire('Error', errorToShow, 'error');
      }
    }      
    if (!foundErrorCode) {
      errorToShow = 'Error not contemplated';
    }
  }

  public async mostrarAlertaExito(info: any): Promise<SweetAlertResult<any>> {
    const salida = this.crearSalida(info)
    const res = await Swal.fire('Éxito', salida, 'success');
    return res;
  }

  public async alertaSimple(titulo: string, texto: string): Promise<SweetAlertResult<any>>{
    const res = await Swal.fire(titulo, texto, 'info');
    return res;
  }

  private crearSalida(json: string): string {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        }
        else {
          cls = 'string';
        }
      }
      else if (/true|false/.test(match)) {
        cls = 'boolean';
      }
      else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }

}
