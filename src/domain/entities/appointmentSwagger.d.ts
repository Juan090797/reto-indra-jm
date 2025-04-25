export interface AppointmentRequest {
    insuredId: string;
    scheduleId: number;
    countryISO: 'PE' | 'CL';
  }
  
  export interface AppointmentResponse {
    message: string;
    appointments: {
      id: string;
      insuredId: string;
      scheduleId: number;
      countryISO: string;
      status: 'PENDING' | 'COMPLETED';
      createdAt: string;
      updatedAt: string;
    }[];
  }
  
  export interface AppointmentListResponse {
    message: string;
    appointments: AppointmentResponse['appointments'];
  }