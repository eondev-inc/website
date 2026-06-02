const useBlogs = () => {
  const retrievePost = async (perPage: number) => {
    const techUrl = import.meta.env.VITE_API_BLOG_URL || 'http://localhost:3000'
    console.log('Fetching posts from:', techUrl)

    try {
      const response = await fetch(techUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      })

      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response
    } catch (error) {
      console.error('Error fetching posts:', error)
      throw error
    }
  }

  return { retrievePost }
}

export default useBlogs
