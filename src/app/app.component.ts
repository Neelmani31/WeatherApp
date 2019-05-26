import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';

import { WeatherService } from './service/weather.service';
declare var ol: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  long: any;
  lat: any;
  cardData: any;
  today: any;
  location:any;
  map: any;
  constructor(private weather: WeatherService) { }
  ngOnInit() {

    let now = new Date();
    this.today = formatDate(now, 'dd-MM-yyyy', 'en-US', '+0530');

    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([77.390171, 28.569152]),
        zoom: 2
      })
    });

    this.map.on('click', function(args) {
      let lonlat = ol.proj.transform(args.coordinate, 'EPSG:3857', 'EPSG:4326');
      this.long = lonlat[0];
      this.lat = lonlat[1];
      this.simpleReverseGeocoding(this.long, this.lat);
    }, this );
    
   
  }

  simpleReverseGeocoding(lon, lat) {
    fetch('http://nominatim.openstreetmap.org/reverse?format=json&lon=' + lon + '&lat=' + lat).then(function(response) {
      return response.json();
    }).then(json=> {
      let location=(json.display_name).split(",", 2);
      this.location=location[0]+","+location[1];
    })
  }

  getForecast() {
    this.weather.currentForecast(this.lat, this.long).subscribe(res => {
      let temp = (res.currently.temperature - 32) * (5 / 9);
      this.cardData = {
        heading: res.currently.summary,
        location: this.location,
        temperature: temp,
        icon: res.currently.icon
      }
    });
  }
}
