import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

import { Observable, of} from 'rxjs';
import { catchError} from 'rxjs/operators';
import { api } from '../config/path';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  data:any;
  constructor(private http: HttpClient) { }

  currentForecast(lat, long): Observable<any>{
  return this.http.get<any[]>(api.weatherApi+api.key+"/"+lat+","+long).pipe(
    catchError(this.handleError<any[]>('getHeroes', []))
  );;
  }
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
