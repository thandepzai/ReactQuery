import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

export default function Dashboard() {
  const queryClient = useQueryClient()

  const handleTest = () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  }
  async function getServerSideProps() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(10)
      }, 2000) // Chờ 10 giây trước khi trả về giá trị 10
    })
  }
  const result = useQuery({
    queryKey: ['todos'],
    queryFn: () => getServerSideProps(),
    initialData: 1,
    staleTime: 2000
    // refetchInterval: 1000 tự động nặp lại dữ liệu
  })

  const handleTestFilter = async () => {
    // Cancel all queries
    await queryClient.cancelQueries()

    // Remove all inactive queries that begin with `students` in the key
    // queryClient.removeQueries({ queryKey: ['students'], type: 'inactive' })

    // Remove all inactive
    // queryClient.removeQueries({ type: 'inactive' })

    // Refetch all active queries
    await queryClient.refetchQueries({ type: 'active' })

    // Refetch all active queries that begin with `students` in the key
    await queryClient.refetchQueries({ queryKey: ['students'], type: 'active' })
  }
  return (
    <div>
      <h1 className='mb-6 text-lg'>Dashboard</h1>
      <button onClick={handleTest} className='m-5 bg-blue-600 p-5'>
        Test
      </button>
      <button onClick={handleTestFilter} className='bg-blue-600 p-5'>
        Test Filter
      </button>
    </div>
  )
}
