import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/enviroment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  url: string = environment.wwwRoot + "api/socket";
  restUrl:string = environment.wwwRoot + "/sendMessageRest";

  constructor(private http: HttpClient) { }


}