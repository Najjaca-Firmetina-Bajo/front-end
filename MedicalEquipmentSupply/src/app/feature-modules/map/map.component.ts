import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Output() mapClick: EventEmitter<any> = new EventEmitter();
  @Input() initialCenter: [number, number] = [45.2396, 19.8227];
  @Input() initialZoom: number = 13;
  @Input() fixedCoordinates: [number, number][] = [[45.2396, 19.8227],[45.4396, 19.3227]];
  @Input() coord: string = "";

  private map: any;
  private markers: any[] = [];
  messages: string = '';

  constructor() { }

  private initMap(): void {
    this.map = L.map('map', {
      center: this.initialCenter,
      zoom: this.initialZoom,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);

    this.registerOnClick();
  }

  private registerOnClick(): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      const latString = lat.toString();
      const lngString = lng.toString();
    
      const coordinateString = `interpolatedCoordinates.add(new Coordinate(${latString}, ${lngString})); `;
      
      this.messages += coordinateString;
      console.log(this.messages);
    });
  }


  private updateDynamicCoordinate(): void {
    // Remove previous dynamic marker if any
    this.markers.forEach(marker => this.map.removeLayer(marker));

    // Check if coord is valid
    if (this.coord) {
      const [longitude, latitude] = this.coord.split('|').map(Number);
      const dynamicMarker = L.marker([latitude, longitude], { icon: this.createDynamicIcon() }).addTo(this.map);
      this.markers.push(dynamicMarker);
    }
    var marker = L.marker([45.2396, 19.8227]).addTo(this.map);
    var marker = L.marker([45.27269690979444, 19.836823940277103]).addTo(this.map);

  }

  private createDynamicIcon(): any {
    return L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
      iconSize:     [20, 30], // size of the icon
      iconAnchor:   [10, 30]
    });
  }

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://icons.veryicon.com/png/o/object/material-design-icons-1/map-marker-circle.png',
      
    iconSize:     [30, 30], // size of the icon
    iconAnchor:   [15, 15], // point of the icon which will correspond to marker's location
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    this.initMap();
    //45.27269690979444 and longitude: 19.836823940277103
    var marker = L.marker([45.2396, 19.8227]).addTo(this.map);
    var marker = L.marker([45.27269690979444, 19.836823940277103]).addTo(this.map);

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coord'] && !changes['coord'].firstChange) {
      this.updateDynamicCoordinate();
    }
  }
}
