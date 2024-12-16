import { Injectable } from '@angular/core';
import { httpOptions, serverURL } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { ITipoapunte } from '../model/tipoapunte.interface';
import { IPage } from '../model/model.interface';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class TipoApunteService {
  serverURL: string = serverURL + '/tipoapunte';

  constructor(private oHttp: HttpClient) {}

  getPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string
  ): Observable<IPage<ITipoapunte>> {
    let URL: string = '';
    URL += this.serverURL;
    if (!page) {
      page = 0;
    }
    URL += '?page=' + page;
    if (!size) {
      size = 10;
    }
    URL += '&size=' + size;
    if (field) {
      URL += '&sort=' + field;
      if (dir === 'asc') {
        URL += ',asc';
      } else {
        URL += ',desc';
      }
    }
    if (filtro) {
      URL += '&filter=' + filtro;
    }
    return this.oHttp.get<IPage<ITipoapunte>>(URL, httpOptions);
  }

  get(id: number): Observable<ITipoapunte> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<ITipoapunte>(URL);
  }

  create(oTipoApunte: ITipoapunte): Observable<ITipoapunte> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<ITipoapunte>(URL, oTipoApunte);
  }

  update(oTipoApunte: ITipoapunte): Observable<ITipoapunte> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<ITipoapunte>(URL, oTipoApunte);
  }

  getOne(id: number): Observable<ITipoapunte> {
    let URL: string = '';
    URL += 'http://localhost:8085';
    URL += '/tipoapunte';
    URL += '/' + id;
    return this.oHttp.get<ITipoapunte>(URL);
  }

  delete(id: number) {
    return this.oHttp.delete('http://localhost:8085/tipoapunte/' + id);
  }
  getXBalance(id: number): Observable<IPage<ITipoapunte>> {
    let URL: string = '';
    URL += 'http://localhost:8085';
    URL += '/tipoapunte';
    URL += '/xbalance/' + id;
    return this.oHttp.get<IPage<ITipoapunte>>(URL);
  }

  deleteRelation(id_balance: number, id_tipoapunte: number) {
    let URL: string = '';
    URL += 'http://localhost:8085';
    URL += '/grupotipoapunte';
    URL += '/xbalance/' + id_balance + '/' + id_tipoapunte;
    return this.oHttp.delete(URL);
  }

  getRestPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string,
    id_balance: number
  ): Observable<IPage<ITipoapunte>> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/restxbalance/' + id_balance;
    if (!page) {
      page = 0;
    }
    URL += '?page=' + page;
    if (!size) {
      size = 10;
    }
    URL += '&size=' + size;
    if (field) {
      URL += '&sort=' + field;
      if (dir === 'asc') {
        URL += ',asc';
      } else {
        URL += ',desc';
      }
    }
    if (filtro) {
      URL += '&filter=' + filtro;
    }
    return this.oHttp.get<IPage<ITipoapunte>>(URL, httpOptions);
  }

  addRelation(id_balance: number, id_tipoapunte: number) {
    let URL: string = '';
    URL += 'http://localhost:8085';
    URL += '/grupotipoapunte';
    URL += '/xbalance/' + id_balance + '/' + id_tipoapunte;
    return this.oHttp.post(URL, httpOptions);
  }
}
