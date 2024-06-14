import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CompanyInfo} from "../model/company-info.model";
import {CompaniesService} from "../../companies/companies.service";
import Chart from 'chart.js/auto';
import {AdministrationService} from "../administration.service";


@Component({
  selector: 'app-analytics-report',
  templateUrl: './analytics-report.component.html',
  styleUrls: ['./analytics-report.component.css']
})
export class AnalyticsReportComponent implements OnInit {
  companyInfo: CompanyInfo | null = null;
  userId: number | undefined;
  appointmentsPerYearData: { [key: number]: number; } | undefined;
  reservationsPerYearData: { [key: number]: number; } | undefined;
  appointmentsPerQuarterData: { [key: number]: number; } | undefined;
  reservationsPerQuarterData: { [key: number]: number; } | undefined;
  appointmentsPerMonthData: { [key: number]: number; } | undefined;
  reservationsPerMonthData: { [key: number]: number; } | undefined;
  appointmentsChart: Chart | undefined;
  reservationsPerYearChart: Chart | undefined;
  reservationsPerQuarterChart: Chart | undefined;
  appointmentsPerQuarterChart: Chart | undefined;
  appointmentsPerMonthChart: Chart | undefined;
  reservationsPerMonthChart: Chart | undefined;
  availableYears: string[] | undefined;
  selectedYear: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  profitForPeriod: number = 0;


  constructor(
    private companyService: CompaniesService,
    private administrationService: AdministrationService
  ) {}


  ngOnInit(): void {
    this.getAuthenticatedUserIdAndFetchCompanyInfo();
  }

  getProfitForPeriod() {
    if(!this.companyInfo || !this.startDate || !this.endDate) {return;}
    this.administrationService.getProfitForPeriod(this.companyInfo.id, this.startDate.toISOString(), this.endDate.toISOString()).subscribe(
      (profit: number) => {
        this.profitForPeriod = profit;
      },
      (error: any) => {
        console.error('Error fetching appointments per year data', error);
      }
    );
  }

  onYearSelectionChange(event: any) {
    this.selectedYear = event.value;
    if(!this.companyInfo) {return;}
    this.administrationService.getAppointmentsPerQuarter(this.companyInfo.id, parseInt(this.selectedYear, 10)).subscribe(
      (appointmentsData: { [key: number]: number }) => {
        this.appointmentsPerQuarterData = appointmentsData;
        this.createAppointmentPerYearQuarter();
      },
      (error: any) => {
        console.error('Error fetching appointments per year data', error);
      }
    );

    this.administrationService.getAppointmentsPerMonth(this.companyInfo.id, parseInt(this.selectedYear, 10)).subscribe(
      (appointmentsData: { [key: number]: number }) => {
        this.appointmentsPerMonthData = appointmentsData;
        this.createAppointmentPerYearMonth();
      },
      (error: any) => {
        console.error('Error fetching appointments per year data', error);
      }
    );

    this.administrationService.getReservationsPerQuarter(this.companyInfo.id, parseInt(this.selectedYear, 10)).subscribe(
      (appointmentsData: { [key: number]: number }) => {
        this.reservationsPerQuarterData = appointmentsData;
        this.createReservationPerYearQuarter();
      },
      (error: any) => {
        console.error('Error fetching appointments per year data', error);
      }
    );

    this.administrationService.getReservationsPerMonth(this.companyInfo.id, parseInt(this.selectedYear, 10)).subscribe(
      (appointmentsData: { [key: number]: number }) => {
        this.appointmentsPerMonthData = appointmentsData;
        this.createReservationPerYearMonth();
      },
      (error: any) => {
        console.error('Error fetching appointments per year data', error);
      }
    );
  }

  getAuthenticatedUserIdAndFetchCompanyInfo(): void {
    this.companyService.getAuthenticatedUserId().subscribe(
      (userId: number) => {
        this.userId = Number(userId);
        this.companyService.getCompanyInfo(this.userId).subscribe(
          (data: CompanyInfo) => {
            this.companyInfo = data;
            this.administrationService.getAppointmentsPerYear(this.companyInfo.id).subscribe(
              (appointmentsData: { [key: number]: number }) => {
                this.appointmentsPerYearData = appointmentsData;
                this.createAppointmentPerYearChart();
              },
              (error: any) => {
                console.error('Error fetching appointments per year data', error);
              }
            );

            this.administrationService.getReservationsPerYear(this.companyInfo.id).subscribe(
              (appointmentsData: { [key: number]: number }) => {
                this.reservationsPerYearData = appointmentsData;
                this.createReservationPerYearChart();
              },
              (error: any) => {
                console.error('Error fetching appointments per year data', error);
              }
            );
          },
          (error: any) => {
            console.error('Error fetching company info', error);
          }
        );
      },
      (error) => {
        console.error('Error getting authenticated user ID:', error);
      }
    );
  }

