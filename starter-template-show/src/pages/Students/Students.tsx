import { deleteStudent, getStudent, getStudents } from 'api/students.api'
import { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useQueryString } from 'utils/utils'
import classNames from 'classnames'
import { toast } from 'react-toastify'

const LIMIT = 10
export default function Students() {
  // const [students, setStudents] = useState<StudentsType>([])
  // const [isLoading, setIsLoanding] = useState<boolean>(false)
  // useEffect(() => {
  //   setIsLoanding(true)
  //   getStudents(1, 10)
  //     .then((res) => {
  //       setStudents(res.data)
  //     })
  //     .finally(() => {
  //       setIsLoanding(false)
  //     })
  // }, [])
  const queryClient = useQueryClient()
  // queryClient.invalidateQueries()

  const queryString: { page?: string } = useQueryString()
  const page = Number(queryString.page) || 1
  const studentQuery = useQuery({
    queryKey: ['students', page],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 5000)
      return getStudents(page, LIMIT, controller.signal)
    },
    // placeholderData: keepPreviousData, //giữ lại dữ liệu trước đó
    // staleTime: 10 * 1000,
    retry: 0,
    notifyOnChangeProps: []
    // throwOnError: true

    // refetchInterval: 1000
  })
  console.log(
    '🚀 ~ Students ~ studentQuery:',
    studentQuery.isLoadingError,
    studentQuery.isRefetchError,
    studentQuery.isFetchedAfterMount,
    studentQuery.isLoading
  )
  const date = new Date(studentQuery.dataUpdatedAt)
  console.log('🚀 ~ Students ~ date:', date)
  const totalStudentsCount = Number(studentQuery.data?.headers['x-total-count'] || 0)
  const totalPage = Math.ceil(totalStudentsCount / LIMIT)

  const deleteStudentMutation = useMutation({
    mutationFn: (id: number | string) => deleteStudent(id),
    onSuccess: (_, id) => {
      toast.success(`Xoa thanh cong student id la ${id}`)
      queryClient.invalidateQueries({ queryKey: ['students', page], exact: true })
    },
    gcTime: 50000
  })

  const handleDeleteStudent = (id: number | string) => {
    deleteStudentMutation.mutate(id)
  }

  const handlePrefetchStudent = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ['student', String(id)],
      queryFn: () => getStudent(id),
      staleTime: 5 * 1000,
      gcTime: 10000
    })
  }

  function datenow() {
    return new Date().getTime()
  }
  const currentTimestamp = datenow()
  async function getServerSideProps() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(10)
      }, 2000) // Chờ 2 giây trước khi trả về giá trị 10
    })
  }
  const result = useQuery({
    queryKey: ['todos', page],
    queryFn: getServerSideProps,
    initialData: 1
  })
  console.log('🚀 ~ Students ~ result:', result.isLoading)

  const refetchStudents = () => {
    result.refetch()
  }

  const cancelRequestStudents = () => {
    queryClient.cancelQueries({ queryKey: ['students', page] })
  }

  const newMutateTest = useMutation({
    mutationFn: async () => {
      console.log('12345')
    },
    onSuccess: () => {
      console.log(12345)
    }
  })

  const handleTestMutateTest = () => {
    for (let i = 0; i < 10; i++) {}
  }

  useEffect(() => {
    if (studentQuery) {
      queryClient.prefetchQuery({
        queryKey: ['students', page + 1],
        queryFn: () => {
          const controller = new AbortController()
          setTimeout(() => {
            controller.abort()
          }, 5000)
          return getStudents(page, LIMIT, controller.signal)
        }
      })
    }
  }, [page])

  return (
    <div>
      <h1 className='text-lg'>Students</h1>
      <div>
        <button className='mt-6 rounded bg-blue-500 px-5 py-2 text-white' onClick={() => studentQuery.refetch()}>
          Click 10s
        </button>
      </div>
      <div>
        <button className='mt-6 rounded bg-blue-500 px-5 py-2 text-white'>Click 2s</button>
      </div>
      <div>
        <button className='mt-6 rounded bg-pink-500 px-5 py-2 text-white' onClick={refetchStudents}>
          Referch Students
        </button>
      </div>
      <div>
        <button className='my-6 rounded bg-pink-500 px-5 py-2 text-white' onClick={cancelRequestStudents}>
          Cancel Request Students
        </button>
      </div>
      <Link
        type='button'
        className='me-2 mb-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        to='/students/add'
      >
        Add Student
      </Link>

      {studentQuery.isLoading && (
        <div role='status' className='mt-6 animate-pulse'>
          <div className='mb-4 h-4  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <span className='sr-only'>Loading...</span>
        </div>
      )}
      {!studentQuery.isLoading && (
        <Fragment>
          <div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
              <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='py-3 px-6'>
                    #
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Avatar
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Name
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    Email
                  </th>
                  <th scope='col' className='py-3 px-6'>
                    <span className='sr-only'>Action</span>
                  </th>
                </tr>
              </thead>
              {Number(result.data)}
              <tbody>
                {studentQuery.data?.data.map((student) => (
                  <tr
                    key={student.id}
                    className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
                    onMouseEnter={() => handlePrefetchStudent(student.id)}
                  >
                    <td className='py-4 px-6'>{student.id}</td>
                    <td className='py-4 px-6'>
                      <img src={student.avatar} alt='student' className='h-5 w-5' />
                    </td>
                    <th scope='row' className='whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white'>
                      {student.last_name}
                    </th>
                    <td className='py-4 px-6'>{student.email}</td>
                    <td className='py-4 px-6 text-right'>
                      <Link
                        to={`/students/${student.id}`}
                        className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'
                      >
                        Edit
                      </Link>
                      <button
                        className='font-medium text-red-600 dark:text-red-500'
                        onClick={() => handleDeleteStudent(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='mt-6 flex justify-center'>
            <nav aria-label='Page navigation example'>
              <ul className='inline-flex -space-x-px'>
                <li>
                  {page === 1 ? (
                    <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                      Previous
                    </span>
                  ) : (
                    <Link
                      className=' rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                      to={`/students?page=${page - 1}`}
                    >
                      Previous
                    </Link>
                  )}
                </li>
                {Array(totalPage)
                  .fill(0)
                  .map((_, index) => {
                    const pageNumber = index + 1
                    const isActive = page === pageNumber
                    return (
                      <li key={pageNumber}>
                        <Link
                          className={classNames(
                            'border border-gray-300  py-2 px-3 leading-tight  text-gray-500   hover:bg-gray-100  hover:text-gray-700',
                            {
                              'bg-gray-100 text-gray-700': isActive
                            }
                          )}
                          to={`/students?page=${pageNumber}`}
                        >
                          {pageNumber}
                        </Link>
                      </li>
                    )
                  })}

                <li>
                  {page === totalPage ? (
                    <span className=' cursor-not-allowed rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                      Next
                    </span>
                  ) : (
                    <Link
                      className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                      to={`/students?page=${page + 1}`}
                    >
                      Next
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </Fragment>
      )}
    </div>
  )
}
