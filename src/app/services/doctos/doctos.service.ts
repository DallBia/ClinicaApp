import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class DoctosService {

  constructor(private shared: SharedService,
    private http: HttpClient,

    ) { }




}
