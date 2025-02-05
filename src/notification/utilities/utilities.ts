const allowedMimeTypes = [
    'image/jpeg', 
    'image/png', 
    'application/pdf', 
    'application/json', 
    'text/plain', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip', 
    'application/vnd.ms-excel', 
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ];
  
  export function isValidMimeType(mimeType: string): boolean {
    return allowedMimeTypes.includes(mimeType);
  }
  