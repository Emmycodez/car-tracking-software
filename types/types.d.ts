export type LoginProps ={
  email: string;
  password: string;
}

export type UserProps ={
   id?: string;
  name: string | null;
  email: string;
  role?: string;
  password?: string | null
   traccarId?: string | null;
   accountActivationToken?: string | null;
   activationTokenExpiry?: Date | null;
   businessName?: string | null;
   createdAt?: Date;
   isActive?: boolean;
}

export type ClientCreationProps = {
  name: string;
  email: string;
  businessName: string;
}

export interface UserTableProps{
  dbUsers: UserProps[];
}

export interface DeviceProps {
  id: string,
  traccarId?: string,
  name: string,
  uniqueId: string,
  userId?: Int,
  user? : UserProps | null,
  createdAt?: Date,
  updatedAt?: Date,
}