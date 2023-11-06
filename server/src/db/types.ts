export interface CompanyEntity {
  id: string;
  name: string;
  description?: string;
}

export interface JobEntity {
  id: string;
  companyId: string;
  title: string;
  description?: string;
  createdAt: string;
}

export interface UserEntity {
  username: string; // Used as a primary key, so it must be unique.
  password: string;
}
// Define the structure of the Message entity according to the database schema.
export interface Message {
  id: string; // Used as a primary key, so it must be unique.
  user: string; // This should correspond to a User's username.
  text: string;
  createdAt: string; // ISO date string.
}

export interface SubscriptionResponse {
  loading: boolean;
  data: {
    message: Message;
  };
}
