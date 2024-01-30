import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { environment } from 'src/env/enviroment';
import { SimulationService } from '../simulator.service';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit {
  private serverUrl = environment.wwwRoot + 'socket';
  private stompClient: any;

  isLoaded: boolean = false;
  isCustomSocketOpened = false;
  messages: string[] = [];
  coord: any;
  frequency: number = 5;

  constructor(private simulationService: SimulationService) { }

  ngOnInit(): void {
    this.coord = "";
    this.initializeWebSocketConnection();

  }


  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;

    this.stompClient.connect({}, function () {
      that.isLoaded = true;
      that.openGlobalSocket();
    });
  }

  openGlobalSocket() {
    if (this.isLoaded) {
      this.stompClient.subscribe("/socket-publisher", (message: { body: string }) => {
        if (message.body) {
          let messageResult: string = message.body;
          this.coord = messageResult;
          this.messages.push(messageResult);
          console.log(this.messages);
        }
      });
    }
  }




  startSimulation(): void {
    // Call the startSimulation method from the service
    this.simulationService.startSimulation(this.frequency).subscribe(
      () => console.log('Simulation started successfully'),
      error => console.error('Error starting simulation:', error)
    );
  }
}