  createAppointmentPerYearChart(): void {
    if (!this.appointmentsPerYearData) {
      console.log('Appointments per year data is not available');
      return;
    }

    const years = Object.keys(this.appointmentsPerYearData);
    const appointmentsCount = Object.values(this.appointmentsPerYearData);

    this.availableYears = years
    this.selectedYear = this.availableYears[this.availableYears.length - 1];

    console.log('Years:', years);
    console.log('Appointments Count:', appointmentsCount);

    const chartElement = document.getElementById('appointments-per-year-chart') as HTMLCanvasElement;

    if (!chartElement) {
      console.error('Chart element with ID "appointments-year-chart" not found in the document');
      return;
    }

    if(!this.companyInfo) {return;}

    this.appointmentsChart = new Chart(chartElement, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Appointments per year',
            data: appointmentsCount,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          xAxis: {
            type: 'category', // Tip skale za kategorijalne podatke
            ticks: {
              display: true,
            },
          },
          yAxis: {
            ticks: {
              display: true,
            },
          },
        },
      },
    });

    console.log('Appointments Count:', this.appointmentsChart);

    this.administrationService.getAppointmentsPerQuarter(this.companyInfo.id, parseInt(this.selectedYear, 10)).subscribe(
      (appointmentsData: { [key: number]: number }) => {
        this.appointmentsPerQuarterData = appointmentsData;
        this.createAppointmentPerYearQuarter();
      },
      (error: any) => {
        console.error('Error fetching appointments per year data', error);
      }
    );


  }

  createAppointmentPerYearQuarter(): void {
    if (!this.appointmentsPerQuarterData) {
      console.log('Appointments per year data is not available');
      return;
    }

    const years = Object.keys(this.appointmentsPerQuarterData);
    const appointmentsCount = Object.values(this.appointmentsPerQuarterData);

    //this.availableYears = years
    //this.selectedYear = this.availableYears[this.availableYears.length - 1];

    console.log('Quarters:', years);
    console.log('Appointments Count:', appointmentsCount);

    const chartElement = document.getElementById('appointments-per-quarter-chart') as HTMLCanvasElement;

    if (!chartElement) {
      console.error('Chart element with ID "appointments-year-chart" not found in the document');
      return;
    }

    if (this.appointmentsPerQuarterChart) {
      this.appointmentsPerQuarterChart.destroy();
    }

    this.appointmentsPerQuarterChart = new Chart(chartElement, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Appointments per quarter',
            data: appointmentsCount,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          xAxis: {
            type: 'category', // Tip skale za kategorijalne podatke
            ticks: {
              display: true,
            },
          },
          yAxis: {
            ticks: {
              display: true,
            },
          },
        },
      },
    });

    console.log('Appointments Count:', this.appointmentsChart);

    if(!this.companyInfo) {return;}

    this.administrationService.getAppointmentsPerMonth(this.companyInfo.id, parseInt(this.selectedYear, 10)).subscribe(
      (appointmentsData: { [key: number]: number }) => {
        this.appointmentsPerMonthData = appointmentsData;
        this.createAppointmentPerYearMonth();
      },
      (error: any) => {
        console.error('Error fetching appointments per year data', error);
      }
    );
  }

  createAppointmentPerYearMonth(): void {
    if (!this.appointmentsPerMonthData) {
      console.log('Appointments per year data is not available');
      return;
    }

    const years = Object.keys(this.appointmentsPerMonthData);
    const appointmentsCount = Object.values(this.appointmentsPerMonthData);

    //this.availableYears = years
    //this.selectedYear = this.availableYears[this.availableYears.length - 1];

    console.log('Months:', years);
    console.log('Appointments Count:', appointmentsCount);

    const chartElement = document.getElementById('appointments-per-month-chart') as HTMLCanvasElement;

    if (!chartElement) {
      console.error('Chart element with ID "appointments-year-chart" not found in the document');
      return;
    }

    if (this.appointmentsPerMonthChart) {
      this.appointmentsPerMonthChart.destroy();
    }

    this.appointmentsPerMonthChart = new Chart(chartElement, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Appointments per month',
            data: appointmentsCount,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          xAxis: {
            type: 'category', // Tip skale za kategorijalne podatke
            ticks: {
              display: true,
            },
          },
          yAxis: {
            ticks: {
              display: true,
            },
          },
        },
      },
    });

    console.log('Appointments Count:', this.appointmentsChart);
  }

  createReservationPerYearChart(): void {
    if (!this.reservationsPerYearData) {
      console.log('Appointments per year data is not available');
      return;
    }

    const years = Object.keys(this.reservationsPerYearData);
    const appointmentsCount = Object.values(this.reservationsPerYearData);


    console.log('Years:', years);
    console.log('Appointments Count:', appointmentsCount);

    const chartElement = document.getElementById('reservations-per-year-chart') as HTMLCanvasElement;

    if (!chartElement) {
      console.error('Chart element with ID "appointments-year-chart" not found in the document');
      return;
    }

    if(!this.companyInfo) {return;}

    this.reservationsPerYearChart = new Chart(chartElement, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Reservations per year',
            data: appointmentsCount,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          xAxis: {
            type: 'category', // Tip skale za kategorijalne podatke
            ticks: {
              display: true,
            },
          },
          yAxis: {
            ticks: {
              display: true,
            },
          },
        },
      },
    });


    console.log('Appointments Count:', this.appointmentsChart);

    this.administrationService.getReservationsPerQuarter(this.companyInfo.id, parseInt(this.selectedYear, 10)).subscribe(
      (appointmentsData: { [key: number]: number }) => {
        this.reservationsPerQuarterData = appointmentsData;
        this.createReservationPerYearQuarter();
      },
      (error: any) => {
        console.error('Error fetching appointments per year data', error);
      }
    );




  }

  createReservationPerYearQuarter(): void {
    if (!this.reservationsPerQuarterData) {
      console.log('Appointments per year data is not available');
      return;
    }

    const years = Object.keys(this.reservationsPerQuarterData);
    const appointmentsCount = Object.values(this.reservationsPerQuarterData);

    //this.availableYears = years
    //this.selectedYear = this.availableYears[this.availableYears.length - 1];

    console.log('Quarters:', years);
    console.log('Appointments Count:', appointmentsCount);

    const chartElement = document.getElementById('reservations-per-quarter-chart') as HTMLCanvasElement;

    if (!chartElement) {
      console.error('Chart element with ID "appointments-year-chart" not found in the document');
      return;
    }

    if (this.reservationsPerQuarterChart) {
      this.reservationsPerQuarterChart.destroy();
    }

    this.reservationsPerQuarterChart = new Chart(chartElement, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Reservations per quarter',
            data: appointmentsCount,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          xAxis: {
            type: 'category', // Tip skale za kategorijalne podatke
            ticks: {
              display: true,
            },
          },
          yAxis: {
            ticks: {
              display: true,
            },
          },
        },
      },
    });

    console.log('Appointments Count:', this.appointmentsChart);

    if(!this.companyInfo) {return;}

    this.administrationService.getReservationsPerMonth(this.companyInfo.id, parseInt(this.selectedYear, 10)).subscribe(
      (appointmentsData: { [key: number]: number }) => {
        this.reservationsPerMonthData = appointmentsData;
        this.createReservationPerYearMonth();
      },
      (error: any) => {
        console.error('Error fetching appointments per year data', error);
      }
    );
  }


  createReservationPerYearMonth(): void {
    if (!this.reservationsPerMonthData) {
      console.log('Appointments per year data is not available');
      return;
    }

    const years = Object.keys(this.reservationsPerMonthData);
    const appointmentsCount = Object.values(this.reservationsPerMonthData);

    //this.availableYears = years
    //this.selectedYear = this.availableYears[this.availableYears.length - 1];

    console.log('Months:', years);
    console.log('Appointments Count:', appointmentsCount);

    const chartElement = document.getElementById('reservations-per-month-chart') as HTMLCanvasElement;

    if (!chartElement) {
      console.error('Chart element with ID "appointments-year-chart" not found in the document');
      return;
    }

    if (this.reservationsPerMonthChart) {
      this.reservationsPerMonthChart.destroy();
    }

    this.reservationsPerMonthChart = new Chart(chartElement, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Reservations per month',
            data: appointmentsCount,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          xAxis: {
            type: 'category', // Tip skale za kategorijalne podatke
            ticks: {
              display: true,
            },
          },
          yAxis: {
            ticks: {
              display: true,
            },
          },
        },
      },
    });

    console.log('Appointments Count:', this.appointmentsChart);
  }

}
