export interface Student {
  id: number
  first_name: string
  last_name: string
  email: string
  gender: string
  country: string
  avatar: string
  btc_address: string
}

// Ham nay hay ne, Khai bao interface chi lay id, email, avater, last name
export type Students = Pick<Student, 'id' | 'email' | 'avatar' | 'last_name'>[]
