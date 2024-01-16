import { useMatch, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addStudent, getStudent, updateStudent } from 'api/students.api'
import { Student } from 'types/student.type'
import { useEffect, useMemo, useState } from 'react'
import { isAxiosError } from 'utils/utils'
import { toast } from 'react-toastify'

type FormStateType = Omit<Student, 'id'> | Student
const initialFormState: FormStateType = {
  avatar: '',
  email: '',
  btc_address: '',
  country: '',
  first_name: '',
  gender: 'other',
  last_name: ''
}

type FormError =
  | {
      [key in keyof FormStateType]: string
    }
  | null
export default function AddStudent() {
  const [formState, setFormState] = useState<FormStateType>(initialFormState)
  const addMatch = useMatch('/students/add')
  const isAddMode = Boolean(addMatch)
  const { id } = useParams()
  const queryClient = useQueryClient()

  // const handleTestFilter = async () => {
  //   await queryClient.cancelQueries()
  //   // Remove all inactive queries that begin with `student` in the key
  //   queryClient.removeQueries({ queryKey: ['student'], type: 'inactive' })

  //   // Refetch all active queries
  //   await queryClient.refetchQueries({ type: 'active' })

  //   // Refetch all active queries that begin with `students` in the key
  //   await queryClient.refetchQueries({ queryKey: ['student'], type: 'active' })
  // }

  // Cap nhat
  const { data: dataStudent, isSuccess } = useQuery({
    queryKey: ['student', id],
    queryFn: () => getStudent(id as string),
    enabled: id !== undefined,
    staleTime: 1000 * 10
  })

  useEffect(() => {
    if (isSuccess || dataStudent) {
      setFormState(dataStudent.data)
    }
  }, [dataStudent, isSuccess])

  queryClient.setMutationDefaults(['createTodo'], {
    mutationFn: (test: string) => updateStudent(id as string, formState as Student),
    retry: 3
  })

  const updateStudentMutation = useMutation({
    mutationKey: ['createTodo'],
    onSuccess: (data) => {
      console.log('123')

      queryClient.setQueryData(['student', id], data)
      setFormState(initialFormState)
      toast('🦄 Update thành công!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      })
    },
    onMutate: (data) => {
      console.log('2313')
      return 1234
    },
    onSettled: (a, b, c, context) => {
      console.log('🚀 ~ AddStudent ~ context:', context)
      console.log('123123')
      return queryClient.invalidateQueries({ queryKey: ['student', id] })
    },
    gcTime: 50000
  })

  // Them moi
  const { mutate, error, data, reset } = useMutation({
    mutationFn: (body: FormStateType) => {
      return addStudent(body)
    }
  })

  const errorForm: FormError = useMemo(() => {
    const allError = isAddMode ? error : updateStudentMutation.error
    if (isAxiosError<{ error: FormError }>(allError) && allError?.response?.status === 422) {
      return allError.response?.data.error
    }
    return null
  }, [error, isAddMode, updateStudentMutation.error])

  // Dung currying
  const handleChange = (name: keyof FormStateType) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [name]: event.target.value }))
    if (data || error) {
      reset()
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // try {
    //   await mutateAsync(formState)
    //   console.log(data)
    //   setFormState(initialFormState)
    // } catch (error) {
    //   console.log(error)
    // }
    if (isAddMode) {
      mutate(formState, {
        onSuccess: () => {
          setFormState(initialFormState)
          toast.success('Add thanh cong')
        }
      })
    } else {
      updateStudentMutation.mutate()
    }
  }
  console.log(updateStudentMutation.variables)

  return (
    <div>
      <h1 className='text-lg'>{isAddMode ? 'Add' : 'Edit'} Student</h1>
      {/* {updateStudentMutation.isPending && <li style={{ opacity: 0.5 }}>{updateStudentMutation.variables}</li>} */}
      {/* <button className='bg-slate-600 p-4' onClick={() => updateStudentMutation.reset()}>
        Reset Mutation
      </button> */}
      <form className='mt-6' onSubmit={handleSubmit}>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='email'
            name='floating_email'
            id='floating_email'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
            placeholder=' '
            value={formState.email}
            onChange={handleChange('email')}
            required
          />
          <label
            htmlFor='floating_email'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            Email address
          </label>
          {errorForm && (
            <p className='text-red-500'>
              <span className='font-medium'>Lỗi </span>
              {errorForm.email}
            </p>
          )}
        </div>

        <div className='group relative z-0 mb-6 w-full'>
          <div>
            <div>
              <div className='mb-4 flex items-center'>
                <input
                  id='gender-1'
                  type='radio'
                  name='gender'
                  value='Male'
                  checked={formState.gender === 'Male'}
                  onChange={handleChange('gender')}
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                />
                <label htmlFor='gender-1' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Male
                </label>
              </div>
              <div className='mb-4 flex items-center'>
                <input
                  id='gender-2'
                  type='radio'
                  name='gender'
                  value='Female'
                  checked={formState.gender === 'Female'}
                  onChange={handleChange('gender')}
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                />
                <label htmlFor='gender-2' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Female
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  id='gender-3'
                  type='radio'
                  name='gender'
                  value='Other'
                  checked={formState.gender === 'Other'}
                  onChange={handleChange('gender')}
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                />
                <label htmlFor='gender-3' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Other
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='country'
            id='country'
            value={formState.country}
            onChange={handleChange('country')}
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
            placeholder=' '
            required
          />
          <label
            htmlFor='country'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            Country
          </label>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='tel'
              name='first_name'
              id='first_name'
              value={formState.first_name}
              onChange={handleChange('first_name')}
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
              placeholder=' '
              required
            />
            <label
              htmlFor='first_name'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              First Name
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='last_name'
              id='last_name'
              value={formState.last_name}
              onChange={handleChange('last_name')}
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
              placeholder=' '
              required
            />
            <label
              htmlFor='last_name'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              Last Name
            </label>
          </div>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='avatar'
              id='avatar'
              value={formState.avatar}
              onChange={handleChange('avatar')}
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
              placeholder=' '
              required
            />
            <label
              htmlFor='avatar'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              Avatar Base64
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='btc_address'
              id='btc_address'
              value={formState.btc_address}
              onChange={handleChange('btc_address')}
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
              placeholder=' '
              required
            />
            <label
              htmlFor='btc_address'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              BTC Address
            </label>
          </div>
        </div>

        <button
          type='submit'
          className='w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto'
        >
          {isAddMode ? 'Add' : 'Update'}
        </button>
      </form>
      {/* <button
        className='my-2.5 rounded-lg bg-blue-700 px-5 py-2.5 text-white hover:bg-blue-800'
        onClick={handleTestFilter}
      >
        test Filter
      </button> */}
    </div>
  )
}
