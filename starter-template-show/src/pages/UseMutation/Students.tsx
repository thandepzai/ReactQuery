import { deleteStudent, getStudent, getStudents } from 'api/students.api'
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useQueryString } from 'utils/utils'
import classNames from 'classnames'
import { toast } from 'react-toastify'
import { useInView } from 'react-intersection-observer'

export default function Students() {
  const { ref, inView } = useInView()
  const [nowPage, setNowPage] = useState(1)
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage
  } = useInfiniteQuery({
    queryKey: ['students'],
    queryFn: async ({ pageParam }) => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 5000)
      return getStudents(pageParam, 10, controller.signal)
    },
    placeholderData: keepPreviousData,
    staleTime: 10 * 1000,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.config.params._page + 1

      return nextPage
    }
  })
  console.log('🚀 ~ file: Students.tsx:39 ~ Students ~ data:', data)

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

  return (
    <div>
      <h1 className='text-lg'>Students</h1>
      {!data && (
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
      {data && (
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
              <tbody>
                {data?.pages.map((page: any) =>
                  page?.data.map((student: any) => (
                    <tr
                      key={student.id}
                      className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
                    >
                      <td className='py-10 px-6'>{student.id}</td>
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <button ref={ref}>checked</button>
          </div>
        </Fragment>
      )}
    </div>
  )
}
