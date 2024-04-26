export type TForm = {
  id: string;
  employeeName?: string;
  certName?: string;
  ROCRequested?: boolean;
  personalDevelopment?: boolean;
  reason?: string;
  estimatedCompletionTime?: string;
  estimatedCompletionDate?: string;
  certExpirationDate?: string;
  certCost?: Number;
  nameOfPreviousCert?: string;
  dateOfPreviousCert?: string;
  employeeSignOffDate?: string;
  leadSignOffDate?: string;
  executiveSignOffDate?: string;
  file?: string;
};
