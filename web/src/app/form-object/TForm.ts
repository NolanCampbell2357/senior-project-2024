export type TForm = {
  id: string;
  employeeName?: string;
  certName?: string;
  ROCRequested?: boolean;
  personalDevelopment?: boolean;
  reason?: string;
  estimatedCompletionTime?: string;
  estimatedCompletionDate?: Date;
  certExpirationDate?: Date;
  certCost?: number;
  nameOfPreviousCert?: string;
  dateOfPreviousCert?: Date;
  employeeSignOffDate?: Date;
  leadSignOffDate?: Date;
  executiveSignOffDate?: Date;
};
