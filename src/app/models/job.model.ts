export class Job {
  id: string;
  contents: string;
  name: string;
  publication_date: string;
  locations: object[];
  levels: object[];
  refs: object;
  company: object;
}

export interface Request {
  location: string;
  level: string;
  page_index: number;
}
